import { Injectable } from '@angular/core';
import { AppState } from '../state/app.state';
import { TranslateService } from '@ngx-translate/core';
import { BackEndState } from '../state/backend.state';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusMessageDialog } from '../modules/core/dialogs/status-message/status-message.dialog';
import { Router } from '@angular/router';
import { CodeEditor } from '../domain/code.editor';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { LogService } from '../services/log.service';

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

        // Set the default language as default
        this.appState.defaultLanguage$
            .subscribe(language => this.translate.setDefaultLang(language));

        // Use the selected language to translate
        this.appState.selectedLanguage$
            .subscribe(language => this.translate.use(language));


        this.appState.codeEditor$
            .subscribe(codeEditor => {
                switch (codeEditor) {
                    case CodeEditor.Beginner:
                        this.router.navigate(['']);
                        setTimeout(() => blocklyState.setSideNavStatus(true), 100);
                        break;
                    case CodeEditor.Advanced:
                        this.router.navigate(['/advanced']);
                        blocklyState.setSideNavStatus(false);
                        break;
                    default:
                        this.router.navigate(['']);
                        blocklyState.setSideNavStatus(false);
                        break;
                }
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