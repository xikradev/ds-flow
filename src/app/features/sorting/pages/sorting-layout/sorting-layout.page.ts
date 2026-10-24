import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SimulationControlsComponent } from '../../components/simulation-controls/simulation-controls.component';
import { AppHeaderComponent } from '../../../../shared/ui/app-header/app-header.component';

@Component({
  selector: 'app-sorting-layout-page',
  imports: [AppHeaderComponent, RouterOutlet, SimulationControlsComponent],
  templateUrl: './sorting-layout.page.html',
})
export class SortingLayoutPage {}
