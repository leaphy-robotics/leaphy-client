import { Injectable } from '@angular/core';
import { filter, switchMap, tap } from 'rxjs/operators';
import { DialogState } from '../state/dialog.state';
import { RobotState } from '../state/robot.state';
import { BackEndState } from '../state/back-end.state';

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
            .pipe(filter(message => message.event === 'CLIENT_PAIRED_WITH_ROBOT'))
            .subscribe(message => this.robotState.setRobotId(message.message));
    }
}
