import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CodeEditorState } from './code-editor.state';
import { CodeEditorEffects } from '../effects/code-editor.effects';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  private codeEditorStateSubject: BehaviorSubject<CodeEditorState> = new BehaviorSubject<CodeEditorState>(null);
  private codeEditorEffectSubject: BehaviorSubject<CodeEditorEffects> = new BehaviorSubject<CodeEditorEffects>(null);
  private program: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private lang: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public codeEditorState$: Observable<CodeEditorState>;
  public codeEditorEffect$: Observable<CodeEditorEffects>;

  constructor() {
    this.codeEditorState$ = this.codeEditorStateSubject.asObservable();
    this.codeEditorEffect$ = this.codeEditorEffectSubject.asObservable();
  }

  get codeEditorState(): CodeEditorState {
    return this.codeEditorStateSubject.value;
  }

  set codeEditorState(value: CodeEditorState) {
    this.codeEditorStateSubject.next(value);
  }

  get codeEditorEffect(): CodeEditorEffects {
    return this.codeEditorEffectSubject.value;
  }

  set codeEditorEffect(value: CodeEditorEffects) {
    this.codeEditorEffectSubject.next(value);
  }

  get programValue(): string {
    return this.program.value;
  }

  set programValue(value: string) {
    this.program.next(value);
  }

  get langValue(): string {
    return this.lang.value;
  }

  set langValue(value: string) {
    this.lang.next(value);
  }
}
