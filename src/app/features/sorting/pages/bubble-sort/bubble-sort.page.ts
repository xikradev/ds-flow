import { Component, signal } from '@angular/core';
import { ValueAdderComponent } from '../../components/value-adder/value-adder.component';

@Component({
  selector: 'app-bubble-sort-page',
  host: {
    class: 'block h-full',
  },
  imports: [ValueAdderComponent],
  templateUrl: './bubble-sort.page.html',
})
export class BubbleSortPage {
  readonly values = signal<number[]>(Array.from({ length: 5 }, () => this.randomValue()));

  addValue(value: number): void {
    this.values.update((values) => [...values, value]);
  }

  private randomValue(): number {
    return Math.floor(Math.random() * 99) + 1;
  }
}
