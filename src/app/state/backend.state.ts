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

  private sketchLocationSubject$ = new BehaviorSubject<string>(null);
  public sketchLocation$ = this.sketchLocationSubject$.asObservable();

  private isViewLogClickedSubject$ = new BehaviorSubject<boolean>(false);
  public isViewLogClicked$ = this.isViewLogClickedSubject$.asObservable();

  private isDriverInstallingSubject$ = new BehaviorSubject<boolean>(false);
  public isDriverInstalling$ = this.isDriverInstallingSubject$.asObservable();

  public setconnectionStatus(status: ConnectionStatus) {
    this.connectionStatusSubject$.next(status);
  }

  public setBackendMessage(message: BackEndMessage) {
    this.backEndMessagesSubject$.next(message);
  }

  public setSketchLocation(location: string) {
    this.sketchLocationSubject$.next(location);
  }

  public setIsViewLogClicked() {
    this.isViewLogClickedSubject$.next(true);
  }

  public setIsDriverInstalling(install: boolean) {
    this.isDriverInstallingSubject$.next(install);
  }
}
