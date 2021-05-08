import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { distinctUntilChanged, scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DialogState {

  private isConnectDialogVisibleSubject$ = new BehaviorSubject(false);
  public isConnectDialogVisible$ = this.isConnectDialogVisibleSubject$.asObservable()
    .pipe(scan((current) => !current));

  private connectDialogSubject$: BehaviorSubject<MatDialogRef<unknown, any>> = new BehaviorSubject(null);
  public connectDialog$ = this.connectDialogSubject$.asObservable();

  private isSerialOutputWindowOpenSubject$ = new BehaviorSubject(false);
  public isSerialOutputWindowOpen$ = this.isSerialOutputWindowOpenSubject$.asObservable()
    .pipe(distinctUntilChanged());

  private isInfoDialogVisibleSubject$ = new BehaviorSubject(false);
    public isInfoDialogVisible$ = this.isInfoDialogVisibleSubject$.asObservable();
  
  public toggleIsConnectDialogVisible() {
    this.isConnectDialogVisibleSubject$.next(true);
  }

  public setConnectDialog(dialogRef: MatDialogRef<unknown, any>) {
    this.connectDialogSubject$.next(dialogRef);
  }

  public setIsSerialOutputWindowOpen(isOpen: boolean) {
    this.isSerialOutputWindowOpenSubject$.next(isOpen);
  }

  public setIsInfoDialogVisible(isVisible: boolean) {
    this.isInfoDialogVisibleSubject$.next(isVisible);
  }
}
