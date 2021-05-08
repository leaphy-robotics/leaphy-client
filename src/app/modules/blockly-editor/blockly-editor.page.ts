import { Component } from '@angular/core';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { DialogState } from 'src/app/state/dialog.state';

@Component({
  selector: 'app-blockly-editor',
  templateUrl: './blockly-editor.page.html',
  styleUrls: ['./blockly-editor.page.scss']
})
// tslint:disable-next-line: component-class-suffix
export class BlocklyEditorPage  {
  constructor(
    public blocklyState: BlocklyEditorState,
    public dialogState: DialogState
  ) {
  }
}
