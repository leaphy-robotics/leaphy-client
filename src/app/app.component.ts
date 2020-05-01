import { Component } from '@angular/core';
import { AppState } from './state/app.state';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public appState: AppState){

  }
  title = 'Leaphy Robocoder';

  onRobotSelectionChange(event: MatSelectChange){
    this.appState.setSelectedRobotType(event.value);
  }
}
