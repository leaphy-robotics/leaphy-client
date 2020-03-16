import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch.status';
import { combineLatest } from 'rxjs';
import { BackEndState } from '../state/back-end.state';
import { ConnectionStatus } from '../domain/connection.status';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Editor that different state changes have
export class BlocklyEditorEffects {

    constructor(
        private blocklyEditorState: BlocklyEditorState,
        private backEndState: BackEndState
    ) {

        combineLatest([this.blocklyEditorState.code$, this.backEndState.connectionStatus$])
            .subscribe(([code, connectionStatus]) => {
                switch (connectionStatus) {
                    case ConnectionStatus.Disconnected:
                    case ConnectionStatus.ConnectedToBackend:
                    case ConnectionStatus.WaitForRobot:
                        this.blocklyEditorState.setSketchStatus(SketchStatus.UnableToSend);
                        break;
                    case ConnectionStatus.PairedWithRobot:
                        if (code) {
                            this.blocklyEditorState.setSketchStatus(SketchStatus.ReadyToSend);
                        }
                        break;
                    default:
                        break;
                }
            });

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
                        this.blocklyEditorState.setSketchStatus(SketchStatus.ReadyToSend);
                        this.blocklyEditorState.setSketchStatusMessage('');
                        break;
                    default:
                        break;
                }

            });

    }
}
