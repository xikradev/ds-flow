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

  it('renders comparison and sorted states and restores them when navigating', () => {
    const fixture = TestBed.createComponent(BubbleSortPage);
    const list = TestBed.inject(SortingListService);
    const simulation = TestBed.inject(BubbleSortSimulationService);
    list.applySnapshot([{ id: 1, value: 2 }, { id: 2, value: 1 }]);
    const valueButtons = () => Array.from(
      fixture.nativeElement.querySelectorAll('app-sorting-value button') as NodeListOf<HTMLButtonElement>,
    );
    simulation.start();
    simulation.pause();
    simulation.next();
    fixture.detectChanges();
    expect(valueButtons().every((button) => button.classList.contains('bg-comparing'))).toBe(true);
    expect(valueButtons()[0].getAttribute('aria-label')).toContain('em comparação');
    expect(valueButtons()[0].textContent).toContain('↔');
    expect(fixture.nativeElement.querySelector('[aria-live="polite"]').textContent)
      .toContain('Comparando posições 1 e 2');
    while (simulation.canGoForward()) simulation.next();
    fixture.detectChanges();
    expect(valueButtons().every((button) => button.classList.contains('bg-sorted'))).toBe(true);
    expect(valueButtons()[0].getAttribute('aria-label')).toContain('posição definitiva');
    expect(valueButtons()[0].textContent).toContain('✓');
    simulation.previous();
    fixture.detectChanges();
    expect(valueButtons()[0].classList.contains('bg-sorted')).toBe(false);
    expect(valueButtons()[1].classList.contains('bg-sorted')).toBe(true);
    fixture.destroy();
  });

  it('animates the same items across wrapped positions and reverses a swap', () => {
    const fixture = TestBed.createComponent(BubbleSortPage);
    const list = TestBed.inject(SortingListService);
    const simulation = TestBed.inject(BubbleSortSimulationService);
    list.applySnapshot([{ id: 1, value: 2 }, { id: 2, value: 1 }, { id: 3, value: 2 }]);
    const rect = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const index = Array.from(this.parentElement?.querySelectorAll('[data-sorting-id]') ?? []).indexOf(this);
      return { left: index === 0 ? 80 : 0, top: index === 0 ? 0 : 80 } as DOMRect;
    });
    const animations: { cancel: jest.Mock; onfinish: (() => void) | null }[] = [];
    const animate = jest.fn((_keyframes: Keyframe[]) => {
      const animation = { cancel: jest.fn(), onfinish: null };
      animations.push(animation);
      return animation;
    });
    const originalAnimate = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate');
    Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate });
    try {
      fixture.detectChanges();
      const original = Array.from(fixture.nativeElement.querySelectorAll('[data-sorting-id]'));
      simulation.start();
      simulation.pause();
      fixture.detectChanges();
      simulation.next();
      fixture.detectChanges();
      simulation.next();
      fixture.detectChanges();
      const swapped = Array.from(fixture.nativeElement.querySelectorAll('[data-sorting-id]'));
      expect(swapped).toEqual([original[1], original[0], original[2]]);
      expect(animate).toHaveBeenCalledTimes(2);
      expect(animate.mock.calls[0][0][0]['transform']).toContain('80px');
      simulation.previous();
      fixture.detectChanges();
      expect(animations[0].cancel).toHaveBeenCalled();
      expect(animate).toHaveBeenCalledTimes(4);
      expect(Array.from(fixture.nativeElement.querySelectorAll('[data-sorting-id]'))).toEqual(original);
    } finally {
      fixture.destroy();
      rect.mockRestore();
      if (originalAnimate) Object.defineProperty(HTMLElement.prototype, 'animate', originalAnimate);
      else Reflect.deleteProperty(HTMLElement.prototype, 'animate');
    }
  });

  it('skips swap animation when reduced motion is requested', () => {
    const fixture = TestBed.createComponent(BubbleSortPage);
    const list = TestBed.inject(SortingListService);
    const simulation = TestBed.inject(BubbleSortSimulationService);
    list.applySnapshot([{ id: 1, value: 2 }, { id: 2, value: 1 }]);
    const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
    const originalAnimate = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate');
    const animate = jest.fn();
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({ matches: true }) });
    Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate });
    try {
      fixture.detectChanges();
      simulation.start();
      simulation.pause();
      fixture.detectChanges();
      simulation.next();
      fixture.detectChanges();
      simulation.next();
      fixture.detectChanges();
      expect(animate).not.toHaveBeenCalled();
      expect(list.values()).toEqual([1, 2]);
    } finally {
      fixture.destroy();
      if (originalMatchMedia) Object.defineProperty(window, 'matchMedia', originalMatchMedia);
      else Reflect.deleteProperty(window, 'matchMedia');
      if (originalAnimate) Object.defineProperty(HTMLElement.prototype, 'animate', originalAnimate);
      else Reflect.deleteProperty(HTMLElement.prototype, 'animate');
    }
  });
});
