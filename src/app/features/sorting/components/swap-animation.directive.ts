import { afterEveryRender, Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { BubbleSortSimulationService } from '../services/bubble-sort-simulation.service';

interface Position {
  readonly x: number;
  readonly y: number;
}

/** Anima a mudança de posição dos elementos existentes após a renderização. */
@Directive({ selector: '[appSwapAnimation]' })
export class SwapAnimationDirective implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly simulation = inject(BubbleSortSimulationService);
  private positions = new Map<string, Position>();
  private previousIndex = -1;
  private previousSteps = this.simulation.history().steps;
  private animations: Animation[] = [];

  constructor() {
    afterEveryRender({ mixedReadWrite: () => this.updatePositions() });
  }

  ngOnDestroy(): void {
    this.cancelAnimations();
  }

  private updatePositions(): void {
    const history = this.simulation.history();
    const changed = history.steps !== this.previousSteps || history.currentIndex !== this.previousIndex;
    if (!changed && this.animations.length) return;
    if (changed) this.cancelAnimations();

    const elements = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('[data-sorting-id]'));
    const nextPositions = new Map<string, Position>();
    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      nextPositions.set(element.dataset['sortingId']!, { x: rect.left, y: rect.top });
    }

    const sameHistory = history.steps === this.previousSteps;
    const adjacent = Math.abs(history.currentIndex - this.previousIndex) === 1;
    const swap = history.steps[history.currentIndex]?.swapped || history.steps[this.previousIndex]?.swapped;
    const reducedMotion = typeof window === 'undefined' ||
      (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (sameHistory && adjacent && swap && !reducedMotion) {
      for (const element of elements) {
        const id = element.dataset['sortingId']!;
        const before = this.positions.get(id);
        const after = nextPositions.get(id);
        if (!before || !after || typeof element.animate !== 'function') continue;
        const x = before.x - after.x;
        const y = before.y - after.y;
        if (x || y) {
          const animation = element.animate(
            [{ transform: `translate(${x}px, ${y}px)` }, { transform: 'translate(0, 0)' }],
            { duration: 200, easing: 'ease-out' },
          );
          this.animations.push(animation);
          animation.onfinish = () => {
            this.animations = this.animations.filter((active) => active !== animation);
          };
        }
      }
    }

    this.positions = nextPositions;
    this.previousIndex = history.currentIndex;
    this.previousSteps = history.steps;
  }

  private cancelAnimations(): void {
    for (const animation of this.animations) animation.cancel();
    this.animations = [];
  }
}
