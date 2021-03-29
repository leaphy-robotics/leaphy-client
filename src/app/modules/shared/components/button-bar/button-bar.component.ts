import { Component } from '@angular/core';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { AppState } from 'src/app/state/app.state';
import { DialogState } from 'src/app/state/dialog.state';

@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss']
})
export class ButtonBarComponent {

  constructor(
    public appState: AppState,
    public blocklyState: BlocklyEditorState,
    public dialogState: DialogState
  ) { }


  public onCodeClicked() {
    this.blocklyState.toggleIsSideNavOpen();
  }

  public onShowSerialOutputClicked() {
    this.dialogState.setIsSerialOutputWindowOpen(true);
  }

  public onShowInfoClicked() {
    console.log("Hallo info");
  }
}
