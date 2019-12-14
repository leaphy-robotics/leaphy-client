import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { BlocklyEditorPageRoutingModule } from './blockly-editor-routing.module';
import { BlocklyEditorPage } from './blockly-editor.page';
import { LeaphyBlocklyComponent } from './components/leaphy-blockly/leaphy-blockly.component';
import { CodeViewComponent } from './components/code-view/code-view.component';


@NgModule({
  declarations: [BlocklyEditorPage, LeaphyBlocklyComponent, CodeViewComponent],
  imports: [
    CommonModule,
    BlocklyEditorPageRoutingModule,
    MatGridListModule,
    MatSidenavModule,
    MatCheckboxModule
  ]
})
export class BlocklyEditorPageModule { }
