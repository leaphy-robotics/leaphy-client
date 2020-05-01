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
                    case 'INSTALLATION_VERIFIED':
                        this.robotWiredState.setIsInstallationVerified(true);
                        break;
                    case 'NO_DEVICES_FOUND':
                        this.robotWiredState.setSelectedSerialDevice(null);
                        break;
                    case 'DEVICES_FOUND':
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
