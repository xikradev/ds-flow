import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sorting-value',
  imports: [MatIconModule, OverlayModule],
  templateUrl: './sorting-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortingValueComponent implements OnDestroy {
  private readonly injector = inject(Injector);
  private invalidValueTimeout?: ReturnType<typeof setTimeout>;

  readonly value = input.required<number>();
  readonly deleteRequested = output<void>();
  readonly valueEdited = output<number>();
  readonly isMenuOpen = signal(false);
  readonly isEditing = signal(false);
  readonly hasInvalidValue = signal(false);
  readonly editingValue = signal('');
  readonly input = viewChild<ElementRef<HTMLInputElement>>('valueInput');
  readonly menuPositions: ConnectedPosition[] = [
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -8,
    },
  ];
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

  openMenu(): void {
    this.isMenuOpen.set(true);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  requestDelete(): void {
    this.deleteRequested.emit();
    this.closeMenu();
  }

  startEditing(): void {
    this.closeMenu();
    this.clearInvalidValueFeedback();
    this.editingValue.set(String(this.value()));
    this.isEditing.set(true);
    afterNextRender(() => {
      const input = this.input()?.nativeElement;
      input?.focus();
      input?.select();
    }, { injector: this.injector });
  }

  updateEditingValue(value: string): void {
    this.clearInvalidValueFeedback();
    this.editingValue.set(value);
  }

  saveEdit(): void {
    const value = Number(this.editingValue());

    if (!Number.isInteger(value) || value < 1 || value > 99) {
      this.showInvalidValueFeedback();
      return;
    }

    this.valueEdited.emit(value);
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.clearInvalidValueFeedback();
    this.isEditing.set(false);
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
