import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { SortingHistory, SortingPlaybackState } from '../state/sorting-simulation';
import { BubbleSortService } from './bubble-sort.service';
import { SortingListService } from './sorting-list.service';

const STEP_INTERVAL_MS = 1000;

@Injectable()
export class BubbleSortSimulationService implements OnDestroy {
  private readonly algorithm = inject(BubbleSortService);
  private readonly list = inject(SortingListService);
  private readonly historyState = signal<SortingHistory>({ steps: [], currentIndex: -1 });
  private readonly playbackState = signal<SortingPlaybackState>('idle');
  private timer: ReturnType<typeof setInterval> | null = null;

  readonly history = this.historyState.asReadonly();
  readonly playback = this.playbackState.asReadonly();
  readonly currentStep = computed(() => {
    const { steps, currentIndex } = this.historyState();
    return steps[currentIndex] ?? null;
  });
  readonly canGoBack = computed(() => this.historyState().currentIndex > 0);
  readonly canGoForward = computed(() => {
    const { steps, currentIndex } = this.historyState();
    return currentIndex >= 0 && currentIndex < steps.length - 1;
  });

  /** Prepara um novo histórico a partir da lista exibida no momento. */
  prepare(): void {
    this.stopTimer();
    this.playbackState.set('idle');
    const steps = this.algorithm.generateSteps(this.list.items());
    this.historyState.set({ steps, currentIndex: 0 });
    this.list.applySnapshot(steps[0].items);
  }

  start(): void {
    if (this.playbackState() === 'playing') return;
    if (this.historyState().currentIndex === -1) this.prepare();
    if (!this.canGoForward()) return;

    this.playbackState.set('playing');
    this.timer = setInterval(() => {
      this.selectStep(this.historyState().currentIndex + 1);
      if (!this.canGoForward()) this.pause();
    }, STEP_INTERVAL_MS);
  }

  pause(): void {
    this.stopTimer();
    if (this.playbackState() === 'playing') this.playbackState.set('paused');
  }

  next(): void {
    this.pause();
    if (this.canGoForward()) {
      this.selectStep(this.historyState().currentIndex + 1);
    }
  }

  previous(): void {
    this.pause();
    if (this.canGoBack()) {
      this.selectStep(this.historyState().currentIndex - 1);
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private stopTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private selectStep(currentIndex: number): void {
    const history = this.historyState();
    this.list.applySnapshot(history.steps[currentIndex].items);
    this.historyState.set({ ...history, currentIndex });
  }
}
