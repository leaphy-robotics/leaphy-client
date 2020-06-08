import { Component } from '@angular/core';
import { BackEndState } from 'src/app/state/backend.state';
import { ConnectionStatus } from 'src/app/domain/connection.status';
import { RobotWiredState } from 'src/app/state/robot.wired.state';
import { MatSelectChange } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogState } from 'src/app/state/dialog.state';

@Component({
  selector: 'app-connect.wired',
  templateUrl: './connect.wired.dialog.html',
  styleUrls: ['./connect.wired.dialog.scss']
})
// tslint:disable-next-line: component-class-suffix
export class ConnectWiredDialog {
  constructor(
    public dialogRef: MatDialogRef<ConnectWiredDialog>,
    public robotWiredState: RobotWiredState,
    public backEndState: BackEndState,
    private dialogState: DialogState
  ) { }

  public onDeviceSelectionChange(event: MatSelectChange) {
    this.robotWiredState.setSelectedSerialDevice(event.value);
    this.dialogState.toggleIsConnectDialogVisible();
  }

  public onDoneClick(): void {
    this.dialogState.toggleIsConnectDialogVisible();
  }

  public onDetectRobotsClick() {
    this.backEndState.setconnectionStatus(ConnectionStatus.DetectingDevices);
  }

  public onInstallUsbDriverClick() {
    this.robotWiredState.setIsRobotDriverInstalling(true);
  }
}
