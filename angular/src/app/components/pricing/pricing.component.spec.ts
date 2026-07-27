import { TestBed } from '@angular/core/testing';
import { PricingComponent } from './pricing.component';

describe('PricingComponent wizard navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PricingComponent] });
  });

  it('hides the back button on the first step', () => {
    const fixture = TestBed.createComponent(PricingComponent);
    fixture.componentInstance.modalOpen = true;
    fixture.componentInstance.currentStep = 0;
    fixture.detectChanges();

    const footer: HTMLElement = fixture.nativeElement.querySelector('.brief-modal-footer');
    expect(footer.querySelector('.btn-outline')).toBeFalsy();
  });

  it('shows a working back button on the summary step and hides next/skip controls', () => {
    const fixture = TestBed.createComponent(PricingComponent);
    const component = fixture.componentInstance;
    component.modalOpen = true;
    component.currentStep = component.TOTAL_STEPS;
    component.brief.projectName = 'Acme';
    fixture.detectChanges();

    const footer: HTMLElement = fixture.nativeElement.querySelector('.brief-modal-footer');
    const backButton: HTMLButtonElement | null = footer.querySelector('.btn-outline');
    expect(backButton).toBeTruthy();
    expect(footer.querySelector('.brief-nav-right')).toBeFalsy();

    backButton!.click();
    fixture.detectChanges();

    expect(component.currentStep).toBe(component.TOTAL_STEPS - 1);
    expect(component.brief.projectName).toBe('Acme');
  });
});

describe('PricingComponent required field validation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PricingComponent] });
  });

  it('marks required fields with a visible indicator', () => {
    const fixture = TestBed.createComponent(PricingComponent);
    fixture.componentInstance.modalOpen = true;
    fixture.componentInstance.currentStep = 0;
    fixture.detectChanges();

    const marks = fixture.nativeElement.querySelectorAll('.required-mark');
    expect(marks.length).toBeGreaterThan(0);
  });

  it('does not advance and shows inline errors when Next is clicked with required fields empty', () => {
    const fixture = TestBed.createComponent(PricingComponent);
    const component = fixture.componentInstance;
    component.modalOpen = true;
    component.currentStep = 0;
    fixture.detectChanges();

    const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector('.brief-nav-right .btn-primary');
    nextButton.click();
    fixture.detectChanges();

    expect(component.currentStep).toBe(0);
    expect(component.attemptedNext()).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('.brief-step-error-banner')).toBeTruthy();
  });

  it('advances and clears the error state once required fields are filled', async () => {
    const fixture = TestBed.createComponent(PricingComponent);
    const component = fixture.componentInstance;
    component.modalOpen = true;
    component.currentStep = 0;
    fixture.detectChanges();

    const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector('.brief-nav-right .btn-primary');
    nextButton.click();
    await fixture.whenStable();
    expect(component.attemptedNext()).toBe(true);

    component.brief.siteType = 'Landing page';
    component.brief.goal = 'Sales';
    await fixture.whenStable();

    nextButton.click();
    await fixture.whenStable();

    expect(component.currentStep).toBe(1);
    expect(component.attemptedNext()).toBe(false);
  });
});

describe('PricingComponent skip-only steps', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PricingComponent] });
  });

  it('blocks Next on step 1 until the URL is filled, but Skip always advances', () => {
    const fixture = TestBed.createComponent(PricingComponent);
    const component = fixture.componentInstance;
    component.modalOpen = true;
    component.currentStep = 1;
    fixture.detectChanges();

    const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector('.brief-nav-right .btn-primary');
    nextButton.click();
    fixture.detectChanges();

    expect(component.currentStep).toBe(1);
    expect(component.attemptedNext()).toBe(true);
    expect(fixture.nativeElement.querySelector('.field-error')).toBeTruthy();

    const skipButton: HTMLButtonElement = fixture.nativeElement.querySelector('.brief-nav-right .btn-outline');
    skipButton.click();
    fixture.detectChanges();

    expect(component.currentStep).toBe(2);
    expect(component.attemptedNext()).toBe(false);
  });

  it('advances step 1 via Next once the URL is filled', () => {
    const fixture = TestBed.createComponent(PricingComponent);
    const component = fixture.componentInstance;
    component.modalOpen = true;
    component.currentStep = 1;
    component.brief.currentSiteUrl = 'https://example.com';
    fixture.detectChanges();

    const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector('.brief-nav-right .btn-primary');
    nextButton.click();
    fixture.detectChanges();

    expect(component.currentStep).toBe(2);
  });

  it('blocks Next on step 3 until a frontend is selected, but Skip always advances', () => {
    const fixture = TestBed.createComponent(PricingComponent);
    const component = fixture.componentInstance;
    component.modalOpen = true;
    component.currentStep = 3;
    fixture.detectChanges();

    const nextButton: HTMLButtonElement = fixture.nativeElement.querySelector('.brief-nav-right .btn-primary');
    nextButton.click();
    fixture.detectChanges();

    expect(component.currentStep).toBe(3);
    expect(component.attemptedNext()).toBe(true);

    const skipButton: HTMLButtonElement = fixture.nativeElement.querySelector('.brief-nav-right .btn-outline');
    skipButton.click();
    fixture.detectChanges();

    expect(component.currentStep).toBe(4);
    expect(component.attemptedNext()).toBe(false);
  });
});

describe('PricingComponent canProceed per step', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PricingComponent] });
  });

  function makeComponent(step: number) {
    const fixture = TestBed.createComponent(PricingComponent);
    fixture.componentInstance.currentStep = step;
    return fixture.componentInstance;
  }

  it('step 2 requires audience and b2b segment', () => {
    const component = makeComponent(2);
    expect(component.canProceed).toBe(false);
    component.brief.audience = 'Small business owners';
    expect(component.canProceed).toBe(false);
    component.brief.b2b = 'B2B';
    expect(component.canProceed).toBe(true);
  });

  it('step 4 requires logo and brand status', () => {
    const component = makeComponent(4);
    expect(component.canProceed).toBe(false);
    component.brief.hasLogo = 'Yes';
    expect(component.canProceed).toBe(false);
    component.brief.hasBrand = 'No';
    expect(component.canProceed).toBe(true);
  });

  it('step 5 requires a theme and at least one mood', () => {
    const component = makeComponent(5);
    expect(component.canProceed).toBe(false);
    component.brief.theme = 'Dark';
    expect(component.canProceed).toBe(false);
    component.brief.mood.push('Trust');
    expect(component.canProceed).toBe(true);
  });

  it('step 6 requires a font style and Hungarian accent preference', () => {
    const component = makeComponent(6);
    expect(component.canProceed).toBe(false);
    component.brief.fontStyle = 'Modern sans-serif';
    expect(component.canProceed).toBe(false);
    component.brief.needsHungarian = 'Yes';
    expect(component.canProceed).toBe(true);
  });

  it('step 7 requires at least one visual style', () => {
    const component = makeComponent(7);
    expect(component.canProceed).toBe(false);
    component.brief.visualStyles.push('Minimal');
    expect(component.canProceed).toBe(true);
  });

  it('step 8 requires structure, sections, nav style, and scroll preference', () => {
    const component = makeComponent(8);
    expect(component.canProceed).toBe(false);
    component.brief.pageStructure = 'One long landing page';
    component.brief.sections.push('Hero');
    component.brief.navStyle = 'Fixed top nav';
    expect(component.canProceed).toBe(false);
    component.brief.scrollAnimations = 'Yes, include it';
    expect(component.canProceed).toBe(true);
  });

  it('step 9 requires photos, video, and icon preferences', () => {
    const component = makeComponent(9);
    expect(component.canProceed).toBe(false);
    component.brief.hasPhotos = 'Yes, photos are ready';
    component.brief.needsVideo = 'No';
    expect(component.canProceed).toBe(false);
    component.brief.iconStyle = 'Outline';
    expect(component.canProceed).toBe(true);
  });

  it('step 10 requires an animation level', () => {
    const component = makeComponent(10);
    expect(component.canProceed).toBe(false);
    component.brief.animationLevel = 'Subtle';
    expect(component.canProceed).toBe(true);
  });

  it('step 11 requires at least one selected feature', () => {
    const component = makeComponent(11);
    expect(component.canProceed).toBe(false);
    component.brief.features.push('Blog / CMS');
    expect(component.canProceed).toBe(true);
  });

  it('step 12 requires copy and image readiness', () => {
    const component = makeComponent(12);
    expect(component.canProceed).toBe(false);
    component.brief.hasCopy = 'Yes, everything is ready';
    expect(component.canProceed).toBe(false);
    component.brief.hasImages = 'Partially ready';
    expect(component.canProceed).toBe(true);
  });

  it('defaults to true on the summary step (step 13)', () => {
    const component = makeComponent(13);
    expect(component.canProceed).toBe(true);
  });
});
