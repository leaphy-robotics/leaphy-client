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
import { LogService } from '../services/log.service';
import { DialogState } from '../state/dialog.state';
import { CodeEditorType } from '../domain/code-editor.type';

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
        private dialogState: DialogState,
        private logger: LogService,
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
                                type: 'input',
                                height: 180
                            })
                            .then(name => {
                                callback(name);
                            })
                    }
                } catch (e) {
                    console.log(e);
                    throw e;
                }

                // If that worked, set the backend Connection status
                this.backEndState.setconnectionStatus(ConnectionStatus.ConnectedToBackend);

                // If the focus is set on an open window, relay to backend
                this.dialogState.isSerialOutputFocus$
                    .pipe(withLatestFrom(this.dialogState.isSerialOutputWindowOpen$))
                    .pipe(filter(([isFocus, isOpen]) => isFocus && isOpen))
                    .subscribe(() => {
                        this.send('focus-serial');
                    });

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

                // When a reload is requested and we are done saving the temp workspace, relay to Electron backend
                this.blocklyEditorState.workspaceStatus$
                    .pipe(filter(status => status === WorkspaceStatus.Clean), withLatestFrom(this.appState.isReloadRequested$))
                    .pipe(filter(([, isRequested]) => !!isRequested))
                    .subscribe(() => {
                        this.send('restart-app');
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
                        this.backEndState.binaryLocation$,
                        this.robotWiredState.verifiedSerialDevice$
                    ))
                    .pipe(filter(([connectionStatus, , isInstallationVerified, binaryLocation,]) =>
                        connectionStatus == ConnectionStatus.DetectingDevices && isInstallationVerified && !!binaryLocation))
                    .subscribe(([, robotType, , binaryLocation, verifiedDevice]) => {
                        if (!verifiedDevice) {
                            this.send('get-serial-devices');
                            return;
                        }
                        const payload = {
                            ...robotType,
                            ...verifiedDevice,
                            binaryPath: binaryLocation
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
                        this.backEndState.binaryLocation$
                    ))
                    .pipe(filter(([, , isInstallationVerified, binaryLocation]) => isInstallationVerified && !!binaryLocation))
                    .subscribe(([devices, robotType, , binaryLocation]) => {
                        if (!devices.length) {
                            this.backEndState.setconnectionStatus(ConnectionStatus.WaitForRobot);
                            return;
                        }
                        const payload = {
                            ...robotType,
                            ...devices[0],
                            binaryPath: binaryLocation
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

                // When a workspace project is being loaded, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(withLatestFrom(this.appState.codeEditorType$))
                    .pipe(filter(([status, codeEditorType]) => status === WorkspaceStatus.Finding && codeEditorType === CodeEditorType.Beginner))
                    .pipe(withLatestFrom(this.appState.selectedRobotType$))
                    .subscribe(([, robotType]) => {
                        this.send('restore-workspace', robotType.id);
                    });

                // When a code project is being loaded, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(withLatestFrom(this.appState.codeEditorType$))
                    .pipe(filter(([status, codeEditorType]) => status === WorkspaceStatus.Finding && codeEditorType === CodeEditorType.Advanced))
                    .subscribe(() => {
                        this.send('restore-workspace-code', appState.genericRobotType.id);
                    });

                // When the temp workspace is being loaded, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(filter(status => status === WorkspaceStatus.FindingTemp))
                    .pipe(withLatestFrom(this.appState.selectedRobotType$))
                    .subscribe(([, robotType]) => {
                        this.send('restore-workspace-temp', robotType.id);
                    });

                // When an existing project's workspace is being saved, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(withLatestFrom(this.appState.codeEditorType$))
                    .pipe(filter(([status, codeEditorType]) => status === WorkspaceStatus.Saving && codeEditorType === CodeEditorType.Beginner))
                    .pipe(withLatestFrom(
                        this.blocklyEditorState.projectFilePath$,
                        this.blocklyEditorState.workspaceXml$
                    ))
                    .pipe(filter(([, projectFilePath,]) => !!projectFilePath))
                    .subscribe(([, projectFilePath, workspaceXml,]) => {
                        const payload = { projectFilePath, data: workspaceXml };
                        this.send('save-workspace', payload);
                    });

                // When an existing project's code is being saved, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(withLatestFrom(this.appState.codeEditorType$))
                    .pipe(filter(([status, codeEditorType]) => status === WorkspaceStatus.Saving && codeEditorType === CodeEditorType.Advanced))
                    .pipe(withLatestFrom(
                        this.blocklyEditorState.projectFilePath$,
                        this.blocklyEditorState.code$
                    ))
                    .pipe(filter(([, projectFilePath,]) => !!projectFilePath))
                    .subscribe(([, projectFilePath, code]) => {
                        const payload = { projectFilePath, data: code };
                        this.send('save-workspace', payload);
                    });

                // When the workspace is being saved as a new project, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(withLatestFrom(this.appState.codeEditorType$))
                    .pipe(filter(([status, codeEditorType]) => status === WorkspaceStatus.SavingAs && codeEditorType === CodeEditorType.Beginner))
                    .pipe(withLatestFrom(
                        this.blocklyEditorState.projectFilePath$,
                        this.blocklyEditorState.workspaceXml$,
                        this.appState.selectedRobotType$
                    ))
                    .subscribe(([, projectFilePath, workspaceXml, robotType]) => {
                        const payload = { projectFilePath, data: workspaceXml, extension: robotType.id };
                        this.send('save-workspace-as', payload);
                    });

                // When the code is being saved as a new project, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(withLatestFrom(this.appState.codeEditorType$))
                    .pipe(filter(([status, codeEditorType]) => status === WorkspaceStatus.SavingAs && codeEditorType === CodeEditorType.Advanced))
                    .pipe(withLatestFrom(
                        this.blocklyEditorState.projectFilePath$,
                        this.blocklyEditorState.code$
                    ))
                    .subscribe(([, projectFilePath, code]) => {
                        const payload = { projectFilePath, data: code, extension: appState.genericRobotType.id };
                        this.send('save-workspace-as', payload);
                    });

                // When the workspace is being temporarily saved, relay the command to Electron
                this.blocklyEditorState.workspaceStatus$
                    .pipe(filter(status => status === WorkspaceStatus.SavingTemp))
                    .pipe(withLatestFrom(
                        this.blocklyEditorState.workspaceXml$,
                        this.appState.selectedRobotType$
                    ))
                    .subscribe(([, workspaceXml, robotType]) => {
                        const payload = { data: workspaceXml, extension: robotType.id };
                        this.send('save-workspace-temp', payload);
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
                    .subscribe(() => this.send('open-browser-page', "https://discord.com/invite/Yeg7Kkrq5W"));

                // When the user clicks to view the log, relay to backend to open the file in default text editor
                this.backEndState.isViewLogClicked$
                    .pipe(filter(isClicked => !!isClicked))
                    .subscribe(() => this.send('open-log-file'));

                // If driver install is requested, set it right back to false
                this.backEndState.isDriverInstalling$
                    .pipe(filter(install => !!install))
                    .subscribe(() => {
                        this.backEndState.setIsDriverInstalling(false);
                    });

                // If libraries cleanup is requested, inform Electron and set it right back to false
                this.backEndState.isLibrariesClearing$
                    .pipe(filter(clear => !!clear))
                    .pipe(withLatestFrom(this.appState.selectedRobotType$))
                    .subscribe(([, robotType]) => {
                        this.send('reset-libraries', robotType);
                        this.backEndState.setIsLibrariesClearing(false);
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
            this.logger.error('No IPC found for sending :(');
            return;
        }
        this.ipc.send(channel, ...args);
    }
}
