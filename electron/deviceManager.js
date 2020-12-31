class DeviceManager {
    constructor(arduinoCli, path) {
        this.arduinoCli = arduinoCli;
        this.path = path;
    }

    updateDevice = async (event, payload) => {
        console.log('Update Device command received');
        const updatingMessage = { event: "UPDATE_STARTED", message: "UPDATE_STARTED", displayTimeout: 0 };
        event.sender.send('backend-message', updatingMessage);
        const inputFile = this.path.join(this.path.dirname(payload.sketchPath), "build", payload.fqbn.split(":").join("."), `${this.path.basename(payload.sketchPath)}.${payload.ext}`);
        const uploadParams = ["upload", "--fqbn", payload.fqbn, "--port", payload.address, "--input-file", inputFile];
        try {
            await this.arduinoCli.runAsync(uploadParams);
        } catch (error) {
            var unsuccesfulUploadMessage = { event: "UPDATE_FAILED", message: "UPDATE_FAILED", payload: payload, displayTimeout: 3000 };
            event.sender.send('backend-message', unsuccesfulUploadMessage);
            return;
        }

        const updateCompleteMessage = { event: "UPDATE_COMPLETE", message: "UPDATE_COMPLETE", payload: payload, displayTimeout: 3000 };
        event.sender.send('backend-message', updateCompleteMessage);
    }

    getDevices = async (event) => {
        console.log('Get Serial Devices command received');
        const updateIndexParams = ["core", "update-index"];
        console.log(await this.arduinoCli.runAsync(updateIndexParams));

        const listBoardsParams = ["board", "list", "--format", "json"];
        const connectedDevices = JSON.parse(await this.arduinoCli.runAsync(listBoardsParams));
        const eligibleBoards = connectedDevices.filter(device => device.protocol_label == "Serial Port (USB)");
        let message;
        if (!eligibleBoards.length) {
            message = { event: "NO_DEVICES_FOUND", message: "NO_DEVICES_FOUND", displayTimeout: -1 };
        } else {
            message = { event: "DEVICES_FOUND", message: "DEVICES_FOUND", payload: eligibleBoards, displayTimeout: 0 };
        }
        event.sender.send('backend-message', message);
    }
}

module.exports = DeviceManager;
