/* ============================================================
   ROSSI MACHINE TOOLS — main.js
   Custom cursor · Nav scroll · Scroll reveal · Counters · Anchors
   ============================================================ */

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
const dot  = document.getElementById('cDot');
const ring = document.getElementById('cRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

/* Lagging ring follows cursor with lerp */
(function loop() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(loop);
})();

/* Expand cursor on interactive elements */
const hoverTargets = 'a, button, .ecard, .scard, .icard, .lcstep';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ── NAV SCROLL BEHAVIOUR + PROGRESS BAR ────────────────── */
const nav = document.getElementById('nav');
const pb  = document.getElementById('pbar');

window.addEventListener('scroll', () => {
  const st      = window.scrollY;
  const totalH  = document.body.scrollHeight - window.innerHeight;

  /* Sticky nav */
  nav.classList.toggle('stuck', st > 60);

  /* Scroll progress bar */
  pb.style.width = (st / totalH * 100) + '%';
}, { passive: true });

/* ── SCROLL REVEAL (IntersectionObserver) ────────────────── */
const revealEls = document.querySelectorAll('.rv, .rvl, .rvs');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── ANIMATED STAT COUNTERS ──────────────────────────────── */
const counters = document.querySelectorAll('.stnum[data-target]');

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el     = entry.target;
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';

    (function step(ts) {
      const start    = step.startTime || (step.startTime = ts);
      const progress = Math.min((ts - start) / 1600, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);   /* ease-out cubic */
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    })(performance.now());

    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});