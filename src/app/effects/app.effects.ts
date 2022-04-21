import { Injectable } from '@angular/core';
import { AppState } from '../state/app.state';
import { TranslateService } from '@ngx-translate/core';
import { BackEndState } from '../state/backend.state';
import { filter, withLatestFrom } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusMessageDialog } from '../modules/core/dialogs/status-message/status-message.dialog';
import { Router } from '@angular/router';
import { CodeEditorType } from '../domain/code-editor.type';
import { LogService } from '../services/log.service';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { ReloadConfig } from '../domain/reload.config';
import { combineLatest } from 'rxjs';
import { CodeEditorState } from '../state/code-editor.state';

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
        private codeEditorState: CodeEditorState,
        private snackBar: MatSnackBar,
        private router: Router,
        private logger: LogService) {

        // When the language is changed, store reload config, then request a reload
        this.appState.changedLanguage$
            .pipe(filter(changedLanguage => !!changedLanguage))
            .pipe(withLatestFrom(this.appState.currentLanguage$, this.appState.selectedRobotType$))
            .pipe(filter(([changedLanguage, currentLanguage,]) => changedLanguage.code !== currentLanguage.code))
            .subscribe(([changedLanguage, , robotType]) => {
                this.appState.setCurrentLanguage(changedLanguage);
                const reloadConfig = new ReloadConfig(robotType);
                this.appState.setReloadConfig(reloadConfig);
                this.appState.setIsReloadRequested(true);
            });

        // Use the current language to translate the angular strings
        this.appState.currentLanguage$
            .pipe(filter(language => !!language))
            .subscribe(language => this.translate.use(language.code));

        // When a reloadConfig is found, clear it and set the robotType
        combineLatest([this.appState.reloadConfig$, this.blocklyState.blocklyConfig$])
            .pipe(filter(([reloadConfig, blockly]) => !!reloadConfig && !!blockly))
            .subscribe(([reloadConfig,]) => {
                this.appState.setReloadConfig(null);
                setTimeout(() => this.appState.setSelectedRobotType(reloadConfig.robotType), 500);
            });

        // When the editor toggle is requested to advanced, just autoconfirm it
        // When the editor toggle is requested to beginner, and there are no changes, just autoconfirm it
        this.appState.isCodeEditorToggleRequested$
            .pipe(withLatestFrom(this.appState.codeEditorType$, this.codeEditorState.isDirty$))
            .pipe(filter(([requested, codeEditorType, isDirty]) => !!requested && (codeEditorType === CodeEditorType.Beginner || codeEditorType === CodeEditorType.Advanced && !isDirty)))
            .subscribe(() => this.appState.setIsCodeEditorToggleConfirmed(true));

        // When the editor change has been confirmed, toggle the codeeditor
        this.appState.isCodeEditorToggleConfirmed$
            .pipe(filter(isToggled => !!isToggled), withLatestFrom(this.appState.codeEditorType$))
            .subscribe(([, codeEditorType]) => {
                if (codeEditorType == CodeEditorType.Beginner) {
                    this.appState.setSelectedCodeEditor(CodeEditorType.Advanced);
                } else {
                    this.appState.setSelectedCodeEditor(CodeEditorType.Beginner);
                }
            });

        // When the code editor changes, route to the correct screen
        this.appState.codeEditorType$
            .pipe(filter(codeEditor => !!codeEditor))
            .subscribe(async codeEditor => {
                switch (codeEditor) {
                    case CodeEditorType.Beginner:
                        await this.router.navigate(['']);
                        break;
                    case CodeEditorType.Advanced:
                        await this.router.navigate(['/advanced']);
                        break;
                    default:
                        //await this.router.navigate(['']);
                        break;
                }
                this.appState.setIsCodeEditorToggleConfirmed(false);
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