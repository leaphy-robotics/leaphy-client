import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';

@Injectable({
    providedIn: 'root',
})
export class BlocklyEditorEffects {
    constructor(private blocklyEditorState: BlocklyEditorState) {
        this.blocklyEditorState.sketchUploadStatus$.subscribe(status => console.log('Effect knows about status:', status));
    }
}
