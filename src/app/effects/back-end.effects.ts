import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch-upload.status';
import { filter, withLatestFrom } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BackEndState } from '../state/back-end.state';
import { ConnectionStatus } from '../domain/connection.status';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Backend that different state changes have
export class BackEndEffects {

    private apiId = 'ccsb7byy76';
    private region = 'eu-west-1';
    private env = 'test';
    myWebSocket: WebSocketSubject<any> = webSocket(`wss://${this.apiId}.execute-api.${this.region}.amazonaws.com/${this.env}`);

    constructor(private blocklyEditorState: BlocklyEditorState, private backEndState: BackEndState) {

        this.myWebSocket.asObservable().subscribe(
            msg => this.onMessage(msg), // Called whenever there is a message from the server
            err => console.log(err), // Called if WebSocket API signals some kind of error
            () => console.log('complete') // Called when connection is closed (for whatever reason)
        );

        // What to do when the RobotId is set/changed:
        this.blocklyEditorState.robotId$
            .pipe(filter(robotId => !!robotId))
            .subscribe(robotId => {
                if (!this.myWebSocket.closed) {
                    console.log('Pairing with robot!');
                    this.myWebSocket.next({ action: 'pair-client', robotId });
                } else {
                    console.log('Wanted to register to robot but Websocket connection was not open');
                }
            });

        // What to do when the sketchstatus changes
        this.blocklyEditorState.sketchStatus$
            .pipe(withLatestFrom(this.blocklyEditorState.code$, this.blocklyEditorState.robotId$))
            .subscribe(([status, code, robotId]) => {
                switch (status) {
                    case SketchStatus.Sending:
                        this.myWebSocket.next({ action: 'compile', robotId, sketch: code });
                        break;
                    default:
                        break;
                }
            });
    }

    private onMessage(msg: any) {
        console.log('Received message from websockets:', msg);

        switch (msg.event) {
            case 'CLIENT_PAIRED_WITH_ROBOT':
                this.backEndState.setconnectionStatus(ConnectionStatus.PairedWithRobot);
                break;
            case 'COMPILE_REQUEST_RECEIVED':
            case 'COMPILATION_STARTED':
            case 'COMPILATION_COMPLETE':
                this.blocklyEditorState.setSketchStatusMessage(msg.message);
                break;
            case 'BINARY_PUBLISHED':
                this.blocklyEditorState.setSketchStatus(SketchStatus.ReadyToSend);
                break;
            default:
                break;
        }
    }
}
