import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import { BackEndEffects } from './effects/back-end.effects';
import { BlocklyEditorEffects } from './effects/blockly-editor.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule
  ],
  providers: [
    // Initialize the Effects on startup
    {provide: APP_INITIALIZER, deps: [BackEndEffects, BlocklyEditorEffects], useFactory: () => () => null, multi: true} 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
