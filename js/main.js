// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => observer.observe(s));

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// About section accordion
document.querySelectorAll('.about-acc-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const panel  = toggle.nextElementSibling;
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    panel.classList.toggle('open', !isOpen);
  });
});

// Contact form — Google Apps Script backend
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx2ncP9SqFJzuJnrOfnevWr1gxkw0ATx2cVLJoib1ZBJbS_fSTduZQiIRvsfRlGuDdu/exec';

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn      = document.getElementById('cfSubmit');
    const response = document.getElementById('cfResponse');
    const payload  = {
      name:    document.getElementById('cf-name').value.trim(),
      email:   document.getElementById('cf-email').value.trim(),
      message: document.getElementById('cf-message').value.trim()
    };

    btn.disabled    = true;
    btn.textContent = 'Sending…';
    response.className = '';
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
