import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch.status';
import { filter, withLatestFrom } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BackEndState } from '../state/back-end.state';
import { ConnectionStatus } from '../domain/connection.status';
import { combineLatest } from 'rxjs';

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
        this.backEndState.setconnectionStatus(ConnectionStatus.Connected);
        this.myWebSocket.asObservable().subscribe(
            msg => this.onMessage(msg), // Called whenever there is a message from the server
            err => console.log(err), // Called if WebSocket API signals some kind of error
            () => console.log('complete') // Called when connection is closed (for whatever reason)
        );

        combineLatest([this.blocklyEditorState.robotId$, this.backEndState.connectionStatus$])
            .pipe(filter(([robotId]) => !!robotId))
            .subscribe(([robotId, connectionStatus]) => {
                switch (connectionStatus) {
                    case ConnectionStatus.Connected:
                    case ConnectionStatus.StartPairing:
                        this.myWebSocket.next({ action: 'pair-client', robotId });
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
            case 'FAILED_PAIRING_WITH_ROBOT':
                this.backEndState.setconnectionStatus(ConnectionStatus.WaitForRobot);
                break;
            case 'ROBOT_REGISTERED':
                this.backEndState.setconnectionStatus(ConnectionStatus.StartPairing);
                break;
            case 'CLIENT_PAIRED_WITH_ROBOT':
                this.backEndState.setconnectionStatus(ConnectionStatus.PairedWithRobot);
                break;
            case 'PREPARING_COMPILATION_ENVIRONMENT':
            case 'COMPILATION_STARTED':
            case 'COMPILATION_COMPLETE':
                this.blocklyEditorState.setSketchStatusMessage(msg.message);
                break;
            case 'BINARY_PUBLISHED':
                this.blocklyEditorState.setSketchStatus(SketchStatus.ReadyToSend);
                this.blocklyEditorState.setSketchStatusMessage(msg.message);
                break;
            case 'ROBOT_NOT_CONNECTED':
                this.backEndState.setconnectionStatus(ConnectionStatus.WaitForRobot);
                break;
            default:
                break;
        }
    }
}
