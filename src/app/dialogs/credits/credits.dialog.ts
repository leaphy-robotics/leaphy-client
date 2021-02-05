import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.dialog.html',
  styleUrls: ['./credits.dialog.scss']
})
export class CreditsDialog  {
  constructor(
    public dialogRef: MatDialogRef<CreditsDialog>
  ) { }

  public onDialogClosed() {
    this.dialogRef.close();
  }
}
