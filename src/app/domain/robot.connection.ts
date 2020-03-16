export class RobotConnection {
    constructor(public robotId: string) {
        this.lastActive = Date.now();
    }

    lastActive: number;
}
