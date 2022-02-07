import { Injectable } from "@angular/core";
import { filter, withLatestFrom } from "rxjs/operators";
import { AppState } from "../state/app.state";
import { BlocklyEditorState } from "../state/blockly-editor.state";
import { CodeEditorState } from "../state/code-editor.state";

import * as ace from "ace-builds";
import { BackEndState } from "../state/backend.state";

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Editor that different state changes have
export class CodeEditorEffects {
    constructor(private codeEditorState: CodeEditorState, private appState: AppState, private blocklyState: BlocklyEditorState, private backEndState: BackEndState) {

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


        // When the Ace Editor is set, set it with the current blockly code, and update the blockly code with changes
        this.codeEditorState.aceEditor$
            .pipe(filter(aceEditor => !!aceEditor))
            .pipe(withLatestFrom(this.blocklyState.code$))
            .subscribe(([aceEditor, code]) => {
                if (code) {
                    aceEditor.session.setValue(code);
                } else {
                    aceEditor.session.setValue(this.defaultProgram);
                }

                aceEditor.on("change", () => {
                    this.blocklyState.setCode(aceEditor.getValue());
                });
            });

        // React to the backend message and set the ACE Editor code
        // React to messages received from the Backend
        this.backEndState.backEndMessages$
            .pipe(withLatestFrom(this.codeEditorState.aceEditor$))
            .pipe(filter(([message,]) => !!message))
            .subscribe(([message, aceEditor]) => {
                switch (message.event) {
                    case 'WORKSPACE_CODE_RESTORING':
                        aceEditor.session.setValue(message.payload.data as string);
                        break;
                    default:
                        break;
                }
            });
    }
    private defaultProgram: string = `void leaphyProgram() {
}

void setup() {
    leaphyProgram();
}

void loop() {

}`

}
