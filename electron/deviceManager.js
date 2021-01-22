const SerialPort = require("serialport");

class DeviceManager {
    constructor(arduinoCli) {
        this.arduinoCli = arduinoCli;
        this.activeSerial = null;
    }

    subscribeToSerialData = async (event, payload) => {
        const lineParser = new SerialPort.parsers.Readline("\n");
        this.activeSerial = new SerialPort(payload.address, { baudRate: 115200 });
        this.activeSerial.pipe(lineParser)
        lineParser.on('data', function (data) {
            const serialDataReceivedMessage = { event: "SERIAL_DATA", payload: data };
            event.sender.send('backend-message', serialDataReceivedMessage);
        });
    }

    updateDevice = async (event, payload) => {

        console.log('Update Device command received');

        this.activeSerial?.close();

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

        await this.subscribeToSerialData(event, payload);

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