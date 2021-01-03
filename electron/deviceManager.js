class DeviceManager {
    constructor(arduinoCli){
        this.arduinoCli = arduinoCli;
    }

    updateDevice = async (event, payload) => {
        console.log('Update Device command received', payload);
        const updatingMessage = { event: "UPDATE_STARTED", message: "UPDATE_STARTED", displayTimeout: 0 };
        event.sender.send('backend-message', updatingMessage);
        const uploadParams = ["upload", "-b", payload.fqbn, "-p", payload.address, "-i", `${payload.sketchPath}.${payload.ext}`];
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