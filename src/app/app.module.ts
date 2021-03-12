import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { BackendWiredEffects } from './effects/backend.wired.effects';
import { BackEndCloudEffects } from './effects/backend.cloud.effects';
import { BlocklyEditorEffects } from './effects/blockly-editor.effects';
import { CodeEditorEffects } from './effects/code-editor.effects';
import { DialogEffects } from './effects/dialog.effects';
import { RobotCloudEffects } from './effects/robot.cloud.effects';
import { AppEffects } from './effects/app.effects';
import { RobotWiredEffects } from './effects/robot.wired.effects';
import { CoreModule } from './modules/core/core.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    CoreModule
  ],
  providers: [
    // Initialize the Effects on startup
    {
      provide: APP_INITIALIZER, deps:
        [
          AppEffects,
          BackendWiredEffects,
          BackEndCloudEffects,
          BlocklyEditorEffects,
          CodeEditorEffects,
          DialogEffects,
          RobotCloudEffects,
          RobotWiredEffects
        ], useFactory: () => () => null, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
