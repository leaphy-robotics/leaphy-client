import { Component, OnInit } from '@angular/core';
import { BackEndState } from 'src/app/state/backend.state';
import { ConnectionStatus } from 'src/app/domain/connection.status';
import { RobotWiredState } from 'src/app/state/robot.wired.state';

@Component({
  selector: 'app-connect.wired',
  templateUrl: './connect.wired.dialog.html',
  styleUrls: ['./connect.wired.dialog.scss']
})
export class ConnectWiredDialog implements OnInit {
  constructor(public robotWiredState: RobotWiredState, private backEndState: BackEndState) { }

  ngOnInit() {
  }
  public onDetectRobotsClick() {
    this.backEndState.setconnectionStatus(ConnectionStatus.StartPairing);
  }

  public onInstallDriverClick() {
    this.robotWiredState.setIsRobotDriverInstalling(true);
  }
}
