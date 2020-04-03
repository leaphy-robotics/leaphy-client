import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch.status';
import { filter, withLatestFrom } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BackEndState } from '../state/backend.state';
import { ConnectionStatus } from '../domain/connection.status';
import { combineLatest } from 'rxjs';
import { RobotState } from '../state/robot.state';
import { BackEndMessage } from '../domain/backend.message';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Backend that different state changes have
export class CloudBackEndEffects {

    private apiId = '6lge1rqji3';
    private region = 'eu-west-1';
    private env = 'test';
    myWebSocket: WebSocketSubject<any> = webSocket(`wss://${this.apiId}.execute-api.${this.region}.amazonaws.com/${this.env}`);

    constructor(
        private blocklyEditorState: BlocklyEditorState,
        private backEndState: BackEndState,
        private robotState: RobotState
    ) {
        this.backEndState.setconnectionStatus(ConnectionStatus.ConnectedToBackend);
        this.myWebSocket.asObservable().subscribe(
            message => this.backEndState.setBackendMessage(message as BackEndMessage), // Called whenever there is a message from the server
            err => console.log(err), // Called if WebSocket API signals some kind of error
            () => {
                // Called when connection is closed (for whatever reason)
                this.backEndState.setconnectionStatus(ConnectionStatus.Disconnected);
            }
        );

        this.robotState.pairingCode$
            .pipe(filter(pairingCode => !!pairingCode))
            .subscribe(pairingCode => {
                console.log('Sending pairing request with pairing code:', pairingCode);
                this.myWebSocket.next({ action: 'pair-client', pairingCode });
            });

        // When the robot id is set but we are not yet connected to it
        // This means the robotId is set from localstorage and we must
        // initiate reconnecting.
        combineLatest([this.robotState.robotId$, this.backEndState.connectionStatus$])
            .pipe(filter(([robotId]) => !!robotId))
            .subscribe(([robotId, connectionStatus]) => {
                switch (connectionStatus) {
                    case ConnectionStatus.StartPairing:
                    case ConnectionStatus.ConnectedToBackend:
                        console.log('Sending reconnect request with robot id:', robotId);
                        this.myWebSocket.next({ action: 'reconnect-client', robotId });
                }
            });

        // What to do when the sketchstatus changes
        this.blocklyEditorState.sketchStatus$
            .pipe(withLatestFrom(this.blocklyEditorState.code$, this.robotState.robotId$, this.robotState.robotPort$))
            .pipe(filter(([, , , robotPort]) => robotPort === 'OTA'))
            .subscribe(([status, code, robotId]) => {
                switch (status) {
                    case SketchStatus.Sending:
                        this.myWebSocket.next({ action: 'compile', robotId, sketch: code });
                        break;
                    default:
                        break;
                }
            });

        this.backEndState.backEndMessages$
            .pipe(filter(message => !!message))
            .pipe(withLatestFrom(this.blocklyEditorState.sketchStatus$))
            .subscribe(([message, sketchStatus]) => {
                console.log('Received message from backend:', message);
                switch (message.event) {
                    case 'ROBOT_REGISTERED':
                        this.backEndState.setconnectionStatus(ConnectionStatus.StartPairing);
                        break;
                    case 'CLIENT_PAIRED_WITH_ROBOT':
                    case 'CLIENT_RECONNECTED_WITH_ROBOT':
                        this.backEndState.setconnectionStatus(ConnectionStatus.PairedWithRobot);
                        break;
                    case 'ROBOT_NOT_REGISTERED':
                        if (sketchStatus !== SketchStatus.Sending) {
                            this.backEndState.setconnectionStatus(ConnectionStatus.WaitForRobot);
                        }
                        break;
                    default:
                        break;
                }
            });
    }
}
