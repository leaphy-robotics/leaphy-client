import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeEditorRoutingModule } from './code-editor-routing.module';
import { CodeEditorPage } from './code-editor.page';


@NgModule({
  declarations: [CodeEditorPage],
  imports: [
    CommonModule,
    CodeEditorRoutingModule
  ]
})
export class CodeEditorModule { }
