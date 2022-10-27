import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-connect.cloud',
  templateUrl: './connect.cloud.dialog.html',
  styleUrls: ['../dialog-styles.scss', './connect.cloud.dialog.scss']
})

export class ConnectCloudDialog {

  public robotId: string;
  constructor(
    public dialogRef: MatDialogRef<ConnectCloudDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.robotId = this.data.robotId;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
