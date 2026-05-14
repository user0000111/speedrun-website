(function () {
  var IS_HOME = window.location.pathname === '/' || window.location.pathname === '/index.html';

  var LINKS = [
    { label: 'Home',            id: 'home',     href: '/',          section: true  },
    { label: 'Projects',        id: 'projects', href: '/#projects', section: true  },
    { label: 'Skill Library',   id: 'skills',   href: '/#skills',   section: true  },
    { label: 'Research Papers', id: null,       href: '/papers/',   section: false },
    { label: 'Press',           id: 'press',    href: '/#press',    section: true  },
    { label: 'Contact Us',      id: 'contact',  href: '/#contact',  section: true  },
  ];

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
  logo.innerHTML =
    '<img class="logo-dark" src="/logo.png" alt="Speedrun AI Labs" loading="eager">' +
    '<img class="logo-light" src="/logo-white.png" alt="Speedrun AI Labs" loading="eager">';
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

    li.appendChild(a);
    ul.appendChild(li);
  });

  inner.appendChild(ul);

  nav.appendChild(inner);

  // Inject nav as first child of body
  document.body.insertBefore(nav, document.body.firstChild);
})();
