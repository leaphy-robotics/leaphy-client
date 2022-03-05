import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConnectionStatus } from '../domain/connection.status';
import { BackEndMessage } from '../domain/backend.message';

@Injectable({
  providedIn: 'root'
})
export class BackEndState {

  private connectionStatusSubject$: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Disconnected);
  public connectionStatus$ = this.connectionStatusSubject$.asObservable();

  private backEndMessagesSubject$ = new BehaviorSubject<BackEndMessage>(null);
  public backEndMessages$ = this.backEndMessagesSubject$.asObservable();

  private binaryLocationSubject$ = new BehaviorSubject<string>(null);
  public binaryLocation$ = this.binaryLocationSubject$.asObservable();

  private isViewLogClickedSubject$ = new BehaviorSubject<boolean>(false);
  public isViewLogClicked$ = this.isViewLogClickedSubject$.asObservable();

  private isDriverInstallingSubject$ = new BehaviorSubject<boolean>(false);
  public isDriverInstalling$ = this.isDriverInstallingSubject$.asObservable();

  private isLibrariesClearingSubject$ = new BehaviorSubject<boolean>(false);
  public isLibrariesClearing$ = this.isLibrariesClearingSubject$.asObservable();

  public setconnectionStatus(status: ConnectionStatus) {
    this.connectionStatusSubject$.next(status);
  }

  public setBackendMessage(message: BackEndMessage) {
    this.backEndMessagesSubject$.next(message);
  }

  public setSketchLocation(location: string) {
    this.binaryLocationSubject$.next(location);
  }

  public setIsViewLogClicked() {
    this.isViewLogClickedSubject$.next(true);
  }

  public setIsDriverInstalling(install: boolean) {
    this.isDriverInstallingSubject$.next(install);
  }

  public setIsLibrariesClearing(clear: boolean) {
    this.isLibrariesClearingSubject$.next(clear);
  }
}
