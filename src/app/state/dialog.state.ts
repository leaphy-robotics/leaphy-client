import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DialogState {

  private isConnectDialogVisibleSubject$ = new BehaviorSubject(false);
  public isConnectDialogVisible$ = this.isConnectDialogVisibleSubject$.asObservable()
    .pipe(scan((current) => !current));

  private connectDialogSubject$: BehaviorSubject<MatDialogRef<unknown, any>> = new BehaviorSubject(null);
  public connectDialog$ = this.connectDialogSubject$.asObservable();

  public toggleIsConnectDialogVisible() {
    this.isConnectDialogVisibleSubject$.next(true);
  }

  public setConnectDialog(dialogRef: MatDialogRef<unknown, any>) {
    this.connectDialogSubject$.next(dialogRef);
  }
}
