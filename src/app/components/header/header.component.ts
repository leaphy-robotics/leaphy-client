import { Component } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { RobotWiredState } from 'src/app/state/robot.wired.state';
import { MatSelectChange } from '@angular/material/select';
import { BackEndState } from 'src/app/state/backend.state';
import { ConnectionStatus } from 'src/app/domain/connection.status';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { WorkspaceStatus } from 'src/app/domain/workspace.status';

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

  onRobotSelectionChange(event: MatSelectChange) {
    this.appState.setSelectedRobotType(event.value);
  }

  public onConnectClicked() {
    this.backEndState.setconnectionStatus(ConnectionStatus.DetectingDevices);
  }

  public onLoadWorkspaceClicked() {
    this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Finding);
  }

  public onSaveWorkspaceClicked() {
    this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Saving);
  }

  public onSaveWorkspaceAsClicked() {
    this.blocklyState.setWorkspaceStatus(WorkspaceStatus.SavingAs);
  }
}
