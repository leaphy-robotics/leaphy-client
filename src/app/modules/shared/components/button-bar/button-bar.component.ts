import { Component, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BlocklyEditorState } from "src/app/state/blockly-editor.state";
import { AppState } from "src/app/state/app.state";
import { DialogState } from "src/app/state/dialog.state";
import { InfoDialog } from "src/app/modules/core/dialogs/info/info.dialog";
import { CodeEditor } from "src/app/domain/code.editor";
import { first } from "rxjs/operators";

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
  ) {
  }
  public onBlocklyEditorClicked() {
    this.appState.codeEditor$.pipe(first())
    .subscribe(editor => {
      if(editor === CodeEditor.Beginner) {
        this.appState.setCodeEditor(CodeEditor.None);
      } else {
        this.appState.setCodeEditor(CodeEditor.Beginner);
      }
    });
    
  }

  public onCodeEditorClicked() {
    this.appState.codeEditor$.pipe(first())
    .subscribe(editor => {
      if(editor === CodeEditor.Advanced) {
        this.appState.setCodeEditor(CodeEditor.None);
      } else {
        this.appState.setCodeEditor(CodeEditor.Advanced);
      }
    });
  }

  public onShowSerialOutputClicked() {
    this.dialogState.setIsSerialOutputWindowOpen(true);
  }

  public onShowInfoClicked() {
    const creditsDialogRef = this.dialog.open(InfoDialog, {
      width: "800px",
      disableClose: true,
    });
    this.dialogState.setConnectDialog(creditsDialogRef);
  }
}
