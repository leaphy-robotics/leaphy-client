import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlocklyEditorRoutingModule } from './blockly-editor-routing.module';
import { BlocklyEditorPage } from './blockly-editor.page';
import { LeaphyBlocklyComponent } from './components/leaphy-blockly/leaphy-blockly.component';
import { CodeViewComponent } from './components/code-view/code-view.component';
import { SharedModule } from '../shared/shared.module';
import { GlobalVariablesService } from 'src/app/state/global.state';

@NgModule({})
export class BlocklyEditorModule {
  private declerations: any[] = [];

  constructor(private globalVariablesService: GlobalVariablesService) {
    if (globalVariablesService.langValue == "python")
      this.pythonComponent();
    else
      this.arduinoComponent();
  }

  private pythonComponent(): void {
    this.declerations = [LeaphyBlocklyComponent, CodeViewComponent];
    this.finalModule();
  }

  private arduinoComponent(): void {
    this.declerations = [BlocklyEditorPage, LeaphyBlocklyComponent, CodeViewComponent];
    this.finalModule();
  }

  private finalModule(): void {
    @NgModule({
      declarations: this.declerations,
      imports: [
        CommonModule,
        BlocklyEditorRoutingModule,
        SharedModule
      ],
      entryComponents: []
    })
    class MadeModule { }
    Object.assign(this, MadeModule);
  }
}
