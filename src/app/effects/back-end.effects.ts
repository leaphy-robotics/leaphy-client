import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch-upload.status';
import { map, switchMap, filter, withLatestFrom, tap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Backend that different state changes have
export class BackEndEffects {

    myWebSocket: WebSocketSubject<any> = webSocket('wss://1mqy98mwx7.execute-api.eu-west-1.amazonaws.com/test');

    constructor(private blocklyEditorState: BlocklyEditorState) {

        this.myWebSocket.asObservable().subscribe(
            msg => console.log('message received: ' + msg),
            // Called whenever there is a message from the server
            err => console.log(err),
            // Called if WebSocket API signals some kind of error
            () => console.log('complete')
            // Called when connection is closed (for whatever reason)
        );
        if (!this.myWebSocket.closed) {
            console.log('Websocket connection appears to be open');
            this.myWebSocket.next({ action: 'register-client', robotId: 'robot001' });
        }

        this.blocklyEditorState.sketchStatus$
            .pipe(tap(status => console.log(`Status changed to: ${status}`)))
            .pipe(withLatestFrom(this.blocklyEditorState.code$))
            .subscribe(([status, code]) => {
                switch (status) {
                    case SketchStatus.Sending:
                        console.log(code);
                        break;
                    case SketchStatus.Compiling:
                        console.log('Sketch is compiling');
                        break;
                    default:
                        break;
                }
            });
    }
}
