import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('defaults to "en" when localStorage has no saved language', () => {
    const service = TestBed.inject(I18nService);
    expect(service.lang()).toBe('en');
  });

  it('restores the saved language from localStorage', () => {
    localStorage.setItem('lang', 'hu');
    const service = TestBed.inject(I18nService);
    expect(service.lang()).toBe('hu');
  });

  it('toggles between "en" and "hu" and persists the change', () => {
    const service = TestBed.inject(I18nService);

    service.toggle();
    expect(service.lang()).toBe('hu');
    expect(localStorage.getItem('lang')).toBe('hu');

    service.toggle();
    expect(service.lang()).toBe('en');
    expect(localStorage.getItem('lang')).toBe('en');
  });

  it('exposes the dictionary for the current language via t()', () => {
    const service = TestBed.inject(I18nService);
    expect(service.t()['nav.services']).toBe('Services');

    service.toggle();
    expect(service.t()['nav.services']).toBe('Szolgáltatások');
  });

  it('returns undefined for a key missing from the dictionary', () => {
    const service = TestBed.inject(I18nService);
    expect(service.t()['this.key.does.not.exist']).toBeUndefined();
  });
});
