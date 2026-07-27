import { TestBed } from '@angular/core/testing';
import { StatsComponent } from './stats.component';

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  observed: Element[] = [];
  unobserveSpy = vi.fn();

  constructor(private callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(el: Element) {
    this.observed.push(el);
  }

  unobserve(el: Element) {
    this.unobserveSpy(el);
  }

  disconnect() {}

  trigger(isIntersecting: boolean) {
    const entries = this.observed.map(
      target => ({ isIntersecting, target }) as IntersectionObserverEntry,
    );
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

describe('StatsComponent', () => {
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let nowSpy: ReturnType<typeof vi.spyOn>;
  let originalIntersectionObserver: typeof IntersectionObserver;

  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    originalIntersectionObserver = window.IntersectionObserver;
    (window as any).IntersectionObserver = FakeIntersectionObserver;

    let time = 0;
    nowSpy = vi.spyOn(performance, 'now').mockImplementation(() => (time += 2000));
    rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(performance.now());
        return 1;
      });

    TestBed.configureTestingModule({ imports: [StatsComponent] });
  });

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver;
    rafSpy.mockRestore();
    nowSpy.mockRestore();
  });

  it('does not animate before the section intersects the viewport', () => {
    const fixture = TestBed.createComponent(StatsComponent);
    fixture.detectChanges();

    const numbers: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.stat-number'),
    );
    expect(numbers.map(el => el.textContent)).toEqual(['0+', '0%', '0yrs', '0M+']);
  });

  it('counts each stat up to its target value once it intersects', () => {
    const fixture = TestBed.createComponent(StatsComponent);
    fixture.detectChanges();

    const observer = FakeIntersectionObserver.instances[0];
    expect(observer.observed.length).toBe(4);

    observer.trigger(true);

    const numbers: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.stat-number'),
    );
    expect(numbers.map(el => el.textContent)).toEqual(['143+', '98%', '6yrs', '2M+']);
  });

  it('stops observing each element after it has animated', () => {
    const fixture = TestBed.createComponent(StatsComponent);
    fixture.detectChanges();

    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger(true);

    expect(observer.unobserveSpy).toHaveBeenCalledTimes(4);
  });

  it('ignores entries that are not intersecting', () => {
    const fixture = TestBed.createComponent(StatsComponent);
    fixture.detectChanges();

    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger(false);

    expect(observer.unobserveSpy).not.toHaveBeenCalled();
    const numbers: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.stat-number'),
    );
    expect(numbers.map(el => el.textContent)).toEqual(['0+', '0%', '0yrs', '0M+']);
  });
});
