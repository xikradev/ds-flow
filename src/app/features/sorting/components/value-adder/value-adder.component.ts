import { afterNextRender, Component, ElementRef, inject, Injector, output, signal, viewChild } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-value-adder',
  imports: [MatIconModule, OverlayModule],
  templateUrl: './value-adder.component.html',
})
export class ValueAdderComponent {
  private readonly injector = inject(Injector);

  readonly valueAdded = output<number>();
  readonly isAdding = signal(false);
  readonly value = signal('');
  readonly input = viewChild<ElementRef<HTMLInputElement>>('valueInput');
  readonly tooltipPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -8,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -8,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8,
    },
  ];

  startAdding(): void {
    this.isAdding.set(true);
    afterNextRender(() => this.input()?.nativeElement.focus(), { injector: this.injector });
  }

  updateValue(value: string): void {
    this.value.set(value);
  }

  cancel(): void {
    this.value.set('');
    this.isAdding.set(false);
  }

  add(): void {
    const value = Number(this.value());

    if (!Number.isInteger(value) || value < 1 || value > 99) {
      return;
    }

    this.valueAdded.emit(value);
    this.cancel();
  }
}
