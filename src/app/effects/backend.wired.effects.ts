import { Injectable, NgZone } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { filter, withLatestFrom } from 'rxjs/operators';
import { BackEndState } from '../state/backend.state';
import { IpcRenderer } from 'electron';
import { SketchStatus } from '../domain/sketch.status';
import { BackEndMessage } from '../domain/backend.message';
import { ConnectionStatus } from '../domain/connection.status';
import { AppState } from '../state/app.state';
import { RobotWiredState } from '../state/robot.wired.state';
import { WorkspaceStatus } from '../domain/workspace.status';

declare var Blockly: any;

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
                try {
                    // Open communications to the Electron process
                    this.ipc = window.require('electron').ipcRenderer;
                    // Replace the Prompt used by Blockly Variables with something that works in Electron
                    const electronPrompt = window.require('electron-prompt')
                    Blockly.prompt = (msg, defaultValue, callback) => {
                        electronPrompt
                            ({
                                title: 'Variable',
                                label: msg,
                                type: 'input'
                            }).then(name => { callback(name) })
                    }
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

                // Detect first run in the beginning
                this.appState.isDesktop$
                    .subscribe(() => this.send('detect-first-run'));

                // When wired robot is selected, verify that all prerequisites are installed
                this.appState.selectedRobotType$
                    .pipe(filter(robotType => !!robotType && !!robotType.isWired))
                    .subscribe(robotType => {
                        this.backEndState.setconnectionStatus(ConnectionStatus.VerifyingPrerequisites);
                        this.send('verify-installation', robotType);
                    });

                // When the sketch status is set to sending, send a compile request to backend
                this.blocklyEditorState.sketchStatus$
                    .pipe(withLatestFrom(this.blocklyEditorState.code$, this.appState.selectedRobotType$))
                    .pipe(filter(([, , robotType,]) => !!robotType && !!robotType.isWired))
                    .subscribe(([status, code, robotType]) => {
                        switch (status) {
                            case SketchStatus.Sending:
                                const payload = {
                                    code,
                                    fqbn: robotType.fqbn,
                                    ext: robotType.ext,
                                    core: robotType.core,
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

                // When the ConnectionStatus is set to DetectingDevices
                // Double Check that the installation is verified, and there is a sketch location
                // If there's already a verified device, try uploading the compiled sketch to it
                // If there's not, have the backend get the devices to try
                this.backEndState.connectionStatus$
                    .pipe(withLatestFrom(
                        this.appState.selectedRobotType$,
                        this.robotWiredState.isInstallationVerified$,
                        this.backEndState.sketchLocation$,
                        this.robotWiredState.verifiedSerialDevice$
                    ))
                    .pipe(filter(([connectionStatus, , isInstallationVerified, sketchLocation,]) =>
                        connectionStatus == ConnectionStatus.DetectingDevices && isInstallationVerified && !!sketchLocation))
                    .subscribe(([, robotType, , sketchLocation, verifiedDevice]) => {
                        if (!verifiedDevice) {
                            this.send('get-serial-devices');
                            return;
                        }
                        const payload = {
                            ...robotType,
                            ...verifiedDevice,
                            sketchPath: sketchLocation
                        }
                        this.send('update-device', payload);
                    });

                // When the verified device fails to update
                // Get all serial devices
                this.backEndState.backEndMessages$
                    .pipe(withLatestFrom(this.robotWiredState.verifiedSerialDevice$))
                    .pipe(filter(([message, verifiedDevice]) => !!verifiedDevice && !!message && message.event == 'UPDATE_FAILED' && message.payload.address == verifiedDevice.address))
                    .subscribe(() => {
                        this.send('get-serial-devices');
                    });


                // When the Serial Devices to try are updated, try to upload to the first one
                // If none left, set the connections status to waiting for robot
                this.robotWiredState.serialDevicesToTry$
                    .pipe(withLatestFrom(
                        this.appState.selectedRobotType$,
                        this.robotWiredState.isInstallationVerified$,
                        this.backEndState.sketchLocation$
                    ))
                    .pipe(filter(([, , isInstallationVerified, sketchLocation]) => isInstallationVerified && !!sketchLocation))
                    .subscribe(([devices, robotType, , sketchLocation]) => {
                        if (!devices.length) {
                            this.backEndState.setconnectionStatus(ConnectionStatus.WaitForRobot);
                            return;
                        }
                        const payload = {
                            ...robotType,
                            ...devices[0],
                            sketchPath: sketchLocation
                        }
                        this.send('update-device', payload);
                    })

                // React to messages from the backend
                this.backEndState.backEndMessages$
                    .pipe(filter(message => !!message))
                    .subscribe((message) => {
                        switch (message.event) {
                            // If no devices found, set the status to WaitForRobot
                            case 'NO_DEVICES_FOUND':
                                this.backEndState.setconnectionStatus(ConnectionStatus.WaitForRobot);
                                break;
                            // When compilation completes, start detecting devices
                            case 'COMPILATION_COMPLETE':
                                this.backEndState.setSketchLocation(message.payload);
                                this.backEndState.setconnectionStatus(ConnectionStatus.DetectingDevices);
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
                    .pipe(withLatestFrom(
                        this.blocklyEditorState.projectFilePath$,
                        this.blocklyEditorState.workspaceXml$,
                        this.appState.selectedRobotType$
                    ))
                    .subscribe(([, projectFilePath, workspaceXml, robotType]) => {
                        if (projectFilePath) {
                            const payload = { projectFilePath, workspaceXml };
                            this.send('save-workspace', payload);
                        } else {
                            const payload = { projectFilePath, workspaceXml, robotType };
                            this.send('save-workspace-as', payload);
                        }
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

                // When the user clicks help, open the default OS browser with the leaphy Forum
                this.appState.showHelpPage$
                    .pipe(filter(show => !!show))
                    .subscribe(() => this.send('open-browser-page', "https://forum.leaphy.nl/"));
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
