import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SortingPlaybackState } from '../../state/sorting-simulation';

@Component({
  selector: 'app-simulation-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './simulation-controls.component.html',
})
export class SimulationControlsComponent {
  readonly playback = input<SortingPlaybackState>('idle');
  readonly canStart = input(false);
  readonly canGoBack = input(false);
  readonly canGoForward = input(false);
  readonly previousStep = output<void>();
  readonly togglePlayback = output<void>();
  readonly nextStep = output<void>();
}
