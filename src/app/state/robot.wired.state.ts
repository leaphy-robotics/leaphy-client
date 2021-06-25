import { Injectable } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';
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
    public serialData$: Observable<{ time: Date, data: string }[]> = this.incomingSerialDataSubject$.asObservable()
        .pipe(filter(incoming => !!incoming))
        .pipe(scan((all, incoming) => {
            if (incoming.toString() === this.poisonPill) {
                return [];
            }
            return [...all, { time: new Date(), data: String(incoming) }]
        }, []));

    public serialChartDataSets$: Observable<ChartDataSets[]> = this.serialData$
        .pipe(filter(data => !!data))
        .pipe(map(data => {
            const dataSets: ChartDataSets[] = data.reduce((sets, item) => {
                // split the item if possible
                var [label, valueStr] = item.data.split(' = ');
                var value = Number(valueStr);

                // If it can't be parsed, move to next item
                if(!label || value === NaN) return sets;

                const dataPoint = { x: item.time, y: value}
                // Find the set with the label
                const labelSet = sets.find(s => s.label === label);

                // If it's already there, push a data point into it
                if(labelSet) labelSet.data.push(dataPoint)
                // Else create the new dataset
                else sets.push({label, data: [dataPoint]});

                return sets;
            }, [])
            return dataSets;
        }));

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

    public clearSerialData(): void {
        this.setIncomingSerialData(this.poisonPill);
    }

    private readonly poisonPill: string = "caaa61a6-a666-4c0b-83b4-ebc75b08fecb"
}
