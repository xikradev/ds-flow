import { computed, Injectable, signal } from '@angular/core';
import { SortingListItem } from '../state/sorting-simulation';

const MIN_VALUE = 1;
const MAX_VALUE = 99;
const INITIAL_VALUES_COUNT = 5;

@Injectable({ providedIn: 'root' })
export class SortingListService {
  private nextItemId = 0;
  private readonly list = signal<readonly SortingListItem[]>(
    Array.from({ length: INITIAL_VALUES_COUNT }, () => this.createItem(this.randomValue())),
  );

  readonly items = this.list.asReadonly();
  readonly values = computed(() => this.list().map((item) => item.value));

  /** Aplica ou restaura uma lista preservando a identidade e a ordem dos itens. */
  applySnapshot(items: readonly SortingListItem[]): void {
    const snapshot = items.map((item) => ({ ...item }));
    for (const item of snapshot) {
      this.nextItemId = Math.max(this.nextItemId, item.id);
    }
    this.list.set(snapshot);
  }

  addValue(value: number): number {
    const item = this.createItem(value);
    this.list.update((items) => [...items, item]);
    return item.id;
  }

  removeValueAt(index: number): void {
    this.list.update((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  updateValueAt(index: number, value: number): void {
    this.list.update((items) => items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, value } : item,
    ));
  }

  private createItem(value: number): SortingListItem {
    this.nextItemId += 1;
    return { id: this.nextItemId, value };
  }

  private randomValue(): number {
    return Math.floor(Math.random() * MAX_VALUE) + MIN_VALUE;
  }
}
