import { Injectable } from '@angular/core';
import { AppState } from '../state/app.state';
import { TranslateService } from '@ngx-translate/core';
import { BackEndState } from '../state/backend.state';
import { filter, map, pairwise, tap, withLatestFrom } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusMessageDialog } from '../modules/core/dialogs/status-message/status-message.dialog';
import { Router } from '@angular/router';
import { CodeEditorType } from '../domain/code-editor.type';
import { LogService } from '../services/log.service';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { ReloadConfig } from '../domain/reload.config';
import { combineLatest, forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class AppEffects {
    private isDebug = false;
    constructor(
        private appState: AppState,
        private translate: TranslateService,
        private backEndState: BackEndState,
        private blocklyState: BlocklyEditorState,
        private snackBar: MatSnackBar,
        private router: Router,
        private logger: LogService) {

        // When the language is changed, store reload config, then request a reload
        this.appState.changedLanguage$
            .pipe(filter(lang => !!lang))
            .pipe(withLatestFrom(this.appState.selectedRobotType$))
            .subscribe(([, robotType]) => {
                const reloadConfig = new ReloadConfig(robotType);
                this.appState.setReloadConfig(reloadConfig);
                this.appState.setIsReloadRequested(true);
            });

        // Use the current language to translate the angular translations
        this.appState.currentLanguage$
            .subscribe(language => this.translate.use(language));

        // When a reloadConfig is found, clear it and set the robotType
        combineLatest([this.appState.reloadConfig$, this.blocklyState.blocklyConfig$])
            .pipe(tap(() => this.logger.info("Got values for each")))
            .pipe(filter(([reloadConfig, blockly]) => !!reloadConfig && !!blockly))
            .pipe(tap(() => this.logger.info("Got non null values for each")))
            .subscribe(([reloadConfig,]) => {
                this.appState.setReloadConfig(null);
                setTimeout(() => this.appState.setSelectedRobotType(reloadConfig.robotType), 500);
            });

        // When the selected code editor changes, route to the correct screen
        this.appState.codeEditorType$
            .subscribe(codeEditor => {
                switch (codeEditor) {
                    case CodeEditorType.Beginner:
                        this.router.navigate(['']);
                        break;
                    case CodeEditorType.Advanced:
                        this.router.navigate(['/advanced']);
                        break;
                    default:
                        this.router.navigate(['']);
                        break;
                }
            });

        // When Advanced CodeEditor is active, but the button is clicked again, toggle the code view
        this.appState.codeEditorType$
            .pipe(
                pairwise(),
                filter(([previous, current]) => current === CodeEditorType.Advanced && (previous === current)),
                withLatestFrom(this.blocklyState.isSideNavOpen$),
                map(([, isOpen]) => isOpen)
            )
            .subscribe(() => {
                this.appState.setCodeEditor(CodeEditorType.None)
            });

        // Enable to debugging to log all backend messages
        this.backEndState.backEndMessages$
            .pipe(filter(() => this.isDebug))
            .subscribe(message => this.logger.debug(message));

        // Show snackbar based on messages received from the Backend
        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message && message.displayTimeout >= 0))
            .subscribe(message => {
                this.snackBar.openFromComponent(StatusMessageDialog, {
                    duration: message.displayTimeout,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    data: message
                })
            });
    }
}