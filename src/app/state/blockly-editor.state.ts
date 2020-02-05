import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SketchStatus } from '../domain/sketch.status';

@Injectable({
  providedIn: 'root'
})
export class BlocklyEditorState {

  private robotIdSubject$ = new BehaviorSubject('robot001');
  public robotId$ = this.robotIdSubject$.asObservable();

  private codeSubject$ = new BehaviorSubject('');
  public code$ = this.codeSubject$.asObservable();

  private sketchStatusSubject$: BehaviorSubject<SketchStatus> = new BehaviorSubject(SketchStatus.UnableToSend);
  public sketchStatus$ = this.sketchStatusSubject$.asObservable();

  private sketchStatusMessageSubject$ = new BehaviorSubject('');
  public sketchStatusMessage$ = this.sketchStatusMessageSubject$.asObservable();

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
}
