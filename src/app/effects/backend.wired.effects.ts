import { Injectable, NgZone } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { filter, withLatestFrom, switchMap, tap } from 'rxjs/operators';
import { BackEndState } from '../state/backend.state';

import { IpcRenderer } from 'electron';
import { SketchStatus } from '../domain/sketch.status';
import { BackEndMessage } from '../domain/backend.message';
import { ConnectionStatus } from '../domain/connection.status';
import { AppState } from '../state/app.state';
import { RobotWiredState } from '../state/robot.wired.state';
import { WorkspaceStatus } from '../domain/workspace.status';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Electron environment that different state changes have
export class BackendWiredEffects {

    private ipc: IpcRenderer | undefined;

    constructor(
        private backEndState: BackEndState,
        private appState: AppState,
        private blocklyEditorState: BlocklyEditorState,
        private robotWiredState: RobotWiredState,
        private zone: NgZone
    ) {
        // Only set up these effects when we're in Desktop mode
        this.appState.isDesktop$
            .pipe(filter(isDesktop => !!isDesktop))
            .subscribe(() => {
                // Get the connection to the Electron process
                try {
                    this.ipc = window.require('electron').ipcRenderer;
                } catch (e) {
                    throw e;
                }

                // If that worked, set the backend Connection status
                this.backEndState.setconnectionStatus(ConnectionStatus.ConnectedToBackend);

                // Relay messages from Electron to the Backend State
                this.on('backend-message', (event: any, message: BackEndMessage) => {
                    // This is needed to trigger UI refresh from IPC events
                    this.zone.run(() => {
                        this.backEndState.setBackendMessage(message);
                    });
                });

                // When wired robot is selected, verify that all prerequisites are installed
                this.appState.selectedRobotType$
                    .pipe(filter(robotType => !!robotType && !!robotType.isWired))
                    .subscribe(robotType => {
                        this.backEndState.setconnectionStatus(ConnectionStatus.VerifyingPrerequisites);
                        this.send('verify-installation', robotType);
                    });

                // If the installation of prequisites is verified, start detecting
                this.robotWiredState.isInstallationVerified$
                    .pipe(filter(isVerified => !!isVerified))
                    .subscribe(() => {
                        this.backEndState.setconnectionStatus(ConnectionStatus.DetectingDevices);
                    });

                // Get the devices when the ConnectionStatus is set to DetectingDevices
                this.backEndState.connectionStatus$
                    .subscribe(connectionStatus => {
                        switch (connectionStatus) {
                            case ConnectionStatus.DetectingDevices:
                                this.send('get-serial-devices');
                        }
                    });

                // If no devices found, set the status to WaitForRobot
                this.backEndState.backEndMessages$
                    .pipe(filter(message => !!message))
                    .subscribe((message) => {
                        switch (message.event) {
                            case 'NO_DEVICES_FOUND':
                                this.backEndState.setconnectionStatus(ConnectionStatus.WaitForRobot);
                                break;
                            default:
                                break;
                        }
                    });

                // When a serial device is selected, set the connection status to "PairedWithRobot"
                this.robotWiredState.selectedSerialDevice$
                    .pipe(filter(serialDevice => !!serialDevice))
                    .subscribe(() => this.backEndState.setconnectionStatus(ConnectionStatus.PairedWithRobot));

                // When the sketch status is set to sending, send a compile request to backend
                this.blocklyEditorState.sketchStatus$
                    .pipe(withLatestFrom(this.blocklyEditorState.code$, this.appState.selectedRobotType$, this.robotWiredState.selectedSerialDevice$))
                    .pipe(filter(([, , robotType,]) => !!robotType && !!robotType.isWired))
                    .subscribe(([status, code, robotType, serialDevice]) => {
                        switch (status) {
                            case SketchStatus.Sending:
                                const payload = {
                                    code,
                                    fqbn: robotType.fqbn,
                                    ext: robotType.ext,
                                    core: robotType.core,
                                    port: serialDevice.address,
                                    name: robotType.name,
                                    board: robotType.board,
                                    libs: robotType.libs
                                };
                                this.send('compile', payload);
                                break;
                            default:
                                break;
                        }
                    });

                // When a workspace is being loaded, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(filter(status => status === WorkspaceStatus.Finding))
                    .pipe(withLatestFrom(this.appState.selectedRobotType$))
                    .subscribe(([, robotType]) => {
                        this.send('restore-workspace', robotType);
                    });

                // When the workspace is being saved, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(filter(status => status === WorkspaceStatus.Saving))
                    .pipe(withLatestFrom(this.blocklyEditorState.projectFilePath$, this.blocklyEditorState.workspaceXml$))
                    .pipe(filter(([, projectFilePath,]) => !!projectFilePath))
                    .subscribe(([, projectFilePath, workspaceXml]) => {
                        const payload = { projectFilePath, workspaceXml };
                        this.send('save-workspace', payload);
                    });

                // When the workspace is being saved, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(filter(status => status === WorkspaceStatus.SavingAs))
                    .pipe(withLatestFrom(
                        this.blocklyEditorState.projectFilePath$,
                        this.blocklyEditorState.workspaceXml$,
                        this.appState.selectedRobotType$
                    ))
                    .subscribe(([, projectFilePath, workspaceXml, robotType]) => {
                        const payload = { projectFilePath, workspaceXml, robotType };
                        this.send('save-workspace-as', payload);
                    });

                // When the Install USB driver is being installed, relay the command to Electron
                this.robotWiredState.isRobotDriverInstalling$
                    .pipe(filter(isInstalling => !!isInstalling))
                    .pipe(withLatestFrom(this.appState.selectedRobotType$))
                    .subscribe(([, robotType]) => {
                        this.send('install-usb-driver', robotType);
                    });
            });
    }

    public on(channel: string, listener: (event: any, data: any) => void): void {
        if (!this.ipc) {
            return;
        }
        this.ipc.on(channel, listener);
    }

    public send(channel: string, ...args): void {
        if (!this.ipc) {
            console.log('No IPC found for sending :(');
            return;
        }
        this.ipc.send(channel, ...args);
    }
}
