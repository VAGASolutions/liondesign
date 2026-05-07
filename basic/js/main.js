/* ============================================================
   KORTE STUDIO — Main JS + Analyzer Engine
   ============================================================ */

'use strict';

// ── CUSTOM CURSOR ─────────────────────────────────────────────

const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function lerpCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  document.querySelectorAll('a, button, .bento-card, .project-card, .testimonial-card, .faq-trigger, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ── NAV ───────────────────────────────────────────────────────

const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── SCROLL ANIMATIONS (Intersection Observer) ─────────────────

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
    setTimeout(() => el.classList.add('is-visible'), delay);
    io.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));

// ── STATS COUNT-UP ────────────────────────────────────────────

const statsIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      let current = 0;
      const duration = 1400;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
      }, 16);
    });
    statsIO.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) statsIO.observe(statsSection);

// ── PORTFOLIO FILTER ──────────────────────────────────────────

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

// ── FAQ ACCORDION ─────────────────────────────────────────────

function toggleFaq(trigger) {
  const body = trigger.nextElementSibling;
  const isOpen = body.classList.contains('open');

  document.querySelectorAll('.faq-body.open').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.faq-trigger[aria-expanded="true"]').forEach(t => t.setAttribute('aria-expanded', 'false'));

  if (!isOpen) {
    body.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  }
}

// ── CONTACT FORM ──────────────────────────────────────────────

function submitContact() {
  const name = document.getElementById('contactName')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim();
  const note = document.getElementById('contactProject')?.value.trim();

  if (!name || !email) {
    showToast('⚠️ Please enter your name and email.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠️ Please enter a valid email address.');
    return;
  }

  const selected = [...document.querySelectorAll('.service-chip.selected')].map(c => c.dataset.service);
  if (selected.length === 0) {
    showToast('⚠️ Please select at least one service.');
    return;
  }

  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    ``,
    `Services requested:`,
    ...selected.map(s => `  • ${s}`),
    note ? `\nAdditional notes:\n${note}` : ''
  ].join('\n');

  const mailto = `mailto:webkorte@gmail.com?subject=New Enquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  showToast('✓ Opening your email client…');
}

// ── TOAST ─────────────────────────────────────────────────────

function showToast(msg, duration = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

// ── SERVICE PICKER ────────────────────────────────────────────

document.querySelectorAll('.service-chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});


// ── INIT ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Stagger hero elements on load (already handled by CSS data-animate on scroll,
  // but hero is above fold so trigger immediately)
  setTimeout(() => {
    document.querySelectorAll('.hero [data-animate]').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), i * 120);
    });
  }, 100);
});
