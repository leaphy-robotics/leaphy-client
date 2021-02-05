import { ElementRef, Injectable } from "@angular/core";
import { Ace } from "ace-builds";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CodeEditorState {

    private aceElementSubject$ = new BehaviorSubject<ElementRef<HTMLElement>>(null);
    public aceElement$ = this.aceElementSubject$.asObservable();

    private aceEditorSubject$ = new BehaviorSubject<Ace.Editor>(null);
    public aceEditor$ = this.aceEditorSubject$.asObservable();

    public setAceElement(element: ElementRef<HTMLElement>) {
        this.aceElementSubject$.next(element);
    }

    public setAceEditor(editor: Ace.Editor){
        this.aceEditorSubject$.next(editor);
    }
}