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

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 20; }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
