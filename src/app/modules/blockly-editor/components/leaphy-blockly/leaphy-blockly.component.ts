import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { SketchStatus } from 'src/app/domain/sketch.status';
import { BackEndState } from 'src/app/state/backend.state';
import { ConnectionStatus } from 'src/app/domain/connection.status';

@Component({
    selector: 'app-leaphy-blockly',
    templateUrl: './leaphy-blockly.component.html',
    styleUrls: ['./leaphy-blockly.component.scss']
})
export class LeaphyBlocklyComponent implements AfterViewInit {

    @ViewChild('blockContent', { static: false }) blockContent: ElementRef;

    constructor(
        public blocklyState: BlocklyEditorState,
        public backEndState: BackEndState) {
    }

    ngAfterViewInit() {
        this.blocklyState.setBlocklyElement(this.blockContent.nativeElement);
    }

    public onUploadClicked() {
        this.blocklyState.setSketchStatus(SketchStatus.Sending);
    }

    public onConnectClicked() {
        this.backEndState.setconnectionStatus(ConnectionStatus.DetectingDevices);
    }
}
