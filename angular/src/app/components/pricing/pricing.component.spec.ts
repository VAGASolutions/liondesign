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
