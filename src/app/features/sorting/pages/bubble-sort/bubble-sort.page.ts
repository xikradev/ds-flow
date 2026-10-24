import { Component } from '@angular/core';
import { SimulationControlsComponent } from '../../components/simulation-controls/simulation-controls.component';
import { AppHeaderComponent } from '../../../../shared/ui/app-header/app-header.component';

@Component({
  selector: 'app-bubble-sort-page',
  imports: [AppHeaderComponent, SimulationControlsComponent],
  templateUrl: './bubble-sort.page.html',
})
export class BubbleSortPage {}
