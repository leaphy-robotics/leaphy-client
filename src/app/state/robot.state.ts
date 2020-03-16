import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RobotConnection } from '../domain/robot.connection';

@Injectable({
    providedIn: 'root'
})
export class RobotState {

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

    private robotConnectionKey = 'robotConnection';
    private robotIdSubject$: BehaviorSubject<string>;
    public robotId$: Observable<string>;

    private pairingCodeSubject$ = new BehaviorSubject<string>(null);
    public pairingCode$ = this.pairingCodeSubject$.asObservable();

    public setRobotId(robotId: string): void {
        console.log('Setting robotId:', robotId);
        const robotConnection = new RobotConnection(robotId);
        localStorage.setItem(this.robotConnectionKey, JSON.stringify(robotConnection));
        this.robotIdSubject$.next(robotId);
    }

    public setPairingCode(pairingCode: string): void {
        this.pairingCodeSubject$.next(pairingCode);
    }
}
