const DAILY_LIMIT = 99;

// Upstash Redis via REST API (uses KV_REST_API_URL and KV_REST_API_TOKEN env vars)
async function redisIncr(key) {
  const url = `${process.env.KV_REST_API_URL}/incr/${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
  const data = await res.json();
  return data.result;
}

async function redisExpire(key, seconds) {
  const url = `${process.env.KV_REST_API_URL}/expire/${key}/${seconds}`;
  await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
}

async function redisGet(key) {
  const url = `${process.env.KV_REST_API_URL}/get/${key}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
  const data = await res.json();
  return data.result;
}

function getDateKey() {
  const now = new Date();
  // Sydney time offset (UTC+11 in daylight saving, UTC+10 otherwise)
  // Using ISO date string in UTC+11 for simplicity
  const sydney = new Date(now.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }));
  const y = sydney.getFullYear();
  const m = String(sydney.getMonth() + 1).padStart(2, '0');
  const d = String(sydney.getDate()).padStart(2, '0');
  return `contact:submissions:${y}-${m}-${d}`;
}

function parseFormBody(body) {
  const params = new URLSearchParams(body);
  return {
    name: params.get('name') || '',
    email: params.get('email') || '',
    message: params.get('message') || '',
    website: params.get('website') || '', // honeypot field
    captchaAnswer: params.get('captcha_answer') || '',
    captchaExpected: params.get('captcha_expected') || '',
  };
}

function validateFields({ name, email, message }) {
  if (!name || name.trim().length < 2) return 'Name is required.';
  if (!email || !email.includes('@')) return 'A valid email is required.';
  if (!message || message.trim().length < 10) return 'Message must be at least 10 characters.';
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Parse body
  let fields;
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString();
    fields = parseFormBody(body);
  } catch {
    return res.redirect(303, '/#contact?error=1');
  }

  // Honeypot check — bots fill hidden fields, humans don't
  if (fields.website && fields.website.trim().length > 0) {
    // Silent success to confuse bots
    return res.redirect(303, '/thank-you.html');
  }

  // Server-side field validation
  const validationError = validateFields(fields);
  if (validationError) {
    return res.redirect(303, '/#contact?error=1');
  }

  // Rate limit check
  const dateKey = getDateKey();
  try {
    const current = await redisGet(dateKey);
    const count = current ? parseInt(current, 10) : 0;
    if (count >= DAILY_LIMIT) {
      return res.redirect(303, '/#contact?limit=1');
    }

    // Increment counter; set 25h TTL on first entry to ensure it expires overnight
    const newCount = await redisIncr(dateKey);
    if (newCount === 1) {
      await redisExpire(dateKey, 90000); // 25 hours in seconds
    }
  } catch {
    // If Redis fails, allow the submission through (fail open — don't block real users)
    console.error('Redis error — rate limit bypassed');
  }

  // Send email via Resend
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
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(fields.message).replace(/\n/g, '<br>')}</p>
          <hr>
          <p style="color:#666;font-size:12px;">Sent via speedrunlab.ai contact form</p>
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
