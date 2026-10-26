import { Component, inject } from '@angular/core';
import { ValueAdderComponent } from '../../components/value-adder/value-adder.component';
import { SortingListService } from '../../services/sorting-list.service';

@Component({
  selector: 'app-bubble-sort-page',
  host: {
    class: 'block h-full',
  },
  imports: [ValueAdderComponent],
  templateUrl: './bubble-sort.page.html',
})
export class BubbleSortPage {
  readonly sortingList = inject(SortingListService);
}
