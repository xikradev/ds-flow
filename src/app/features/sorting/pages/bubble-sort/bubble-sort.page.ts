import { Component, computed, inject, signal } from '@angular/core';
import { SortingValueComponent } from '../../components/sorting-value/sorting-value.component';
import { ValueAdderComponent } from '../../components/value-adder/value-adder.component';
import { SortingListService } from '../../services/sorting-list.service';
import { BubbleSortSimulationService } from '../../services/bubble-sort-simulation.service';
import { SwapAnimationDirective } from '../../components/swap-animation.directive';

@Component({
  selector: 'app-bubble-sort-page',
  host: {
    class: 'block h-full',
  },
  imports: [SortingValueComponent, ValueAdderComponent, SwapAnimationDirective],
  templateUrl: './bubble-sort.page.html',
})
export class BubbleSortPage {
  readonly sortingList = inject(SortingListService);
  readonly simulation = inject(BubbleSortSimulationService);
  readonly newestValueId = signal<number | null>(null);
  readonly simulationDescription = computed(() => {
    const step = this.simulation.currentStep();
    if (!step) return '';
    const comparing = step.comparing
      ? `Comparando posições ${step.comparing[0] + 1} e ${step.comparing[1] + 1}. `
      : '';
    const sorted = step.sortedPositions.length
      ? `Posições definitivas: ${step.sortedPositions.map((index) => index + 1).join(', ')}.`
      : '';
    return `${comparing}${sorted}`;
  });

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
