import { Component, inject, HostListener } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
})
export class NavComponent {
  i18n = inject(I18nService);
  scrolled = false;
  menuOpen = false;
  activeSection = 'hero';
  scrollProgress = 0;

  private readonly sections = ['contact', 'testimonials', 'portfolio', 'process', 'services', 'hero'];

  @HostListener('window:scroll')
  onScroll() {
    const y = window.scrollY;
    this.scrolled = y > 20;

    const doc = document.documentElement;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    this.scrollProgress = scrollHeight > 0 ? (y / scrollHeight) * 100 : 0;

    const threshold = window.innerHeight * 0.4;
    for (const id of this.sections) {
      const top = document.getElementById(id)?.getBoundingClientRect().top ?? Infinity;
      if (top <= threshold) { this.activeSection = id; break; }
    }
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  scrollTo(id: string) {
    this.menuOpen = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
