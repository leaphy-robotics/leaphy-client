class FirstRunDetector {
    constructor(firstRun, os, app, compiler) {
        this.firstRun = firstRun;
        this.os = os;

        // Checks a flag per version and clears the sketch folder
        // if this is the first run for that version
        var currentVersion = app.getVersion();
        var isFirstVersionRun = firstRun({ name: currentVersion });
        if (isFirstVersionRun) {
            compiler.clearSketchFolder();
        }
    }
    detectFirstRun = (event) => {
        // Clear the firstRun setting, don't do this unless you want to
        //this.firstRun.clear();

        const isFirstRun = this.firstRun();

        if (isFirstRun) {
            const platform = this.os.platform;
            if (platform == "win32") {
                const driverInstallationRequiredMessage = { event: "DRIVER_INSTALLATION_REQUIRED", message: "DRIVER_INSTALLATION_REQUIRED", displayTimeout: 0 };
                event.sender.send('backend-message', driverInstallationRequiredMessage);
            }

            const firstRunDetectedMessage = { event: "FIRST_RUN" };
            event.sender.send('backend-message', firstRunDetectedMessage);
        }
    }
}

module.exports = FirstRunDetector;