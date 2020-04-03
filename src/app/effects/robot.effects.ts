import { Injectable } from '@angular/core';
import { filter, switchMap, tap } from 'rxjs/operators';
import { DialogState } from '../state/dialog.state';
import { RobotState } from '../state/robot.state';
import { BackEndState } from '../state/backend.state';

@Injectable({
    providedIn: 'root',
})

export class RobotEffects {

    constructor(
        private robotState: RobotState,
        private dialogState: DialogState,
        private backEndState: BackEndState
    ) {

        this.dialogState.connectDialog$
            .pipe(filter(dialogRef => !!dialogRef))
            .pipe(switchMap(dialogRef => dialogRef.afterClosed()))
            .subscribe(result => {
                console.log(result);
                this.robotState.setPairingCode(result);
            });

        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .subscribe(message => {
                console.log('Received message from backend:', message);
                switch (message.event) {
                    case 'CLIENT_PAIRED_WITH_ROBOT':
                        this.robotState.setRobotId(message.message);
                        break;
                    case 'ROBOT_FOUND_ON_PORT':
                        this.robotState.setRobotPort(message.message);
                        break;
                    default:
                        break;
                }
            });
    }
}
