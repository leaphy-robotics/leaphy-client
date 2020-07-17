import { Injectable } from '@angular/core';
import { AppState } from '../state/app.state';
import { TranslateService } from '@ngx-translate/core';
import { BackEndState } from '../state/backend.state';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})

export class AppEffects {
    private isDebug = false;
    constructor(
        private appState: AppState, 
        private translate: TranslateService,
        private backEndState: BackEndState) {

        // Set the default language as default
        this.appState.defaultLanguage$
            .subscribe(language => this.translate.setDefaultLang(language));

        // Use the selected language to translate
        this.appState.selectedLanguage$
            .subscribe(language => this.translate.use(language));

        // Enable to debugging to console.log all backend messages
        this.backEndState.backEndMessages$
            .pipe(filter(() => this.isDebug))
            .subscribe(message => console.log(message));
    }
}