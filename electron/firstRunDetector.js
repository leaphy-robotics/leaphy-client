class FirstRunDetector {
    constructor(firstRun, executable, os, app, path) {
        this.firstRun = firstRun;
        this.executable = executable;
        this.ch341DriverSetupPath = this.getCh341DriverSetupPath(os, app, path);
        this.ch341DriverInstallerPath = this.getCh341DriverInstallerPath(os, app, path);
    }
    detectFirstRun = async (event) => {
        const isFirstRun = this.firstRun();
        // Clear the firstRun setting, don't do this
        //this.firstRun.clear();

        if (isFirstRun) {
            const firstRunDetectedMessage = { event: "FIRST_RUN" };
            event.sender.send('backend-message', firstRunDetectedMessage);

        }
        //console.log(await this.executable.runAsync(this.ch341DriverSetupPath, []))
        //console.log(await this.executable.runAsync(this.ch341DriverInstallerPath, []))

        var spawn = require('child_process').spawn;
        spawn(this.ch341DriverSetupPath);
    }

    getCh341DriverSetupPath = (os, app, path) => {
        let platformFolder;
        let ch341_driver_setup;
        const platform = os.platform;
        if (platform == "win32") {
            platformFolder = "win32";
            ch341_driver_setup = "SETUP.EXE";
        }
        const ch341DriverInstallerPath = path.join(app.getAppPath(), 'lib', platformFolder, 'ch341_driver', ch341_driver_setup);
        return ch341DriverInstallerPath;
    }

    getCh341DriverInstallerPath = (os, app, path) => {
        let platformFolder;
        let ch341_driver_installer;
        const platform = os.platform;
        if (platform == "win32") {
            platformFolder = "win32";
            ch341_driver_installer = "CH341SER.EXE";
        } 
        const ch341DriverInstallerPath = path.join(app.getAppPath(), 'lib', platformFolder, 'ch341_driver_installer', ch341_driver_installer);
        return ch341DriverInstallerPath;
    }


}

module.exports = FirstRunDetector;