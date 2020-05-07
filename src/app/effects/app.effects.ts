import { Injectable } from '@angular/core';
import { AppState } from '../state/app.state';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})

export class AppEffects {
    constructor(private appState: AppState, private translate: TranslateService) {

        // Set the default language as default
        this.appState.defaultLanguage$
            .subscribe(language => this.translate.setDefaultLang(language));

        // Use the selected language to translate
        this.appState.selectedLanguage$
            .subscribe(language => this.translate.use(language));
    }
}