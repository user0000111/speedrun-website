(function () {
  var IS_HOME = window.location.pathname === '/' || window.location.pathname === '/index.html';

  // `flyout` names a panel in FLYOUTS; `activeFor` lights the item for extra home sections;
  // `alsoOn` lights it on extra sub-pages.
  var LINKS = [
    { label: 'Home',            id: 'home',     href: '/',          section: true  },
    { label: 'About',           id: 'about',    href: '/#about',    section: true,  flyout: 'about', alsoOn: ['/ai-safety/', '/data/'] },
    { label: 'Agents',          id: 'projects', href: '/#projects', section: true  },
    { label: 'Skill Library',   id: 'skills',   href: '/#skills',   section: true,  flyout: 'research', alsoOn: ['/papers/'] },
    { label: 'Press',           id: 'press',    href: '/#press',    section: true  },
    { label: 'Contact Us',      id: 'contact',  href: '/#contact',  section: true  },
  ];

  // Flyouts, Apple globalnav style: hover the item and a panel drops down under the bar.
  // Skill Library is the top-row item and Research Papers sits inside its panel (Addy 2026-10-23:
  // "skills library there and research paper inside, basically a swap"; the reverse held from 2026-10-17).
  // About holds the manifesto and AI Safety (Addy 2026-10-17: "That AI Safety tab will also be under the
  // About section"). Skill links are the card ids on home; paper links follow the card order on /papers/.
  var FLYOUTS = {
    about: [
      { label: 'About Speedrun AI Labs', primary: true, items: [
        ['Manifesto', '/#about'],
        ['AI Safety', '/ai-safety/'],
      ]},
      { label: 'More', items: [
        ['Data',       '/data/'],
        ['Press',      '/#press'],
        ['Contact Us', '/#contact'],
        ['Legal',      '/legal/'],
      ]},
    ],
    research: [
      { label: 'Explore', primary: true, items: [
        ['Skill Library',   '/#skills'],
        ['Research Papers', '/papers/'],
      ]},
      { label: 'Skills', items: [
        ['Reverse Engineer Anything', '/#reverse-engineer-anything'],
        ['Hermes Agent as a Skill File', '/#hermes-agent-as-a-skill'],
        ['Read Before Write',        '/#read-before-write'],
        ['No-Slop Writing',          '/#no-slop-writing'],
        ['No-Slop Writing (AU)',     '/#no-slop-writing-au'],
        ['Deep Audit',               '/#deep-audit'],
      ]},
      { label: 'Papers', items: [
        ['NemoClaw on Apple Silicon',        '/papers/#nemoclaw-apple-silicon'],
        ['Inside NemoClaw',                  '/papers/#inside-nemoclaw'],
        ['Independent Review-Council Seats', '/papers/#review-council-seats'],
        ['The Intelligence Council',         '/papers/#intelligence-council'],
        ['Self-Improving AI Agents',         '/papers/#self-improving-agents'],
        ['Fault-Tolerant Memory for OpenClaw', '/papers/#fault-tolerant-memory'],
      ]},
    ],
  };

  // Flyout styles live here, once, so the pages cannot drift apart.
  var CSS =
    // Desktop bar is 96px so the mascot (72px of visible artwork inside a 109px image with uneven
    // transparent padding) sits centred with ~12px above and below (Addy 2026-10-17). Phone unchanged.
    '@media(min-width:769px){.nav-inner{height:96px}.nav-logo img{height:109px;position:relative;top:4px}}' +
    'nav{transition:background .32s cubic-bezier(.4,0,.6,1)}' +
    'nav.flyout-open{background:#FBFBFB;border-bottom-color:transparent}' +
    '.nav-flyout{position:absolute;top:100%;left:0;right:0;background:#FBFBFB;display:grid;grid-template-rows:0fr;visibility:hidden;' +
      'transition:grid-template-rows .32s cubic-bezier(.4,0,.6,1),visibility 0s linear .32s}' +
    '.nav-flyout.open{grid-template-rows:1fr;visibility:visible;transition:grid-template-rows .32s cubic-bezier(.4,0,.6,1),visibility 0s}' +
    '.nav-flyout-clip{overflow:hidden;min-height:0}' +
    '.nav-flyout-inner{max-width:980px;margin:0 auto;padding:40px 22px 84px;display:flex;gap:88px}' +
    '.nav-flyout-group{min-width:0}' +
    '.nav-flyout-group.primary{min-width:262px}' +
    '.nav-flyout-label{font-family:var(--font-sans);font-size:12px;font-weight:400;color:var(--grey-mid);letter-spacing:-0.01em;margin:0 0 14px}' +
    '.nav-flyout ul{list-style:none;margin:0;padding:0}' +
    '.nav-flyout li{margin:0}' +
    '.nav-flyout a{font-family:var(--font-sans);display:inline-block;color:var(--grey-dark);text-decoration:none;font-size:12px;font-weight:600;line-height:1.34;letter-spacing:-0.01em;padding:4px 0;transition:color .2s ease}' +
    '.nav-flyout .primary a{font-size:24px;line-height:1.17;letter-spacing:0.007em;padding:3px 0;color:var(--black)}' +
    '.nav-flyout a:hover,.nav-flyout a:focus-visible{color:var(--black)}' +
    '.nav-flyout-label,.nav-flyout li{opacity:0;transform:translateY(-4px);transition:opacity .16s ease,transform .16s ease}' +
    '.nav-flyout.open .nav-flyout-label,.nav-flyout.open li{opacity:1;transform:none;transition:opacity .24s ease var(--d,0s),transform .24s ease var(--d,0s)}' +
    '.nav-curtain{position:fixed;inset:0;z-index:99;background:rgba(232,232,237,0.4);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);opacity:0;visibility:hidden;' +
      'transition:opacity .32s cubic-bezier(.4,0,.6,1),visibility 0s linear .32s}' +
    '.nav-curtain.on{opacity:1;visibility:visible;transition:opacity .32s cubic-bezier(.4,0,.6,1),visibility 0s}' +
    '.paper-card,.skill-card{scroll-margin-top:120px}' +
    '@media(max-width:768px){' +
      // Phone: the panel is a menu, not a poster. Primary choices are full-width rows with a chevron,
      // group labels are small caps, list items are regular weight, and the panel scrolls on short phones.
      '.nav-flyout-clip{max-height:calc(100vh - 140px);max-height:calc(100dvh - 140px);overflow-y:auto;-webkit-overflow-scrolling:touch}' +
      '.nav-flyout-inner{flex-direction:column;gap:22px;padding:14px 20px 28px}' +
      '.nav-flyout-group.primary{min-width:0}' +
      '.nav-flyout-label{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--grey-mid);margin:0 0 2px}' +
      '.nav-flyout a{display:block;font-size:15px;font-weight:400;color:var(--grey-dark);padding:10px 0}' +
      '.nav-flyout .primary a{display:flex;align-items:center;justify-content:space-between;font-size:20px;font-weight:600;letter-spacing:-0.01em;color:var(--black);padding:14px 0;border-bottom:1px solid var(--grey-light)}' +
      '.nav-flyout .primary li:last-child a{border-bottom:0}' +
      '.nav-flyout .primary a::after{content:"\\203A";font-size:26px;line-height:1;font-weight:400;color:var(--grey-nav);margin-left:12px}' +
      '.paper-card,.skill-card{scroll-margin-top:156px}' +
    '}' +
    '@media(prefers-reduced-motion:reduce){nav,.nav-flyout,.nav-flyout *,.nav-curtain{transition:none!important}}';
  // Phone nav: Apple-style glass, Addy's pick of three on 2026-10-17 ("A"). It is styled from here under
  // html[data-nav="glass"], which outranks each page's inline phone-nav rules (those stay as the no-JS
  // fallback), and data-page lets the content offsets follow the bar. GLASS holds the material so the
  // transparency can be tuned in one place.
  // Transparency: Addy's pick of three on 2026-10-17 (option 1, 45% white; 34% and 22% lost the labels over the black section).
  var GLASS = { bg: 'rgba(255,255,255,.45)', blur: 'saturate(180%) blur(24px)', panel: 'rgba(255,255,255,.84)' };
  var EDGE = 'inset 0 1px 0 rgba(255,255,255,.9),0 0 0 .5px rgba(0,0,0,.08)';
  var GLASS_CSS = '@media(max-width:768px){' +
    'html[data-nav="glass"] nav,html[data-nav="glass"] nav.flyout-open{top:0;left:0;right:0;background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none;border-bottom:0;pointer-events:none}' +
    'html[data-nav="glass"] .nav-inner{margin:10px 10px 0;padding:0 0 6px;border-radius:26px;max-width:none;height:auto;pointer-events:auto;background:' + GLASS.bg + ';-webkit-backdrop-filter:' + GLASS.blur + ';backdrop-filter:' + GLASS.blur + ';box-shadow:' + EDGE + ',0 8px 28px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04)}' +
    'html[data-nav="glass"] .nav-top-row{height:56px;padding:0 14px 0 6px;display:grid;grid-template-columns:1fr auto;align-items:center}' +
    'html[data-nav="glass"] .nav-logo{grid-column:1}' +
    'html[data-nav="glass"] .nav-logo img{height:56px}' +
    'html[data-nav="glass"] .nav-linkedin{grid-column:2;justify-self:end;margin:0}' +
    'html[data-nav="glass"] .nav-linkedin svg{width:20px;height:20px}' +
    'html[data-nav="glass"] .nav-links{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,auto);gap:2px 4px;border-top:0;padding:0 10px 4px;margin:0;pointer-events:auto}' +
    'html[data-nav="glass"] .nav-links li,html[data-nav="glass"] .nav-links li:nth-child(n+4){display:flex;justify-content:center;border:0}' +
    'html[data-nav="glass"] .nav-links a{display:block;font-size:12px;font-weight:400;letter-spacing:.01em;color:var(--grey-dark);padding:7px 10px;border-radius:980px;text-align:center;white-space:nowrap}' +
    'html[data-nav="glass"] .nav-links a.active{color:var(--black);background:rgba(0,0,0,.055)}' +
    'html[data-nav="glass"] .nav-flyout{pointer-events:auto;top:calc(100% + 8px);left:10px;right:10px;border-radius:22px;background:' + GLASS.panel + ';-webkit-backdrop-filter:' + GLASS.blur + ';backdrop-filter:' + GLASS.blur + ';box-shadow:' + EDGE + ',0 12px 36px rgba(0,0,0,.1);overflow:hidden}' +
    'html[data-nav="glass"] .nav-flyout-clip{max-height:calc(100dvh - 170px)}' +
    'html[data-nav="glass"] .nav-curtain{background:rgba(232,232,237,.35)}' +
    // the bar is 136px tall on phone: content offsets and jump margins follow it (rule 26)
    'html[data-nav="glass"][data-page="home"] .page,html[data-nav="glass"][data-page="papers"] .main,html[data-nav="glass"][data-page="doc"] body,html[data-nav="glass"][data-page="thanks"] body{padding-top:148px}' +
    'html[data-nav="glass"] .paper-card,html[data-nav="glass"] .skill-card,html[data-nav="glass"] .agent-tile,html[data-nav="glass"] .agent-detail,html[data-nav="glass"] .doc h2,html[data-nav="glass"] .sf-notes li{scroll-margin-top:164px}' +
    '}';
  var style = document.createElement('style');
  style.textContent = CSS + GLASS_CSS;
  document.head.appendChild(style);
  document.documentElement.setAttribute('data-nav', 'glass');
  document.documentElement.setAttribute('data-page', IS_HOME ? 'home' : /^\/papers\/?$/.test(window.location.pathname) ? 'papers' : window.location.pathname === '/thank-you.html' ? 'thanks' : 'doc');

  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var path = window.location.pathname;

  var nav = document.createElement('nav');
  var inner = document.createElement('div');
  inner.className = 'nav-inner';

  // Top row: logo + LinkedIn
  var topRow = document.createElement('div');
  topRow.className = 'nav-top-row';

  // Logo
  var logo = document.createElement('a');
  logo.className = 'nav-logo';
  if (IS_HOME) {
    logo.setAttribute('onclick', "go('home')");
    logo.style.cursor = 'pointer';
  } else {
    logo.href = '/';
  }
  // One logo. The site's background is light on every page, so there is nothing for a
  // second, white version to sit on — it was a leftover from an unfinished dark theme
  // (a8dd610) and was being downloaded on every page load while hidden.
  // width/height give the browser the logo's ratio before it loads, so the LinkedIn icon
  // does not jump ~100px on refresh (CSS sets the real height; width follows).
  logo.innerHTML =
    '<img src="/logo.png" alt="Speedrun AI Labs" width="1200" height="655" loading="eager">';
  topRow.appendChild(logo);

  // LinkedIn icon (top row, right side)
  var liLink = document.createElement('a');
  liLink.href = 'https://www.linkedin.com/company/speedrun-ai-labs';
  liLink.target = '_blank';
  liLink.rel = 'noopener noreferrer';
  liLink.className = 'nav-linkedin';
  liLink.setAttribute('aria-label', 'Speedrun AI Labs on LinkedIn');
  // LinkedIn's own mark: brand blue (#0A66C2, set in each page's .nav-linkedin) with white "in" letters;
  // the white rect sits under the cut-out letters so they stay white over the dark Joseph section too.
  liLink.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2" fill="#fff"/><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
  topRow.appendChild(liLink);

  inner.appendChild(topRow);

  // Links row
  var ul = document.createElement('ul');
  ul.className = 'nav-links';
  var triggers = []; // [{key, a, li}] for the flyouts, built after the row

  LINKS.forEach(function (link) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.textContent = link.label;

    var normalised = link.href.replace(/\/$/, '').replace('/#', '/');
    var isActive = IS_HOME
      ? (link.id === 'home')
      : (path.replace(/\/$/, '') === normalised || path === link.href ||
         (link.alsoOn || []).indexOf(path) !== -1);

    if (isActive) a.classList.add('active');

    if (IS_HOME && link.section && link.id) {
      a.setAttribute('data-p', link.id);
      a.setAttribute('onclick', "go('" + link.id + "')");
    } else {
      a.href = link.href;
    }

    if (link.flyout) {
      li.className = 'nav-has-flyout';
      a.id = 'nav-trigger-' + link.flyout;
      a.setAttribute('aria-haspopup', 'true');
      a.setAttribute('aria-expanded', 'false');
      a.setAttribute('aria-controls', 'nav-flyout-' + link.flyout);
      // A section that lives inside this panel lights the item too (Skill Library under Research).
      if (IS_HOME && link.activeFor) a.setAttribute('data-p', link.activeFor);
      // Touch: the first tap opens the panel instead of navigating; the panel's primary link navigates.
      if (!canHover) a.removeAttribute('onclick');
      triggers.push({ key: link.flyout, a: a, li: li });
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  inner.appendChild(ul);
  nav.appendChild(inner);

  var curtain = document.createElement('div');
  curtain.className = 'nav-curtain';
  curtain.setAttribute('aria-hidden', 'true');

  // ---- Flyouts ----
  var active = null; // the controller whose panel is open
  var ctls = [];
  // A page that has just loaded with the mouse already over an item (the previous page's click put it
  // there) gets a hover event without any movement; the panel must wait for the mouse to actually move.
  var mouseMoved = false;
  document.addEventListener('mousemove', function (ev) {
    if (mouseMoved || !(ev.movementX || ev.movementY)) return;
    mouseMoved = true;
    ctls.forEach(function (c) { if (c.li.matches(':hover') || c.el.matches(':hover')) c.scheduleOpen(); });
  }, true);

  function makeFlyout(key, groups, trigger, triggerLi) {
    var fly = document.createElement('div');
    fly.className = 'nav-flyout';
    fly.id = 'nav-flyout-' + key;
    fly.setAttribute('role', 'region');
    fly.setAttribute('aria-labelledby', 'nav-trigger-' + key);
    var clip = document.createElement('div');
    clip.className = 'nav-flyout-clip';
    var fin = document.createElement('div');
    fin.className = 'nav-flyout-inner';
    var step = 0;
    function delay(el) { el.style.setProperty('--d', (0.1 + step * 0.02).toFixed(2) + 's'); step++; }

    var openTimer = null, closeTimer = null;
    var ctl = {
      key: key, el: fly, trigger: trigger, li: triggerLi,
      isOpen: function () { return fly.classList.contains('open'); },
      open: function () {
        clearTimeout(closeTimer); clearTimeout(openTimer);
        if (active && active !== ctl) active.close(true);
        if (ctl.isOpen()) return;
        fly.classList.add('open');
        nav.classList.add('flyout-open');
        curtain.classList.add('on');
        trigger.setAttribute('aria-expanded', 'true');
        setFocusable(true);
        active = ctl;
      },
      close: function (now) {
        clearTimeout(openTimer); clearTimeout(closeTimer);
        function shut() {
          fly.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          setFocusable(false);
          if (active === ctl) {
            active = null;
            nav.classList.remove('flyout-open');
            curtain.classList.remove('on');
          }
        }
        if (now) shut(); else closeTimer = setTimeout(shut, 160);
      },
      scheduleOpen: function () { if (!mouseMoved) return; clearTimeout(closeTimer); openTimer = setTimeout(ctl.open, 120); },
      cancelOpen: function () { clearTimeout(openTimer); }
    };
    function setFocusable(on) {
      fly.querySelectorAll('a').forEach(function (x) { x.tabIndex = on ? 0 : -1; });
    }

    groups.forEach(function (group) {
      var g = document.createElement('div');
      g.className = 'nav-flyout-group' + (group.primary ? ' primary' : '');
      var lab = document.createElement('div');
      lab.className = 'nav-flyout-label';
      lab.textContent = group.label;
      delay(lab);
      g.appendChild(lab);
      var gl = document.createElement('ul');
      group.items.forEach(function (item) {
        var gli = document.createElement('li');
        var ga = document.createElement('a');
        ga.textContent = item[0];
        ga.href = item[1];
        ga.tabIndex = -1;
        var hashTarget = item[1].indexOf('/#') === 0 ? item[1].slice(2) : null;
        ga.addEventListener('click', function (ev) {
          ctl.close(true);
          // On home the sections are shown by go(); route the click there instead of reloading.
          if (IS_HOME && hashTarget && typeof window.srRoute === 'function') {
            ev.preventDefault();
            window.srRoute(hashTarget);
          }
        });
        delay(gli);
        gli.appendChild(ga);
        gl.appendChild(gli);
      });
      g.appendChild(gl);
      fin.appendChild(g);
    });
    clip.appendChild(fin);
    fly.appendChild(clip);
    nav.appendChild(fly);

    // Mouse: open on hover with a short intent delay, like apple.com; touch: first tap opens.
    if (canHover) {
      [triggerLi, fly].forEach(function (el) {
        el.addEventListener('mouseenter', ctl.scheduleOpen);
        el.addEventListener('mouseleave', function () { ctl.cancelOpen(); ctl.close(false); });
      });
      // A click on the item itself navigates (go() or its href), so the panel goes with it. The mouse is
      // still over the item, so mouseleave alone left the panel and curtain over the new content.
      trigger.addEventListener('click', function () { ctl.cancelOpen(); ctl.close(true); });
    } else {
      trigger.addEventListener('click', function (ev) {
        ev.preventDefault();
        if (ctl.isOpen()) ctl.close(true); else ctl.open();
      });
    }
    // Keyboard: ArrowDown (or Enter/Space on touch) on the trigger opens; Escape closes and returns focus.
    trigger.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown' || (!canHover && (ev.key === 'Enter' || ev.key === ' '))) {
        ev.preventDefault(); ctl.open();
        var first = fly.querySelector('a'); if (first) first.focus();
      }
    });
    ctls.push(ctl);
    return ctl;
  }

  triggers.forEach(function (t) { makeFlyout(t.key, FLYOUTS[t.key], t.a, t.li); });

  // Any press outside the open panel and its own item closes it: another nav item, the logo, the page
  // behind the curtain. Touch has no mouseleave, so without this a panel opened by tap stayed up, blurring
  // the section go() had just switched to (reviewer, 2026-10-17: "click menu it does not close and you do
  // not see any content"). Capture phase, so it runs before the pressed element's own handler.
  function closeIfOutside(ev) {
    if (!active) return;
    var t = ev.target;
    if (!(t instanceof Node)) return;
    if (active.el.contains(t) || active.li.contains(t)) return;
    active.close(true);
  }
  document.addEventListener('pointerdown', closeIfOutside, true);
  document.addEventListener('touchstart', closeIfOutside, { capture: true, passive: true });
  document.addEventListener('click', closeIfOutside, true);
  // go() on the home page calls this before it swaps sections.
  window.srNavClose = function () { if (active) active.close(true); };

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && active) { var t = active.trigger; active.close(true); t.focus(); }
  });
  nav.addEventListener('focusout', function (ev) {
    if (active && !nav.contains(ev.relatedTarget)) active.close(true);
  });
  curtain.addEventListener('click', function () { if (active) active.close(true); });

  // Inject nav as first child of body
  document.body.insertBefore(nav, document.body.firstChild);
  document.body.insertBefore(curtain, nav.nextSibling);
})();
