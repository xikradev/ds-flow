/** Um valor mantém sua identidade mesmo quando há outros valores iguais. */
export interface SortingListItem {
  readonly id: number;
  readonly value: number;
}

/** Snapshot completo da lista e das indicações visuais de uma etapa. */
export interface SortingStep {
  readonly items: readonly SortingListItem[];
  readonly comparing: readonly [number, number] | null;
  readonly sortedPositions: readonly number[];
  readonly swapped: boolean;
}

export type SortingPlaybackState = 'idle' | 'playing' | 'paused' | 'completed';

/**
 * Histórico vazio usa currentIndex -1. Caso contrário, currentIndex está entre
 * 0 e steps.length - 1, inclusive; não há navegação além desses limites.
 */
export interface SortingHistory {
  readonly steps: readonly SortingStep[];
  readonly currentIndex: number;
}
