class ArduinoCli {
    constructor(executable, os, path, app) {
        this.executable = executable;
        this.arduinoCliPath = this.getArduinoCliPath(os, path, app);
    }

    getArduinoCliPath = (os, path, app) => {
        const platform = os.platform()
        const arduino_cli = (platform == "win32") ? "arduino-cli.exe" : "arduino-cli";
        return path.join(app.getAppPath(), 'lib', platform, 'arduino_cli', arduino_cli);
    }

    runAsync = async (params) => await this.executable.runAsync(this.arduinoCliPath, params);
}

module.exports = ArduinoCli;
