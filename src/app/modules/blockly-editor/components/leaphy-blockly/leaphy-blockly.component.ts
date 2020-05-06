import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BlocklyEditorState } from 'src/app/state/blockly-editor.state';
import { SketchStatus } from 'src/app/domain/sketch.status';
import { BackEndState } from 'src/app/state/backend.state';
import { DialogState } from 'src/app/state/dialog.state';
import { filter } from 'rxjs/operators';
import { ConnectionStatus } from 'src/app/domain/connection.status';

declare var Blockly: any;

@Component({
    selector: 'app-leaphy-blockly',
    templateUrl: './leaphy-blockly.component.html',
    styleUrls: ['./leaphy-blockly.component.scss']
})
export class LeaphyBlocklyComponent implements AfterViewInit {
    @ViewChild('blockContent', { static: false }) blockContent: ElementRef;
    private workspace: any;
    constructor(
        public blocklyState: BlocklyEditorState,
        public backEndState: BackEndState,
        private dialogState: DialogState) {
    }

    ngAfterViewInit() {
        this.blocklyState.toolboxXml$
            .pipe(filter(toolbox => !!toolbox))
            .subscribe(toolbox => {
                this.workspace = Blockly.inject(this.blockContent.nativeElement, {
                    toolbox,
                    scrollbars: true,
                    zoom: {
                        controls: true,
                        wheel: false,
                        startScale: 1.0,
                        maxScale: 3,
                        minScale: 0.3,
                        scaleSpeed: 1.2
                    },
                    trashcan: true,
                    move: {
                        scrollbars: true,
                        drag: true,
                        wheel: true
                    }
                });

                this.workspace.addChangeListener(async (event) => {
                    this.blocklyState.setCode(Blockly.Arduino.workspaceToCode(this.workspace));
                });
            });
    }

    public onUploadClicked() {
        this.blocklyState.setSketchStatus(SketchStatus.Sending);
    }

    public onConnectClicked() {
        this.backEndState.setconnectionStatus(ConnectionStatus.DetectingDevices);
    }
}
