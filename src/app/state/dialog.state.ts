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

  private isSerialOutputFocusSubject$ = new BehaviorSubject(false);
  public isSerialOutputFocus$ = this.isSerialOutputFocusSubject$.asObservable();

  private isSerialGraphOutputSelectedSubject$ = new BehaviorSubject(false);
  public isSerialGraphOutputSelected$ = this.isSerialGraphOutputSelectedSubject$.asObservable();

  private isInfoDialogVisibleSubject$ = new BehaviorSubject(false);
  public isInfoDialogVisible$ = this.isInfoDialogVisibleSubject$.asObservable();

  private isEditorTypeChangeConfirmationDialogVisibleSubject$ = new BehaviorSubject(false);
  public isEditorTypeChangeConfirmationDialogVisible$ = this.isEditorTypeChangeConfirmationDialogVisibleSubject$.asObservable();

  public toggleIsConnectDialogVisible() {
    this.isConnectDialogVisibleSubject$.next(true);
  }

  public setConnectDialog(dialogRef: MatDialogRef<unknown, any>) {
    this.connectDialogSubject$.next(dialogRef);
  }

  public setIsSerialOutputWindowOpen(isOpen: boolean) {
    this.isSerialOutputWindowOpenSubject$.next(isOpen);
  }

  public setIsSerialOutputFocus(isFocus: boolean) {
    this.isSerialOutputFocusSubject$.next(isFocus);
  }

  public setIsSerialGraphOutputSelected(isSelected: boolean) {
    this.isSerialGraphOutputSelectedSubject$.next(isSelected);
  }

  public setIsInfoDialogVisible(isVisible: boolean) {
    this.isInfoDialogVisibleSubject$.next(isVisible);
  }

  public setIsEditorTypeChangeConfirmationDialogVisible(isVisible: boolean) {
    this.isEditorTypeChangeConfirmationDialogVisibleSubject$.next(isVisible);
  }
}
