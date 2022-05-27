import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { HeaderComponent } from './components/header/header.component';
import { RobotSelectionComponent } from './components/robot-selection/robot-selection.component';
import { StartComponent } from './components/start/start.component';

import { ConnectWiredDialog } from './dialogs/connect.wired/connect.wired.dialog';
import { ConnectCloudDialog } from './dialogs/connect.cloud/connect.cloud.dialog';
import { InstallDriverDialog } from './dialogs/install-driver/install-driver.dialog';
import { StatusMessageDialog } from './dialogs/status-message/status-message.dialog';
import { CreditsDialog } from './dialogs/credits/credits.dialog';
import { InfoDialog } from './dialogs/info/info.dialog';
import { ConfirmEditorDialog } from './dialogs/confirm-editor/confirm-editor.dialog';
import { LanguageSelectDialog } from './dialogs/language-select/language-select.dialog';


@NgModule({
  declarations: [
    ConnectWiredDialog,
    ConnectCloudDialog,
    InstallDriverDialog,
    ConfirmEditorDialog,
    HeaderComponent,
    RobotSelectionComponent,
    StartComponent,
    StatusMessageDialog,
    CreditsDialog,
    LanguageSelectDialog,
    InfoDialog
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  entryComponents: [ConnectWiredDialog, ConnectCloudDialog, InstallDriverDialog, ConfirmEditorDialog, StatusMessageDialog, CreditsDialog, LanguageSelectDialog, InfoDialog],
  exports: [
    HeaderComponent,
    StartComponent,
    RobotSelectionComponent,
    ConnectCloudDialog,
    ConnectWiredDialog,
    InstallDriverDialog,
    ConfirmEditorDialog,
    StatusMessageDialog,
    CreditsDialog,
    LanguageSelectDialog,
    InfoDialog
  ]
})
export class CoreModule { }
