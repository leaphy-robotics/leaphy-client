import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';

import { BlocklyEditorPageRoutingModule } from './blockly-editor-routing.module';
import { BlocklyEditorPage } from './blockly-editor.page';
import { LeaphyBlocklyComponent } from './components/leaphy-blockly/leaphy-blockly.component';
import { CodeViewComponent } from './components/code-view/code-view.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [BlocklyEditorPage, LeaphyBlocklyComponent, CodeViewComponent],
  imports: [
    CommonModule,
    BlocklyEditorPageRoutingModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    TranslateModule
  ],
  entryComponents: []
})
export class BlocklyEditorPageModule { }
