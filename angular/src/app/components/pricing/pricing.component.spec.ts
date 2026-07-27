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
