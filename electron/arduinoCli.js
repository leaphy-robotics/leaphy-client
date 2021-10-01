class ArduinoCli {
    constructor(executable, os, path, app) {
        this.app = app;
        this.path = path;
        this.executable = executable;
        this.arduinoCliPath = this.getArduinoCliPath(os, path, app);
    }

    getArduinoCliPath = (os, path, app) => {
        const platform = os.platform()
        const arduino_cli = (platform == "win32") ? "arduino-cli.exe" : "arduino-cli";
        return path.join(app.getAppPath(), 'lib', platform, 'arduino_cli', arduino_cli);
    }

    runAsync = async (params) => await this.executable.runAsync(this.arduinoCliPath, [...params, "--config-file", this.path.join(this.app.getPath("userData"), "arduino-cli.yaml")]);

    createArduinoCliConfig = async () => {
        console.log(await this.executable.runAsync(this.arduinoCliPath, ["config", "init", "--dest-dir", this.app.getPath('userData'), "--overwrite"]));
        await this.runAsync(["config", "set", "directories.data", this.path.join(this.app.getPath('userData'), '.Arduino')]);
        await this.runAsync(["config", "set", "directories.downloads", this.path.join(this.app.getPath('userData'), '.Arduino/staging')]);
        await this.runAsync(["config", "set", "directories.user", this.path.join(this.app.getPath('userData'), 'sketch')]);
    }
}

module.exports = ArduinoCli;
