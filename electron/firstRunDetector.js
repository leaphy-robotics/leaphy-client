class FirstRunDetector {
    constructor(firstRun, executable, os, app, path) {
        this.firstRun = firstRun;
        this.executable = executable;
        this.os = os;
        this.boardDriverInstallerPath = this.getBoardDriverInstallerPath(os, app, path);
    }

    detectFirstRun = async (event) => {
        // Clear the firstRun setting, don't do this
        //this.firstRun.clear();

        const isFirstRun = this.firstRun();

        if (isFirstRun) {
            const firstRunDetectedMessage = { event: "FIRST_RUN" };
            event.sender.send('backend-message', firstRunDetectedMessage);

            const platform = this.os.platform;
            if (platform == "win32") {
                console.log(await this.executable.runAsync(this.boardDriverInstallerPath, []))
            }
        }
    }

    getBoardDriverInstallerPath = (os, app, path) => {
        let platformFolder;
        let board_driver_installer;
        const platform = os.platform;
        if (platform == "win32") {
            platformFolder = "win32";
            board_driver_installer = "Driver_for_Windows.exe";
        }
        const boardDriverInstallerPath = path.join(app.getAppPath(), 'lib', platformFolder, 'board_driver', board_driver_installer);
        return boardDriverInstallerPath;
    }
}

module.exports = FirstRunDetector;