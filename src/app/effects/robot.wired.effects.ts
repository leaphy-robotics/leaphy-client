import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { BackEndState } from '../state/backend.state';
import { RobotWiredState } from '../state/robot.wired.state';

@Injectable({
    providedIn: 'root',
})

export class RobotWiredEffects {

    constructor(
        private robotWiredState: RobotWiredState,
        private backEndState: BackEndState
    ) {
        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .subscribe(message => {
                switch (message.event) {
                    case 'NO_DEVICES_FOUND':
                        this.robotWiredState.setRobotPort(null);
                        break;
                    case 'DEVICES_FOUND':
                        console.log('Received DEVICES_FOUND event:', message.message);
                        this.robotWiredState.setSerialDevices(message.message);
                        break;
                    default:
                        break;
                }
            });

        this.robotWiredState.isRobotDriverInstalling$
            .pipe(filter(isInstalling => !!isInstalling))
            .subscribe(() => {
                this.robotWiredState.setIsRobotDriverInstalling(false);
            });

    }
}
