import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConnectCloudDialog } from '../dialogs/connect.cloud/connect.cloud.dialog';
import { filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { DialogState } from '../state/dialog.state';
import { RobotCloudState } from '../state/robot.cloud.state';
import { ConnectWiredDialog } from '../dialogs/connect.wired/connect.wired.dialog';
import { AppState } from '../state/app.state';
import { BackEndState } from '../state/backend.state';
import { ConnectionStatus } from '../domain/connection.status';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Dialog that different state changes have
export class DialogEffects {

    constructor(
        private dialogState: DialogState,
        private appState: AppState,
        private robotCloudState: RobotCloudState,
        private backEndState: BackEndState,
        private dialog: MatDialog
    ) {
        // Open the connect dialog if closed when starting to detect devices
        this.backEndState.connectionStatus$
            .pipe(withLatestFrom(this.dialogState.isConnectDialogVisible$))
            .pipe(filter(([,isDialogVisible]) => !isDialogVisible))
            .subscribe(([connectionStatus,]) => {
                switch (connectionStatus) {
                    case ConnectionStatus.DetectingDevices:
                        this.dialogState.toggleIsConnectDialogVisible();
                }
            });

        // Close the dialog when the isConnectDialogVisible is set to false
        this.dialogState.isConnectDialogVisible$
            .pipe(withLatestFrom(this.dialogState.connectDialog$))
            .pipe(filter(([isVisible, dialogRef]) => !isVisible && !!dialogRef))
            .subscribe(([, dialogRef]) => dialogRef.close());

        this.dialogState.isConnectDialogVisible$
            .pipe(filter(isVisible => !!isVisible))
            .pipe(withLatestFrom(this.appState.isRobotWired$, this.robotCloudState.pairingCode$))
            .subscribe(([, isRobotWired, pairingCode]) => {
                let component: any;
                let data: any;
                if (isRobotWired) {
                    component = ConnectWiredDialog;
                } else {
                    component = ConnectCloudDialog;
                    data = { pairingCode };
                }
                const dialogRef = this.dialog.open(component, {
                    width: '450px',
                    data
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
