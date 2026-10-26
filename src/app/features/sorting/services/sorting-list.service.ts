import { Injectable, signal } from '@angular/core';

const MIN_VALUE = 1;
const MAX_VALUE = 99;
const INITIAL_VALUES_COUNT = 5;

@Injectable({ providedIn: 'root' })
export class SortingListService {
  private readonly list = signal<number[]>(
    Array.from({ length: INITIAL_VALUES_COUNT }, () => this.randomValue()),
  );

  readonly values = this.list.asReadonly();

  addValue(value: number): void {
    this.list.update((values) => [...values, value]);
  }

  private randomValue(): number {
    return Math.floor(Math.random() * MAX_VALUE) + MIN_VALUE;
  }
}
