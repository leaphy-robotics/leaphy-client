import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BlocklyEditorState } from "src/app/state/blockly-editor.state";
import { AppState } from "src/app/state/app.state";
import { DialogState } from "src/app/state/dialog.state";
import { CreditsDialog } from "src/app/modules/core/dialogs/credits/credits.dialog";

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
    public dialog: MatDialog
  ) {}
  public onCodeClicked() {
    this.blocklyState.toggleIsSideNavOpen();
  }

  public onShowSerialOutputClicked() {
    this.dialogState.setIsSerialOutputWindowOpen(true);
  }

  public onShowInfoClicked() {
    const creditsDialogRef = this.dialog.open(CreditsDialog, {
      width: "800px",
      disableClose: true,
    });
    this.dialogState.setConnectDialog(creditsDialogRef);
  }
}
