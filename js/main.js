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

// ── Hero canvas — 3D perspective wave grid ────────────────────────────────
(function () {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var t   = 0;
  var raf;

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

    var horizon = H * 0.40;

    // Horizontal sine-wave lines with perspective spacing
    var numH = 26;
    for (var i = 1; i <= numH; i++) {
      var p    = i / numH;
      var y0   = horizon + (H - horizon) * Math.pow(p, 1.5);
      var amp  = 60 * p * p;
      var freq = 0.004 + 0.002 * (1 - p);
      var spd  = 0.35 + 0.15 * (1 - p);
      var lw   = 0.5 + 1.6 * p;
      var col  = i % 2 === 0
        ? 'rgba(21,96,130,'  + (0.04 + 0.22 * p) + ')'
        : 'rgba(15,158,213,' + (0.03 + 0.15 * p) + ')';

      ctx.beginPath();
      ctx.strokeStyle = col;
      ctx.lineWidth   = lw;

      for (var x = 0; x <= W; x += 4) {
        var wy = y0 + amp * Math.sin(x * freq + t * spd + i * 0.28);
        x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }

    // Vertical lines converging to central vanishing point
    var numV = 22;
    var vpx  = W * 0.5;
    for (var j = 0; j <= numV; j++) {
      var bx   = W * (j / numV);
      var tx   = vpx + (bx - vpx) * 0.06;
      var dist = Math.abs(j / numV - 0.5) * 2;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(15,158,213,' + (0.022 + 0.055 * dist) + ')';
      ctx.lineWidth   = 0.6;
      ctx.moveTo(tx, horizon);
      ctx.lineTo(bx, H);
      ctx.stroke();
    }

    t  += 0.015;
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
