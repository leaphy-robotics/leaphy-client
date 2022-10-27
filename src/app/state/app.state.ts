import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { RobotType } from '../domain/robot.type';
import { map, filter } from 'rxjs/operators';
import { Language } from '../domain/language';
import { CodeEditorType } from '../domain/code-editor.type';
import { LocalStorageService } from '../services/localstorage.service';
import { ReloadConfig } from '../domain/reload.config';
import packageJson from '../../../package.json';

@Injectable({
    providedIn: 'root'
})
export class AppState {
    /* eslint-disable max-len */
    private leaphyOriginalRobotType = new RobotType('l_original', 'Leaphy Original', 'orig.svg', 'Arduino UNO', 'arduino:avr:uno', 'hex', 'arduino:avr',
        ['Leaphy Original Extension', 'Leaphy Extra Extension', 'Servo', 'Adafruit GFX Library', 'Adafruit SSD1306', 'Adafruit LSM9DS1 Library', 'Adafruit Unified Sensor']
    );
    private leaphyFlitzRobotType = new RobotType('l_flitz', 'Leaphy Flitz', 'flitz.svg', 'Arduino UNO', 'arduino:avr:uno', 'hex', 'arduino:avr',
        ['Leaphy Extra Extension', 'Servo', 'Adafruit GFX Library', 'Adafruit SSD1306', 'Adafruit LSM9DS1 Library', 'Adafruit Unified Sensor'], true, false, false
    );
    private leaphyClickRobotType = new RobotType('l_click', 'Leaphy Click', 'click.svg', 'Arduino UNO', 'arduino:avr:uno', 'hex', 'arduino:avr',
        ['Leaphy Extra Extension', 'Servo']
    );
    private arduinoUnoRobotType = new RobotType('l_uno', 'Arduino Uno', 'uno.svg', 'Arduino UNO', 'arduino:avr:uno', 'hex', 'arduino:avr',
        ['Leaphy Extra Extension', 'Servo', 'Adafruit GFX Library', 'Adafruit SSD1306', 'Adafruit LSM9DS1 Library', 'Adafruit Unified Sensor']
    );
    private leaphyWiFiRobotType = new RobotType('l_wifi', 'Leaphy WiFi', 'wifi.svg', 'NodeMCU', 'esp8266:esp8266:nodemcuv2', 'bin', 'esp8266:esp8266',
        ['Leaphy WiFi Extension', 'Leaphy Extra Extension', 'Servo', 'Adafruit GFX Library', 'Adafruit SSD1306', 'Adafruit LSM9DS1 Library', 'Adafruit Unified Sensor'], false
    );
    public genericRobotType = new RobotType('l_code', 'Generic Robot', null, 'Arduino UNO', 'arduino:avr:uno', 'hex', 'arduino:avr',
        ['Leaphy Original Extension', 'Leaphy Extra Extension', 'Servo', 'Adafruit GFX Library', 'Adafruit SSD1306', 'Adafruit LSM9DS1 Library', 'Adafruit Unified Sensor']
    );
    /* eslint-enable max-len */

    private defaultLanguage = new Language('nl', 'Nederlands')
    private availableLanguages = [new Language('en', 'English'), this.defaultLanguage]

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
        this.currentLanguageSubject$ = new BehaviorSubject(currentLanguage);
        this.currentLanguage$ = this.currentLanguageSubject$.asObservable();

        const reloadConfig = this.localStorage.fetch<ReloadConfig>('reloadConfig');
        this.reloadConfigSubject$ = new BehaviorSubject(reloadConfig);
        this.reloadConfig$ = this.reloadConfigSubject$.asObservable();

        this.codeEditorType$ = combineLatest([this.selectedRobotType$, this.selectedCodeEditorType$])
            .pipe(filter(([robotType,]) => !!robotType))
            .pipe(map(([robotType, selectedCodeEditorType]) => {
                if (robotType === this.genericRobotType) {
                    return CodeEditorType.Advanced
                }
                return selectedCodeEditorType;
            }))

        this.canChangeCodeEditor$ = this.selectedRobotType$
            .pipe(filter(robotType => !!robotType))
            .pipe(map(robotType => robotType !== this.genericRobotType))

        this.packageJsonVersionSubject$ = new BehaviorSubject(packageJson.version);
        this.packageJsonVersion$ = this.packageJsonVersionSubject$.asObservable();
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

    private availableLanguagesSubject$ = new BehaviorSubject<Language[]>(this.availableLanguages);
    public availableLanguages$ = this.availableLanguagesSubject$.asObservable();

    private currentLanguageSubject$: BehaviorSubject<Language>;
    public currentLanguage$: Observable<Language>

    private changedLanguageSubject$ = new BehaviorSubject(null);
    public changedLanguage$ = this.changedLanguageSubject$.asObservable();

    public isRobotWired$: Observable<boolean> = this.selectedRobotType$
        .pipe(filter(selectedRobotType => !!selectedRobotType))
        .pipe(map(selectedRobotType => selectedRobotType.isWired));

    private showHelpPageSubject$ = new BehaviorSubject<boolean>(false);
    public showHelpPage$ = this.showHelpPageSubject$.asObservable();

    private isCodeEditorToggleRequestedSubject$ = new BehaviorSubject<boolean>(false);
    public isCodeEditorToggleRequested$ = this.isCodeEditorToggleRequestedSubject$.asObservable();

    private isCodeEditorToggleConfirmedSubject$ = new BehaviorSubject<boolean>(false);
    public isCodeEditorToggleConfirmed$ = this.isCodeEditorToggleConfirmedSubject$.asObservable();

    private selectedCodeEditorTypeSubject$ = new BehaviorSubject<CodeEditorType>(CodeEditorType.Beginner);
    public selectedCodeEditorType$ = this.selectedCodeEditorTypeSubject$.asObservable();

    public codeEditorType$: Observable<CodeEditorType>;

    public canChangeCodeEditor$: Observable<boolean>;

    private packageJsonVersionSubject$: BehaviorSubject<string>;
    public packageJsonVersion$: Observable<string>;


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
        this.localStorage.store('currentLanguage', language);
        this.currentLanguageSubject$.next(language);
    }

    public setShowHelpPage(show: boolean) {
        this.showHelpPageSubject$.next(show);
    }

    public setIsCodeEditorToggleRequested() {
        this.isCodeEditorToggleRequestedSubject$.next(true);
    }

    public setIsCodeEditorToggleConfirmed(confirmed: boolean) {
        this.isCodeEditorToggleConfirmedSubject$.next(confirmed);
    }

    public setSelectedCodeEditor(codeEditor: CodeEditorType) {
        this.selectedCodeEditorTypeSubject$.next(codeEditor);
    }

}
