import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeEditorRoutingModule } from './code-editor-routing.module';
import { CodeEditorPage } from './code-editor.page';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [CodeEditorPage],
  imports: [
    CommonModule,
    CodeEditorRoutingModule,
    SharedModule
  ]
})
export class CodeEditorModule { }
