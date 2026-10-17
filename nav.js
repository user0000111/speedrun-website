(function () {
  var IS_HOME = window.location.pathname === '/' || window.location.pathname === '/index.html';

  var LINKS = [
    { label: 'Home',            id: 'home',     href: '/',          section: true  },
    { label: 'About',           id: 'about',    href: '/#about',    section: true  },
    { label: 'Agents',          id: 'projects', href: '/#projects', section: true  },
    { label: 'Research Papers', id: null,       href: '/papers/',   section: false, flyout: 'research' },
    { label: 'Press',           id: 'press',    href: '/#press',    section: true  },
    { label: 'Contact Us',      id: 'contact',  href: '/#contact',  section: true  },
  ];

  // The Research flyout, Apple globalnav style: hover "Research Papers" and this panel
  // drops down under the bar. Skill Library lives here, not in the top row (Addy 2026-10-17).
  // Paper links follow the card order on /papers/; skill links are the card ids on home.
  var FLYOUT = [
    { label: 'Explore Research', primary: true, items: [
      ['Research Papers', '/papers/'],
      ['Skill Library',   '/#skills'],
    ]},
    { label: 'Papers', items: [
      ['NemoClaw on Apple Silicon',        '/papers/#nemoclaw-apple-silicon'],
      ['Inside NemoClaw',                  '/papers/#inside-nemoclaw'],
      ['Independent Review-Council Seats', '/papers/#review-council-seats'],
      ['The Intelligence Council',         '/papers/#intelligence-council'],
      ['Self-Improving AI Agents',         '/papers/#self-improving-agents'],
      ['Fault-Tolerant Memory for OpenClaw', '/papers/#fault-tolerant-memory'],
    ]},
    { label: 'Skills', items: [
      ['Hermes Agent as a Skill',  '/#hermes-agent-as-a-skill'],
      ['Read Before Write',        '/#read-before-write'],
      ['No Slop Writing',          '/#no-slop-writing'],
      ['No Slop Writing (AU)',     '/#no-slop-writing-au'],
      ['Deep Audit',               '/#deep-audit'],
    ]},
  ];

  // Flyout styles live here, once, so the three pages cannot drift apart.
  var CSS =
    // Desktop bar is 96px so the mascot (72px of visible artwork inside a 109px image with uneven
    // transparent padding) sits centred with ~12px above and below (Addy 2026-10-17). Phone unchanged.
    '@media(min-width:769px){.nav-inner{height:96px}.nav-logo img{height:109px;position:relative;top:4px}}' +
    'nav{transition:background .32s cubic-bezier(.4,0,.6,1)}' +
    'nav.flyout-open{background:#FBFBFB;border-bottom-color:transparent}' +
    '.nav-flyout{position:absolute;top:100%;left:0;right:0;background:#FBFBFB;display:grid;grid-template-rows:0fr;visibility:hidden;' +
      'transition:grid-template-rows .32s cubic-bezier(.4,0,.6,1),visibility 0s linear .32s}' +
    'nav.flyout-open .nav-flyout{grid-template-rows:1fr;visibility:visible;transition:grid-template-rows .32s cubic-bezier(.4,0,.6,1),visibility 0s}' +
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
    'nav.flyout-open .nav-flyout-label,nav.flyout-open .nav-flyout li{opacity:1;transform:none;transition:opacity .24s ease var(--d,0s),transform .24s ease var(--d,0s)}' +
    '.nav-curtain{position:fixed;inset:0;z-index:99;background:rgba(232,232,237,0.4);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);opacity:0;visibility:hidden;' +
      'transition:opacity .32s cubic-bezier(.4,0,.6,1),visibility 0s linear .32s}' +
    '.nav-curtain.on{opacity:1;visibility:visible;transition:opacity .32s cubic-bezier(.4,0,.6,1),visibility 0s}' +
    '.paper-card,.skill-card{scroll-margin-top:120px}' +
    '@media(max-width:768px){' +
      '.nav-flyout-inner{flex-direction:column;gap:28px;padding:24px 24px 36px}' +
      '.nav-flyout-group.primary{min-width:0}' +
      '.nav-flyout a{font-size:14px;padding:6px 0}' +
      '.nav-flyout .primary a{font-size:24px;padding:4px 0}' +
      '.paper-card,.skill-card{scroll-margin-top:156px}' +
    '}' +
    '@media(prefers-reduced-motion:reduce){nav,.nav-flyout,.nav-flyout *,.nav-curtain{transition:none!important}}';
  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  function currentActive() {
    if (!IS_HOME) {
      var path = window.location.pathname.replace(/\/$/, '');
      for (var i = 0; i < LINKS.length; i++) {
        var lhref = LINKS[i].href.replace(/\/$/, '').replace('/#', '/');
        if (path === lhref || path + '/' === LINKS[i].href) return LINKS[i].id || LINKS[i].label;
      }
      return null;
    }
    return 'home';
  }

  var trigger = null, triggerLi = null;
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
  liLink.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
  topRow.appendChild(liLink);

  inner.appendChild(topRow);

  // Links row
  var ul = document.createElement('ul');
  ul.className = 'nav-links';

  LINKS.forEach(function (link) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.textContent = link.label;

    var isActive = IS_HOME
      ? (link.id === 'home')
      : (window.location.pathname.replace(/\/$/, '') === link.href.replace(/\/$/, '').replace('/#', '/') ||
         window.location.pathname === link.href);

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
      // The Skill Library section now sits under this item, so it lights up there too.
      if (IS_HOME) a.setAttribute('data-p', 'skills');
      trigger = a;
      triggerLi = li;
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  inner.appendChild(ul);

  nav.appendChild(inner);

  // ---- Research flyout ----
  var flyout = document.createElement('div');
  flyout.className = 'nav-flyout';
  flyout.id = 'nav-flyout-research';
  flyout.setAttribute('role', 'region');
  flyout.setAttribute('aria-labelledby', 'nav-trigger-research');
  var clip = document.createElement('div');
  clip.className = 'nav-flyout-clip';
  var fin = document.createElement('div');
  fin.className = 'nav-flyout-inner';
  var step = 0;
  function delay(el) { el.style.setProperty('--d', (0.1 + step * 0.02).toFixed(2) + 's'); step++; }
  FLYOUT.forEach(function (group) {
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
        close(true);
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
  flyout.appendChild(clip);
  nav.appendChild(flyout);

  var curtain = document.createElement('div');
  curtain.className = 'nav-curtain';
  curtain.setAttribute('aria-hidden', 'true');

  var openTimer = null, closeTimer = null;
  function isOpen() { return nav.classList.contains('flyout-open'); }
  function setLinksFocusable(on) {
    flyout.querySelectorAll('a').forEach(function (x) { x.tabIndex = on ? 0 : -1; });
  }
  function open() {
    clearTimeout(closeTimer); clearTimeout(openTimer);
    if (isOpen()) return;
    nav.classList.add('flyout-open');
    curtain.classList.add('on');
    trigger.setAttribute('aria-expanded', 'true');
    setLinksFocusable(true);
  }
  function close(now) {
    clearTimeout(openTimer); clearTimeout(closeTimer);
    function shut() {
      nav.classList.remove('flyout-open');
      curtain.classList.remove('on');
      trigger.setAttribute('aria-expanded', 'false');
      setLinksFocusable(false);
    }
    if (now) shut(); else closeTimer = setTimeout(shut, 160);
  }

  // Mouse: open on hover with a short intent delay, like apple.com; touch: first tap opens.
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    [triggerLi, flyout].forEach(function (el) {
      el.addEventListener('mouseenter', function () { clearTimeout(closeTimer); openTimer = setTimeout(open, 120); });
      el.addEventListener('mouseleave', function () { clearTimeout(openTimer); close(false); });
    });
  } else {
    trigger.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (isOpen()) close(true); else open();
    });
  }
  // Keyboard: Enter/Space/ArrowDown on the trigger opens; Escape closes and returns focus.
  trigger.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowDown' || (!canHover && (ev.key === 'Enter' || ev.key === ' '))) {
      ev.preventDefault(); open();
      var first = flyout.querySelector('a'); if (first) first.focus();
    }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && isOpen()) { close(true); trigger.focus(); }
  });
  nav.addEventListener('focusout', function (ev) {
    if (isOpen() && !nav.contains(ev.relatedTarget)) close(true);
  });
  curtain.addEventListener('click', function () { close(true); });

  // Inject nav as first child of body
  document.body.insertBefore(nav, document.body.firstChild);
  document.body.insertBefore(curtain, nav.nextSibling);
})();
