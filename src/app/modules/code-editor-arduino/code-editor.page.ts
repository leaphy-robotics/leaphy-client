import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CodeEditorState } from 'src/app/state/code-editor.state';
import { GlobalVariablesService } from 'src/app/state/global.state';
@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.page.html',
  styleUrls: ['./code-editor.page.scss']
})
export class CodeEditorPage implements AfterViewInit {

  @ViewChild("editor") private editor: ElementRef<HTMLElement>;

  constructor(private codeEditorState: CodeEditorState, private global: GlobalVariablesService) {
    codeEditorState = new CodeEditorState('arduino', global);
   }

  ngAfterViewInit(): void {
    this.codeEditorState.setAceElement(this.editor);
  }
}
