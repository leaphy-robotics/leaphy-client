import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CodeEditorState } from './code-editor.state';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  private codeEditorStateSubject: BehaviorSubject<CodeEditorState> = new BehaviorSubject<CodeEditorState>(null);

  public codeEditorState$: Observable<CodeEditorState>;

  constructor() {
    this.codeEditorStateSubject.next(new CodeEditorState('arduino', this));
    this.codeEditorState$ = this.codeEditorStateSubject.asObservable();
  }

  get codeEditorState(): CodeEditorState {
    return this.codeEditorStateSubject.value;
  }

  set codeEditorState(value: CodeEditorState) {
    console.log('set codeEditorState', value);
    this.codeEditorStateSubject.next(value);
  }
}
