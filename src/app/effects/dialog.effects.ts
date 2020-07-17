import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { DialogState } from '../state/dialog.state';
import { ConnectWiredDialog } from '../dialogs/connect.wired/connect.wired.dialog';
import { BackEndState } from '../state/backend.state';
import { ConnectionStatus } from '../domain/connection.status';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Dialog that different state changes have
export class DialogEffects {

    constructor(
        private dialogState: DialogState,
        private backEndState: BackEndState,
        private dialog: MatDialog
    ) {
        // Open the connect dialog if closed when waiting for robot
        this.backEndState.connectionStatus$
            .pipe(withLatestFrom(this.dialogState.connectDialog$))
            .pipe(filter(([connectionStatus, dialog]) => connectionStatus == ConnectionStatus.WaitForRobot && !dialog))
            .subscribe(() => {
                console.log('Opening connect instructions dialog');
                const component = ConnectWiredDialog;
                const dialogRef = this.dialog.open(component, {
                    width: '450px',
                    disableClose: false,
                });
                this.dialogState.setConnectDialog(dialogRef);
            });

        // Set the connect dialog to null after it closes
        this.dialogState.connectDialog$
            .pipe(filter(dialogRef => !!dialogRef))
            .pipe(switchMap(dialogRef => dialogRef.afterClosed()))
            .subscribe(() => {
                console.log('Dialog after close');
                this.dialogState.setConnectDialog(null);
            });
    }
}
