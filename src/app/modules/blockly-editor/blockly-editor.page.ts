import { Component, OnInit } from '@angular/core';
declare var Blockly: any;

@Component({
  selector: 'app-blockly-editor',
  templateUrl: './blockly-editor.page.html',
  styleUrls: ['./blockly-editor.page.scss']
})
// tslint:disable-next-line: component-class-suffix
export class BlocklyEditorPage implements OnInit {
  private workspace: any;
  constructor() {

    this.workspace = Blockly.inject('blocklyDiv', {
      toolbox: `<xml id="toolbox">
      <category name="Control" colour="120">
          <block type="controls_if"></block>
          <block type="controls_repeat_ext" disabled="true"></block>
      </category>
      <category name="Text" colour="230">
          <block type="text"></block>
          <block type="text_print"></block>
      </category>
      <category name="Custom" colour="360">
          <block type="begin"></block>
          <block type="move"></block>
          <block type="end"></block>
      </category>
  </xml>`,
      scrollbars: false
    });

  }

  ngOnInit() {
  }

}
