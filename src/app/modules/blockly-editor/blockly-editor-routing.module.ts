import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlocklyEditorPage } from './blockly-editor.page';


const routes: Routes = [{
  path: '',
  component: BlocklyEditorPage
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlocklyEditorRoutingModule { }
