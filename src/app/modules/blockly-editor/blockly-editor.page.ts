import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
declare var Blockly: any;

@Component({
  selector: 'app-blockly-editor',
  templateUrl: './blockly-editor.page.html',
  styleUrls: ['./blockly-editor.page.scss']
})
// tslint:disable-next-line: component-class-suffix
export class BlocklyEditorPage implements OnInit, AfterViewInit {
  @ViewChild('blockContent', { static: false }) blockContent: ElementRef;

  private workspace: any;
  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.workspace = Blockly.inject(this.blockContent.nativeElement, {
      toolbox: `<xml id="toolbox" style="display: none">
      <category name="Control" colour="120">
        <block type="controls_if"></block>
        <block type="controls_repeat_ext" disabled="true"></block>
      </category>
      <category name="Text" colour="230">
        <block type="text"></block>
        <block type="text_print"></block>
      </category>
      <category name="Custom" colour="360">
        <block type="arduino_base_inout_buildin_led"></block>
      </category>
    </xml>`,
      scrollbars: false
    });
  }
}
