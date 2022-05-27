import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PortalModule} from '@angular/cdk/portal';

import { ButtonBarComponent } from './components/button-bar/button-bar.component';
import { SerialOutputComponent } from './components/serial-output/serial-output.component';
import { SerialWindowComponent } from './components/serial-window/serial-window.component';

import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NgChartsModule  } from 'ng2-charts';

@NgModule({
  declarations: [ButtonBarComponent, SerialOutputComponent, SerialWindowComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule,
    PortalModule,
    NgChartsModule 
  ],
  exports: [
    FormsModule,
    ButtonBarComponent,
    SerialOutputComponent,
    SerialWindowComponent,
    TranslateModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule
  ], 
  entryComponents:[SerialOutputComponent, SerialWindowComponent]
})
export class SharedModule { }
