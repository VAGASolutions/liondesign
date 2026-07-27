import { TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';

function createFakeContext2d(): Partial<CanvasRenderingContext2D> {
  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(700 * 500 * 4) }) as ImageData),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    textAlign: 'center' as CanvasTextAlign,
    textBaseline: 'middle' as CanvasTextBaseline,
  };
}

describe('HeroComponent', () => {
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cafSpy: ReturnType<typeof vi.spyOn>;
  let getContextSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    let nextId = 1;
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => nextId++);
    cafSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(() => createFakeContext2d() as CanvasRenderingContext2D);
    TestBed.configureTestingModule({ imports: [HeroComponent] });
  });

  afterEach(() => {
    rafSpy.mockRestore();
    cafSpy.mockRestore();
    getContextSpy.mockRestore();
  });

  it('initializes the particle and word canvases without throwing', () => {
    expect(() => {
      const fixture = TestBed.createComponent(HeroComponent);
      fixture.detectChanges();
    }).not.toThrow();

    expect(rafSpy).toHaveBeenCalled();
  });

  it('cancels all tracked animation frames on destroy', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();

    const scheduledCount = rafSpy.mock.calls.length;
    expect(scheduledCount).toBeGreaterThan(0);

    fixture.destroy();

    expect(cafSpy).toHaveBeenCalledTimes(scheduledCount);
  });

  it('scrolls to a section by id', () => {
    const fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();

    const target = document.createElement('div');
    target.id = 'contact';
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    fixture.componentInstance.scrollTo('contact');

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    target.remove();
  });
});
