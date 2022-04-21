import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { DialogState } from '../state/dialog.state';
import { ConnectWiredDialog } from '../modules/core/dialogs/connect.wired/connect.wired.dialog';
import { BackEndState } from '../state/backend.state';
import { ConnectionStatus } from '../domain/connection.status';
import { InstallDriverDialog } from '../modules/core/dialogs/install-driver/install-driver.dialog';
import { CreditsDialog } from '../modules/core/dialogs/credits/credits.dialog';
import { RobotWiredState } from '../state/robot.wired.state';
import { InfoDialog } from '../modules/core/dialogs/info/info.dialog';
import { AppState } from '../state/app.state';
import { ConfirmEditorDialog } from '../modules/core/dialogs/confirm-editor/confirm-editor.dialog';
import { CodeEditorState } from '../state/code-editor.state';
import { LanguageSelectDialog } from '../modules/core/dialogs/language-select/language-select.dialog';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Dialog that different state changes have
export class DialogEffects {

    constructor(
        private dialogState: DialogState,
        private appState: AppState,
        private codeEditorState: CodeEditorState,
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

        // When the info dialog visibility is set to true, open the dialog
        this.dialogState.isInfoDialogVisible$
            .pipe(filter(isVisible => !!isVisible))
            .subscribe(() => {
                this.dialog.open(InfoDialog, {
                    width: "800px",
                    disableClose: true,
                });
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
            .subscribe(() => {
                this.dialogState.setIsSerialOutputWindowOpen(true);
            });

        // If the focus is set but the serial dialog is not open, open it
        this.dialogState.isSerialOutputFocus$
            .pipe(withLatestFrom(this.dialogState.isSerialOutputWindowOpen$))
            .pipe(filter(([isFocus, isOpen]) => isFocus && !isOpen))
            .subscribe(() => {
                this.dialogState.setIsSerialOutputWindowOpen(true);
            });

        const showInstallDriverDialog = () => {
            const installDriverDialogComponent = InstallDriverDialog;
            const installDriverDialogRef = this.dialog.open(installDriverDialogComponent, {
                width: '450px',
                disableClose: true,
            });
            this.dialogState.setConnectDialog(installDriverDialogRef);
        }

        // If driver install is requested, show the dialog
        this.backEndState.isDriverInstalling$
            .pipe(filter(install => !!install))
            .subscribe(showInstallDriverDialog);

        // If the editor change needs confirmation, show the confirmation dialog
        this.appState.isCodeEditorToggleRequested$
            .pipe(withLatestFrom(this.appState.isCodeEditorToggleConfirmed$, this.codeEditorState.isDirty$))
            .pipe(filter(([requested, confirmed, isDirty]) => !!requested && !confirmed && isDirty))
            .subscribe(() => this.dialogState.setIsEditorTypeChangeConfirmationDialogVisible(true));

        // When the info dialog visibility is set to true, open the dialog
        this.dialogState.isEditorTypeChangeConfirmationDialogVisible$
            .pipe(filter(isVisible => !!isVisible))
            .subscribe(() => {
                this.dialog.open(ConfirmEditorDialog, {
                    width: "450px",
                    disableClose: true,
                });
            });

        // React to messages received from the Backend
        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .subscribe(message => {
                switch (message.event) {
                    case 'DRIVER_INSTALLATION_REQUIRED':
                        showInstallDriverDialog();
                        break;
                    case 'FIRST_RUN':

                        const languageSelectionDialogComponent = LanguageSelectDialog;
                        const languageDialogRef = this.dialog.open(languageSelectionDialogComponent, {
                            width: '450px',
                            disableClose: true,
                        });
                        this.dialogState.setConnectDialog(languageDialogRef);

                        languageDialogRef.afterClosed().subscribe(() => {
                            const creditsDialogComponent = CreditsDialog;
                            const creditsDialogRef = this.dialog.open(creditsDialogComponent, {
                                width: '800px',
                                disableClose: true,
                            });
                            this.dialogState.setConnectDialog(creditsDialogRef);
                        });

                        break;

                    default:
                        break;
                }
            });
    }
}
