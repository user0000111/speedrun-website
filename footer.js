(function () {
  // Site footer, apple.com style: fine print, link columns, then the legal bar.
  // Injected on every page (like nav.js) so the pages cannot drift apart.
  // Include it as the LAST element of <body>, after the page content.
  var ENTITY = 'Speedrun AI Labs Pty Ltd';
  var ABN = '38 695 878 356';
  var YEAR = 2026;

  var IS_HOME = window.location.pathname === '/' || window.location.pathname === '/index.html';
  // On home the sections are shown by go(); everywhere else a section link is a normal link.
  function href(h) { return h; }

  // Fine print (drafted by Fable 5 on Apple's footnote pattern, 2026-10-17). Numbered notes are keyed
  // to <sup class="fn"> markers in index.html (home + Agents); other pages show the general lines.
  var NOTES = [
    "Anton is an AI agent that reviews the systems you point it at. It can miss weaknesses and flag things that are not. A clean report is not a certification, and Anton does not replace independent penetration testing or a security audit where one is required. Use it only on systems your business owns, operates or is authorised in writing to test. See the <a href=\"/legal/#ai-disclaimer\">AI and agent disclaimer</a> and <a href=\"/legal/#acceptable-use\">Acceptable Use Policy</a>.",
    "Joseph reports changes in the regulatory sources your business selects. Those sources can be incomplete, delayed or revised, and Joseph can miss or misread a change. Silence is not confirmation that nothing has changed, nor a substitute for your own monitoring.",
    "Joseph is an AI productivity tool for a compliance function. It does not give legal, financial, tax or compliance advice. Using Joseph does not make a business compliant or discharge any obligation to a regulator. Speedrun AI Labs Pty Ltd holds no Australian financial services licence or Australian credit licence and is not a law practice or registered tax agent. See the <a href=\"/legal/#ai-disclaimer\">AI and agent disclaimer</a>.",
    "Anton and Joseph are supplied to businesses only, under a separate written Services Agreement that governs the services and prevails over this website. Nothing here is an offer; an enquiry or our reply forms no agreement, and we may decline any deployment. Our configurations and skills are licensed for the term; your business keeps its hardware, data and outputs. See <a href=\"/terms/#services-agreement\">Terms of Use, section 4</a>.",
    "Our papers are practitioner research. Unless a paper says otherwise, it is a preprint that has not been peer reviewed. Results depend on the models, versions and conditions described and may not reproduce elsewhere. Papers are not advice and neither endorse nor criticise any product or vendor. SSRN's terms also apply to papers hosted there. See the <a href=\"/legal/#research-notice\">Research publications notice</a>.",
    "We recommend running Anton on your own hardware, on your premises; other setups are available. Depending on your configuration and third-party services, including any AI model provider, some data may leave your premises. Your business decides what Anton can access and is responsible for its data and its own security. See <a href=\"/privacy/#deployment-model\">Privacy Policy, section 2</a>.",
    "Joseph can run in a cloud environment or entirely inside your own. Whether Speedrun AI Labs hosts or operates any part of a deployment depends on the Services Agreement. In a cloud deployment the cloud provider holds data under its terms; your business decides whether that suits the sensitivity of its data. Nothing on this website is a service-level, uptime or performance commitment. See <a href=\"/privacy/#agent-data\">Privacy Policy, section 10</a>.",
    "A suitably qualified person must review every agent output before it is relied on. Outputs can be wrong, incomplete or misleading, even when they sound confident, and depend on the data the agent is given. Your business is responsible for the decisions it makes with them. Relying on an agent without human review is misuse. See <a href=\"/terms/#ai-content\">Terms of Use, section 8</a>.",
    "Speedrun AI Labs does not use your business's data, or any client's, to train, fine-tune or improve any AI model. Where an agent uses a third-party AI model provider, the provider processes what the agent sends it under its own terms, including on retention and training. Where models are hosted inside your own environment, the agent sends no data to an external provider. The Services Agreement records which configuration applies. See <a href=\"/privacy/#third-party-ai\">Privacy Policy, section 11</a>."
];
  var GENERAL = [
    "Nothing on this website is professional advice, or a promise that deploying an agent will achieve any outcome, including compliance or protection from attack.",
    "Skills in the Skill Library are open source under the MIT License, provided as is and without warranty; each repository's licence governs. Review a skill before installing it; its permissions and outputs are your responsibility. See <a href=\"/legal/#open-source\">Open-source licences</a>.",
    "Agent capabilities, deployment options and third-party services may change and differ between deployments. Read our <a href=\"/terms/\">Terms of Use</a>, <a href=\"/privacy/\">Privacy Policy</a> and <a href=\"/legal/\">Legal</a> page."
];

  var COLUMNS = [
    { title: 'Agents', links: [
      ['Anton, Cyber Security', '/#anton'],
      ['Joseph, Compliance', '/#joseph'],
      ['Book a call', '/#contact'],
    ]},
    { title: 'Research', links: [
      ['Research Papers', '/papers/'],
      ['Skill Library', '/#skills'],
      ['Open Source on GitHub', 'https://github.com/Speedrunlab'],
    ]},
    { title: 'Speedrun AI Labs', links: [
      ['About', '/#about'],
      ['AI Safety', '/ai-safety/'],
      ['Data', '/data/'],
      ['Press', '/#press'],
      ['Contact Us', '/#contact'],
      ['LinkedIn', 'https://www.linkedin.com/company/speedrun-ai-labs'],
    ]},
  ];

  var LEGAL = [
    ['Privacy Policy', '/privacy/'],
    ['Terms of Use', '/terms/'],
    ['Legal', '/legal/'],
    ['Data', '/data/'],
    ['AI Safety', '/ai-safety/'],
    ['Site Map', '/site-map/'],
  ];

  var CSS =
    '.sf{background:#F5F5F7;font-family:var(--font-sans);font-size:12px;line-height:1.34;color:var(--grey-mid);margin-top:auto}' +
    '.sf-inner{max-width:980px;margin:0 auto;padding:17px 22px 21px}' +
    '.sf-fine{letter-spacing:-0.12px}' +
    '.sf-fine p{margin:0 0 .8em}' +
    '.sf-notes{list-style:decimal outside;margin:0 0 .8em;padding-left:1.5em}' +
    '.sf-notes li{margin:0 0 8px;padding-left:2px;scroll-margin-top:110px}' +
    '.sf-fine a{color:var(--grey-dark);text-decoration:underline}' +
    '.sf-fine{padding-bottom:17px;border-bottom:1px solid #D2D2D7}' +
    '.sf-cols{display:flex;gap:30px;padding-top:20px}' +
    '.sf-col{flex:1;min-width:0}' +
    '.sf-col h3{font-size:12px;font-weight:600;color:var(--black);margin:0 0 .8em;line-height:1.34}' +
    '.sf-col h3 button{all:unset;cursor:default}' +
    '.sf-col ul{list-style:none;margin:0;padding:0}' +
    '.sf-col li{margin:0 0 .8em}' +
    '.sf a{color:var(--grey-dark);text-decoration:none}' +
    '.sf a:hover{text-decoration:underline;color:var(--black)}' +
    '.sf-more{padding:14px 0 17px;border-bottom:1px solid #D2D2D7}' +
    '.sf-more a{color:#0066CC;text-decoration:underline}' +
    '.sf-bottom{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 0;padding-top:17px}' +
    '.sf-copy{margin-right:30px}' +
    '.sf-legal{display:flex;flex-wrap:wrap;list-style:none;margin:0;padding:0}' +
    '.sf-legal li{border-right:1px solid #D2D2D7;padding:0 9px 0 9px;line-height:1}' +
    '.sf-legal li:first-child{padding-left:0}' +
    '.sf-legal li:last-child{border-right:0}' +
    '.sf-region{margin-left:auto;color:var(--grey-dark)}' +
    '.sf-entity{width:100%;padding-top:8px}' +
    '@media(max-width:768px){' +
      '.sf-inner{padding:17px 16px 21px}' +
      '.sf-notes li{scroll-margin-top:150px}' +
      '.sf-cols{display:block;padding-top:6px}' +
      '.sf-col{border-bottom:1px solid #D2D2D7}' +
      '.sf-col h3{margin:0}' +
      '.sf-col h3 button{display:flex;justify-content:space-between;align-items:center;width:100%;padding:11px 0;cursor:pointer;color:var(--black);font-weight:400;font-size:12px}' +
      '.sf-col h3 button::after{content:"";width:6px;height:6px;border-right:1.2px solid var(--grey-mid);border-bottom:1.2px solid var(--grey-mid);transform:rotate(45deg) translate(-2px,-2px);transition:transform .2s ease}' +
      '.sf-col.open h3 button::after{transform:rotate(-135deg) translate(-2px,-2px)}' +
      '.sf-col ul{display:none;padding:0 0 10px 14px}' +
      '.sf-col.open ul{display:block}' +
      '.sf-more{border-bottom:1px solid #D2D2D7}' +
      '.sf-bottom{display:block}' +
      '.sf-copy{margin:0 0 8px}' +
      '.sf-legal{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin:4px 0 12px}' +
      '.sf-legal li{border-right:0;padding:0;line-height:1.3}' +
      '.sf-region{margin:0}' +
    '}';
  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function link(label, url) {
    var a = el('a', null, label);
    a.href = href(url);
    if (/^https?:/.test(url)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    var hash = url.indexOf('/#') === 0 ? url.slice(2) : null;
    if (IS_HOME && hash) {
      a.addEventListener('click', function (ev) {
        if (typeof window.srRoute === 'function') { ev.preventDefault(); window.srRoute(hash); }
      });
    }
    return a;
  }

  var footer = el('footer', 'sf');
  var inner = el('div', 'sf-inner');

  // Static, trusted constants above: innerHTML is used only for their links.
  var fine = el('div', 'sf-fine');
  if (IS_HOME) {
    var ol = el('ol', 'sf-notes');
    NOTES.forEach(function (t, i) { var li = el('li'); li.id = 'fn-' + (i + 1); li.innerHTML = t; ol.appendChild(li); });
    fine.appendChild(ol);
  } else {
    var research = el('p'); research.innerHTML = NOTES[4]; fine.appendChild(research);
  }
  GENERAL.forEach(function (t) { var g = el('p'); g.innerHTML = t; fine.appendChild(g); });
  inner.appendChild(fine);

  // A div, not <nav>: every page styles bare `nav` as the fixed top bar.
  var cols = el('div', 'sf-cols');
  cols.setAttribute('role', 'navigation');
  cols.setAttribute('aria-label', 'Footer');
  COLUMNS.forEach(function (c, i) {
    var col = el('div', 'sf-col');
    var h = el('h3');
    var btn = el('button', null, c.title);
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'sf-col-' + i);
    btn.addEventListener('click', function () {
      var open = col.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    h.appendChild(btn);
    col.appendChild(h);
    var ul = el('ul');
    ul.id = 'sf-col-' + i;
    c.links.forEach(function (l) { var li = el('li'); li.appendChild(link(l[0], l[1])); ul.appendChild(li); });
    col.appendChild(ul);
    cols.appendChild(col);
  });
  inner.appendChild(cols);

  var more = el('div', 'sf-more');
  more.appendChild(document.createTextNode('Deploy Anton or Joseph in your business: '));
  more.appendChild(link('talk to us', '/#contact'));
  more.appendChild(document.createTextNode(' or email '));
  var mail = el('a', null, 'info@speedrunlab.ai');
  mail.href = 'mailto:info@speedrunlab.ai';
  more.appendChild(mail);
  more.appendChild(document.createTextNode('.'));
  inner.appendChild(more);

  var bottom = el('div', 'sf-bottom');
  bottom.appendChild(el('div', 'sf-copy', 'Copyright © ' + YEAR + ' ' + ENTITY + '. All rights reserved.'));
  var legal = el('ul', 'sf-legal');
  LEGAL.forEach(function (l) { var li = el('li'); li.appendChild(link(l[0], l[1])); legal.appendChild(li); });
  bottom.appendChild(legal);
  bottom.appendChild(el('div', 'sf-region', 'Sydney, Australia'));
  bottom.appendChild(el('div', 'sf-entity', 'ABN ' + ABN));
  inner.appendChild(bottom);

  footer.appendChild(inner);
  document.body.appendChild(footer);
})();
