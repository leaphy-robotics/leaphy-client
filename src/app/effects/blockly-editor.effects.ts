import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch.status';
import { combineLatest } from 'rxjs';
import { BackEndState } from '../state/back-end.state';
import { ConnectionStatus } from '../domain/connection.status';

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
    }
}
