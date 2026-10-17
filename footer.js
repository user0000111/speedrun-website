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

  var FINE_PRINT = [
    'Anton and Joseph are AI agents. They support the judgement of your security, compliance and leadership teams; they do not replace it. Review what an agent produces before you act on it.',
    'Nothing on this website is legal, financial, tax or regulatory advice. Using an agent does not by itself make a business compliant with any law, licence condition or regulatory obligation.',
    'Research papers are practitioner research, published for information. Skills in the Skill Library are free and open source under the MIT License and are provided as is, without warranty.',
    'Deployment options depend on your environment. Features and availability may change.'
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
    '.sf-fine p{margin:0 0 .8em}' +
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

  var fine = el('div', 'sf-fine');
  FINE_PRINT.forEach(function (t) { fine.appendChild(el('p', null, t)); });
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
