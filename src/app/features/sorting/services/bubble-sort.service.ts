import { Injectable } from '@angular/core';
import { SortingListItem, SortingStep } from '../state/sorting-simulation';

@Injectable({ providedIn: 'root' })
export class BubbleSortService {
  /** Gera snapshots independentes, incluindo o estado inicial e as posições definitivas. */
  generateSteps(items: readonly SortingListItem[]): readonly SortingStep[] {
    const current = items.map((item) => ({ ...item }));
    const sortedPositions: number[] = [];
    const steps: SortingStep[] = [];

    const record = (comparing: readonly [number, number] | null, swapped = false): void => {
      steps.push({
        items: current.map((item) => ({ ...item })),
        comparing,
        sortedPositions: [...sortedPositions],
        swapped,
      });
    };

    record(null);
    for (let end = current.length - 1; end > 0; end--) {
      for (let index = 0; index < end; index++) {
        record([index, index + 1]);
        if (current[index].value > current[index + 1].value) {
          [current[index], current[index + 1]] = [current[index + 1], current[index]];
          record([index, index + 1], true);
        }
      }
      sortedPositions.unshift(end);
      record(null);
    }

    if (current.length > 0) {
      sortedPositions.unshift(0);
      record(null);
    }

    return steps;
  }
}
