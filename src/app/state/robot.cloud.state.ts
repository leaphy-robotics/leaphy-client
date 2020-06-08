import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RobotCloudState {
    private robotIdSubject$ = new BehaviorSubject<string>(null);
    public robotId$ = this.robotIdSubject$.asObservable();

    private pairingCodeSubject$ = new BehaviorSubject<string>(null);
    public pairingCode$ = this.pairingCodeSubject$.asObservable();

    public setRobotId(robotId: string): void {
        this.robotIdSubject$.next(robotId);
    }

    public setPairingCode(pairingCode: string): void {
        this.pairingCodeSubject$.next(pairingCode);
    }
}
