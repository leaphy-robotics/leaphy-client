import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch.status';
import { BackEndState } from '../state/backend.state';
import { ConnectionStatus } from '../domain/connection.status';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest } from 'rxjs';

declare var Blockly: any;

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Editor that different state changes have
export class BlocklyEditorEffects {

    constructor(
        private blocklyEditorState: BlocklyEditorState,
        private backEndState: BackEndState,
        private http: HttpClient
    ) {
        // Create the Blockly Workspace
        combineLatest(this.blocklyEditorState.blocklyElement$, this.blocklyEditorState.blocklyConfig$, this.blocklyEditorState.toolboxXml$)
            .pipe(filter(([element, config, toolbox]) => !!element && !!config && !!toolbox))
            .subscribe(([element, config, toolbox]) => {
                config.toolbox = toolbox;
                const workspace = Blockly.inject(element, config);
                this.blocklyEditorState.setBlocklyWorkspace(workspace);
            });

        // Subscribe to generated code changes when the workspace is set
        this.blocklyEditorState.blocklyWorkspace$
            .pipe(filter(workspace => !!workspace))
            .subscribe(workspace => workspace.addChangeListener(async (event) => {
                this.blocklyEditorState.setCode(Blockly.Arduino.workspaceToCode(workspace));
            }));

        this.backEndState.connectionStatus$
            .subscribe(connectionStatus => {
                switch (connectionStatus) {
                    case ConnectionStatus.Disconnected:
                    case ConnectionStatus.ConnectedToBackend:
                    case ConnectionStatus.WaitForRobot:
                        this.blocklyEditorState.setSketchStatus(SketchStatus.UnableToSend);
                        break;
                    case ConnectionStatus.PairedWithRobot:
                        this.blocklyEditorState.setSketchStatus(SketchStatus.ReadyToSend);
                        break;
                    default:
                        break;
                }
            });

        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .subscribe(message => {
                console.log('BlocklyEditorEffects got backendmessage', message);
                switch (message.event) {
                    case 'PREPARING_COMPILATION_ENVIRONMENT':
                    case 'COMPILATION_STARTED':
                    case 'COMPILATION_COMPLETE':
                    case 'ROBOT_UPDATING':
                        this.blocklyEditorState.setSketchStatusMessage(message.message);
                        break;
                    case 'ROBOT_REGISTERED':
                    case 'ROBOT_UPDATED':
                        this.blocklyEditorState.setSketchStatus(SketchStatus.ReadyToSend);
                        this.blocklyEditorState.setSketchStatusMessage(null);
                        break;
                    default:
                        break;
                }

            });

        this.http.get('./assets/leaphy-toolbox.xml', {
            headers: new HttpHeaders()
                .set('Content-Type', 'text/xml')
                .append('Access-Control-Allow-Methods', 'GET')
                .append('Access-Control-Allow-Origin', '*')
                .append('Access-Control-Allow-Headers',
                    'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
            responseType: 'text'
        })
            .subscribe(toolbox => this.blocklyEditorState.setToolboxXml(toolbox), error => console.log('Error loading toolbox', error));
    }
}
