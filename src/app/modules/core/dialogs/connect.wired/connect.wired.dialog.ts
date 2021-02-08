import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-connect.wired',
  templateUrl: './connect.wired.dialog.html',
  styleUrls: ['../dialog-styles.scss', './connect.wired.dialog.scss']
})
// tslint:disable-next-line: component-class-suffix
export class ConnectWiredDialog {
  constructor(
    public dialogRef: MatDialogRef<ConnectWiredDialog>
  ) { }

  public onDialogClosed() {
    this.dialogRef.close();
  }
}
