// ── Active nav: highlight link matching the current page ──────────────────
(function () {
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href.indexOf('#') !== -1) return;
    if (href === path) a.classList.add('active');
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

// ── Hero canvas — 3D perspective wave surface ─────────────────────────────
(function () {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var ctx  = canvas.getContext('2d');
  var dpr  = window.devicePixelRatio || 1;
  var t    = 0;
  var raf;
  var COLS = 30, ROWS = 30;

  function resize() {
    var W = canvas.parentElement.offsetWidth;
    var H = canvas.parentElement.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    var W = canvas.width  / dpr;
    var H = canvas.height / dpr;

    ctx.clearRect(0, 0, W, H);

    var horizonY = H * 0.42;   // vanishing point Y
    var baseY    = H * 1.02;   // near edge of grid (just below screen bottom)
    var waveAmp  = H * 0.14;   // max wave height at near edge

    // ── Pre-compute projected grid points ──────────────────────────────
    // r=0: near (bottom of screen), r=ROWS: far (horizon)
    var pts = [];
    for (var r = 0; r <= ROWS; r++) {
      pts[r] = [];
      var rf    = r / ROWS;                   // 0 = near, 1 = far
      var persp = 1 / (1 + rf * 7);          // perspective scale

      for (var c = 0; c <= COLS; c++) {
        var gx = c / COLS - 0.5;             // -0.5 … +0.5

        // Two-component wave gives natural ocean-surface appearance
        var wz = Math.sin(gx * 9  + rf * 5  + t       ) * 0.58
               + Math.sin(gx * 4  - rf * 7  + t * 1.3 ) * 0.42;

        pts[r][c] = {
          x:     W * 0.5 + gx * W * 1.25 * persp,
          y:     horizonY + (baseY - horizonY) * (1 - rf) - wz * waveAmp * persp,
          persp: persp
        };
      }
    }

    // ── 1. Column lines — depth direction (back to front) ──────────────
    // These give the "going-away" lines that sell the 3D depth
    for (var c2 = 0; c2 <= COLS; c2++) {
      var edgeDist = Math.abs(c2 / COLS - 0.5) * 2; // 0 centre, 1 edge
      ctx.beginPath();
      for (var r2 = ROWS; r2 >= 0; r2--) {
        var p2 = pts[r2][c2];
        r2 === ROWS ? ctx.moveTo(p2.x, p2.y) : ctx.lineTo(p2.x, p2.y);
      }
      ctx.strokeStyle = 'rgba(15,158,213,' + (0.035 + 0.11 * edgeDist) + ')';
      ctx.lineWidth   = 0.35 + 0.8 * edgeDist;
      ctx.stroke();
    }

    // ── 2. Row lines — wave crests (far → near = painter's algorithm) ──
    // Drawn front-to-back so near rows paint over far rows
    for (var r3 = ROWS; r3 >= 0; r3--) {
      var persp3 = pts[r3][0].persp;
      ctx.beginPath();
      for (var c3 = 0; c3 <= COLS; c3++) {
        var p3 = pts[r3][c3];
        c3 === 0 ? ctx.moveTo(p3.x, p3.y) : ctx.lineTo(p3.x, p3.y);
      }
      var a3 = 0.04 + 0.34 * persp3;
      ctx.strokeStyle = r3 % 2 === 0
        ? 'rgba(21,96,130,'  + a3 + ')'
        : 'rgba(15,158,213,' + (a3 * 0.88) + ')';
      ctx.lineWidth = 0.4 + 2.4 * persp3;
      ctx.stroke();
    }

    t  += 0.011;
    raf = requestAnimationFrame(draw);
  }

  draw();

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });
}());

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
