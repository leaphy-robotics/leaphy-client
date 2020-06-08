export enum ConnectionStatus {
    Disconnected = 0,
    ConnectedToBackend = 1,
    DetectingDevices = 5,
    StartPairing = 2,
    WaitForRobot = 3,
    PairedWithRobot = 4,
    VerifyingPrerequisites = 6
}
