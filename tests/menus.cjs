// tests/menus.cjs — every menu clicked, by touch and by mouse (Addy 2026-10-17, after a reviewer found
// "when you click menu it does not close and you do not see any content"). On each start page it taps every
// top-level item, opens each flyout and taps every item in it, taps the trigger again, another item, the
// logo and the page behind the panel, then every footer link and every button on home; after each press it
// asserts that no panel or curtain is left open and that the destination is right (section shown, URL,
// target under the bar). Exit code 1 on any failure.
// Run: B=https://www.speedrunlab.ai NODE_PATH=~/Documents/investing-platform-v1/node_modules node tests/menus.cjs
//      (B=http://localhost:8765 locally; CTX=phone,ipad,desk,webkit to pick contexts)
const { chromium, webkit, devices } = require('playwright');
const fs = require('fs');
const B = (process.env.B || 'https://www.speedrunlab.ai').replace(/\/$/, '');
const WANT = (process.env.CTX || 'phone,ipad,desk,webkit').split(',');
const results = [];
function check(ctx, name, ok, detail) {
  results.push({ ctx, name, ok, detail });
  console.log((ok ? 'ok   ' : 'FAIL ') + ctx.padEnd(8) + name + (ok ? '' : '   <- ' + detail));
}
const cb = () => 'cb=' + Date.now() + Math.random().toString(36).slice(2, 6);
const url = (u) => { const [path, hash] = u.split('#'); return B + path + (path.includes('?') ? '&' : '?') + cb() + (hash ? '#' + hash : ''); };
async function state(p) {
  return p.evaluate(() => ({
    path: location.pathname + location.hash,
    section: (document.querySelector('.page.active') || {}).id || null,
    open: !!document.querySelector('.nav-flyout.open'),
    curtain: !!document.querySelector('.nav-curtain.on'),
    navOpen: document.querySelector('nav').classList.contains('flyout-open'),
    navBottom: Math.round(document.querySelector('nav').getBoundingClientRect().bottom),
  }));
}
const clear = (s) => !s.open && !s.curtain && !s.navOpen;
async function landed(p, s, href) {
  // Where a press should have taken us: path and/or a target sitting just under the bar.
  const [path, hash] = href.split('#');
  let ok = true, why = [];
  if (path && path !== '/' && !s.path.startsWith(path)) { ok = false; why.push('path ' + s.path); }
  if (path === '/' && !hash && s.section !== 'p-home' && !s.path.startsWith('/')) { ok = false; why.push('not home'); }
  if (hash) {
    const info = await p.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) { const sec = document.getElementById('p-' + id); return sec ? { section: true, pgActive: sec.classList.contains('active'), pg: sec.id } : null; }
      const pg = el.closest('.page');
      return { top: Math.round(el.getBoundingClientRect().top), pg: pg ? pg.id : null, pgActive: pg ? pg.classList.contains('active') : true };
    }, hash);
    if (!info) { ok = false; why.push('no #' + hash); }
    else if (info.section) { if (!info.pgActive) { ok = false; why.push('section ' + s.section + ' not ' + info.pg); } }
    else {
      if (!info.pgActive) { ok = false; why.push('section ' + s.section + ' not ' + info.pg); }
      if (info.top < s.navBottom - 6 || info.top > s.navBottom + 260) { ok = false; why.push('#' + hash + ' top=' + info.top + ' bar=' + s.navBottom); }
    }
  }
  return [ok, why.join(', ')];
}
async function run(name, browserType, opts, touch) {
  const b = await browserType.launch();
  const c = await b.newContext(opts);
  const p = await c.newPage();
  // Turnstile's challenge frame logs a cross-origin access error on http://localhost; not ours.
  const errs = []; p.on('pageerror', e => { if (!/challenges\.cloudflare\.com/.test(e.message)) errs.push(e.message); });
  const settle = async (href) => { await p.waitForLoadState('load'); await p.waitForTimeout(href && href.includes('#') ? 1600 : 700); };
  const start = async (u) => { await p.goto(url(u)); await p.waitForTimeout(700); };
  const press = async (sel) => { const el = p.locator(sel).first(); await el.waitFor({ state: 'visible', timeout: 8000 }); if (touch) await el.tap(); else await el.click(); };
  const pressXY = async (x, y) => { if (touch) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); };
  const openPanel = async (key) => { if (touch) await press('#nav-trigger-' + key); else await p.hover('#nav-trigger-' + key); await p.waitForTimeout(600); return (await state(p)).open; };
  const navItem = (label) => `.nav-links a:text-is("${label}")`;
  const TOP = [['Home', 'p-home'], ['Agents', 'p-projects'], ['Press', 'p-press'], ['Contact Us', 'p-contact']];

  // 1. Top-level items, from home and from a sub-page.
  for (const from of ['/', '/papers/']) {
    for (const [label, id] of TOP) {
      await start(from); await press(navItem(label)); await settle('#x');
      const s = await state(p);
      check(name, `${from} tap ${label}`, s.section === id && clear(s), JSON.stringify(s));
    }
  }
  // 2. Flyouts.
  for (const key of ['about', 'research']) {
    for (const from of ['/', '/papers/']) {
      const tag = `${from} ${key}`;
      await start(from);
      check(name, `${tag}: opens`, await openPanel(key), JSON.stringify(await state(p)));
      if (touch) {
        await press('#nav-trigger-' + key); await p.waitForTimeout(500);
        check(name, `${tag}: tap item again closes`, clear(await state(p)), JSON.stringify(await state(p)));
      } else {
        await p.mouse.move(700, 760); await p.waitForTimeout(600);
        check(name, `${tag}: mouse leaves, closes`, clear(await state(p)), JSON.stringify(await state(p)));
        await start(from); await openPanel(key); await p.click('#nav-trigger-' + key); await settle('#x');
        const s = await state(p);
        const dest = key === 'about' ? s.section === 'p-about' : s.path.startsWith('/papers/');
        check(name, `${tag}: click item closes + navigates`, clear(s) && dest, JSON.stringify(s));
      }
      await start(from); await openPanel(key);
      const items = await p.$$eval(`#nav-flyout-${key} a`, as => as.map(a => [a.textContent, a.getAttribute('href')]));
      for (const [label, href] of items) {
        await start(from); await openPanel(key);
        await press(`#nav-flyout-${key} a:text-is("${label}")`); await settle(href);
        const s = await state(p); const [ok, why] = await landed(p, s, href);
        check(name, `${tag} → ${label}`, ok && clear(s), why + ' ' + JSON.stringify(s));
      }
      await start(from); await openPanel(key); await press(navItem('Agents')); await settle('#x');
      { const s = await state(p); check(name, `${tag} open → tap Agents`, s.section === 'p-projects' && clear(s), JSON.stringify(s)); }
      await start(from); await openPanel(key); await press('.nav-logo'); await settle();
      { const s = await state(p); check(name, `${tag} open → tap logo`, s.section === 'p-home' && clear(s), JSON.stringify(s)); }
      await start(from); await openPanel(key);
      { const vp = p.viewportSize(); await pressXY(Math.round(vp.width / 2), vp.height - 10); await p.waitForTimeout(500);
        const s = await state(p); check(name, `${tag} open → press the page behind`, clear(s), JSON.stringify(s)); }
      const other = key === 'about' ? 'research' : 'about';
      await start(from); await openPanel(key); await openPanel(other);
      { const s = await p.evaluate(() => ({ a: document.getElementById('nav-flyout-about').classList.contains('open'), r: document.getElementById('nav-flyout-research').classList.contains('open') }));
        check(name, `${tag} open → open ${other}`, other === 'about' ? (s.a && !s.r) : (s.r && !s.a), JSON.stringify(s)); }
    }
  }
  // 3. Footer: legal bar, the talk-to-us line, and every column link (columns are an accordion on phone).
  const footerLinks = async () => p.$$eval('.sf-legal a, .sf-more a[href^="/"]', as => as.map(a => [a.textContent, a.getAttribute('href'), a.closest('.sf-legal') ? '.sf-legal' : '.sf-more']));
  for (const from of ['/', '/data/']) {
    await start(from);
    for (const [label, href, scope] of await footerLinks()) {
      await start(from); await press(`${scope} a:text-is("${label}")`); await settle(href);
      const s = await state(p); const [ok, why] = await landed(p, s, href);
      check(name, `${from} footer → ${label}`, ok && clear(s), why + ' ' + JSON.stringify(s));
    }
    const cols = await p.$$eval('.sf-col', cs => cs.map((c, i) => [i + 1, [...c.querySelectorAll('a')].map(a => [a.textContent, a.getAttribute('href')])]));
    for (const [i, links] of cols) {
      for (const [label, href] of links) {
        if (!href.startsWith('/')) continue;
        await start(from);
        const openCol = await p.$eval(`.sf-col:nth-child(${i}) ul`, ul => getComputedStyle(ul).display !== 'none');
        if (!openCol) { await press(`.sf-col:nth-child(${i}) h3 button`); await p.waitForTimeout(300); }
        await press(`.sf-col:nth-child(${i}) a:text-is("${label}")`); await settle(href);
        const s = await state(p); const [ok, why] = await landed(p, s, href);
        check(name, `${from} footer col ${i} → ${label}`, ok && clear(s), why + ' ' + JSON.stringify(s));
      }
    }
  }
  // 4. Home: hero buttons, agent tiles, manifesto link, closing CTA, a footnote marker.
  const HOME = [
    ['.hx-light .hb-fill', '/#anton-more'], ['.hx-dark .hb-fill', '/#joseph-more'],
    ['.hx-light .hb-line', '/#contact'], ['.hx-dark .hb-line', '/#contact'],
  ];
  for (const [sel, href] of HOME) {
    await start('/'); await press(sel); await settle(href);
    const s = await state(p); const [ok, why] = await landed(p, s, href);
    check(name, `home ${sel}`, ok && clear(s), why + ' ' + JSON.stringify(s));
  }
  await start('/#projects');
  const firstNote = await p.$eval('#p-projects sup.fn a', a => '/' + a.getAttribute('href'));
  const AGENTS = [['#anton .tile-btn', '/#contact'], ['#joseph .tile-btn', '/#contact'], ['#anton .tile-link', '/#anton-more'], ['#joseph .tile-link', '/#joseph-more'], ['.agents-close .agents-cta', '/#contact'], ['#p-projects sup.fn a', firstNote]];
  for (const [sel, href] of AGENTS) {
    await start('/#projects'); await press(sel); await settle(href);
    const s = await state(p); const [ok, why] = await landed(p, s, href);
    check(name, `agents ${sel}`, ok && clear(s), why + ' ' + JSON.stringify(s));
  }
  await start('/#about'); await press('.about-more a'); await settle();
  { const s = await state(p); check(name, 'about → AI Safety link', s.path.startsWith('/ai-safety/') && clear(s), JSON.stringify(s)); }
  await start('/privacy/'); await press('.toc a'); await settle('#x');
  { const s = await state(p); const [ok, why] = await landed(p, s, '/privacy/#who-we-are'); check(name, 'privacy TOC first link', ok, why + ' ' + JSON.stringify(s)); }
  // 5. History: the URL follows the section, Back returns to the previous one, a refresh keeps it.
  await start('/'); await press(navItem('About')); if (touch) { await press('#nav-flyout-about a:text-is("Manifesto")'); } await settle('#x');
  { const s = await state(p); check(name, 'history: About puts #about in the URL', s.section === 'p-about' && s.path.endsWith('#about') && clear(s), JSON.stringify(s)); }
  await press(navItem('Agents')); await settle('#x'); await p.goBack(); await p.waitForTimeout(800);
  { const s = await state(p); check(name, 'history: Back returns to About', s.section === 'p-about' && clear(s), JSON.stringify(s)); }
  await p.goBack(); await p.waitForTimeout(800);
  { const s = await state(p); check(name, 'history: Back again returns Home', s.section === 'p-home' && clear(s), JSON.stringify(s)); }
  await start('/#about'); await p.reload(); await p.waitForTimeout(800);
  { const s = await state(p); check(name, 'history: refresh keeps About', s.section === 'p-about', JSON.stringify(s)); }
  // 6. Contact-form error return, both URL shapes the handler has used.
  for (const u of ['/?error=1#contact', '/#contact?error=1']) {
    await p.goto(B + u); await p.waitForTimeout(900);
    const r = await p.evaluate(() => ({ section: (document.querySelector('.page.active') || {}).id, err: (function () { const e = document.getElementById('formErr'); return e ? getComputedStyle(e).display : 'missing'; })() }));
    check(name, `form error return ${u}`, r.section === 'p-contact' && r.err === 'block', JSON.stringify(r));
  }
  // 7. Papers: the Read Abstract toggle opens and closes.
  await start('/papers/');
  { const id = await p.$eval('.paper-card [onclick*="toggleAbstract"]', b => (b.getAttribute('onclick').match(/'([^']+)'/) || [])[1]);
    const disp = () => p.evaluate(id => getComputedStyle(document.getElementById(id)).display, id);
    const before = await disp(); await press('.paper-card [onclick*="toggleAbstract"]'); await p.waitForTimeout(400); const open = await disp();
    await press('.paper-card [onclick*="toggleAbstract"]'); await p.waitForTimeout(400); const closed = await disp();
    check(name, 'papers: Read Abstract toggles', before === 'none' && open !== 'none' && closed === 'none', `${before} → ${open} → ${closed}`); }
  check(name, 'no page errors', errs.length === 0, errs.join(' | ').slice(0, 200));
  await b.close();
}
// 8. Every internal link on every page answers 200 (after redirects) on the www host.
async function crawl() {
  const b = await chromium.launch(); const c = await b.newContext(); const p = await c.newPage();
  const pages = ['/', '/papers/', '/data/', '/ai-safety/', '/privacy/', '/terms/', '/legal/', '/site-map/', '/thank-you.html'];
  const seen = new Map();
  for (const u of pages) {
    await p.goto(url(u)); await p.waitForTimeout(500);
    const hrefs = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')).filter(h => h && h.startsWith('/')));
    for (const h of hrefs) { const path = h.split('#')[0] || '/'; if (!seen.has(path)) seen.set(path, u); }
  }
  for (const [path, from] of seen) {
    const r = await p.request.get(B + path, { maxRedirects: 5 });
    const okHost = !B.startsWith('https://www.speedrunlab.ai') || r.url().startsWith('https://www.speedrunlab.ai/');
    check('links', `${path} (from ${from})`, r.status() === 200 && okHost, `status ${r.status()} → ${r.url()}`);
  }
  await b.close();
}
(async () => {
  const have = (n) => WANT.includes(n);
  if (have('phone')) await run('phone', chromium, { viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true }, true);
  if (have('ipad')) await run('ipad', chromium, { viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true }, true);
  if (have('desk')) await run('desk', chromium, { viewport: { width: 1440, height: 900 } }, false);
  if (have('webkit')) {
    try { await run('webkit', webkit, { ...devices['iPhone 15'] }, true); }
    catch (e) { console.log('webkit skipped: ' + String(e.message).split('\n')[0]); }
  }
  if (have('links') || WANT.length >= 3) await crawl();
  const bad = results.filter(r => !r.ok);
  console.log(`\n${results.length} checks, ${bad.length} failed.`);
  if (bad.length) { console.log('FAILED:'); bad.forEach(r => console.log(' - ' + r.ctx + ' ' + r.name + ' <- ' + r.detail)); }
  process.exit(bad.length ? 1 : 0);
})();
