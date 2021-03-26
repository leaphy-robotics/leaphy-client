import { Component } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { UserMode } from 'src/app/domain/user.mode';

@Component({
  selector: 'app-editor-toggle',
  templateUrl: './editor-toggle.component.html',
  styleUrls: ['./editor-toggle.component.scss']
})
export class HeaderComponent {

  constructor(
    public appState: AppState,
  ) { }


  public onBlocklyEditorClicked() {
    this.appState.setUserMode(UserMode.Beginner);
  }

  public onCodeEditorClicked() {
    this.appState.setUserMode(UserMode.Advanced);
  }
}
