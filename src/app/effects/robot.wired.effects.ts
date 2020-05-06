import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { BackEndState } from '../state/backend.state';
import { RobotWiredState } from '../state/robot.wired.state';
import { AppState } from '../state/app.state';

@Injectable({
    providedIn: 'root',
})

export class RobotWiredEffects {

    constructor(
        private robotWiredState: RobotWiredState,
        private backEndState: BackEndState,
        private appState: AppState
    ) {
        // React to messages from the Electron backend
        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .subscribe(message => {
                switch (message.event) {
                    case 'INSTALLATION_VERIFIED':
                        this.robotWiredState.setIsInstallationVerified(true);
                        break;
                    case 'NO_DEVICES_FOUND':
                        this.robotWiredState.setSerialDevices([]);
                        this.robotWiredState.setSelectedSerialDevice(null);
                        break;
                    case 'DEVICES_FOUND':
                        this.robotWiredState.setSerialDevices(message.message);
                        if(message.message.length === 1) {
                            this.robotWiredState.setSelectedSerialDevice(message.message[0]);
                        }
                        break;
                    default:
                        break;
                }
            });

        // Reset the Installation Verified flag and the serial device when a new robot type is selected
        this.appState.selectedRobotType$
            .pipe(filter(robotType => !!robotType))
            .subscribe(() => {
                this.robotWiredState.setIsInstallationVerified(false);
                this.robotWiredState.setSelectedSerialDevice(null);
            });

        this.robotWiredState.isRobotDriverInstalling$
            .pipe(filter(isInstalling => !!isInstalling))
            .subscribe(() => {
                this.robotWiredState.setIsRobotDriverInstalling(false);
            });

    }
}
