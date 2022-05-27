import { Injectable } from '@angular/core';
import { ChartDataset } from 'chart.js';
import { ReplaySubject } from 'rxjs';
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

    private incomingSerialDataSubject$ = new ReplaySubject<{ time: Date, data: string }>();
    public serialData$: Observable<{ time: Date, data: string }[]> = this.incomingSerialDataSubject$
        .pipe(filter(output => !!output))
        .pipe(scan((all, incoming) => {
            if (incoming.data === this.poisonPill) {
                return [];
            }
            return all.concat(incoming);
        }, []));

    public serialChartDataSets$: Observable<ChartDataset[]> = this.serialData$
        .pipe(map(data => {
            const dataSets: ChartDataset[] = data.reduce((sets, item) => {
                var [label, valueStr] = item.data.split(' = ');

                // If it can't be parsed, move to next item
                if (!label || !valueStr) return sets;

                var value = Number(valueStr);

                const dataPoint = { x: item.time, y: value }
                // Find the set with the label
                const labelSet = sets.find(s => s.label === label);

                // If it's already there, push a data point into it
                if (labelSet) labelSet.data.push(dataPoint)
                // Else create the new dataset
                else sets.push({ label, data: [dataPoint] });

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

    public setIncomingSerialData(data: { time: Date, data: string }): void {
        this.incomingSerialDataSubject$.next(data);
    }

    public clearSerialData(): void {
        this.setIncomingSerialData({ time: new Date(), data: this.poisonPill });
    }

    private readonly poisonPill: string = "caaa61a6-a666-4c0b-83b4-ebc75b08fecb"
}
