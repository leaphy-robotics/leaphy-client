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

    private verifiedSerialDeviceSubject$ = new BehaviorSubject<SerialDevice>(null);
    public verifiedSerialDevice$ = this.verifiedSerialDeviceSubject$.asObservable();

    private incomingSerialDataSubject$ = new BehaviorSubject<any>(null);
    public serialData$ = this.incomingSerialDataSubject$.asObservable()
        .pipe(filter(incoming => !!incoming))
        .pipe(scan((all, incoming) => {
            if(incoming.toString() === this.poisonPill){
                return [];
            }
            return [...all, { time: new Date(), data: incoming }]
        },[]));

    public setIsInstallationVerified(isVerified: boolean): void {
        this.isInstallationVerifiedSubject$.next(isVerified);
    }

    public setSerialDevicesToTry(serialDevices: SerialDevice[]) {
        this.serialDevicesToTrySubject$.next(serialDevices);
    }

    public setVerifiedSerialDevice(serialDevice: SerialDevice): void {
        this.verifiedSerialDeviceSubject$.next(serialDevice);
    }

    public setIncomingSerialData(data: any): void {
        this.incomingSerialDataSubject$.next(data);
    }

    public clearSerialData(): void {
        this.setIncomingSerialData(this.poisonPill);
    }

    private readonly poisonPill: string = "caaa61a6-a666-4c0b-83b4-ebc75b08fecb"
}
