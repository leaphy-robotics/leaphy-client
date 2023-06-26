import { Injectable } from "@angular/core";
import { filter, withLatestFrom } from "rxjs/operators";
import { BlocklyEditorState } from "../state/blockly-editor.state";
import * as ace from "ace-builds";
import { BackEndState } from "../state/backend.state";
import { GlobalVariablesService } from "../state/global.state";

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Editor that different state changes have
export class CodeEditorEffects {
    constructor(private globalVariableService: GlobalVariablesService, private blocklyState: BlocklyEditorState, private backEndState: BackEndState) {

        this.globalVariableService.codeEditorState.aceElement$
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
                this.globalVariableService.codeEditorState.setAceEditor(aceEditor);
            });


        // When the Ace Editor is set, set it with the code, and update the blockly code with changes
        this.globalVariableService.codeEditorState.aceEditor$
            .pipe(filter(aceEditor => !!aceEditor))
            .pipe(withLatestFrom(this.blocklyState.code$, this.globalVariableService.codeEditorState.code$))
            .subscribe(([aceEditor, blocklyCode, editorCode]) => {
                const startingCode = blocklyCode ? blocklyCode : editorCode;
                aceEditor.session.setValue(startingCode);
                this.globalVariableService.codeEditorState.setOriginalCode(startingCode);
                this.globalVariableService.codeEditorState.setCode(startingCode);

                aceEditor.on("change", () => {
                    const changedCode = aceEditor.getValue();
                    this.globalVariableService.codeEditorState.setCode(changedCode)
                    this.blocklyState.setCode(changedCode);
                });
            });

        // React to the backend message and set the ACE Editor code
        // React to messages received from the Backend
        this.backEndState.backEndMessages$
            .pipe(withLatestFrom(this.globalVariableService.codeEditorState.aceEditor$))
            .pipe(filter(([message,]) => !!message))
            .subscribe(([message, aceEditor]) => {
                switch (message.event) {
                    case 'WORKSPACE_CODE_RESTORING':
                        const code = message.payload.data as string;
                        aceEditor.session.setValue(code);
                        this.globalVariableService.codeEditorState.setOriginalCode(code);
                        this.globalVariableService.codeEditorState.setCode(code);
                        break;
                    case 'WORKSPACE_SAVED':
                        const savedCode = aceEditor.getValue();
                        this.globalVariableService.codeEditorState.setOriginalCode(savedCode);
                        this.globalVariableService.codeEditorState.setCode(savedCode);
                        break;
                    default:
                        break;
                }
            });
    }
}
