import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { NavComponent } from './components/nav/nav.component';
import { HeroComponent } from './components/hero/hero.component';
import { MarqueeComponent } from './components/marquee/marquee.component';
import { ServicesSectionComponent } from './components/services-section/services.component';
import { StatsComponent } from './components/stats/stats.component';
import { ProcessComponent } from './components/process/process.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent, HeroComponent, MarqueeComponent, ServicesSectionComponent,
    StatsComponent, ProcessComponent, PortfolioComponent, TestimonialsComponent,
    PricingComponent, ContactComponent, FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnDestroy {
  private rafId = 0;

  ngAfterViewInit() {
    this.initCursor();
    this.initReveal();
    this.init3DScroll();
  }

  ngOnDestroy() { cancelAnimationFrame(this.rafId); }

  private initCursor() {
    const cursor = document.querySelector('.cursor') as HTMLElement;
    const ring = document.querySelector('.cursor-ring') as HTMLElement;
    if (!cursor || !ring || window.innerWidth <= 768) return;
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    const anim = () => {
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      this.rafId = requestAnimationFrame(anim);
    };
    anim();

    document.querySelectorAll('a, button, .service-card, .portfolio-item, .testimonial-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('grow'); ring.classList.add('grow'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('grow'); ring.classList.remove('grow'); });
    });
  }

  private initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  private init3DScroll() {
    const SECTIONS = Array.from(
      document.querySelectorAll('section, .marquee-section, footer')
    ).filter(el => (el as HTMLElement).id !== 'hero') as HTMLElement[];

    const PERSP = 1400, MAX_ROT = 7, MAX_SCALE_OUT = 0.88;
    const MAX_SCALE_IN = 0.97, MAX_VERT_PUSH = -60, MAX_OPACITY = 0.3;
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    let ticking = false;
    const apply = () => {
      const vh = window.innerHeight;
      SECTIONS.forEach(sec => {
        const rect = sec.getBoundingClientRect(), top = rect.top, h = rect.height;
        if (top < 0) {
          const p = clamp(easeOut(Math.abs(top) / Math.max(h * 0.55, vh * 0.4)), 0, 1);
          sec.style.transform = `perspective(${PERSP}px) translateY(${p * MAX_VERT_PUSH}px) scale(${1 - p * (1 - MAX_SCALE_OUT)}) rotateX(${p * MAX_ROT}deg)`;
          sec.style.opacity = String(1 - p * MAX_OPACITY);
          sec.style.borderRadius = `${p * 28}px`;
          sec.style.zIndex = '1';
        } else if (top > 0 && top < vh) {
          const p = clamp(easeOut(top / vh), 0, 1);
          sec.style.transform = `perspective(${PERSP}px) translateY(${p * 40}px) scale(${1 - p * (1 - MAX_SCALE_IN)}) rotateX(${-p * 4}deg)`;
          sec.style.opacity = String(1 - p * 0.12);
          sec.style.borderRadius = `${p * 16}px`;
          sec.style.zIndex = '2';
        } else {
          sec.style.transform = `perspective(${PERSP}px) translateY(0px) scale(1) rotateX(0deg)`;
          sec.style.opacity = '1'; sec.style.borderRadius = '0px'; sec.style.zIndex = '1';
        }
      });
      ticking = false;
    };

    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(apply); ticking = true; } }, { passive: true });
    apply();
  }
}
