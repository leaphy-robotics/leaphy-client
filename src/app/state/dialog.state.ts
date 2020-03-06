import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { ConnectDialogComponent } from '../dialogs/connect-dialog/connect-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogState {

  private isConnectDialogVisibleSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isConnectDialogVisible$ = this.isConnectDialogVisibleSubject$.asObservable();

  private connectDialogSubject$: BehaviorSubject<MatDialogRef<ConnectDialogComponent, any>> = new BehaviorSubject(null);
  public connectDialog$ = this.connectDialogSubject$.asObservable();

  public setIsConnectDialogVisible(isOpen: boolean) {
    this.isConnectDialogVisibleSubject$.next(isOpen);
  }

  public setConnectDialog(dialogRef: MatDialogRef<ConnectDialogComponent, any>) {
    this.connectDialogSubject$.next(dialogRef);
  }
}
