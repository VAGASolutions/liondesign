import { Component, inject } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-process',
  standalone: true,
  templateUrl: './process.component.html',
})
export class ProcessComponent {
  i18n = inject(I18nService);
}
