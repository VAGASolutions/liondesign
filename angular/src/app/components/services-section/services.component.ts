import { Component, inject } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-services-section',
  standalone: true,
  templateUrl: './services.component.html',
})
export class ServicesSectionComponent {
  i18n = inject(I18nService);
}
