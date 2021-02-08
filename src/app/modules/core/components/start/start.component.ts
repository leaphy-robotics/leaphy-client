import { Component } from "@angular/core";
import { BlocklyEditorState } from "src/app/state/blockly-editor.state";
import { WorkspaceStatus } from "src/app/domain/workspace.status";

@Component({
  selector: "app-start",
  templateUrl: "./start.component.html",
  styleUrls: ["./start.component.scss"],
})
export class StartComponent {
  constructor(private blocklyState: BlocklyEditorState) {}

  public onLoadWorkspaceClicked() {
    this.blocklyState.setWorkspaceStatus(WorkspaceStatus.Finding);
  }
}
