class DeviceManager {
    constructor(arduinoCli){
        this.arduinoCli = arduinoCli;
    }

    updateDevice = async (event, payload) => {
        console.log('Update Device command received');
        const updatingMessage = { event: "UPDATE_STARTED", message: "Updating robot..." };
        event.sender.send('backend-message', updatingMessage);
        const uploadParams = ["upload", "-b", payload.fqbn, "-p", payload.address, "-i", `${payload.sketchPath}.${payload.fqbn.split(":").join(".")}.${payload.ext}`];
        try {
            await this.arduinoCli.run(uploadParams);
        } catch (error) {
            unsuccesfulUploadMessage = { event: "UPDATE_FAILED", message: "Uploading compiled sketch failed", payload: payload };
            event.sender.send('backend-message', unsuccesfulUploadMessage);
            return;
        }
    
        const updateCompleteMessage = { event: "UPDATE_COMPLETE", message: "Robot is ready for next sketch", payload: payload };
        event.sender.send('backend-message', updateCompleteMessage);
    }

    getDevices = async (event) => {
        console.log('Get Serial Devices command received');
        const updateIndexParams = ["core", "update-index"];
        console.log(await this.arduinoCli.run(updateIndexParams));
    
        const listBoardsParams = ["board", "list", "--format", "json"];
        const connectedDevices = JSON.parse(await this.arduinoCli.run(listBoardsParams));
        const eligibleBoards = connectedDevices.filter(device => device.protocol_label == "Serial Port (USB)");
        let message;
        if (!eligibleBoards.length) {
            message = { event: "NO_DEVICES_FOUND", message: "No connected robots found" };
        } else {
            message = { event: "DEVICES_FOUND", payload: eligibleBoards };
        }
        event.sender.send('backend-message', message);
    }
}

module.exports = DeviceManager;