import { BubbleSortService } from './bubble-sort.service';
import { SortingListItem } from '../state/sorting-simulation';

describe('BubbleSortService', () => {
  const service = new BubbleSortService();
  const items = (values: number[]): SortingListItem[] =>
    values.map((value, index) => ({ id: index + 1, value }));

  it('records comparisons and definitive positions for an ordered list without swaps', () => {
    const steps = service.generateSteps(items([1, 2, 3]));

    expect(steps.map((step) => step.comparing)).toEqual([
      null, [0, 1], [1, 2], null, [0, 1], null, null,
    ]);
    expect(steps.every((step) => !step.swapped)).toBe(true);
    expect(steps.filter((step) => step.sortedPositions.length > 0).map((step) => step.sortedPositions))
      .toEqual([[2], [2], [1, 2], [0, 1, 2]]);
  });

  it('records each swap after its comparison and preserves earlier snapshots', () => {
    const input = items([3, 2, 1]);
    const steps = service.generateSteps(input);

    expect(steps.filter((step) => step.swapped).map((step) => step.items.map((item) => item.value)))
      .toEqual([[2, 3, 1], [2, 1, 3], [1, 2, 3]]);
    expect(steps[1].comparing).toEqual([0, 1]);
    expect(steps[1].items).toEqual(input);
    expect(steps[2].comparing).toEqual([0, 1]);
    expect(steps[steps.length - 1].sortedPositions).toEqual([0, 1, 2]);
    expect(input.map((item) => item.value)).toEqual([3, 2, 1]);
  });

  it('preserves distinct identities and the relative order of equal values', () => {
    const steps = service.generateSteps(items([2, 1, 2, 1]));
    const last = steps[steps.length - 1];

    expect(last.items.map((item) => item.id)).toEqual([2, 4, 1, 3]);
    expect(last.sortedPositions).toEqual([0, 1, 2, 3]);
  });

  it('handles empty and single-item lists', () => {
    expect(service.generateSteps([])).toEqual([
      { items: [], comparing: null, sortedPositions: [], swapped: false },
    ]);
    expect(service.generateSteps(items([7]))).toEqual([
      { items: items([7]), comparing: null, sortedPositions: [], swapped: false },
      { items: items([7]), comparing: null, sortedPositions: [0], swapped: false },
    ]);
  });

  it('copies input items so later input mutations cannot alter snapshots', () => {
    const input = [{ id: 1, value: 2 }, { id: 2, value: 1 }];
    const steps = service.generateSteps(input);

    input[0].value = 99;
    expect(steps[0].items[0].value).toBe(2);
    expect(steps[1].items[0]).not.toBe(steps[0].items[0]);
  });
});
