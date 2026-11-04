import { Component, inject, input } from '@angular/core';

import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly homeHref = input('#simulator');
  readonly brandLabel = input('DSflow, início');
}
