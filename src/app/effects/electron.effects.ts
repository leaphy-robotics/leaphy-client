import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { filter, withLatestFrom } from 'rxjs/operators';
import { BackEndState } from '../state/back-end.state';
import { RobotState } from '../state/robot.state';

import { IpcRenderer } from 'electron';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Electron environment that different state changes have
export class ElectronEffects {

    private ipc: IpcRenderer | undefined;

    constructor(
        private blocklyEditorState: BlocklyEditorState,
        private backEndState: BackEndState
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

        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .pipe(withLatestFrom(this.blocklyEditorState.sketchStatus$))
            .subscribe(([message, sketchStatus]) => {
                console.log('Received message from websockets:', message);
                switch (message.event) {
                    default:
                        break;
                }
            });

        this.on('compilation-complete', (event: any) => {
            console.log('Got a pong from electron', event);
        });
        this.blocklyEditorState.isSideNavOpen$
            .pipe(withLatestFrom(this.blocklyEditorState.code$))
            .subscribe(([, code]) => {
                this.send('compile', code);
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
