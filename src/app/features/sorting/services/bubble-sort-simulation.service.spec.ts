import { TestBed } from '@angular/core/testing';
import { createEnvironmentInjector, EnvironmentInjector } from '@angular/core';
import { BubbleSortSimulationService } from './bubble-sort-simulation.service';
import { SortingListService } from './sorting-list.service';

describe('BubbleSortSimulationService', () => {
  let simulation: BubbleSortSimulationService;
  let list: SortingListService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [BubbleSortSimulationService] });
    simulation = TestBed.inject(BubbleSortSimulationService);
    list = TestBed.inject(SortingListService);
    list.applySnapshot([{ id: 1, value: 2 }, { id: 2, value: 1 }]);
  });

  it('keeps navigation safe before preparation and at both ends of the history', () => {
    simulation.next();
    simulation.previous();
    expect(simulation.currentStep()).toBeNull();
    expect(simulation.history().currentIndex).toBe(-1);

    simulation.prepare();
    simulation.previous();
    expect(simulation.history().currentIndex).toBe(0);
    expect(simulation.canGoBack()).toBe(false);

    while (simulation.canGoForward()) simulation.next();
    const lastIndex = simulation.history().currentIndex;
    simulation.next();
    expect(lastIndex).toBe(simulation.history().steps.length - 1);
    expect(simulation.history().currentIndex).toBe(lastIndex);
    expect(simulation.currentStep()?.sortedPositions).toEqual([0, 1]);
    expect(list.values()).toEqual([1, 2]);

    while (simulation.canGoBack()) simulation.previous();
    expect(simulation.history().currentIndex).toBe(0);
    expect(list.values()).toEqual([2, 1]);
  });

  it('restores items and visual metadata when navigating across a swap', () => {
    simulation.prepare();
    const history = simulation.history().steps;
    simulation.next();
    expect(simulation.currentStep()).toEqual(history[1]);
    expect(simulation.currentStep()?.comparing).toEqual([0, 1]);
    expect(simulation.currentStep()?.swapped).toBe(false);
    simulation.next();
    expect(simulation.currentStep()?.swapped).toBe(true);
    expect(list.items().map((item) => item.id)).toEqual([2, 1]);

    simulation.previous();
    expect(simulation.currentStep()).toEqual(history[1]);
    expect(list.items()).toEqual(history[1].items);
    simulation.next();
    expect(simulation.currentStep()).toEqual(history[2]);
    expect(list.items()).toEqual(history[2].items);
    expect(simulation.history().steps).toBe(history);
  });

  it('prepares a fresh history from the currently displayed list', () => {
    simulation.prepare();
    simulation.next();
    simulation.next();
    list.addValue(3);
    const currentItems = list.items();

    simulation.prepare();
    expect(simulation.history().currentIndex).toBe(0);
    expect(simulation.currentStep()?.items).toEqual(currentItems);
    expect(simulation.currentStep()?.comparing).toBeNull();
  });

  describe('automatic playback', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('starts once, pauses and resumes from the same step', () => {
      simulation.start();
      simulation.start();
      expect(simulation.playback()).toBe('playing');
      jest.advanceTimersByTime(1000);
      expect(simulation.history().currentIndex).toBe(1);
      simulation.pause();
      jest.advanceTimersByTime(3000);
      expect(simulation.history().currentIndex).toBe(1);
      expect(simulation.playback()).toBe('paused');
      simulation.start();
      jest.advanceTimersByTime(1000);
      expect(simulation.history().currentIndex).toBe(2);
      expect(list.values()).toEqual([1, 2]);
      simulation.pause();
    });

    it('pauses on manual navigation, including at a boundary', () => {
      simulation.start();
      simulation.previous();
      expect(simulation.playback()).toBe('paused');
      jest.advanceTimersByTime(2000);
      expect(simulation.history().currentIndex).toBe(0);
      simulation.start();
      simulation.next();
      expect(simulation.playback()).toBe('paused');
      jest.advanceTimersByTime(2000);
      expect(simulation.history().currentIndex).toBe(1);
    });

    it('stops at the last step without leaving a timer running', () => {
      simulation.start();
      jest.advanceTimersByTime(10000);
      expect(simulation.history().currentIndex).toBe(simulation.history().steps.length - 1);
      expect(simulation.playback()).toBe('completed');
      expect(jest.getTimerCount()).toBe(0);
    });

    it('restarts from the original items and begins playback again', () => {
      const original = list.items();
      simulation.restart();
      expect(simulation.playback()).toBe('idle');
      simulation.start();
      jest.advanceTimersByTime(10000);
      expect(simulation.playback()).toBe('completed');
      expect(simulation.canStart()).toBe(false);

      simulation.restart();
      expect(list.items()).toEqual(original);
      expect(simulation.history().currentIndex).toBe(0);
      expect(simulation.currentStep()?.sortedPositions).toEqual([]);
      expect(simulation.playback()).toBe('playing');
      jest.advanceTimersByTime(1000);
      expect(simulation.history().currentIndex).toBe(1);
      simulation.pause();
    });

    it('completes through manual navigation and resumes after going back', () => {
      simulation.prepare();
      while (simulation.canGoForward()) simulation.next();
      expect(simulation.playback()).toBe('completed');
      simulation.previous();
      expect(simulation.playback()).toBe('paused');
      expect(simulation.canStart()).toBe(true);
      simulation.start();
      jest.advanceTimersByTime(1000);
      expect(simulation.playback()).toBe('completed');
    });

    it.each([[[]], [[{ id: 1, value: 7 }]]])('does not start with fewer than two items: %p', (items) => {
      list.applySnapshot(items);
      expect(simulation.canStart()).toBe(false);
      simulation.start();
      expect(simulation.playback()).toBe('idle');
      expect(simulation.history().currentIndex).toBe(-1);
      expect(jest.getTimerCount()).toBe(0);
      simulation.prepare();
      simulation.start();
      expect(simulation.playback()).toBe('idle');
      expect(jest.getTimerCount()).toBe(0);
    });

    it('cancels playback when the feature injector is destroyed', () => {
      const injector = createEnvironmentInjector(
        [SortingListService, BubbleSortSimulationService],
        TestBed.inject(EnvironmentInjector),
      );
      const scopedSimulation = injector.get(BubbleSortSimulationService);
      scopedSimulation.start();
      expect(jest.getTimerCount()).toBe(1);
      injector.destroy();
      expect(jest.getTimerCount()).toBe(0);
      jest.advanceTimersByTime(2000);
      expect(scopedSimulation.history().currentIndex).toBe(0);
    });
  });
});
