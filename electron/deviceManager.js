const { SerialPort } = require("serialport");
const { ReadlineParser } = require('@serialport/parser-readline')

class DeviceManager {
    constructor(arduinoCli, logger) {
        this.arduinoCli = arduinoCli;
        this.activeSerial = null;
        this.logger = logger;
    }

    subscribeToSerialData = async (event, payload) => {
        const lineParser = new ReadlineParser({ delimiter: "\n"});
        this.activeSerial = new SerialPort({ path: payload.address, baudRate: 115200 });
        this.activeSerial.pipe(lineParser)
        lineParser.on('data', function (data) {
            const serialDataReceivedMessage = { event: "SERIAL_DATA", payload: data };
            event.sender.send('backend-message', serialDataReceivedMessage);
        });
    }

    updateDevice = async (event, payload) => {

        this.logger.verbose('Update Device command received');

        if(this.activeSerial?.isOpen){
            this.activeSerial.close();
        }
        
        const updatingMessage = { event: "UPDATE_STARTED", message: "UPDATE_STARTED", displayTimeout: 0 };
        event.sender.send('backend-message', updatingMessage);
        const uploadParams = ["upload", "-b", payload.fqbn, "-p", payload.address, "-i", `${payload.binaryPath}.${payload.ext}`];

        try {
            await this.arduinoCli.runAsync(uploadParams);
        } catch (error) {
            this.logger.error("Upload failed", error);
            var unsuccesfulUploadMessage = { event: "UPDATE_FAILED", message: "UPDATE_FAILED", payload: payload, displayTimeout: 3000 };
            event.sender.send('backend-message', unsuccesfulUploadMessage);
            return;
        }

        await this.subscribeToSerialData(event, payload);

        const updateCompleteMessage = { event: "UPDATE_COMPLETE", message: "UPDATE_COMPLETE", payload: payload, displayTimeout: 3000 };
        event.sender.send('backend-message', updateCompleteMessage);
    }

    getDevices = async (event) => {
        this.logger.verbose('Get Serial Devices command received');

        const updateIndexParams = ["core", "update-index"];
        this.logger.info(await this.arduinoCli.runAsync(updateIndexParams));

        const listBoardsParams = ["board", "list", "--format", "json"];
        const connectedDevices = JSON.parse(await this.arduinoCli.runAsync(listBoardsParams)).map(b => b.port);
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