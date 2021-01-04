import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { BackendWiredEffects } from './effects/backend.wired.effects';
import { BackEndCloudEffects } from './effects/backend.cloud.effects';
import { BlocklyEditorEffects } from './effects/blockly-editor.effects';
import { DialogEffects } from './effects/dialog.effects';
import { RobotCloudEffects } from './effects/robot.cloud.effects';
import { AppEffects } from './effects/app.effects';
import { RobotWiredEffects } from './effects/robot.wired.effects';

import { ConnectWiredDialog } from './dialogs/connect.wired/connect.wired.dialog';
import { ConnectCloudDialog } from './dialogs/connect.cloud/connect.cloud.dialog';
import { InstallDriverDialog } from './dialogs/install-driver/install-driver.dialog';
import { StatusMessageDialog } from './dialogs/status-message/status-message.dialog';
import { CreditsDialog } from './dialogs/credits/credits.dialog';

import { HeaderComponent } from './components/header/header.component';
import { RobotSelectionComponent } from './components/robot-selection/robot-selection.component';
import { StartComponent } from './components/start/start.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ConnectWiredDialog,
    ConnectCloudDialog,
    InstallDriverDialog,
    HeaderComponent,
    RobotSelectionComponent,
    StartComponent,
    StatusMessageDialog,
    CreditsDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
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
          DialogEffects,
          RobotCloudEffects,
          RobotWiredEffects
        ], useFactory: () => () => null, multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConnectWiredDialog, ConnectCloudDialog, InstallDriverDialog, StatusMessageDialog, CreditsDialog]
})
export class AppModule { }
