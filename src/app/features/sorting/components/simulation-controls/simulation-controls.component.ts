import { Component, output } from '@angular/core';

@Component({
  selector: 'app-simulation-controls',
  templateUrl: './simulation-controls.component.html',
})
export class SimulationControlsComponent {
  readonly previousStep = output<void>();
  readonly togglePlayback = output<void>();
  readonly nextStep = output<void>();
}
