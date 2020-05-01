import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { BackEndState } from '../state/backend.state';
import { RobotWiredState } from '../state/robot.wired.state';

@Injectable({
    providedIn: 'root',
})

export class RobotWiredEffects {

    constructor(
        private robotCloudState: RobotWiredState,
        private backEndState: BackEndState
    ) {
        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .subscribe(message => {
                switch (message.event) {
                    case 'ROBOT_FOUND_ON_PORT':
                        this.robotCloudState.setRobotPort(message.message);
                        break;
                    default:
                        break;
                }
            });

        this.robotCloudState.isRobotDriverInstalling$
            .pipe(filter(isInstalling => !!isInstalling))
            .subscribe(() => {
                this.robotCloudState.setIsRobotDriverInstalling(false);
            });

    }
}
