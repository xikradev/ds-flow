import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SimulationControlsComponent } from '../../components/simulation-controls/simulation-controls.component';
import { AppHeaderComponent } from '../../../../shared/ui/app-header/app-header.component';
import { BubbleSortSimulationService } from '../../services/bubble-sort-simulation.service';
import { SortingListService } from '../../services/sorting-list.service';

@Component({
  selector: 'app-sorting-layout-page',
  imports: [AppHeaderComponent, RouterOutlet, SimulationControlsComponent],
  providers: [SortingListService, BubbleSortSimulationService],
  templateUrl: './sorting-layout.page.html',
})
export class SortingLayoutPage {
  readonly simulation = inject(BubbleSortSimulationService);

  togglePlayback(): void {
    switch (this.simulation.playback()) {
      case 'playing':
        this.simulation.pause();
        break;
      case 'completed':
        this.simulation.restart();
        break;
      default:
        this.simulation.start();
    }
  }
}
