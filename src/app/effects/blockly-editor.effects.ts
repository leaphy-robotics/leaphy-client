import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch.status';
import { BackEndState } from '../state/backend.state';
import { ConnectionStatus } from '../domain/connection.status';
import { filter, withLatestFrom } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';
import { WorkspaceStatus } from '../domain/workspace.status';
import { AppState } from '../state/app.state';

declare var Blockly: any;

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Editor that different state changes have
export class BlocklyEditorEffects {

    constructor(
        private blocklyState: BlocklyEditorState,
        private backEndState: BackEndState,
        private appState: AppState,
        private http: HttpClient
    ) {
        // Create a new workspace when all prerequisites are there
        combineLatest(this.blocklyState.blocklyElement$, this.blocklyState.blocklyConfig$)
            .pipe(withLatestFrom(this.appState.selectedRobotType$))
            .pipe(filter(([[element, config], robotType]) => !!element && !!config && !!robotType))
            .pipe(withLatestFrom(
                this.getXmlContent('./assets/blockly/base-toolbox.xml'),
                this.getXmlContent('./assets/blockly/leaphy-toolbox.xml'),
                this.getXmlContent('./assets/blockly/leaphy-start.xml'),
            ))
            .subscribe(([[[element, config], robotType], baseToolboxXml, leaphyToolboxXml, startWorkspaceXml]) => {
                const parser = new DOMParser();
                const toolboxXmlDoc = parser.parseFromString(baseToolboxXml, 'text/xml');
                const toolboxElement = toolboxXmlDoc.getElementById('easyBloqsToolbox');
                const leaphyCategories = parser.parseFromString(leaphyToolboxXml, 'text/xml');
                const leaphyRobotCategory = leaphyCategories.getElementById(robotType.id);
                toolboxElement.prepend(leaphyRobotCategory);
                if(robotType.showLeaphyExtra){
                    const leaphyExtraCategory = leaphyCategories.getElementById('l_extra');
                    toolboxElement.appendChild(leaphyExtraCategory);    
                }
                const serializer = new XMLSerializer();
                const toolboxXmlString = serializer.serializeToString(toolboxXmlDoc);
                config.toolbox = toolboxXmlString;
                const workspace = Blockly.inject(element, config);
                const toolbox = workspace.getToolbox();
                toolbox.getFlyout().autoClose = false;
                const xml = Blockly.Xml.textToDom(startWorkspaceXml);
                Blockly.Xml.domToWorkspace(xml, workspace);
                this.blocklyState.setWorkspace(workspace);
                this.blocklyState.setToolboxXml(toolboxXmlString);
                toolbox.selectItemByPosition(0);
                toolbox.refreshTheme();
            });

        // Set the toolbox and initialWorkspace when the robot selection changes
        this.appState.selectedRobotType$
            .pipe(withLatestFrom(this.blocklyState.workspace$))
            .pipe(filter(([robotType, workspace]) => !!robotType && !!workspace))
            .pipe(withLatestFrom(
                this.getXmlContent('./assets/blockly/base-toolbox.xml'),
                this.getXmlContent('./assets/blockly/leaphy-toolbox.xml'),
                this.getXmlContent('./assets/blockly/leaphy-start.xml'),
            ))
            .subscribe(([[robotType, workspace], baseToolboxXml, leaphyToolboxXml, startWorkspaceXml]) => {
                const parser = new DOMParser();
                const toolboxXmlDoc = parser.parseFromString(baseToolboxXml, 'text/xml');
                const toolboxElement = toolboxXmlDoc.getElementById('easyBloqsToolbox');
                const leaphyCategories = parser.parseFromString(leaphyToolboxXml, 'text/xml');
                const leaphyRobotCategory = leaphyCategories.getElementById(robotType.id);
                toolboxElement.prepend(leaphyRobotCategory);
                const serializer = new XMLSerializer();
                const toolboxXmlString = serializer.serializeToString(toolboxXmlDoc);
                this.blocklyState.setToolboxXml(toolboxXmlString);

                workspace.clear();
                const xml = Blockly.Xml.textToDom(startWorkspaceXml);
                Blockly.Xml.domToWorkspace(xml, workspace);
            });

        // Update the toolbox when it changes
        this.blocklyState.toolboxXml$
            .pipe(withLatestFrom(this.blocklyState.workspace$))
            .pipe(filter(([toolbox, workspace]) => !!toolbox && !!workspace))
            .subscribe(([toolbox, workspace]) => workspace.updateToolbox(toolbox))

        // Subscribe to changes when the workspace is set
        this.blocklyState.workspace$
            .pipe(filter(workspace => !!workspace))
            .subscribe(workspace => {
                workspace.clearUndo();
                workspace.addChangeListener(Blockly.Events.disableOrphans);
                workspace.addChangeListener(async () => {
                    this.blocklyState.setCode(Blockly.Arduino.workspaceToCode(workspace));
                    const xml = Blockly.Xml.workspaceToDom(workspace);
                    const data = Blockly.Xml.domToPrettyText(xml);
                    this.blocklyState.setWorkspaceXml(data);
                });
            });

        // When the WorkspaceStatus is set to loading, load in the latest workspace XML
        this.blocklyState.workspaceStatus$
            .pipe(filter(status => status === WorkspaceStatus.Restoring))
            .pipe(withLatestFrom(this.blocklyState.workspaceXml$, this.blocklyState.workspace$))
            .subscribe(([, workspaceXml, workspace]) => {
                workspace.clear();
                const xml = Blockly.Xml.textToDom(workspaceXml);
                Blockly.Xml.domToWorkspace(xml, workspace);
                this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Clean);
            });

        // When the user presses undo or redo, trigger undo or redo on the workspace
        this.blocklyState.undo$
            .pipe(withLatestFrom(this.blocklyState.workspace$))
            .pipe(filter(([, workspace]) => !!workspace))
            .subscribe(([redo, workspace]) => workspace.undo(redo));

        // Changes in ConnectionStatus result in changes in SketchStatus
        this.backEndState.connectionStatus$
            .subscribe(connectionStatus => {
                switch (connectionStatus) {
                    case ConnectionStatus.Disconnected:
                    case ConnectionStatus.ConnectedToBackend:
                    case ConnectionStatus.WaitForRobot:
                        this.blocklyState.setSketchStatus(SketchStatus.UnableToSend);
                        break;
                    case ConnectionStatus.PairedWithRobot:
                        this.blocklyState.setSketchStatus(SketchStatus.ReadyToSend);
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
                    case 'UPDATE_STARTED':
                        this.blocklyState.setSketchStatusMessage(message.message);
                        break;
                    case 'ROBOT_REGISTERED':
                    case 'UPDATE_COMPLETE':
                        this.blocklyState.setSketchStatus(SketchStatus.ReadyToSend);
                        this.blocklyState.setSketchStatusMessage(null);
                        break;
                    case 'COMPILATION_FAILED':
                    case 'UPDATE_FAILED':
                        this.blocklyState.setSketchStatus(SketchStatus.UnableToSend);
                        this.blocklyState.setSketchStatusMessage(null);
                        break;
                    case 'WORKSPACE_SAVE_CANCELLED':
                        this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Clean);
                        break;
                    case 'WORKSPACE_SAVED':
                        this.blocklyState.setProjectFilePath(message.payload);
                        this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Clean);
                        break;
                    case 'WORKSPACE_RESTORING':
                        this.blocklyState.setWorkspaceXml(message.payload.workspaceXml as string);
                        this.blocklyState.setProjectFilePath(message.payload.projectFilePath);
                        this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Restoring);
                        break;
                    default:
                        break;
                }
            });
    }

    private getXmlContent(path: string): Observable<string> {
        return this.http
            .get(path, {
                headers: new HttpHeaders()
                    .set('Content-Type', 'text/xml')
                    .append('Access-Control-Allow-Methods', 'GET')
                    .append('Access-Control-Allow-Origin', '*')
                    .append('Access-Control-Allow-Headers',
                        'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
                responseType: 'text'
            })
    }
}
