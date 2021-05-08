import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info.dialog.html',
  styleUrls: ['./info.dialog.scss']
})
export class InfoDialog  {
  constructor(
    public dialogRef: MatDialogRef<InfoDialog>
  ) { }

  public onDialogClosed() {
    this.dialogRef.close();
  }
}
