// Contact form handler for speedrunlab.ai
//
// Checks run cheapest-first so junk never reaches Cloudflare or Resend:
//   method -> origin -> honeypot -> Turnstile -> field validation -> spam score
//
// Every rejection path FAILS CLOSED and is logged with a reason. The previous
// Upstash rate limiter failed OPEN on error and had been silently doing nothing
// since its store was uninstalled, which is how the form came to be wide open.

const ALLOWED_ORIGINS = ['https://www.speedrunlab.ai', 'https://speedrunlab.ai'];

const MIN_MESSAGE = 10;
const MAX_LEN = { name: 100, email: 254, subject: 200, phone: 40, message: 5000 };

// Same pattern the browser enforces, so client and server agree.
const AU_PHONE = /^(04\d{8}|0[2378]\d{8}|\+614\d{8})$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

// Lifted from the submissions actually received. A single hit is NOT enough to
// block: a real enquiry could plausibly contain one of these. Every observed
// spam message contained two or more, so that is the threshold.
const SPAM_PHRASES = [
  'send me news and updates by email',
  'let me know when i am subscribed',
  'i am happy to receive emails',
  'subscribe to your newsletter',
  'interested in special offers',
  'i look forward to updates',
  'interested in weekly updates',
];
const SPAM_SCORE_THRESHOLD = 2;

/** Partial email for logs. Returns '***' rather than risk printing the address. */
function fingerprint(email) {
  const s = String(email || '');
  const at = s.indexOf('@');
  if (at < 1) return '***';
  return `${s.slice(0, Math.min(3, at))}***${s.slice(at)}`;
}

function reject(res, reason, fields, extra = '') {
  console.warn(`contact reject reason=${reason} email=${fingerprint(fields?.email)}${extra ? ` ${extra}` : ''}`);
  return res.status(403).send('Forbidden');
}

/** Human-recoverable problems go back to the form's existing inline error UI. */
function rejectToForm(res, reason, fields, extra = '') {
  console.warn(`contact reject reason=${reason} email=${fingerprint(fields?.email)}${extra ? ` ${extra}` : ''}`);
  return res.redirect(303, '/#contact?error=1');
}

function originAllowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Preview deployments only — never widens production.
  if (process.env.VERCEL_ENV !== 'production' && /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
}

async function verifyTurnstile(token, ip) {
  if (!token) return { ok: false, reason: 'turnstile-missing' };

  const secret = process.env.TURNSTILE_SECRET_KEY;
  // No secret configured means we cannot verify, so we refuse. Failing open
  // here would recreate exactly the bug this change exists to fix.
  if (!secret) return { ok: false, reason: 'turnstile-unconfigured' };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();

    if (data.success) return { ok: true };
    return { ok: false, reason: 'turnstile-rejected', codes: (data['error-codes'] || []).join(',') };
  } catch (err) {
    return { ok: false, reason: 'turnstile-error', codes: String(err?.name || err) };
  }
}

function parseFormBody(body) {
  const params = new URLSearchParams(body);
  return {
    name: params.get('name') || '',
    email: params.get('email') || '',
    subject: params.get('subject') || '',
    phone: params.get('phone') || '',
    message: params.get('message') || '',
    submittedAt: params.get('submitted_at_sydney') || '',
    website: params.get('website') || '', // honeypot field
    turnstileToken: params.get('cf-turnstile-response') || '',
  };
}

/** Structural checks. Returns a short reason string, or null when the input is fine. */
function validateFields({ name, email, phone, message, subject }) {
  if (!name || name.trim().length < 2) return 'name-missing';
  if (name.length > MAX_LEN.name) return 'name-too-long';

  if (!email || email.length > MAX_LEN.email || !EMAIL.test(email)) return 'email-invalid';

  if (subject.length > MAX_LEN.subject) return 'subject-too-long';

  // Previously optional, which is how four empty-bodied probe submissions got through.
  const trimmed = message.trim();
  if (trimmed.length < MIN_MESSAGE) return 'message-too-short';
  if (message.length > MAX_LEN.message) return 'message-too-long';

  if (phone) {
    if (phone.length > MAX_LEN.phone) return 'phone-too-long';
    const digits = phone.replace(/[\s\-()]+/g, '');
    if (!AU_PHONE.test(digits)) return 'phone-not-au';
  }

  return null;
}

/** Counts distinct spam-kit phrases present in the message. */
function spamScore(message) {
  const haystack = String(message || '').toLowerCase();
  return SPAM_PHRASES.filter((phrase) => haystack.includes(phrase));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // 1. Origin. Cheap, and the observed bots POST directly with no Origin header.
  if (!originAllowed(req.headers.origin)) {
    console.warn(`contact reject reason=origin origin=${req.headers.origin || 'none'}`);
    return res.status(403).send('Forbidden');
  }

  // 2. Parse.
  let fields;
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    fields = parseFormBody(Buffer.concat(chunks).toString());
  } catch {
    console.warn('contact reject reason=unparseable-body');
    return res.status(400).send('Bad Request');
  }

  // 3. Honeypot. Silent success so the bot learns nothing.
  if (fields.website && fields.website.trim().length > 0) {
    console.warn(`contact reject reason=honeypot email=${fingerprint(fields.email)}`);
    return res.redirect(303, '/thank-you.html');
  }

  // 4. Turnstile. The load-bearing control: a bot that never renders the page
  //    cannot produce a token, which is precisely the traffic we are seeing.
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const turnstile = await verifyTurnstile(fields.turnstileToken, ip);
  if (!turnstile.ok) {
    return reject(res, turnstile.reason, fields, turnstile.codes ? `codes=${turnstile.codes}` : '');
  }

  // 5. Field validation. These are recoverable human mistakes, so send the
  //    person back to the form's inline error rather than a bare 403.
  const validationError = validateFields(fields);
  if (validationError) {
    return rejectToForm(res, validationError, fields);
  }

  // 6. Spam phrasing. Silent success, same reasoning as the honeypot.
  const hits = spamScore(fields.message);
  if (hits.length >= SPAM_SCORE_THRESHOLD) {
    console.warn(
      `contact reject reason=spam-phrases email=${fingerprint(fields.email)} score=${hits.length} matched="${hits.join('|')}"`
    );
    return res.redirect(303, '/thank-you.html');
  }

  // 7. Send.
  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Speedrun AI Labs Contact Form <noreply@speedrunlab.ai>',
        to: [process.env.CONTACT_EMAIL],
        reply_to: fields.email,
        subject: `New contact form submission from ${fields.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(fields.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(fields.email)}</p>
          ${fields.subject ? `<p><strong>Subject:</strong> ${escapeHtml(fields.subject)}</p>` : ''}
          ${fields.phone ? `<p><strong>Phone:</strong> ${escapeHtml(fields.phone)}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(fields.message).replace(/\n/g, '<br>')}</p>
          <hr>
          <p style="color:#666;font-size:12px;">Sent via speedrunlab.ai contact form${fields.submittedAt ? ` &middot; ${escapeHtml(fields.submittedAt)}` : ''}</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('Resend error:', errText);
      return res.redirect(303, '/#contact?error=1');
    }
  } catch (err) {
    console.error('Email send failed:', err);
    return res.redirect(303, '/#contact?error=1');
  }

  console.log(`contact accept email=${fingerprint(fields.email)}`);
  return res.redirect(303, '/thank-you.html');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
