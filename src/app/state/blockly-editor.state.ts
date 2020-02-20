import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SketchStatus } from '../domain/sketch.status';
import { scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlocklyEditorState {

  private robotIdSubject$ = new BehaviorSubject('robot001');
  public robotId$ = this.robotIdSubject$.asObservable();

  private initialCode = `void setup()
{

}


void loop()
{

}
  `;
  private codeSubject$ = new BehaviorSubject(this.initialCode);
  public code$ = this.codeSubject$.asObservable();

  private sketchStatusSubject$: BehaviorSubject<SketchStatus> = new BehaviorSubject(SketchStatus.UnableToSend);
  public sketchStatus$ = this.sketchStatusSubject$.asObservable();

  private sketchStatusMessageSubject$ = new BehaviorSubject('');
  public sketchStatusMessage$ = this.sketchStatusMessageSubject$.asObservable();

  private isSideNavOpenSubject$ = new BehaviorSubject(false);
  public isSideNavOpen$ = this.isSideNavOpenSubject$.asObservable()
    .pipe(scan((current) => !current));

  private isConnectDialogVisibleSubject$ = new BehaviorSubject(false);
  public isConnectDialogVisibleOpen$ = this.isConnectDialogVisibleSubject$.asObservable();

  public setRobotId(robotId: string): void {
    this.robotIdSubject$.next(robotId);
  }

  public setCode(code: string): void {
    this.codeSubject$.next(code);
  }

  public setSketchStatus(status: SketchStatus) {
    this.sketchStatusSubject$.next(status);
  }

  public setSketchStatusMessage(message: string) {
    this.sketchStatusMessageSubject$.next(message);
  }

  public setIsSideNavOpen(isOpen: boolean) {
    this.isSideNavOpenSubject$.next(isOpen);
  }

  public setIsConnectDialogVisible(isVisible: boolean) {
    this.isConnectDialogVisibleSubject$.next(isVisible);
  }
}
