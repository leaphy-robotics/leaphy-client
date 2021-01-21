import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, scan } from 'rxjs/operators';
import { SerialDevice } from '../domain/serial.device';

@Injectable({
    providedIn: 'root'
})
export class RobotWiredState {

    private isInstallationVerifiedSubject$ = new BehaviorSubject<boolean>(false);
    public isInstallationVerified$ = this.isInstallationVerifiedSubject$.asObservable();

    private serialDevicesToTrySubject$ = new BehaviorSubject<SerialDevice[]>([]);
    public serialDevicesToTry$ = this.serialDevicesToTrySubject$.asObservable();

    private isRobotDriverInstallingSubject$ = new BehaviorSubject<boolean>(false);
    public isRobotDriverInstalling$ = this.isRobotDriverInstallingSubject$.asObservable();

    private verifiedSerialDeviceSubject$ = new BehaviorSubject<SerialDevice>(null);
    public verifiedSerialDevice$ = this.verifiedSerialDeviceSubject$.asObservable();

    private incomingSerialDataSubject$ = new BehaviorSubject<any>(null);
    public serialData$ = this.incomingSerialDataSubject$.asObservable()
        .pipe(filter(current => !!current))
        .pipe(scan((all, current) => [...all, current], []));

    public setIsInstallationVerified(isVerified: boolean): void {
        this.isInstallationVerifiedSubject$.next(isVerified);
    }

    public setSerialDevicesToTry(serialDevices: SerialDevice[]) {
        this.serialDevicesToTrySubject$.next(serialDevices);
    }

    public setVerifiedSerialDevice(serialDevice: SerialDevice): void {
        this.verifiedSerialDeviceSubject$.next(serialDevice);
    }

    public setIsRobotDriverInstalling(isInstalling: boolean): void {
        this.isRobotDriverInstallingSubject$.next(isInstalling);
    }

    public setIncomingSerialData(data: any): void {
        this.incomingSerialDataSubject$.next(data);
    }
}
