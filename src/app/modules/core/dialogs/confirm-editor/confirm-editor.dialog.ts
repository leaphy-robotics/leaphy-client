import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-confirm-editor',
  templateUrl: './confirm-editor.dialog.html',
  styleUrls: ['../dialog-styles.scss', './confirm-editor.dialog.scss']
})

export class ConfirmEditorDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmEditorDialog>,
    public appState: AppState
  ) { }

  public onEditorChangeConfirmed() {
    this.appState.setIsCodeEditorToggleConfirmed(true);
    this.dialogRef.close();
  }
  public onEditorChangeCancelled() {
    this.dialogRef.close();
  }
}
