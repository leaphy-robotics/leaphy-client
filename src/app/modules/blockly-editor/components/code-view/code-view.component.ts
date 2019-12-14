import { Component, OnInit } from '@angular/core';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import 'prismjs';
import 'prismjs/components';
import 'prismjs/components/prism-c';
import 'prismjs/plugins/highlight-keywords/prism-highlight-keywords';
import 'prismjs/plugins/line-numbers/prism-line-numbers';

@Component({
  selector: 'app-code-view',
  templateUrl: './code-view.component.html',
  styleUrls: ['./code-view.component.scss']
})
export class CodeViewComponent implements OnInit {

  constructor(public blocklyState: BlocklyEditorState) { }

  ngOnInit() {
  }

}
