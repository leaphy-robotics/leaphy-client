import { Inject, InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as arduino from './code-editor-arduino/code-editor.page';
import * as python from './code-editor-python/code-editor.page';
import * as arduinoRouting from './code-editor-arduino/code-editor-routing.module';
import * as pythonRouting from './code-editor-python/code-editor-routing.module';
import { SharedModule } from './shared/shared.module';
import { GlobalVariablesService } from '../state/global.state';

@NgModule({})
export class CodeEditorModule {
  constructor(@Inject(new InjectionToken<string>('lang')) private lang: string) {

    if (lang === 'python') {
      this.declareVersion1();
    } else {
      this.declareVersion2();
    }
  }

  private declareVersion1(): void {
    // Declarations for version 1

    @NgModule({
      declarations: [python.CodeEditorPage],
      imports: [
        CommonModule,
        pythonRouting.CodeEditorRoutingModule,
        SharedModule
      ]
    })
    class Version1Module { }

    Object.assign(this, Version1Module);
  }

  private declareVersion2(): void {
    // Declarations for version 2
    @NgModule({
      declarations: [arduino.CodeEditorPage],
      imports: [
        CommonModule,
        arduinoRouting.CodeEditorRoutingModule,
        SharedModule
      ]
    })
    class Version2Module { }

    Object.assign(this, Version2Module);
  }
}
