import { TestBed } from '@angular/core/testing';
import { BubbleSortSimulationService } from '../../services/bubble-sort-simulation.service';
import { SortingListService } from '../../services/sorting-list.service';
import { BubbleSortPage } from './bubble-sort.page';

describe('BubbleSortPage editing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({ providers: [BubbleSortSimulationService] });
  });

  afterEach(() => jest.useRealTimers());

  it('blocks add, edit and delete while playing and paused', () => {
    const fixture = TestBed.createComponent(BubbleSortPage);
    const page = fixture.componentInstance;
    const list = TestBed.inject(SortingListService);
    const simulation = TestBed.inject(BubbleSortSimulationService);
    list.applySnapshot([{ id: 1, value: 2 }, { id: 2, value: 1 }]);
    const original = list.items();
    simulation.start();
    for (const state of ['playing', 'paused']) {
      expect(simulation.playback()).toBe(state);
      page.addValue(3);
      page.editValue(0, 9);
      page.removeValue(0);
      expect(list.items()).toEqual(original);
      simulation.pause();
    }
    fixture.detectChanges();
    expect(Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .every((button) => button.disabled)).toBe(true);
    fixture.destroy();
  });

  it.each(['add', 'edit', 'delete'])('clears completed history after %s', (action) => {
    const fixture = TestBed.createComponent(BubbleSortPage);
    const page = fixture.componentInstance;
    const list = TestBed.inject(SortingListService);
    const simulation = TestBed.inject(BubbleSortSimulationService);
    list.applySnapshot([{ id: 1, value: 2 }, { id: 2, value: 1 }]);
    simulation.start();
    jest.advanceTimersByTime(10000);
    expect(simulation.playback()).toBe('completed');
    if (action === 'add') page.addValue(3);
    if (action === 'edit') page.editValue(0, 3);
    if (action === 'delete') page.removeValue(0);
    const changed = list.items();
    expect(simulation.playback()).toBe('idle');
    expect(simulation.history().currentIndex).toBe(-1);
    expect(simulation.currentStep()).toBeNull();
    simulation.previous();
    expect(list.items()).toEqual(changed);
    if (changed.length >= 2) {
      simulation.start();
      expect(simulation.currentStep()?.items).toEqual(changed);
      simulation.pause();
    }
    fixture.destroy();
  });
});
