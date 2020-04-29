import { Component } from '@angular/core';
import { RobotState } from './state/robot.state';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public robotState: RobotState){

  }
  title = 'Leaphy Robocoder';

  onRobotSelectionChange(event: MatSelectChange){
    this.robotState.setRobotType(event.value);
  }
}
