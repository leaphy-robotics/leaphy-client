import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConnectCloudDialog } from '../dialogs/connect.cloud/connect.cloud.dialog';
import { filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { DialogState } from '../state/dialog.state';
import { RobotState } from '../state/robot.state';
import { ConnectWiredDialog } from '../dialogs/connect.wired/connect.wired.dialog';

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
            .pipe(withLatestFrom(this.robotState.robotPort$, this.robotState.pairingCode$))
            .subscribe(([, robotPort, pairingCode]) => {
                let component: any;
                let data: any;
                if (robotPort === 'OTA') {
                    component = ConnectCloudDialog;
                    data = { pairingCode };
                } else {
                    component = ConnectWiredDialog;
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
