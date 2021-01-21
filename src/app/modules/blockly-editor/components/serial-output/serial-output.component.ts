import { Component, OnInit } from '@angular/core';
import { RobotWiredState } from 'src/app/state/robot.wired.state';

@Component({
  selector: 'app-serial-output',
  templateUrl: './serial-output.component.html',
  styleUrls: ['./serial-output.component.scss']
})
export class SerialOutputComponent implements OnInit {

  constructor(public robotWiredState: RobotWiredState) { }

  ngOnInit() {
    //https://stackoverflow.com/a/45655337/1056283
  }

}
