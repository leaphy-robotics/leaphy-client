import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CodeEditorEffects } from 'src/app/effects/code-editor.effects';
import { BackEndState } from 'src/app/state/backend.state';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { CodeEditorState } from 'src/app/state/code-editor.state';
import { GlobalVariablesService } from 'src/app/state/global.state';

@Component({
  selector: 'app-lang-selector',
  templateUrl: './lang-selector.page.html',
  styleUrls: ['./lang-selector.page.scss']
})
export class LangSelectorPage implements AfterViewInit {

  @ViewChild("langmodal") private modal: ElementRef<HTMLElement>;

  constructor(private router: Router) {
    // make two buttons in the modal, one for each language
    // when the user clicks on a button, set the language in the appState
  }

  ngAfterViewInit(): void {
    console.log(this.modal.nativeElement);
  }
}
