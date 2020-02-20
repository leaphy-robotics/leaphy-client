import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch.status';
import { combineLatest, of } from 'rxjs';
import { BackEndState } from '../state/back-end.state';
import { ConnectionStatus } from '../domain/connection.status';
import { MatDialog } from '@angular/material/dialog';
import { ConnectDialogComponent } from '../dialogs/connect-dialog/connect-dialog.component';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Editor that different state changes have
export class BlocklyEditorEffects {

    constructor(
        private blocklyEditorState: BlocklyEditorState,
        private backEndState: BackEndState,
        private dialog: MatDialog
    ) {

        combineLatest([this.blocklyEditorState.code$, this.backEndState.connectionStatus$])
            .subscribe(([code, connectionStatus]) => {
                switch (connectionStatus) {
                    case ConnectionStatus.Disconnected:
                    case ConnectionStatus.Connected:
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

        this.blocklyEditorState.isConnectDialogVisibleOpen$
            .subscribe(isVisible => {
                console.log('Visible', isVisible);
                if (isVisible) {
                    const dialogRef = this.dialog.open(ConnectDialogComponent, {
                        width: '450px',
                        data: { name: 'test' }
                    });

                    dialogRef.afterClosed().subscribe(result => {
                        console.log('The dialog was closed');
                        console.log(result);
                    });

                }
            });
    }
}
