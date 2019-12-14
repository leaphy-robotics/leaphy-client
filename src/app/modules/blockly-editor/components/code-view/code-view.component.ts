import { Component, OnInit } from '@angular/core';
import { BlocklyState } from 'src/app/state/blockly.state';
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

  constructor(public blocklyState: BlocklyState) { }

  ngOnInit() {
  }

}
