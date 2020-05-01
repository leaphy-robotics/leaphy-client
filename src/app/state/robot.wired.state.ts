import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SerialDevice } from '../domain/serial.device';

@Injectable({
    providedIn: 'root'
})
export class RobotWiredState {

    private isInstallationVerifiedSubject$ = new BehaviorSubject<boolean>(false);
    public isInstallationVerified$ = this.isInstallationVerifiedSubject$.asObservable();

    private serialDevicesSubject$ = new BehaviorSubject<SerialDevice[]>([]);
    public serialDevices$ = this.serialDevicesSubject$.asObservable();

    private isRobotDriverInstallingSubject$ = new BehaviorSubject<boolean>(false);
    public isRobotDriverInstalling$ = this.isRobotDriverInstallingSubject$.asObservable();

    private selectedSerialDeviceSubject$ = new BehaviorSubject<SerialDevice>(null);
    public selectedSerialDevice$ = this.selectedSerialDeviceSubject$.asObservable();

    public setIsInstallationVerified(isVerified: boolean): void {
        this.isInstallationVerifiedSubject$.next(isVerified);
    }

    public setSerialDevices(serialDevices: SerialDevice[]) {
        this.serialDevicesSubject$.next(serialDevices);
    }

    public setSelectedSerialDevice(serialDevice: SerialDevice): void {
        this.selectedSerialDeviceSubject$.next(serialDevice);
    }

    public setIsRobotDriverInstalling(isInstalling: boolean): void {
        this.isRobotDriverInstallingSubject$.next(isInstalling);
    }
}
