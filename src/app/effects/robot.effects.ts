import { Injectable } from '@angular/core';
import { filter, switchMap } from 'rxjs/operators';
import { DialogState } from '../state/dialog.state';
import { RobotState } from '../state/robot.state';

@Injectable({
    providedIn: 'root',
})

export class RobotEffects {

    constructor(
        private robotState: RobotState,
        private dialogState: DialogState
    ) {

        this.dialogState.connectDialog$
            .pipe(filter(dialogRef => !!dialogRef))
            .pipe(switchMap(dialogRef => dialogRef.afterClosed()))
            .subscribe(result => {
                this.robotState.setPairingCode(result);
            });
    }
}
