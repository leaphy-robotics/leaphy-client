import { Injectable, NgZone } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { filter, withLatestFrom } from 'rxjs/operators';
import { BackEndState } from '../state/backend.state';

import { IpcRenderer } from 'electron';
import { RobotState } from '../state/robot.state';
import { SketchStatus } from '../domain/sketch.status';
import { BackEndMessage } from '../domain/backend.message';
import { ConnectionStatus } from '../domain/connection.status';
import { AppState } from '../state/app.state';
import { combineLatest } from 'rxjs';

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
        private robotState: RobotState,
        private zone: NgZone
    ) {
        combineLatest([this.appState.isDesktop$, this.appState.isRobotWired$])
            .pipe(filter(([isDesktop, isRobotWired]) => isDesktop && isRobotWired))
            .subscribe(() => {
                try {
                    this.ipc = window.require('electron').ipcRenderer;
                } catch (e) {
                    throw e;
                }
                this.on('backend-message', (event: any, message: BackEndMessage) => {
                    this.zone.run(() => {
                        this.backEndState.setBackendMessage(message);
                    });
                });

                this.blocklyEditorState.sketchStatus$
                    .pipe(withLatestFrom(this.blocklyEditorState.code$, this.appState.selectedRobotType$, this.robotState.robotPort$))
                    .pipe(filter(([, , , robotPort]) => robotPort !== 'OTA'))
                    .subscribe(([status, code, robotType, robotPort]) => {
                        switch (status) {
                            case SketchStatus.Sending:
                                const payload = {
                                    code,
                                    fqbn: robotType.fqbn,
                                    ext: robotType.ext,
                                    core: robotType.core,
                                    port: robotPort,
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

                this.backEndState.backEndMessages$
                    .pipe(filter(message => !!message))
                    .subscribe((message) => {
                        console.log('Received message from backend:', message);
                        switch (message.event) {
                            case 'NO_ROBOT_FOUND':
                                this.robotState.setRobotPort(null);
                                this.backEndState.setconnectionStatus(ConnectionStatus.WaitForRobot);
                                break;
                            case 'ROBOT_FOUND_ON_PORT':
                                this.backEndState.setconnectionStatus(ConnectionStatus.PairedWithRobot);
                                break;
                            default:
                                break;
                        }
                    });

                this.backEndState.connectionStatus$
                    .subscribe(connectionStatus => {
                        switch (connectionStatus) {
                            case ConnectionStatus.StartPairing:
                                console.log('Electron Effect detecting boards');
                                this.send('get-board-port');
                        }
                    });

                this.appState.selectedRobotType$
                    .pipe(filter(robotType => !!robotType))
                    .subscribe(() => {
                        this.send('get-board-port');
                    })

                this.robotState.isRobotDriverInstalling$
                    .pipe(filter(isInstalling => !!isInstalling))
                    .pipe(withLatestFrom(this.appState.selectedRobotType$))
                    .subscribe(([, robotType]) => {
                        this.send('install-board', robotType);
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
