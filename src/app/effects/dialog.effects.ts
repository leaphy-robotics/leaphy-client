import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { DialogState } from '../state/dialog.state';
import { ConnectWiredDialog } from '../modules/core/dialogs/connect.wired/connect.wired.dialog';
import { BackEndState } from '../state/backend.state';
import { ConnectionStatus } from '../domain/connection.status';
import { InstallDriverDialog } from '../modules/core/dialogs/install-driver/install-driver.dialog';
import { CreditsDialog } from '../modules/core/dialogs/credits/credits.dialog';
//import { PortalService } from './shared/portal.service';
import { RobotWiredState } from '../state/robot.wired.state';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Dialog that different state changes have
export class DialogEffects {

    constructor(
        private dialogState: DialogState,
        private backEndState: BackEndState,
        private robotWiredState: RobotWiredState,
        private dialog: MatDialog
    ) {
        // Open the connect dialog if closed when waiting for robot
        this.backEndState.connectionStatus$
            .pipe(withLatestFrom(this.dialogState.connectDialog$))
            .pipe(filter(([connectionStatus, dialogRef]) => connectionStatus === ConnectionStatus.WaitForRobot && !dialogRef))
            .subscribe(() => {
                const component = ConnectWiredDialog;
                const dialogRef = this.dialog.open(component, {
                    width: '450px',
                    disableClose: false,
                });
                this.dialogState.setConnectDialog(dialogRef);
            });

        // When the connect dialog is set, subscribe to the close event
        // So we can set the connect dialog to null after it closes
        this.dialogState.connectDialog$
            .pipe(filter(dialogRef => !!dialogRef))
            .pipe(switchMap(dialogRef => dialogRef.afterClosed()))
            .subscribe(() => {
                this.dialogState.setConnectDialog(null);
            });

        // Open the Serial window when serial messages start appearing
        this.robotWiredState.serialData$
            .pipe(filter(messages => messages.length === 1))
            .subscribe(() => {
                this.dialogState.setIsSerialOutputWindowOpen(true);
            });

        // React to messages received from the Backend
        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .subscribe(message => {
                switch (message.event) {
                    case 'DRIVER_INSTALLATION_REQUIRED':
                        const installDriverDialogComponent = InstallDriverDialog;
                        const installDriverDialogRef = this.dialog.open(installDriverDialogComponent, {
                            width: '450px',
                            disableClose: true,
                        });
                        this.dialogState.setConnectDialog(installDriverDialogRef);
                        break;
                    case 'FIRST_RUN':
                        const creditsDialogComponent = CreditsDialog;
                        const creditsDialogRef = this.dialog.open(creditsDialogComponent, {
                            width: '800px',
                            disableClose: true,
                        });
                        this.dialogState.setConnectDialog(creditsDialogRef);
                        break;

                    default:
                        break;
                }
            });
    }

}
