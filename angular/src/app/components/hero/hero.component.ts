import { Component, inject, AfterViewInit, ViewChild, ElementRef, DOCUMENT, OnDestroy } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  i18n = inject(I18nService);
  private doc = inject(DOCUMENT);

  @ViewChild('particleCanvas') particleRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wordCanvas') wordRef!: ElementRef<HTMLCanvasElement>;

  private rafIds: number[] = [];
  private cycleInterval?: ReturnType<typeof setInterval>;

  readonly projects = [
    { img: 'img/brevity.png',        name: 'Brevity',              url: 'www.brevity.hu' },
    { img: 'img/aeolab.eu.png',      name: 'AEO Lab',              url: 'www.aeolab.eu' },
    { img: 'img/navigo.png',          name: 'Pályázat Navigátor',  url: 'palyazatnavigator.vercel.app' },
    { img: 'img/aicommunitylab.png', name: 'AI Community Lab',     url: 'aicommunitylab.com' },
  ];
  currentIdx = 0;
  fading = false;

  get currentProject() { return this.projects[this.currentIdx]; }

  scrollTo(id: string) {
    this.doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  ngAfterViewInit() {
    this.initParticles();
    this.initWordCanvas();
    this.cycleInterval = setInterval(() => {
      this.fading = true;
      setTimeout(() => {
        this.currentIdx = (this.currentIdx + 1) % this.projects.length;
        this.fading = false;
      }, 350);
    }, 3500);
  }

  ngOnDestroy() {
    this.rafIds.forEach(id => cancelAnimationFrame(id));
    if (this.cycleInterval) clearInterval(this.cycleInterval);
  }

  private initParticles() {
    const canvas = this.particleRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    let W: number, H: number;
    const mouse = { x: null as number | null, y: null as number | null, r: 180 };

    interface Particle { x: number; y: number; dx: number; dy: number; s: number; }
    let particles: Particle[] = [];

    const build = () => {
      particles = [];
      const n = Math.floor((W * H) / 9000);
      for (let i = 0; i < n; i++) {
        const s = Math.random() * 2 + 1;
        particles.push({ x: Math.random() * W, y: Math.random() * H, dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4, s });
      }
    };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      build();
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < mouse.r) { const f = (mouse.r - d) / mouse.r * 0.8; p.x += (dx / d) * f * 2; p.y += (dy / d) * f * 2; }
        }
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245,158,11,0.7)';
        ctx.fill();
      }
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x, dy = particles[a].y - particles[b].y;
          const dist2 = dx * dx + dy * dy;
          const thresh = (W / 7) * (H / 7);
          if (dist2 < thresh) {
            const alpha = (1 - dist2 / thresh) * 0.5;
            const close = mouse.x !== null && mouse.y !== null && Math.hypot(particles[a].x - mouse.x, particles[a].y - mouse.y) < mouse.r;
            ctx.strokeStyle = close ? `rgba(245,158,11,${alpha * 1.6})` : `rgba(245,158,11,${alpha * 0.6})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
          }
        }
      }
      this.rafIds.push(requestAnimationFrame(tick));
    };

    window.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    window.addEventListener('resize', resize, { passive: true });
    resize();
    tick();
  }

  private initWordCanvas() {
    const canvas = this.wordRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 700; canvas.height = 500;

    const WORDS = ['DESIGN', 'SEO', 'SPEED', 'LionDesign'];
    let wordIdx = 0, frame = 0;

    interface WParticle { x: number; y: number; tx: number; ty: number; vx: number; vy: number; dead: boolean; color: string; }
    const particles: WParticle[] = [];

    const makeParticle = (): WParticle => ({
      x: Math.random() * 700, y: Math.random() * 500,
      tx: 0, ty: 0, vx: 0, vy: 0, dead: false,
      color: `hsl(${38 + Math.random() * 10}, 95%, ${50 + Math.random() * 15}%)`
    });

    const getPoints = (word: string) => {
      const off = document.createElement('canvas');
      off.width = 700; off.height = 500;
      const oc = off.getContext('2d')!;
      oc.fillStyle = '#fff'; oc.font = 'bold 110px Inter, Arial';
      oc.textAlign = 'center'; oc.textBaseline = 'middle';
      oc.fillText(word, 350, 250);
      const d = oc.getImageData(0, 0, 700, 500).data;
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < d.length; i += 4 * 5) {
        if (d[i + 3] > 128) pts.push({ x: (i / 4) % 700, y: Math.floor(i / 4 / 700) });
      }
      return pts;
    };

    const showWord = (word: string) => {
      const pts = getPoints(word).sort(() => Math.random() - 0.5);
      pts.forEach((pt, pi) => {
        if (pi < particles.length) { particles[pi].dead = false; particles[pi].tx = pt.x; particles[pi].ty = pt.y; }
        else { const p = makeParticle(); p.tx = pt.x; p.ty = pt.y; particles.push(p); }
      });
      for (let i = pts.length; i < particles.length; i++) {
        particles[i].tx = Math.random() * 700;
        particles[i].ty = Math.random() < 0.5 ? -20 : 520;
        particles[i].dead = true;
      }
    };

    showWord(WORDS[0]);

    const animWord = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(0, 0, 700, 500);
      for (const p of particles) {
        const dx = p.tx - p.x, dy = p.ty - p.y, d = Math.hypot(dx, dy);
        const spd = Math.min(d * 0.08, 4);
        if (d > 0.5) { p.vx += (dx / d) * spd; p.vy += (dy / d) * spd; }
        p.vx *= 0.82; p.vy *= 0.82; p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      frame++;
      if (frame % 220 === 0) { wordIdx = (wordIdx + 1) % WORDS.length; showWord(WORDS[wordIdx]); }
      this.rafIds.push(requestAnimationFrame(animWord));
    };
    animWord();
  }
}
