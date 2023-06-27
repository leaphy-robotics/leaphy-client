import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/blockly-editor/blockly-editor.module').then(m => m.BlocklyEditorModule) },
  { path: 'advanced-arduino', loadChildren: () => import('./modules/code-editor.module').then(m => new m.CodeEditorModule("python")) },
  { path: 'advanced-python', loadChildren: () => import('./modules/code-editor.module').then(m => new m.CodeEditorModule("python")) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
