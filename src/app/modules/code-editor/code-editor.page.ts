import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { CodeEditorState } from 'src/app/state/code-editor.state';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.page.html',
  styleUrls: ['./code-editor.page.scss']
})
export class CodeEditorPage implements AfterViewInit {

  @ViewChild("editor") private editor: ElementRef<HTMLElement>;

  constructor(private codeEditorState: CodeEditorState, 
    public blocklyState: BlocklyEditorState) { }

  ngAfterViewInit(): void {
    this.codeEditorState.setAceElement(this.editor);
  }

  public onSideNavClicked() {
    this.blocklyState.toggleIsSideNavOpen();
  }
}
