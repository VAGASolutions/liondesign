/* ── THEME ── */
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(dark) {
  html.classList.toggle('dark', dark);
  themeBtn.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

const saved = localStorage.getItem('theme');
setTheme(saved ? saved === 'dark' : prefersDark.matches);
themeBtn.addEventListener('click', () => setTheme(!html.classList.contains('dark')));

/* ── NAV SCROLL ── */
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// lightning on nav-link clicks
document.querySelectorAll('.nav-links a, .hero-actions a').forEach(a => {
  a.addEventListener('click', () => {
    setTimeout(() => { if (window._lightning) window._lightning(); }, 80);
  });
});

/* ── CUSTOM CURSOR ── */
const cursor = document.querySelector('.cursor');
const ring   = document.querySelector('.cursor-ring');

if (cursor && ring && window.innerWidth > 768) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  document.querySelectorAll('a, button, .service-card, .portfolio-item, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('grow'); ring.classList.add('grow'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('grow'); ring.classList.remove('grow'); });
  });
}

/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null, r: 180 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildParticles();
  }

  function buildParticles() {
    particles = [];
    const n = Math.floor((W * H) / 9000);
    for (let i = 0; i < n; i++) {
      const s = Math.random() * 2 + 1;
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        s
      });
    }
  }

  function drawConnections() {
    const dark = html.classList.contains('dark');
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist2 = dx * dx + dy * dy;
        const thresh = (W / 7) * (H / 7);
        if (dist2 < thresh) {
          const alpha = (1 - dist2 / thresh) * 0.5;
          const close = mouse.x !== null &&
            Math.hypot(particles[a].x - mouse.x, particles[a].y - mouse.y) < mouse.r;
          ctx.strokeStyle = close
            ? `rgba(245,158,11,${alpha * 1.6})`
            : dark
              ? `rgba(245,158,11,${alpha * 0.6})`
              : `rgba(217,119,6,${alpha * 0.4})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    const dark = html.classList.contains('dark');
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      if (mouse.x !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < mouse.r) {
          const f = (mouse.r - d) / mouse.r * 0.8;
          p.x += (dx / d) * f * 2;
          p.y += (dy / d) * f * 2;
        }
      }
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fillStyle = dark ? 'rgba(245,158,11,0.7)' : 'rgba(217,119,6,0.5)';
      ctx.fill();
    }

    drawConnections();
    requestAnimationFrame(tick);
  }

  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  tick();
})();

/* ── PARTICLE WORD CANVAS ── */
(function initWordCanvas() {
  const canvas = document.getElementById('word-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width  = 700;
  canvas.height = 500;

  const WORDS = ['DESIGN', 'SECURITY', 'SEO', 'SPEED', 'VaDesign'];
  let wordIdx = 0, particles = [], frame = 0;

  class P {
    constructor() {
      this.reset();
      this.x = Math.random() * 700;
      this.y = Math.random() * 500;
    }
    reset() {
      this.tx = 0; this.ty = 0;
      this.vx = 0; this.vy = 0;
      this.dead = false;
      this.color = `hsl(${38 + Math.random()*10}, 95%, ${50 + Math.random()*15}%)`;
    }
    update() {
      const dx = this.tx - this.x, dy = this.ty - this.y;
      const d = Math.hypot(dx, dy);
      const spd = Math.min(d * 0.08, 4);
      if (d > 0.5) { this.vx += (dx / d) * spd; this.vy += (dy / d) * spd; }
      this.vx *= 0.82; this.vy *= 0.82;
      this.x += this.vx; this.y += this.vy;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function getPoints(word) {
    const off = document.createElement('canvas');
    off.width = 700; off.height = 500;
    const oc = off.getContext('2d');
    oc.fillStyle = '#fff';
    oc.font = 'bold 110px Inter, Arial';
    oc.textAlign = 'center';
    oc.textBaseline = 'middle';
    oc.fillText(word, 350, 250);
    const d = oc.getImageData(0, 0, 700, 500).data;
    const pts = [];
    for (let i = 0; i < d.length; i += 4 * 5) {
      if (d[i + 3] > 128) {
        pts.push({ x: (i / 4) % 700, y: Math.floor(i / 4 / 700) });
      }
    }
    return pts;
  }

  function showWord(word) {
    const pts = getPoints(word);
    pts.sort(() => Math.random() - 0.5);
    let pi = 0;
    for (const pt of pts) {
      let p;
      if (pi < particles.length) { p = particles[pi]; p.dead = false; }
      else { p = new P(); particles.push(p); }
      p.tx = pt.x; p.ty = pt.y;
      pi++;
    }
    for (let i = pi; i < particles.length; i++) {
      particles[i].tx = Math.random() * 700;
      particles[i].ty = Math.random() < 0.5 ? -20 : 520;
      particles[i].dead = true;
    }
  }

  showWord(WORDS[0]);

  function animWord() {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, 700, 500);
    for (const p of particles) { p.update(); p.draw(); }
    frame++;
    if (frame % 220 === 0) {
      wordIdx = (wordIdx + 1) % WORDS.length;
      showWord(WORDS[wordIdx]);
    }
    requestAnimationFrame(animWord);
  }
  animWord();
})();

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── STATS COUNTER ── */
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

/* ── METRIC BARS ── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.metric-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
    barObserver.unobserve(e.target);
  });
}, { threshold: 0.3 });

const analyzerEl = document.getElementById('analyzer');
if (analyzerEl) barObserver.observe(analyzerEl);

/* ── RADAR CHART ── */
(function drawRadar() {
  const svg = document.getElementById('radar-svg');
  if (!svg) return;

  const cx = 190, cy = 190, r = 150;
  const labels = ['Design', 'Security', 'SEO', 'Speed', 'UX', 'Code'];
  const values = [0.92, 0.88, 0.95, 0.85, 0.9, 0.87];

  function polarPt(angle, radius) {
    const a = (angle - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  }

  /* grid rings */
  [0.25, 0.5, 0.75, 1].forEach(pct => {
    const pts = labels.map((_, i) => polarPt(i * 60, r * pct));
    const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ') + 'Z';
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(255,255,255,0.07)');
    path.setAttribute('stroke-width', '1');
    svg.appendChild(path);
  });

  /* spokes */
  labels.forEach((_, i) => {
    const end = polarPt(i * 60, r);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', end.x); line.setAttribute('y2', end.y);
    line.setAttribute('stroke', 'rgba(255,255,255,0.07)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  });

  /* data polygon */
  const dataPts = values.map((v, i) => polarPt(i * 60, r * v));
  const dataD = dataPts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ') + 'Z';
  const fill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  fill.setAttribute('d', dataD);
  fill.setAttribute('fill', 'rgba(245,158,11,0.12)');
  fill.setAttribute('stroke', 'rgba(245,158,11,0.8)');
  fill.setAttribute('stroke-width', '1.5');
  svg.appendChild(fill);

  /* dots */
  dataPts.forEach(p => {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#f59e0b');
    svg.appendChild(dot);
  });

  /* rotating ring */
  const ringEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  ringEl.setAttribute('cx', cx); ringEl.setAttribute('cy', cy);
  ringEl.setAttribute('r', r * 0.6);
  ringEl.setAttribute('fill', 'none');
  ringEl.setAttribute('stroke', 'rgba(245,158,11,0.2)');
  ringEl.setAttribute('stroke-width', '1');
  ringEl.setAttribute('stroke-dasharray', '8 5');
  svg.appendChild(ringEl);

  let angle = 0;
  (function spin() {
    angle += 0.4;
    ringEl.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
    requestAnimationFrame(spin);
  })();
})();

/* ── ANALYZER CTA ── */
document.getElementById('analyze-btn')?.addEventListener('click', function () {
  const input = document.getElementById('analyze-url');
  const url = input?.value.trim();
  if (!url) { input?.focus(); return; }

  const bars = document.querySelectorAll('.metric-bar-fill');
  bars.forEach(bar => {
    bar.style.width = '0';
    setTimeout(() => {
      const targets = [88, 72, 95, 68];
      const idx = Array.from(bars).indexOf(bar);
      bar.style.transition = 'width 1.4s cubic-bezier(0.16,1,0.3,1)';
      bar.style.width = targets[idx] + '%';
    }, 200 + Array.from(bars).indexOf(bar) * 150);
  });

  const scores = document.querySelectorAll('.metric-score');
  const vals = [88, 72, 95, 68];
  scores.forEach((el, i) => {
    let v = 0;
    const target = vals[i];
    const iv = setInterval(() => {
      v = Math.min(v + 3, target);
      el.textContent = v;
      if (v >= target) clearInterval(iv);
    }, 18);
  });
});

/* ── PORTFOLIO FILTER ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.style.opacity = show ? '1' : '0.25';
      item.style.transform = show ? '' : 'scale(0.96)';
      item.style.pointerEvents = show ? '' : 'none';
    });
  });
});

/* ── CONTACT FORM ── */
document.getElementById('contact-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Message sent!';
    btn.style.background = '#4ade80';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      btn.style.background = '';
      this.reset();
    }, 3000);
  }, 1400);
});

/* ── MOBILE MENU ── */
document.getElementById('hamburger')?.addEventListener('click', function () {
  const nav = document.getElementById('mobile-menu');
  nav?.classList.toggle('open');
});

/* ══════════════════════════════════════════
   3D SCROLL TRANSITIONS
   Each section tilts/shrinks in 3D as it
   exits upward, and eases in from below.
══════════════════════════════════════════ */
(function init3DScroll() {
  const SECTIONS = Array.from(
    document.querySelectorAll('section, .marquee-section, footer')
  ).filter(el => el.id !== 'hero'); // hero stays flat — it IS the background

  const PERSP    = 1400;   // px — higher = less dramatic
  const MAX_ROT  = 7;      // deg rotateX when fully exiting
  const MAX_SCALE_OUT = 0.88;
  const MAX_SCALE_IN  = 0.97;
  const MAX_VERT_PUSH = -60; // px translateY when exiting
  const MAX_OPACITY   = 0.3; // how dim the exiting section gets

  // clamp helper
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  // ease in-out cubic
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  let ticking = false;

  function applyTransforms() {
    const vh = window.innerHeight;

    SECTIONS.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const top  = rect.top;
      const h    = rect.height;

      /* ── Exiting upward (section scrolled above viewport top) ── */
      if (top < 0) {
        // progress 0→1 as the section scrolls out
        const rawP = Math.abs(top) / Math.max(h * 0.55, vh * 0.4);
        const p    = clamp(easeOut(rawP), 0, 1);

        const scale   = 1 - p * (1 - MAX_SCALE_OUT);
        const rotX    = p * MAX_ROT;
        const transY  = p * MAX_VERT_PUSH;
        const radius  = p * 28;
        const opacity = 1 - p * MAX_OPACITY;

        sec.style.transform    = `perspective(${PERSP}px) translateY(${transY}px) scale(${scale}) rotateX(${rotX}deg)`;
        sec.style.opacity      = opacity;
        sec.style.borderRadius = `${radius}px`;
        sec.style.zIndex       = '1';

      /* ── Entering from below (section below viewport fold) ── */
      } else if (top > 0 && top < vh) {
        // progress 1→0 as section rises into view
        const rawP = top / vh;
        const p    = clamp(easeOut(rawP), 0, 1);

        const scale  = 1 - p * (1 - MAX_SCALE_IN);
        const rotX   = -p * 4;   // slight tilt from below
        const transY = p * 40;   // rises up
        const radius = p * 16;
        const opacity = 1 - p * 0.12;

        sec.style.transform    = `perspective(${PERSP}px) translateY(${transY}px) scale(${scale}) rotateX(${rotX}deg)`;
        sec.style.opacity      = opacity;
        sec.style.borderRadius = `${radius}px`;
        sec.style.zIndex       = '2';

      /* ── Fully in view ── */
      } else {
        sec.style.transform    = `perspective(${PERSP}px) translateY(0px) scale(1) rotateX(0deg)`;
        sec.style.opacity      = '1';
        sec.style.borderRadius = '0px';
        sec.style.zIndex       = '1';
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(applyTransforms); ticking = true; }
  }, { passive: true });

  // run once on load
  applyTransforms();
})();
