import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  readonly homeHref = input('#simulator');
  readonly brandLabel = input('DSflow, início');
}
