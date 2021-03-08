import { Injectable } from "@angular/core";
import { filter, withLatestFrom } from "rxjs/operators";
import { AppState } from "../state/app.state";
import { BlocklyEditorState } from "../state/blockly-editor.state";
import { CodeEditorState } from "../state/code-editor.state";

import * as ace from "ace-builds";

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Editor that different state changes have
export class CodeEditorEffects {
    constructor(private codeEditorState: CodeEditorState, private appState: AppState, private blocklyState: BlocklyEditorState) {

        this.codeEditorState.aceElement$
            .pipe(filter(element => !!element))
            .subscribe(element => {
                ace.config.set("fontSize", "14px");
                //ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
                const aceEditor = ace.edit(element.nativeElement);
                aceEditor.setTheme('ace/theme/solarized_light');
                aceEditor.session.setMode('ace/mode/c_cpp');
                aceEditor.setOptions({
                    enableBasicAutocompletion: true
                });
                this.codeEditorState.setAceEditor(aceEditor);
            });


        this.codeEditorState.aceEditor$
            .pipe(filter(aceEditor => !!aceEditor))
            .pipe(withLatestFrom(this.blocklyState.code$))
            .subscribe(([aceEditor, code]) => {
                aceEditor.session.setValue(code);
                aceEditor.on("change", () => {
                    this.blocklyState.setCode(aceEditor.getValue());
                });
            });
    }
}
