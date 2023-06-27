import { ElementRef, Injectable, Optional, Inject, InjectionToken } from "@angular/core";
import * as Ace from "ace-builds";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, tap, withLatestFrom } from "rxjs/operators";
import { GlobalVariablesService } from "./global.state";

export const CODE_EDITOR_TYPE = new InjectionToken<string>('codeEditorType');

@Injectable({
    providedIn: 'root',
})
export class CodeEditorState {
    private program: string = '';
    public program$: Observable<string>;
    private aceElementSubject$: BehaviorSubject<ElementRef<HTMLElement>>;
    public aceElement$: Observable<ElementRef<HTMLElement>>;
    private aceEditorSubject$: BehaviorSubject<Ace.Ace.Editor>;
    public aceEditor$: Observable<Ace.Ace.Editor>;
    private startCodeSubject$: BehaviorSubject<string>;
    public startCode$: Observable<string>;
    private codeSubject$: BehaviorSubject<string>;
    public code$: Observable<string>;
    public isDirty$: Observable<boolean>;
    public lang: string = '';

    constructor(
        @Optional() @Inject(CODE_EDITOR_TYPE) private codeType: string,
        private globalVariables: GlobalVariablesService
    ) {
        console.log('code editor type: ' + codeType);
        if (this.codeType == 'python') {
            console.log('python');
            this.program = `from leaphy_micropython import *`;
            this.lang = 'python';
        } else if (this.codeType == 'arduino') {
            console.log('arduino');
            this.program = `void leaphyProgram() {
}

void setup() {
    leaphyProgram();
}

void loop() {

}`;
            this.lang = 'arduino';
        } else {
            console.error('Unknown code editor type: ' + codeType);
        }

        globalVariables.programValue = this.program;
        globalVariables.langValue = this.lang;

        globalVariables.codeEditorState = this;

        this.program$ = new BehaviorSubject<string>(this.program);

        this.aceElementSubject$ = new BehaviorSubject<ElementRef<HTMLElement>>(null);
        this.aceElement$ = this.aceElementSubject$.asObservable();

        this.aceEditorSubject$ = new BehaviorSubject<Ace.Ace.Editor>(null);
        this.aceEditor$ = this.aceEditorSubject$.asObservable();

        this.startCodeSubject$ = new BehaviorSubject<string>(this.program);
        this.startCode$ = this.startCodeSubject$.asObservable();

        this.codeSubject$ = new BehaviorSubject<string>(this.program);

        this.code$ = this.codeSubject$.asObservable();

        this.isDirty$ = this.code$
            .pipe(withLatestFrom(this.startCode$))
            .pipe(map(([code, original]) => code !== original));

        this.globalVariables.codeEditorState = this;
    }

    get programValue(): string {
        return this.program;
    }

    public setAceEditor(editor: Ace.Ace.Editor) {
        this.aceEditorSubject$.next(editor);
        // update the global state
        this.globalVariables.codeEditorState = this;
    }

    public setAceElement(element: ElementRef<HTMLElement>) {
        this.aceElementSubject$.next(element);
        // update the global state
        this.globalVariables.codeEditorState = this;
    }

    public setOriginalCode(program: string) {
        console.log("setOriginal", program);
        this.startCodeSubject$.next(program);
        // update the global state
        this.globalVariables.codeEditorState = this;
    }

    public setCode(program: string) {
        console.log("setCode", program);
        this.codeSubject$.next(program);
        // update the global state
        this.globalVariables.codeEditorState = this;
    }
}
