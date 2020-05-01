import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SerialDevice } from '../domain/serial.device';

@Injectable({
    providedIn: 'root'
})
export class RobotWiredState {

    private serialDevicesSubject$ = new BehaviorSubject<SerialDevice[]>([]);
    public serialDevices$ = this.serialDevicesSubject$.asObservable();

    private robotPortSubject$ = new BehaviorSubject<string>(null);
    public robotPort$ = this.robotPortSubject$.asObservable();

    private isRobotDriverInstallingSubject$ = new BehaviorSubject<boolean>(false);
    public isRobotDriverInstalling$ = this.isRobotDriverInstallingSubject$.asObservable();

    public setSerialDevices(serialDevices: SerialDevice[]) {
        this.serialDevicesSubject$.next(serialDevices);
    }

    public setRobotPort(robotPort: string): void {
        this.robotPortSubject$.next(robotPort);
    }

    public setIsRobotDriverInstalling(isInstalling: boolean): void {
        this.isRobotDriverInstallingSubject$.next(isInstalling);
    }
}
