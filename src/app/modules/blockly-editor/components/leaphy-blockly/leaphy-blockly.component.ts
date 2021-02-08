import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { BackEndState } from 'src/app/state/backend.state';

@Component({
    selector: 'app-leaphy-blockly',
    templateUrl: './leaphy-blockly.component.html',
    styleUrls: ['./leaphy-blockly.component.scss']
})
export class LeaphyBlocklyComponent implements AfterViewInit {

    @ViewChild('blockContent') blockContent: ElementRef;

    constructor(
        public blocklyState: BlocklyEditorState,
        public backEndState: BackEndState
    ) {
    }

    ngAfterViewInit() {
        this.blocklyState.setBlocklyElement(this.blockContent.nativeElement);
    }
}
