import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';

import { ElectronEffects } from './effects/electron.effects';
import { CloudBackEndEffects } from './effects/cloud.backend.effects';
import { BlocklyEditorEffects } from './effects/blockly-editor.effects';
import { DialogEffects } from './effects/dialog.effects';
import { RobotEffects } from './effects/robot.effects';
import { ConnectWiredDialog } from './dialogs/connect.wired/connect.wired.dialog';
import { ConnectCloudDialog } from './dialogs/connect.cloud/connect.cloud.dialog';

@NgModule({
  declarations: [
    AppComponent,
    ConnectWiredDialog,
    ConnectCloudDialog

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
    MatButtonModule,
    MatSelectModule
  ],
  providers: [
    // Initialize the Effects on startup
    {provide: APP_INITIALIZER, deps:
      [
        ElectronEffects,
        CloudBackEndEffects,
        BlocklyEditorEffects,
        DialogEffects,
        RobotEffects
      ], useFactory: () => () => null, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConnectWiredDialog, ConnectCloudDialog]
})
export class AppModule { }
