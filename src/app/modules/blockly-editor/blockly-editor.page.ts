import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blockly-editor',
  templateUrl: './blockly-editor.page.html',
  styleUrls: ['./blockly-editor.page.scss']
})
// tslint:disable-next-line: component-class-suffix
export class BlocklyEditorPage implements OnInit {
  events: string[] = [];
  opened: boolean;

  constructor() { }

  ngOnInit() {
  }

}
