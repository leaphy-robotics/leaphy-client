import { ElementRef, Injectable } from "@angular/core";
import { Ace } from "ace-builds";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, tap, withLatestFrom } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CodeEditorState {

    private originalProgram =`void leaphyProgram() {
}

void setup() {
    leaphyProgram();
}

void loop() {

}`
    
    constructor(){
        this.isDirty$ = this.code$
            .pipe(withLatestFrom(this.originalCode$))
            .pipe(map(([code, original]) => code !== original))
    }

    private aceElementSubject$ = new BehaviorSubject<ElementRef<HTMLElement>>(null);
    public aceElement$ = this.aceElementSubject$.asObservable();

    private aceEditorSubject$ = new BehaviorSubject<Ace.Editor>(null);
    public aceEditor$ = this.aceEditorSubject$.asObservable();

    private originalCodeSubject$ = new BehaviorSubject<string>(this.originalProgram);
    public originalCode$ = this.originalCodeSubject$.asObservable();

    private codeSubject$ = new BehaviorSubject<string>(this.originalProgram);
    
    public code$ = this.codeSubject$.asObservable();

    public isDirty$: Observable<boolean>;

    public setAceElement(element: ElementRef<HTMLElement>) {
        this.aceElementSubject$.next(element);
    }

    public setAceEditor(editor: Ace.Editor){
        this.aceEditorSubject$.next(editor);
    }

    public setOriginalCode(program: string){
        this.originalCodeSubject$.next(program);
    }

    public setCode(program: string){
        this.codeSubject$.next(program);
    }

}