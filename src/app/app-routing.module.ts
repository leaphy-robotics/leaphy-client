import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/blockly-editor/blockly-editor.module').then(m => m.BlocklyEditorModule) },
  { path: 'advanced-arduino', loadChildren: () => import('./modules/code-editor-arduino/code-editor.module').then(m => m.CodeEditorModule) },
  { path: 'advanced-python', loadChildren: () => import('./modules/code-editor-arduino/code-editor.module').then(m => m.CodeEditorModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
