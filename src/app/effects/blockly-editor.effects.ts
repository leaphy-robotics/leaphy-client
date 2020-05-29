import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch.status';
import { BackEndState } from '../state/backend.state';
import { ConnectionStatus } from '../domain/connection.status';
import { filter, tap, withLatestFrom } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { WorkspaceStatus } from '../domain/workspace.status';

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
        // Load the toolbox when the effect is loaded
        this.http
            .get('./assets/leaphy-toolbox.xml', {
                headers: new HttpHeaders()
                    .set('Content-Type', 'text/xml')
                    .append('Access-Control-Allow-Methods', 'GET')
                    .append('Access-Control-Allow-Origin', '*')
                    .append('Access-Control-Allow-Headers',
                        'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
                responseType: 'text'
            })
            .subscribe(toolbox => this.blocklyEditorState.setToolboxXml(toolbox), error => console.log('Error loading toolbox', error));

        // Create a new workspace when all prerequisites are there
        combineLatest(this.blocklyEditorState.blocklyElement$, this.blocklyEditorState.blocklyConfig$, this.blocklyEditorState.toolboxXml$)
            .pipe(tap(() => "Creating Blockly workspace"))
            .pipe(filter(([element, config, toolbox]) => !!element && !!config && !!toolbox))
            .subscribe(([element, config, toolbox]) => {
                console.log("Building workspace");
                config.toolbox = toolbox;
                const workspace = Blockly.inject(element, config);
                this.blocklyEditorState.setWorkspace(workspace);
            });

        // Subscribe to changes when the workspace is set
        this.blocklyEditorState.workspace$
            .pipe(filter(workspace => !!workspace))
            .subscribe(workspace => workspace.addChangeListener(async (event) => {
                this.blocklyEditorState.setCode(Blockly.Arduino.workspaceToCode(workspace));
                var xml = Blockly.Xml.workspaceToDom(workspace);
                var data = Blockly.Xml.domToPrettyText(xml);
                this.blocklyEditorState.setWorkspaceXml(data);
            }));

        // When the WorkspaceStatus is set to loading, load in the latest workspace XML
        this.blocklyEditorState.workspaceStatus$
            .pipe(filter(status => status === WorkspaceStatus.Restoring))
            .pipe(withLatestFrom(this.blocklyEditorState.workspaceXml$, this.blocklyEditorState.workspace$))
            .subscribe(([, workspaceXml, workspace]) => {
                workspace.clear();
                const xml = Blockly.Xml.textToDom(workspaceXml);
                Blockly.Xml.domToWorkspace(xml, workspace);
                this.blocklyEditorState.setWorkspaceStatus(WorkspaceStatus.Clean);
            });

        // Changes in ConnectionStatus result in changes in SketchStatus
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

        // React to messages received from the Backend
        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .subscribe(message => {
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
                    case 'WORKSPACE_SAVE_CANCELLED':
                        this.blocklyEditorState.setWorkspaceStatus(WorkspaceStatus.Clean);
                        break;
                    case 'WORKSPACE_SAVED':
                        this.blocklyEditorState.setProjectFilePath(message.message);
                        this.blocklyEditorState.setWorkspaceStatus(WorkspaceStatus.Clean);
                        break;
                    case 'WORKSPACE_RESTORING':
                        this.blocklyEditorState.setWorkspaceXml(message.message.workspaceXml as string);
                        this.blocklyEditorState.setProjectFilePath(message.message.projectFilePath);
                        this.blocklyEditorState.setWorkspaceStatus(WorkspaceStatus.Restoring);
                        break;
                    default:
                        break;
                }
            });
    }
}
