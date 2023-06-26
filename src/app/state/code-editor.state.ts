import { ElementRef, Injectable, Optional, Inject, InjectionToken, } from "@angular/core";
import { Ace } from "ace-builds";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, tap, withLatestFrom } from "rxjs/operators";
import { GlobalVariablesService } from "./global.state";

export const CODE_EDITOR_TYPE = new InjectionToken<string>('codeEditorType');

@Injectable({
    providedIn: 'root',
})
export class CodeEditorState  {



    private originalProgram = `void leaphyProgram() {
}

void setup() {
    leaphyProgram();
}

void loop() {

}`;

    private pythonProgram = `from leaphy_micropython import *`;

    private program: string = '';
    public program$: Observable<string>;
    private aceElementSubject$: BehaviorSubject<ElementRef<HTMLElement>>;
    public aceElement$: Observable<ElementRef<HTMLElement>>;
    private aceEditorSubject$: BehaviorSubject<Ace.Editor>;
    public aceEditor$: Observable<Ace.Editor>;
    private startCodeSubject$: BehaviorSubject<string>;
    public startCode$: Observable<string>;
    private codeSubject$: BehaviorSubject<string>;
    public code$: Observable<string>;
    public isDirty$: Observable<boolean>;
    public lang: string = '';


    constructor(@Optional() @Inject(CODE_EDITOR_TYPE) private codeType: string, private globalVariables: GlobalVariablesService) {

        if (this.codeType === 'python') {
            this.program = this.pythonProgram;
            this.lang = 'python';
        } else {
            this.program = this.originalProgram;
            this.lang = 'arduino';
        }
        this.program$ = new BehaviorSubject<string>(this.program);

        this.aceElementSubject$ = new BehaviorSubject<ElementRef<HTMLElement>>(null);
        this.aceElement$ = this.aceElementSubject$.asObservable();

        this.aceEditorSubject$ = new BehaviorSubject<Ace.Editor>(null);
        this.aceEditor$ = this.aceEditorSubject$.asObservable();

        this.startCodeSubject$ = new BehaviorSubject<string>(this.program);
        this.startCode$ = this.startCodeSubject$.asObservable();

        this.codeSubject$ = new BehaviorSubject<string>(this.program);

        this.code$ = this.codeSubject$.asObservable();

        this.isDirty$ = this.code$
            .pipe(withLatestFrom(this.startCode$))
            .pipe(map(([code, original]) => code !== original))

        this.globalVariables.codeEditorState = this;
    }





    public setAceElement(element: ElementRef<HTMLElement>) {
        this.aceElementSubject$.next(element);
    }

    public setAceEditor(editor: Ace.Editor){
        this.aceEditorSubject$.next(editor);
    }

    public setOriginalCode(program: string){
        console.log(program);
        this.startCodeSubject$.next(program);
    }

    public setCode(program: string){
        this.codeSubject$.next(program);
    }

}