// tests/audit.cjs — the "test it test it test it" gate (Addy 2026-10-17: "make sure on mobile or iPad or
// web it looks great on all of it"). Renders every page at iPhone / iPad portrait / iPad landscape / desktop
// against production (or B=http://localhost:8765), checks horizontal scroll, elements past the viewport edge,
// images that failed to load, footnote markers with no target, page and console errors, and writes full-page
// screenshots plus one review sheet per viewport to OUT (default <tmpdir>/speedrun-audit). READ THE SHEETS,
// phone first. Exit code 1 when any render has a problem. tests/ is in .vercelignore and never deploys.
// Run: B=https://www.speedrunlab.ai NODE_PATH=~/Documents/investing-platform-v1/node_modules node tests/audit.cjs
//      (add PAGES=/#contact to re-check one page; OUT=<dir> to choose where the screenshots go)
const { chromium } = require('playwright');
const os = require('os'), fs = require('fs'), path = require('path');
const B = (process.env.B || 'https://www.speedrunlab.ai').replace(/\/$/, '');
const OUT = process.env.OUT || path.join(os.tmpdir(), 'speedrun-audit');
fs.mkdirSync(OUT, { recursive: true });
// PAGES=/#contact,/data/ re-checks a few pages quickly; the default is every page.
const PAGES = process.env.PAGES ? process.env.PAGES.split(',') : ['/', '/#about', '/#projects', '/#skills', '/#press', '/#contact', '/papers/', '/data/', '/ai-safety/',
  '/privacy/', '/terms/', '/legal/', '/site-map/', '/thank-you.html'];
const VP = [['phone', 393, 852, true], ['ipad', 820, 1180, true], ['ipad-l', 1180, 820, true], ['desk', 1440, 900, false]];
// Accepted console noise, both from Cloudflare Turnstile on the contact section: its "data:," probe, which our
// CSP connect-src refuses (the widget still renders), and its "%c%d font-size:0;color:transparent" console check.
const IGNORE = [/data:,/, /font-size:0;color:transparent/];
(async () => {
  const b = await chromium.launch();
  const report = [];
  for (const [n, w, h, m] of VP) {
    const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m, deviceScaleFactor: 1 });
    for (const u of PAGES) {
      const p = await c.newPage();
      const errs = [];
      p.on('pageerror', e => errs.push(e.message));
      p.on('console', x => { if (x.type() === 'error' && !IGNORE.some(r => r.test(x.text()))) errs.push('console:' + x.text()); });
      const url = u.startsWith('/#') ? `${B}/?cb=${Date.now()}${u.slice(1)}` : `${B}${u}?cb=${Date.now()}`;
      await p.goto(url, { waitUntil: 'load' });
      await p.waitForTimeout(1500);
      // Sweep the page so lazy images load, then return to the top before measuring and shooting.
      await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 0); });
      await p.waitForTimeout(600);
      const r = await p.evaluate(() => {
        const iw = innerWidth, over = [];
        document.querySelectorAll('body *').forEach(el => {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') return;
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && (r.right > iw + 1 || r.left < -1)) {
            const t = String(el.className || el.tagName);
            if (!/nav-flyout|nav-curtain/.test(t)) over.push(t.slice(0, 40) + ' right=' + Math.round(r.right));
          }
        });
        const imgs = [...document.images].filter(i => i.getBoundingClientRect().width > 0 && (!i.complete || i.naturalWidth === 0)).map(i => i.src.split('/').pop());
        const badSup = [...document.querySelectorAll('sup.fn a')].map(a => a.getAttribute('href').slice(1)).filter(id => !document.getElementById(id));
        return { sw: document.documentElement.scrollWidth, iw, over: over.slice(0, 6), imgs, badSup, h: document.documentElement.scrollHeight };
      });
      const shot = `${n}${u.replace(/\W/g, '_')}.png`;
      await p.screenshot({ path: path.join(OUT, shot), fullPage: true });
      const probs = [];
      if (r.sw > r.iw) probs.push(`HSCROLL ${r.sw}>${r.iw}`);
      if (r.over.length) probs.push('OVERFLOW ' + r.over.join('; '));
      if (r.imgs.length) probs.push('IMG ' + r.imgs.join(','));
      if (r.badSup.length) probs.push('FOOTNOTE ' + r.badSup.join(','));
      if (errs.length) probs.push('ERR ' + errs.join(' | ').slice(0, 160));
      report.push({ vp: n, u, h: r.h, probs, shot });
      console.log((probs.length ? 'FAIL ' : 'ok   ') + n.padEnd(7) + u.padEnd(17) + ('h=' + r.h).padEnd(9) + probs.join('  '));
      await p.close();
    }
    await c.close();
  }
  // Review sheets: the full-page shots of one viewport side by side, cropped to a readable height.
  const sheet = await b.newPage();
  for (const [n] of VP) {
    const shots = report.filter(x => x.vp === n);
    const colw = n === 'phone' ? 260 : n === 'desk' ? 480 : 400, cap = n === 'phone' ? 2600 : 2000, perRow = n === 'phone' ? 7 : n === 'desk' ? 4 : 5;
    const rows = [];
    for (let i = 0; i < shots.length; i += perRow) rows.push(shots.slice(i, i + perRow));
    const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#777;font:12px -apple-system,sans-serif}.row{display:flex;gap:10px;padding:10px}.c{width:${colw}px}.c div{color:#fff;margin:0 0 4px;white-space:nowrap;overflow:hidden}.c img{width:${colw}px;max-height:${cap}px;object-fit:cover;object-position:top;display:block;background:#fff}</style>` +
      rows.map(row => '<div class="row">' + row.map(x => `<div class="c"><div>${x.u}${x.probs.length ? ' ✗' : ''}</div><img src="./${x.shot}"></div>`).join('') + '</div>').join('');
    const hp = path.join(OUT, `sheet-${n}.html`);
    fs.writeFileSync(hp, html);
    await sheet.setViewportSize({ width: perRow * (colw + 10) + 10, height: 800 });
    await sheet.goto('file://' + hp);
    await sheet.waitForTimeout(1000);
    await sheet.screenshot({ path: path.join(OUT, `sheet-${n}.png`), fullPage: true });
  }
  await b.close();
  const bad = report.filter(x => x.probs.length).length;
  console.log(`\n${report.length} renders, ${bad} with problems. Screenshots and sheets: ${OUT}`);
  process.exit(bad ? 1 : 0);
})();
