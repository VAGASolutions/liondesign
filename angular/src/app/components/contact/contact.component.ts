import { Component, inject } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  i18n = inject(I18nService);
  submitLabel = '';
  submitting = false;

  ngOnInit() { this.submitLabel = this.i18n.t()['form.submit']; }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.submitting) return;
    this.submitting = true;
    this.submitLabel = 'Sending…';
    setTimeout(() => {
      this.submitLabel = '✓ Message sent!';
      setTimeout(() => {
        this.submitLabel = this.i18n.t()['form.submit'];
        this.submitting = false;
        (e.target as HTMLFormElement).reset();
      }, 3000);
    }, 1400);
  }
}
