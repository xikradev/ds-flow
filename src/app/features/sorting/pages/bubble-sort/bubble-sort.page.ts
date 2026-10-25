import { Component, signal } from '@angular/core';
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
  readonly values = signal<number[]>(Array.from({ length: 5 }, () => this.randomValue()));
  readonly isAddingValue = signal(false);
  readonly newValue = signal('');

  startAdding(): void {
    this.isAddingValue.set(true);
  }

  updateNewValue(value: string): void {
    this.newValue.set(value);
  }

  addValue(): void {
    const value = Number(this.newValue());

    if (!Number.isInteger(value) || value < 1 || value > 99) {
      return;
    }

    this.values.update((values) => [...values, value]);
    this.newValue.set('');
    this.isAddingValue.set(false);
  }

  private randomValue(): number {
    return Math.floor(Math.random() * 99) + 1;
  }
}
