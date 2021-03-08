import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlocklyEditorRoutingModule } from './blockly-editor-routing.module';
import { BlocklyEditorPage } from './blockly-editor.page';
import { LeaphyBlocklyComponent } from './components/leaphy-blockly/leaphy-blockly.component';
import { CodeViewComponent } from './components/code-view/code-view.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [BlocklyEditorPage, LeaphyBlocklyComponent, CodeViewComponent],
  imports: [
    CommonModule,
    BlocklyEditorRoutingModule,
    SharedModule
  ],
  entryComponents: []
})
export class BlocklyEditorModule { }
