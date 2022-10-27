import { Component } from '@angular/core';
import { RobotWiredState } from 'src/app/state/robot.wired.state';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-install-driver',
  templateUrl: './install-driver.dialog.html',
  styleUrls: ['../dialog-styles.scss', './install-driver.dialog.scss']
})

export class InstallDriverDialog {
  constructor(
    public dialogRef: MatDialogRef<InstallDriverDialog>,
    public robotWiredState: RobotWiredState
  ) { }

  public onInstallDriverClicked() {
    this.robotWiredState.setIsRobotDriverInstalling(true);
    this.dialogRef.close();
  }
}
