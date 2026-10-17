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
    "Anton is an AI agent, configured by Speedrun AI Labs to your business, that reviews the code and infrastructure you point it at and reports in plain English to the people you name. Its findings can include false positives and false negatives; a clean report is not a certification or an assurance that your systems are free of weaknesses, and no tool can make a business secure on its own. Anton is not a substitute for independent penetration testing or a security audit where a law, regulator, standard, customer or insurer requires one, and it may be used only on systems your business owns or operates, or is authorised in writing to test. See the <a href=\"/legal/#ai-disclaimer\">AI and agent disclaimer</a> and the <a href=\"/legal/#acceptable-use\">Acceptable Use Policy</a>.",
    "Joseph reports changes in the regulatory sources your business selects for it to monitor, to the people you name. Those sources may be incomplete, delayed or revised, and Joseph may miss, misread, mis-time or misdescribe a change. Silence from Joseph is not confirmation that nothing has changed, and it does not replace your own monitoring of the obligations that apply to you.",
    "Joseph is an AI agent and a productivity tool for the compliance function of a financial services business. It does not provide legal, financial, tax, regulatory or compliance advice, it does not interpret the law for your business, and it does not decide whether your business is compliant. Using Joseph does not by itself make a business compliant with any law, licence condition, regulatory guide, prudential standard, reporting obligation or industry code, and it does not discharge or transfer any obligation your business owes to ASIC, APRA, AUSTRAC, the ATO, the OAIC or any other regulator. Speedrun AI Labs Pty Ltd does not hold an Australian financial services licence or an Australian credit licence, is not a law practice and is not a registered tax agent. See the <a href=\"/legal/#ai-disclaimer\">AI and agent disclaimer</a>.",
    "Anton and Joseph are supplied to businesses only, under a separate written Services Agreement that governs the services and prevails over anything on this website. Nothing on this website is an offer to supply an agent, no agreement is formed by an enquiry or by our reply to it, we do not publish prices, and we may decline any deployment. Descriptions on this website are general and illustrative: they describe what the agents are designed to do, not what a particular deployment will do, and each deployment's scope, integrations and limitations are recorded in its Services Agreement. Our configurations and skills are licensed to your business for the term of its agreement; your business keeps its hardware, its data and the outputs its agent generates. See <a href=\"/terms/#services-agreement\">Terms of Use, section 4</a>.",
    "Our research papers are practitioner research, published for information and discussion. Unless a paper says otherwise, it is a working paper or preprint and has not been peer reviewed. Results depend on the specific models, tools, versions, configurations and conditions described in each paper and may not be reproducible with others, which change frequently. Papers are not advice and are not an endorsement or criticism of any product or vendor named in them; where a paper is hosted on SSRN, SSRN's terms also apply. See the <a href=\"/legal/#research-notice\">Research publications notice</a>.",
    "Anton is recommended to run on hardware your business owns, on your premises, where your business can accommodate that; it can also be set up another way to suit you. Depending on the configuration and the third-party services you choose, including any AI model provider, some data may leave your premises; the Services Agreement records the arrangement for your deployment. Where Anton runs on your hardware, your business decides what data it can access and is responsible for that data, and for the security of its premises, networks, devices, credentials and backups. See <a href=\"/privacy/#deployment-model\">Privacy Policy, section 2</a>.",
    "Joseph can be deployed in a cloud environment or entirely inside your own environment, for the whole business or for a department. Whether any part of a deployment is hosted or operated by Speedrun AI Labs is not fixed in advance: it depends on the Services Agreement and the discussion with each client, and the Services Agreement records what is held, where it is held and who may access it. In a cloud deployment, data is held by the cloud provider under its terms; your business decides whether the arrangement suits the sensitivity of its data, and highly sensitive data may call for everything to stay inside your own environment. The number of deployments, the departments covered and the scope of each are set in the Services Agreement, and nothing on this website is a service-level, uptime, response-time or performance commitment. See <a href=\"/privacy/#agent-data\">Privacy Policy, section 10</a>.",
    "Every output of either agent must be reviewed by a suitably qualified person before it is relied on or acted on. Outputs can be incorrect, incomplete, out of date, inconsistent or misleading, including when they appear confident and well reasoned, and they depend on the quality, completeness and currency of the data, systems and instructions the agent is given. Your business decides how outputs are used in its decisions and is responsible for those decisions. Over-reliance on an agent without human review is a misuse of it. See <a href=\"/terms/#ai-content\">Terms of Use, section 8</a>.",
    "Speedrun AI Labs does not use your business's data, or any other client data, to train, fine-tune or improve any AI model. Where an agent is configured to use a third-party AI model provider, the provider processes the data the agent sends it under the provider's own terms, in most deployments through your business's own account; those terms determine whether the provider retains the data, where it processes it and whether it uses it to improve its own services. Some providers offer settings or agreements that limit retention or exclude training, and we recommend using them where available. Where models are hosted inside your own environment, the agent does not send data to an external provider; the Services Agreement records which configuration applies. See <a href=\"/privacy/#third-party-ai\">Privacy Policy, section 11</a>."
];
  var GENERAL = [
    "Nothing on this website is legal, financial, tax, accounting, cyber security, regulatory, compliance or other professional advice, and nothing on it is a promise that any business will achieve any outcome, including compliance with any law or protection from any attack, by deploying an agent.",
    "Skills in the Skill Library are free and open source under the MIT License and are provided as is, without warranty of any kind; the licence in each repository governs your use. You are responsible for reviewing a skill before you install it, for the permissions you give it and for the outputs it produces. See <a href=\"/legal/#open-source\">Open-source licences</a>.",
    "Agent capabilities, deployment options and the availability of third-party models, platforms and services are subject to change and may differ between deployments. Read our <a href=\"/terms/\">Terms of Use</a>, <a href=\"/privacy/\">Privacy Policy</a> and <a href=\"/legal/\">Legal</a> page."
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
      ['Press', '/#press'],
      ['Contact Us', '/#contact'],
      ['LinkedIn', 'https://www.linkedin.com/company/speedrun-ai-labs'],
    ]},
  ];

  var LEGAL = [
    ['Privacy Policy', '/privacy/'],
    ['Terms of Use', '/terms/'],
    ['Legal', '/legal/'],
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
      '.sf-legal{margin-bottom:8px}' +
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
