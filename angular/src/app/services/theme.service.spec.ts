import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

function mockPrefersDark(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
  });

  it('falls back to prefers-color-scheme: dark when localStorage is empty', () => {
    mockPrefersDark(true);
    const service = TestBed.inject(ThemeService);
    expect(service.dark()).toBe(true);
  });

  it('falls back to prefers-color-scheme: light when localStorage is empty', () => {
    mockPrefersDark(false);
    const service = TestBed.inject(ThemeService);
    expect(service.dark()).toBe(false);
  });

  it('prefers the saved "dark" value over the media query', () => {
    mockPrefersDark(false);
    localStorage.setItem('theme', 'dark');
    const service = TestBed.inject(ThemeService);
    expect(service.dark()).toBe(true);
  });

  it('prefers the saved "light" value over the media query', () => {
    mockPrefersDark(true);
    localStorage.setItem('theme', 'light');
    const service = TestBed.inject(ThemeService);
    expect(service.dark()).toBe(false);
  });

  it('treats an invalid saved value as not-dark', () => {
    mockPrefersDark(true);
    localStorage.setItem('theme', 'not-a-real-theme');
    const service = TestBed.inject(ThemeService);
    expect(service.dark()).toBe(false);
  });

  it('toggles the dark signal', () => {
    mockPrefersDark(false);
    const service = TestBed.inject(ThemeService);

    service.toggle();
    expect(service.dark()).toBe(true);

    service.toggle();
    expect(service.dark()).toBe(false);
  });

  it('syncs the "dark" class on <html> and localStorage as the signal changes', () => {
    mockPrefersDark(false);
    const service = TestBed.inject(ThemeService);
    TestBed.tick();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');

    service.toggle();
    TestBed.tick();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
