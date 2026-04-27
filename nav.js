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
  inner.appendChild(logo);

  // Links
  var ul = document.createElement('ul');
  ul.className = 'nav-links';

  var activePath = currentActive();

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
