import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlocklyState {

  private codeBehaviourSubject$ = new BehaviorSubject('');
  public code$ = this.codeBehaviourSubject$.asObservable();
  constructor() { }

  public setCode(code: string): void {
    this.codeBehaviourSubject$.next(code);
  }
}
