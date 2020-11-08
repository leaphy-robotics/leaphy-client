export class BackEndMessage {
    // TODO: Make event parameter only accept certain values
    constructor(public event: string, public message: string, public payload: any, public displayTimeout: number) { }
}
