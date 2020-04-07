import { Injectable, NgZone } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { filter, withLatestFrom } from 'rxjs/operators';
import { BackEndState } from '../state/backend.state';

import { IpcRenderer } from 'electron';
import { RobotState } from '../state/robot.state';
import { SketchStatus } from '../domain/sketch.status';
import { BackEndMessage } from '../domain/backend.message';
import { ConnectionStatus } from '../domain/connection.status';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Electron environment that different state changes have
export class ElectronEffects {

    private ipc: IpcRenderer | undefined;

    constructor(
        private backEndState: BackEndState,
        private blocklyEditorState: BlocklyEditorState,
        private robotState: RobotState,
        private zone: NgZone
    ) {
        if (window.require) {
            try {
                this.ipc = window.require('electron').ipcRenderer;
            } catch (e) {
                throw e;
            }
        } else {
            console.warn('Electron\'s IPC was not loaded');
        }

        this.send('get-board-port');

        this.on('backend-message', (event: any, message: BackEndMessage) => {
            this.zone.run(() => {
                this.backEndState.setBackendMessage(message);
            });
        });

        this.blocklyEditorState.sketchStatus$
            .pipe(withLatestFrom(this.blocklyEditorState.code$, this.robotState.robotType$, this.robotState.robotPort$))
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
                            name: robotType.name
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

        this.robotState.isRobotDriverInstalling$
            .pipe(filter(isInstalling => !!isInstalling))
            .pipe(withLatestFrom(this.robotState.robotType$))
            .subscribe(([, robotType]) => {
                this.send('install-board', robotType);
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
