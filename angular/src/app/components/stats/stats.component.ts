import { Component, inject, AfterViewInit, ElementRef } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.component.html',
})
export class StatsComponent implements AfterViewInit {
  i18n = inject(I18nService);
  private el = inject(ElementRef);

  ngAfterViewInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const target = +(el.dataset['target'] ?? 0);
        const suffix = el.dataset['suffix'] ?? '';
        const dur = 1800, start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    this.el.nativeElement.querySelectorAll('.stat-number').forEach((el: Element) => observer.observe(el));
  }
}
