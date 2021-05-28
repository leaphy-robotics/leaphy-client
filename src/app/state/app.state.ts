import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RobotType } from '../domain/robot.type';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { Language } from '../domain/language';
import { CodeEditorType } from '../domain/code-editor.type';
import { LocalStorageService } from '../services/localstorage.service';
import { ReloadConfig } from '../domain/reload.config';

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

    constructor(private localStorage: LocalStorageService) {
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

        const currentLanguage = this.localStorage.fetch<Language>('currentLanguage');
        this.currentLanguageSubject$ = new BehaviorSubject(currentLanguage || Language.NL);
        this.currentLanguage$ = this.currentLanguageSubject$.asObservable();

        this.changedLanguageSubject$ = new BehaviorSubject(null);
        this.changedLanguage$ = this.changedLanguageSubject$
            .asObservable()
            .pipe(distinctUntilChanged());

        const reloadConfig = this.localStorage.fetch<ReloadConfig>('reloadConfig');
        this.reloadConfigSubject$ = new BehaviorSubject(reloadConfig);
        this.reloadConfig$ = this.reloadConfigSubject$.asObservable();
    }

    private isDesktopSubject$: BehaviorSubject<boolean>;
    public isDesktop$: Observable<boolean>;

    private reloadConfigSubject$: BehaviorSubject<ReloadConfig>;
    public reloadConfig$: Observable<ReloadConfig>;

    private isReloadRequestedSubject$ = new BehaviorSubject<boolean>(false);
    public isReloadRequested$ = this.isReloadRequestedSubject$.asObservable();

    public availableRobotTypes$: Observable<RobotType[]>;

    private selectedRobotTypeSubject$ = new BehaviorSubject<RobotType>(null);
    public selectedRobotType$ = this.selectedRobotTypeSubject$.asObservable();

    private availableLanguagesSubject$ = new BehaviorSubject<Language[]>([Language.EN, Language.NL]);
    public availableLanguages$ = this.availableLanguagesSubject$.asObservable();

    private currentLanguageSubject$: BehaviorSubject<Language>;
    public currentLanguage$: Observable<Language>

    private changedLanguageSubject$ : BehaviorSubject<Language>;
    public changedLanguage$: Observable<Language>;

    public isRobotWired$: Observable<boolean> = this.selectedRobotType$
        .pipe(filter(selectedRobotType => !!selectedRobotType))
        .pipe(map(selectedRobotType => selectedRobotType.isWired));

    private showHelpPageSubject$ = new BehaviorSubject<boolean>(false);
    public showHelpPage$ = this.showHelpPageSubject$.asObservable();

    private codeEditorTypeSubject$ = new BehaviorSubject<CodeEditorType>(CodeEditorType.Beginner);
    public codeEditorType$ = this.codeEditorTypeSubject$.asObservable();

    public setReloadConfig(reloadConfig: ReloadConfig) {
        if (!reloadConfig) this.localStorage.remove('reloadConfig');
        else this.localStorage.store('reloadConfig', reloadConfig);
    }

    public setIsReloadRequested(isRequested: boolean) {
        this.isReloadRequestedSubject$.next(isRequested);
    }

    public setSelectedRobotType(robotType: RobotType) {
        this.selectedRobotTypeSubject$.next(robotType);
    }

    public setChangedLanguage(language: Language) {
        this.localStorage.store('currentLanguage', language);
        this.changedLanguageSubject$.next(language);
    }

    public setCurrentLanguage(language: Language) {
        this.currentLanguageSubject$.next(language);
    }

    public setShowHelpPage(show: boolean) {
        this.showHelpPageSubject$.next(show);
    }

    public setCodeEditor(codeEditor: CodeEditorType) {
        this.codeEditorTypeSubject$.next(codeEditor);
    }
}
