// ── Active nav: highlight link matching the current page ──────────────────
(function () {
  var path = window.location.pathname;
  var page = path.split('/').pop() || '';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.indexOf('#') !== -1) return;
    if (href === page) a.classList.add('active');
    if ((page === '' || page === 'index.html') && (href === '/' || href === 'index.html')) a.classList.add('active');
  });
}());

// ── Smooth scroll for same-page anchor links ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var href = a.getAttribute('href');
    if (!href || href === '#') return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── About section accordion ───────────────────────────────────────────────
document.querySelectorAll('.about-acc-toggle').forEach(function (toggle) {
  toggle.addEventListener('click', function () {
    var panel   = toggle.nextElementSibling;
    var isOpen  = toggle.getAttribute('aria-expanded') === 'true';
    var chevron = toggle.querySelector('svg');
    toggle.setAttribute('aria-expanded', String(!isOpen));
    if (isOpen) {
      panel.style.height = panel.scrollHeight + 'px';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { panel.style.height = '0'; });
      });
      if (chevron) chevron.style.transform = '';
    } else {
      panel.style.height = panel.scrollHeight + 'px';
      panel.addEventListener('transitionend', function handler() {
        panel.style.height = 'auto';
        panel.removeEventListener('transitionend', handler);
      });
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
  });
});

// ── Project card accordion ────────────────────────────────────────────────
document.querySelectorAll('.project-toggle').forEach(function (toggle) {
  toggle.addEventListener('click', function () {
    var panel   = toggle.nextElementSibling;
    var isOpen  = toggle.getAttribute('aria-expanded') === 'true';
    var chevron = toggle.querySelector('svg');
    toggle.setAttribute('aria-expanded', String(!isOpen));
    if (isOpen) {
      panel.style.height = panel.scrollHeight + 'px';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { panel.style.height = '0'; });
      });
      if (chevron) chevron.style.transform = '';
    } else {
      panel.style.height = panel.scrollHeight + 'px';
      panel.addEventListener('transitionend', function handler() {
        panel.style.height = 'auto';
        panel.removeEventListener('transitionend', handler);
      });
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
  });
});

// ── Skills accordion ──────────────────────────────────────────────────────
document.querySelectorAll('.skills-acc-toggle').forEach(function (toggle) {
  toggle.addEventListener('click', function () {
    var panel   = toggle.nextElementSibling;
    var isOpen  = toggle.getAttribute('aria-expanded') === 'true';
    var chevron = toggle.querySelector('svg');
    toggle.setAttribute('aria-expanded', String(!isOpen));
    if (isOpen) {
      panel.style.height = panel.scrollHeight + 'px';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { panel.style.height = '0'; });
      });
      if (chevron) chevron.style.transform = '';
    } else {
      panel.style.height = panel.scrollHeight + 'px';
      panel.addEventListener('transitionend', function handler() {
        panel.style.height = 'auto';
        panel.removeEventListener('transitionend', handler);
      });
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
  });
});

// ── Highlights carousel ───────────────────────────────────────────────────
(function () {
  var track = document.getElementById('highlightsTrack');
  var dots  = document.querySelectorAll('#highlightsDots .carousel-dot');
  var prev  = document.querySelector('.carousel-prev');
  var next  = document.querySelector('.carousel-next');
  if (!track || !prev || !next) return;

  var total   = track.children.length;
  var current = 0;
  var timer;

  function goTo(n) {
    current = (n + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 20000);
  }

  prev.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
  next.addEventListener('click', function () { goTo(current + 1); resetTimer(); });
  dots.forEach(function (d) {
    d.addEventListener('click', function () { goTo(+d.dataset.idx); resetTimer(); });
  });

  resetTimer();
}());

// ── Google Scholar stats ──────────────────────────────────────────────────
fetch('/data/stats.json')
  .then(function (r) { return r.json(); })
  .then(function (d) {
    var c = document.getElementById('statCitations');
    var h = document.getElementById('statHIndex');
    if (c && d.citations !== undefined) c.textContent = d.citations;
    if (h && d.hindex    !== undefined) h.textContent = d.hindex;
  })
  .catch(function () {});

// ── Contact form — Google Apps Script backend ─────────────────────────────
var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx2ncP9SqFJzuJnrOfnevWr1gxkw0ATx2cVLJoib1ZBJbS_fSTduZQiIRvsfRlGuDdu/exec';

var contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn      = document.getElementById('cfSubmit');
    var response = document.getElementById('cfResponse');
    var payload  = {
      name:    document.getElementById('cf-name').value.trim(),
      email:   document.getElementById('cf-email').value.trim(),
      message: document.getElementById('cf-message').value.trim()
    };
    btn.disabled    = true;
    btn.textContent = 'Sending…';
    response.className   = '';
    response.textContent = '';
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode:   'no-cors',
        body:   JSON.stringify(payload)
      });
      response.className   = 'form-success';
      response.textContent = 'Message sent — I will get back to you soon.';
      contactForm.reset();
    } catch (err) {
      response.className   = 'form-error';
      response.textContent = 'Something went wrong. Please email me directly.';
    }
    btn.disabled    = false;
    btn.textContent = 'Send Message';
  });
}
