import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RobotType } from '../domain/robot.type';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { Language } from '../domain/language';
import { UserMode } from '../domain/user.mode';

@Injectable({
    providedIn: 'root'
})
export class AppState {
    // tslint:disable: max-line-length
    private leaphyOriginalRobotType = new RobotType('l_original', 'Leaphy Original', 'orig.svg', 'Arduino UNO', 'arduino:avr:uno', 'hex', 'arduino:avr', ['Leaphy Original Extension', 'Leaphy Extra Extension', 'Servo']);
    private leaphyFlitzRobotType = new RobotType('l_flitz', 'Leaphy Flitz', 'flitz.svg', 'Arduino UNO', 'arduino:avr:uno', 'hex', 'arduino:avr', ['Leaphy Extra Extension', 'Servo'], true, false);
    private leaphyClickRobotType = new RobotType('l_click', 'Leaphy Click', 'click.svg', 'Arduino UNO', 'arduino:avr:uno', 'hex', 'arduino:avr', ['Leaphy Extra Extension', 'Servo']);
    private arduinoUnoRobotType = new RobotType('l_uno', 'Arduino Uno', 'uno.svg', 'Arduino UNO', 'arduino:avr:uno', 'hex', 'arduino:avr', ['Leaphy Extra Extension', 'Servo']);
    private leaphyWiFiRobotType = new RobotType('l_wifi', 'Leaphy WiFi', 'wifi.svg', 'NodeMCU', 'esp8266:esp8266:nodemcuv2', 'bin', 'esp8266:esp8266', ['Leaphy WiFi Extension', 'Leaphy Extra Extension', 'Servo'], false);
    // tslint:enable: max-line-length

    constructor() {
        if (window.require) {
            this.isDesktopSubject$ = new BehaviorSubject<boolean>(true);
        } else {
            this.isDesktopSubject$ = new BehaviorSubject<boolean>(false);
        }
        this.isDesktop$ = this.isDesktopSubject$.asObservable();
        this.availableRobotTypes$ = this.isDesktop$
            .pipe(map(isDesktop => {
                if (isDesktop) {
                    return [this.leaphyFlitzRobotType, this.leaphyOriginalRobotType, this.leaphyClickRobotType, this.arduinoUnoRobotType]
                } else {
                    return [this.leaphyWiFiRobotType]
                }
            }));
    }

    private isDesktopSubject$: BehaviorSubject<boolean>;
    public isDesktop$: Observable<boolean>;

    public availableRobotTypes$: Observable<RobotType[]>;

    private selectedRobotTypeSubject$ = new BehaviorSubject<RobotType>(null);
    public selectedRobotType$ = this.selectedRobotTypeSubject$.asObservable()
        //.pipe(distinctUntilChanged())
        ;

    private defaultLanguageSubject$ = new BehaviorSubject<Language>(Language.NL);
    public defaultLanguage$ = this.defaultLanguageSubject$.asObservable();

    private selectedLanguageSubject$ = new BehaviorSubject<Language>(Language.NL);
    public selectedLanguage$ = this.selectedLanguageSubject$.asObservable();

    public isRobotWired$: Observable<boolean> = this.selectedRobotType$
        .pipe(filter(selectedRobotType => !!selectedRobotType))
        .pipe(map(selectedRobotType => selectedRobotType.isWired));

    private showHelpPageSubject$ = new BehaviorSubject<boolean>(false);
    public showHelpPage$ = this.showHelpPageSubject$.asObservable();

    private userModeSubject$ = new BehaviorSubject<UserMode>(UserMode.Beginner);
    public userMode$ = this.userModeSubject$.asObservable();

    public setSelectedRobotType(robotType: RobotType) {
        this.selectedRobotTypeSubject$.next(robotType);
    }

    public setSelectedLanguage(language: Language) {
        this.selectedLanguageSubject$.next(language);
    }

    public setShowHelpPage(show: boolean) {
        this.showHelpPageSubject$.next(show);
    }

    public setUserMode(userMode: UserMode) {
        this.userModeSubject$.next(userMode);
    }
}
