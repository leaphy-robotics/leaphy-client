import { Component } from '@angular/core';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { BackEndState } from 'src/app/state/backend.state';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-blockly-editor',
  templateUrl: './blockly-editor.page.html',
  styleUrls: ['./blockly-editor.page.scss']
})
// tslint:disable-next-line: component-class-suffix
export class BlocklyEditorPage {
  constructor(
    public blocklyState: BlocklyEditorState
  ) {
  }

  public onCodeViewClicked() {
    this.blocklyState.toggleIsSideNavOpen();
  }
}
