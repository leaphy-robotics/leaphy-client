import { Component } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { RobotWiredState } from 'src/app/state/robot.wired.state';
import { BackEndState } from 'src/app/state/backend.state';
import { ConnectionStatus } from 'src/app/domain/connection.status';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { WorkspaceStatus } from 'src/app/domain/workspace.status';
import { SketchStatus } from 'src/app/domain/sketch.status';
import { RobotType } from 'src/app/domain/robot.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    public appState: AppState,
    public robotWiredState: RobotWiredState,
    public backEndState: BackEndState,
    public blocklyState: BlocklyEditorState
  ) { }

  public onLoadWorkspaceClicked() {
    this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Finding);
  }

  public onSaveWorkspaceClicked() {
    this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Saving);
  }

  public onSaveWorkspaceAsClicked() {
    this.blocklyState.setWorkspaceStatus(WorkspaceStatus.SavingAs);
  }

  public onShowLeaphyExtraToggled() {
    this.blocklyState.toggleShowLeaphyExtra();
  }

  public onUploadClicked() {
    this.blocklyState.setSketchStatus(SketchStatus.Sending);
  }
}
