import { Component, OnInit } from '@angular/core';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';

@Component({
  selector: 'app-code-view',
  templateUrl: './code-view.component.html',
  styleUrls: ['./code-view.component.scss']
})
export class CodeViewComponent {

  constructor(public blocklyState: BlocklyEditorState) { }
}
