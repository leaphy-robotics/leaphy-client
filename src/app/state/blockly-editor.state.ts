import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SketchUploadStatus } from '../domain/sketch-upload.status';

@Injectable({
  providedIn: 'root'
})
export class BlocklyEditorState {

  private codeSubject$ = new BehaviorSubject('');
  public code$ = this.codeSubject$.asObservable();

  private sketchUploadStatusSubject$: BehaviorSubject<SketchUploadStatus> = new BehaviorSubject(SketchUploadStatus.Done);
  public sketchUploadStatus$ = this.sketchUploadStatusSubject$.asObservable();

  public setCode(code: string): void {
    this.codeSubject$.next(code);
  }

  public setSketchUploadStatus(status: SketchUploadStatus) {
    console.log(status);
    this.sketchUploadStatusSubject$.next(status);
  }
}
