class FirstRunDetector {
    constructor(firstRun, os) {
        this.firstRun = firstRun;
        this.os = os;
    }
    detectFirstRun = (event) => {
        // Clear the firstRun setting, don't do this
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