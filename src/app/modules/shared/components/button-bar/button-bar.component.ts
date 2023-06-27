import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BlocklyEditorState } from "src/app/state/blockly-editor.state";
import { AppState } from "src/app/state/app.state";
import { DialogState } from "src/app/state/dialog.state";
import { RobotWiredState } from "src/app/state/robot.wired.state";
import { GlobalVariablesService } from "src/app/state/global.state";

@Component({
  selector: "app-button-bar",
  templateUrl: "./button-bar.component.html",
  styleUrls: ["./button-bar.component.scss"],
})
export class ButtonBarComponent {
  constructor(
    public appState: AppState,
    public blocklyState: BlocklyEditorState,
    public dialogState: DialogState,
    public robotWiredState: RobotWiredState,
    public dialog: MatDialog,
    private global: GlobalVariablesService
  ) {
  }
  public onSideNavToggled() {
        this.blocklyState.setIsSideNavOpenToggled();
  }

  public onShowSerialOutputClicked() {
    this.dialogState.setIsSerialOutputFocus(true);
  }

  public onShowBootloaderClicked() {
    this.dialogState.setIsBootloaderFocus(true);
  }
}


