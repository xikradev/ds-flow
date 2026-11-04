import { Component, inject, signal } from '@angular/core';
import { SortingValueComponent } from '../../components/sorting-value/sorting-value.component';
import { ValueAdderComponent } from '../../components/value-adder/value-adder.component';
import { SortingListService } from '../../services/sorting-list.service';
import { BubbleSortSimulationService } from '../../services/bubble-sort-simulation.service';

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
  readonly simulation = inject(BubbleSortSimulationService);
  readonly newestValueId = signal<number | null>(null);

  addValue(value: number): void {
    if (this.simulation.editingDisabled()) return;
    this.newestValueId.set(this.sortingList.addValue(value));
    this.simulation.resetAfterEdit();
  }

  removeValue(index: number): void {
    if (this.simulation.editingDisabled()) return;
    this.sortingList.removeValueAt(index);
    this.simulation.resetAfterEdit();
  }

  editValue(index: number, value: number): void {
    if (this.simulation.editingDisabled()) return;
    this.sortingList.updateValueAt(index, value);
    this.simulation.resetAfterEdit();
  }
}
