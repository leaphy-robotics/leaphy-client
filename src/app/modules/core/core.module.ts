import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { HeaderComponent } from './components/header/header.component';
import { RobotSelectionComponent } from './components/robot-selection/robot-selection.component';
import { StartComponent } from './components/start/start.component';

import { ConnectWiredDialog } from './dialogs/connect.wired/connect.wired.dialog';
import { ConnectCloudDialog } from './dialogs/connect.cloud/connect.cloud.dialog';
import { StatusMessageDialog } from './dialogs/status-message/status-message.dialog';
import { CreditsDialog } from './dialogs/credits/credits.dialog';
import { InfoDialog } from './dialogs/info/info.dialog';


@NgModule({
  declarations: [
    ConnectWiredDialog,
    ConnectCloudDialog,
    HeaderComponent,
    RobotSelectionComponent,
    StartComponent,
    StatusMessageDialog,
    CreditsDialog,
    InfoDialog
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  entryComponents: [ConnectWiredDialog, ConnectCloudDialog, StatusMessageDialog, CreditsDialog, InfoDialog],
  exports: [
    HeaderComponent,
    StartComponent,
    RobotSelectionComponent,
    ConnectCloudDialog,
    ConnectWiredDialog,
    StatusMessageDialog,
    CreditsDialog,
    InfoDialog
  ]
})
export class CoreModule { }
