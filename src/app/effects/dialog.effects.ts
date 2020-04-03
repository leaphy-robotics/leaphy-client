import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConnectDialogComponent } from '../dialogs/connect-dialog/connect-dialog.component';
import { filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { DialogState } from '../state/dialog.state';
import { RobotState } from '../state/robot.state';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Dialog that different state changes have
export class DialogEffects {

    constructor(
        private robotState: RobotState,
        private dialogState: DialogState,
        private dialog: MatDialog
    ) {
        this.dialogState.isConnectDialogVisible$
            .pipe(filter(isVisible => !!isVisible))
            .pipe(withLatestFrom(this.robotState.pairingCode$))
            .subscribe(([, pairingCode]) => {
                const dialogRef = this.dialog.open(ConnectDialogComponent, {
                    width: '450px',
                    data: { pairingCode }
                });
                this.dialogState.setConnectDialog(dialogRef);
            });

        this.dialogState.connectDialog$
            .pipe(filter(dialogRef => !!dialogRef))
            .pipe(switchMap(dialogRef => dialogRef.afterClosed()))
            .subscribe(() => {
                this.dialogState.setConnectDialog(null);
            });

    }
}
