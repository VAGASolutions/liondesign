import { TestBed } from '@angular/core/testing';
import { NavComponent } from './nav.component';
import { ThemeService } from '../../services/theme.service';

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

describe('NavComponent theme toggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    mockPrefersDark(false);
    TestBed.configureTestingModule({ imports: [NavComponent] });
  });

  it('injects ThemeService so the stored/preferred theme is applied on startup', () => {
    localStorage.setItem('theme', 'dark');
    const fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('renders a theme toggle button reflecting the current theme', () => {
    const fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.theme-toggle');
    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
  });

  it('toggles the theme and updates the button label when clicked', () => {
    const fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    const theme = TestBed.inject(ThemeService);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.theme-toggle');

    button.click();
    fixture.detectChanges();

    expect(theme.dark()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
  });
});
