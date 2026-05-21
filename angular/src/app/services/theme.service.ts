import { Injectable, signal, effect, inject, DOCUMENT } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private doc = inject(DOCUMENT);
  dark = signal(false);

  constructor() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.dark.set(saved ? saved === 'dark' : prefersDark);
    effect(() => {
      this.doc.documentElement.classList.toggle('dark', this.dark());
      localStorage.setItem('theme', this.dark() ? 'dark' : 'light');
    });
  }

  toggle() { this.dark.update(d => !d); }
}
