import { Component, OnInit } from '@angular/core';
import { RobotState } from 'src/app/state/robot.state';
import { BackEndState } from 'src/app/state/backend.state';
import { ConnectionStatus } from 'src/app/domain/connection.status';

@Component({
  selector: 'app-connect.wired',
  templateUrl: './connect.wired.dialog.html',
  styleUrls: ['./connect.wired.dialog.scss']
})
export class ConnectWiredDialog implements OnInit {
  constructor(public robotState: RobotState, private backEndState: BackEndState) { }

  ngOnInit() {
  }
  public onDetectRobotsClick() {
    this.backEndState.setconnectionStatus(ConnectionStatus.StartPairing);
  }

  public onInstallDriverClick() {
    this.robotState.setIsRobotDriverInstalling(true);
  }
}
