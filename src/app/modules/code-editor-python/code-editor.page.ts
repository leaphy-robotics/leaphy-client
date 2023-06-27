import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CodeEditorEffects } from 'src/app/effects/code-editor.effects';
import { BackEndState } from 'src/app/state/backend.state';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { CodeEditorState } from 'src/app/state/code-editor.state';
import { GlobalVariablesService } from 'src/app/state/global.state';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.page.html',
  styleUrls: ['./code-editor.page.scss']
})
export class CodeEditorPage implements AfterViewInit {

  @ViewChild("editor") private editor: ElementRef<HTMLElement>;
  private codeEditorEffects: CodeEditorEffects;

  constructor(private codeEditorState: CodeEditorState, private global: GlobalVariablesService, private blocklyState: BlocklyEditorState, private backEndState: BackEndState) {
    if (this.global.codeEditorEffect) {
      this.global.codeEditorEffect.cleanup();
      this.global.codeEditorEffect = null;
    }
    codeEditorState = new CodeEditorState('python', global);

  }

  ngAfterViewInit(): void {
    this.codeEditorState.setAceElement(this.editor);
    this.global.codeEditorEffect = new CodeEditorEffects(this.global, this.blocklyState, this.backEndState);
  }
}
