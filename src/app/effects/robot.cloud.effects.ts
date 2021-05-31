import { Injectable } from '@angular/core';
import { filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { DialogState } from '../state/dialog.state';
import { RobotCloudState } from '../state/robot.cloud.state';
import { BackEndState } from '../state/backend.state';
import { AppState } from '../state/app.state';
import { LocalStorageService } from '../services/localstorage.service';
import { RobotConnection } from '../domain/robot.connection';

@Injectable({
    providedIn: 'root',
})

export class RobotCloudEffects {

    constructor(
        private robotCloudState: RobotCloudState,
        private appState: AppState,
        private dialogState: DialogState,
        private backEndState: BackEndState,
        private localstorageService: LocalStorageService
    ) {

        this.appState.selectedRobotType$
            .pipe(withLatestFrom(this.appState.isRobotWired$))
            .pipe(filter(([, isRobotWired]) => !isRobotWired))
            .subscribe(([robotType,]) => {
                const robotConnection = this.localstorageService.fetch<RobotConnection>(robotType.name);
                const ticksThreeHoursAgo = Date.now() - (3 * 60 * 60 * 1000);
                if (!robotConnection || !robotConnection.robotId || robotConnection.lastActive < ticksThreeHoursAgo) {
                    this.localstorageService.remove(robotType.name);
                    this.robotCloudState.setRobotId(null);
                } else {
                    const freshRobotConnection = new RobotConnection(robotConnection.robotId);
                    this.localstorageService.store(robotType.name, freshRobotConnection);
                    this.robotCloudState.setRobotId(robotConnection.robotId);
                }
            });

        this.dialogState.connectDialog$
            .pipe(filter(dialogRef => !!dialogRef))
            .pipe(switchMap(dialogRef => dialogRef.afterClosed()))
            .subscribe(result => {
                this.robotCloudState.setPairingCode(result);
            });

        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .subscribe(message => {
                switch (message.event) {
                    case 'CLIENT_PAIRED_WITH_ROBOT':
                        this.robotCloudState.setRobotId(message.payload);
                        break;
                    default:
                        break;
                }
            });
    }
}
