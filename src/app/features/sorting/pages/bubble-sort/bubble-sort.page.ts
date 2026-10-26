import { Component, inject, signal } from '@angular/core';
import { SortingValueComponent } from '../../components/sorting-value/sorting-value.component';
import { ValueAdderComponent } from '../../components/value-adder/value-adder.component';
import { SortingListService } from '../../services/sorting-list.service';

@Component({
  selector: 'app-bubble-sort-page',
  host: {
    class: 'block h-full',
  },
  imports: [SortingValueComponent, ValueAdderComponent],
  templateUrl: './bubble-sort.page.html',
})
export class BubbleSortPage {
  readonly sortingList = inject(SortingListService);
  readonly newestValueId = signal<number | null>(null);

  addValue(value: number): void {
    this.newestValueId.set(this.sortingList.addValue(value));
  }
}
