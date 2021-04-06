import { Injectable } from '@angular/core';
import { BlocklyEditorState } from '../state/blockly-editor.state';
import { SketchStatus } from '../domain/sketch.status';
import { filter, withLatestFrom } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BackEndState } from '../state/backend.state';
import { ConnectionStatus } from '../domain/connection.status';
import { combineLatest } from 'rxjs';
import { RobotCloudState } from '../state/robot.cloud.state';
import { BackEndMessage } from '../domain/backend.message';
import { AppState } from '../state/app.state';
import { LogService } from '../services/log.service';

@Injectable({
    providedIn: 'root',
})

// Defines the effects on the Backend that different state changes have
export class BackEndCloudEffects {

    private apiId = '6lge1rqji3';
    private region = 'eu-west-1';
    private env = 'test';

    myWebSocket: WebSocketSubject<any>;

    constructor(
        private backEndState: BackEndState,
        private appState: AppState,
        private blocklyEditorState: BlocklyEditorState,
        private robotCloudState: RobotCloudState,
        private logger: LogService
    ) {
        this.appState.isRobotWired$
            .pipe(filter(isRobotWired => !isRobotWired))
            .subscribe(() => {
                try {
                    this.myWebSocket = webSocket(`wss://${this.apiId}.execute-api.${this.region}.amazonaws.com/${this.env}`);
                } catch (error) {
                    this.logger.error('Error occurred while connecting to websocket:', error);
                    this.backEndState.setconnectionStatus(ConnectionStatus.Disconnected);
                }
                this.backEndState.setconnectionStatus(ConnectionStatus.ConnectedToBackend);

                this.myWebSocket.asObservable().subscribe(
                    message => this.backEndState.setBackendMessage(message as BackEndMessage), // Called whenever there is a message from the server
                    err => this.logger.error(err), // Called if WebSocket API signals some kind of error
                    () => {
                        // Called when connection is closed (for whatever reason)
                        this.backEndState.setconnectionStatus(ConnectionStatus.Disconnected);
                    }
                );

                this.robotCloudState.pairingCode$
                    .pipe(filter(pairingCode => !!pairingCode))
                    .subscribe(pairingCode => {
                        this.logger.verbose('Sending pairing request with pairing code:', pairingCode);
                        this.myWebSocket.next({ action: 'pair-client', pairingCode });
                    });

                // When the robot id is set but we are not yet connected to it
                // This means the robotId is set from localstorage and we must
                // initiate reconnecting.
                combineLatest([this.robotCloudState.robotId$, this.backEndState.connectionStatus$])
                    .pipe(filter(([robotId]) => !!robotId))
                    .subscribe(([robotId, connectionStatus]) => {
                        switch (connectionStatus) {
                            case ConnectionStatus.StartPairing:
                            case ConnectionStatus.ConnectedToBackend:
                                this.logger.verbose('Sending reconnect request with robot id:', robotId);
                                this.myWebSocket.next({ action: 'reconnect-client', robotId });
                        }
                    });

                // What to do when the sketchstatus changes
                this.blocklyEditorState.sketchStatus$
                    .pipe(withLatestFrom(this.blocklyEditorState.code$, this.robotCloudState.robotId$))
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
            })


    }
}
