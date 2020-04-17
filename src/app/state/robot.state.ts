import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RobotConnection } from '../domain/robot.connection';
import { RobotType } from '../domain/robot.type';

@Injectable({
    providedIn: 'root'
})
export class RobotState {
    private robotConnectionKey = 'robotConnection';
    private defaultRobotType = new RobotType('Leaphy Original', 'Arduino UNO', 'arduino:avr:uno', 'hex', 'arduino:avr', ['Leaphy Original Extension']);

    constructor() {
        // Get the robotConnection from localStorage
        const robotConnection = JSON.parse(localStorage.getItem(this.robotConnectionKey)) as RobotConnection;
        console.log('Found robotConnection in localstorage:', robotConnection);
        // If it's older than x, clear it
        const ticksThreeHoursAgo = Date.now() - (3 * 60 * 60 * 1000);
        if (!robotConnection || !robotConnection.robotId || robotConnection.lastActive < ticksThreeHoursAgo) {
            localStorage.removeItem(this.robotConnectionKey);
            this.robotIdSubject$ = new BehaviorSubject<string>(null);
        } else {
            this.robotIdSubject$ = new BehaviorSubject<string>(robotConnection.robotId);
        }
        this.robotId$ = this.robotIdSubject$.asObservable();
    }

    private robotIdSubject$: BehaviorSubject<string>;
    public robotId$: Observable<string>;

    private pairingCodeSubject$ = new BehaviorSubject<string>(null);
    public pairingCode$ = this.pairingCodeSubject$.asObservable();

    private robotTypeSubject$ = new BehaviorSubject<RobotType>(this.defaultRobotType);
    public robotType$ = this.robotTypeSubject$.asObservable();

    private robotPortSubject$ = new BehaviorSubject<string>(null);
    public robotPort$ = this.robotPortSubject$.asObservable();

    private isRobotDriverInstallingSubject$ = new BehaviorSubject<boolean>(false);
    public isRobotDriverInstalling$ = this.isRobotDriverInstallingSubject$.asObservable();

    public setRobotId(robotId: string): void {
        const robotConnection = new RobotConnection(robotId);
        localStorage.setItem(this.robotConnectionKey, JSON.stringify(robotConnection));
        this.robotIdSubject$.next(robotId);
    }

    public setPairingCode(pairingCode: string): void {
        this.pairingCodeSubject$.next(pairingCode);
    }

    public setRobotType(robotType: RobotType) {
        this.robotTypeSubject$.next(robotType);
    }

    public setRobotPort(robotPort: string): void {
        this.robotPortSubject$.next(robotPort);
    }

    public setIsRobotDriverInstalling(isInstalling: boolean): void {
        this.isRobotDriverInstallingSubject$.next(isInstalling);
    }
}
