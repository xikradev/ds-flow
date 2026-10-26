import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-value-adder',
  imports: [MatIconModule, OverlayModule],
  templateUrl: './value-adder.component.html',
})
export class ValueAdderComponent implements OnDestroy {
  private readonly injector = inject(Injector);
  private invalidValueTimeout?: ReturnType<typeof setTimeout>;

  readonly valueAdded = output<number>();
  readonly isAdding = signal(false);
  readonly hasInvalidValue = signal(false);
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
    this.clearInvalidValueFeedback();
    this.value.set(value);
  }

  cancel(): void {
    this.clearInvalidValueFeedback();
    this.value.set('');
    this.isAdding.set(false);
  }

  add(): void {
    const value = Number(this.value());

    if (!Number.isInteger(value) || value < 1 || value > 99) {
      this.showInvalidValueFeedback();
      return;
    }

    this.valueAdded.emit(value);
    this.cancel();
  }

  ngOnDestroy(): void {
    this.clearInvalidValueFeedback();
  }

  private showInvalidValueFeedback(): void {
    this.clearInvalidValueFeedback();
    this.hasInvalidValue.set(true);
    this.invalidValueTimeout = setTimeout(() => {
      this.hasInvalidValue.set(false);
      this.invalidValueTimeout = undefined;
    }, 5_000);
  }

  private clearInvalidValueFeedback(): void {
    if (this.invalidValueTimeout) {
      clearTimeout(this.invalidValueTimeout);
      this.invalidValueTimeout = undefined;
    }

    this.hasInvalidValue.set(false);
  }
}
