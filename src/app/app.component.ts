import { Component } from '@angular/core';
import { AppState } from './state/app.state';
import { MatSelectChange } from '@angular/material/select';
import { RobotWiredState } from './state/robot.wired.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public appState: AppState, public robotWiredState: RobotWiredState){

  }
  title = 'Leaphy Robocoder';

  onRobotSelectionChange(event: MatSelectChange){
    this.appState.setSelectedRobotType(event.value);
  }
}
