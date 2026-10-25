import { afterNextRender, Component, ElementRef, inject, Injector, signal, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bubble-sort-page',
  host: {
    class: 'block h-full',
  },
  imports: [MatIconModule],
  templateUrl: './bubble-sort.page.html',
})
export class BubbleSortPage {
  private readonly injector = inject(Injector);

  readonly values = signal<number[]>(Array.from({ length: 5 }, () => this.randomValue()));
  readonly isAddingValue = signal(false);
  readonly newValue = signal('');
  readonly valueInput = viewChild<ElementRef<HTMLInputElement>>('valueInput');

  startAdding(): void {
    this.isAddingValue.set(true);
    afterNextRender(() => this.valueInput()?.nativeElement.focus(), { injector: this.injector });
  }

  updateNewValue(value: string): void {
    this.newValue.set(value);
  }

  cancelAdding(): void {
    this.newValue.set('');
    this.isAddingValue.set(false);
  }

  addValue(): void {
    const value = Number(this.newValue());

    if (!Number.isInteger(value) || value < 1 || value > 99) {
      return;
    }

    this.values.update((values) => [...values, value]);
    this.cancelAdding();
  }

  private randomValue(): number {
    return Math.floor(Math.random() * 99) + 1;
  }
}
