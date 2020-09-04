class ArduinoCli {
    constructor(executable, os, path, app) {
        this.executable = executable;
        this.arduinoCliPath = this.getArduinoCliPath(os, path, app);
    }

    getArduinoCliPath = (os, path, app) => {
        let platformFolder;
        let arduino_cli;    
        const platform = os.platform;
        if (platform == "win32") {
            platformFolder = "win32";
            arduino_cli = "arduino-cli.exe";
        } else if (platform == "darwin") {
            platformFolder = "darwin";
            arduino_cli = "arduino-cli";
        }
        const arduinoCliPath = path.join(app.getAppPath(), 'lib', platformFolder, 'arduino_cli', arduino_cli);
        return arduinoCliPath;
    }

    runAsync = async (params) => await this.executable.runAsync(this.arduinoCliPath, params);
}

module.exports = ArduinoCli;