class PrerequisiteManager {
    constructor(arduinoCli, executable, os, app, path, logger) {
        this.arduinoCli = arduinoCli;
        this.executable = executable;
        this.os = os;
        this.logger = logger;
        if (os.platform != "win32") return;
        this.ch341DriverInstallerPath = this.getCh341DriverInstallerPath(os, app, path);
    }

    verifyInstallation = async (event, payload) => {
        this.logger.verbose('Verify Installation command received');
        const checkingPrerequisitesMessage = { event: "PREPARING_COMPILATION_ENVIRONMENT", message: "PREPARING_COMPILATION_ENVIRONMENT", payload: payload.name, displayTimeout: 0 };
        event.sender.send('backend-message', checkingPrerequisitesMessage);

        const updateCoreIndexParams = ["core", "update-index"];
        this.logger.info(await this.arduinoCli.runAsync(updateCoreIndexParams));
        const updateLibIndexParams = ["lib", "update-index"];
        this.logger.info(await this.arduinoCli.runAsync(updateLibIndexParams));

        await this.verifyInstalledCoreAsync(event, payload.name, payload.core);
        await this.verifyInstalledLibsAsync(event, payload.name, payload.libs);

        const platform = this.os.platform;
        if (platform == "win32") {
            const allDrivers = await this.executable.runAsync("driverquery");
            const isCH340DriverInstalled = allDrivers.indexOf("CH341SER_A64") > -1;
            if (!isCH340DriverInstalled) {
                const driverInstallationRequiredMessage = { event: "DRIVER_INSTALLATION_REQUIRED", message: "DRIVER_INSTALLATION_REQUIRED", displayTimeout: 0 };
                event.sender.send('backend-message', driverInstallationRequiredMessage);
                return;
            }
        }

        const installationVerifiedMessage = { event: "INSTALLATION_VERIFIED", message: "INSTALLATION_VERIFIED", payload: payload.name, displayTimeout: 3000 };
        event.sender.send('backend-message', installationVerifiedMessage);
    }

    installUsbDriver = async (event, payload) => {
        this.logger.verbose('Install USB Driver command received');
        // Only do this for windows
        const platform = this.os.platform;
        if (platform != "win32") return;

        switch (payload.fqbn) {
            case 'arduino:avr:uno':
                this.logger.info(await this.executable.runAsync(this.ch341DriverInstallerPath, []));
                break;
            default:
                break;
        }

        const installationVerifiedMessage = { event: "INSTALLATION_VERIFIED", message: "INSTALLATION_VERIFIED", payload: payload.name, displayTimeout: 3000 };
        event.sender.send('backend-message', installationVerifiedMessage);
    }

    installCore = async (core) => {
        const installCoreParams = ["core", "install", core];
        this.logger.info(await this.arduinoCli.runAsync(installCoreParams));
    }

    upgradeCore = async (core) => {
        const upgradeCoreParams = ["core", "upgrade", core];
        this.logger.info(await this.arduinoCli.runAsync(upgradeCoreParams));
    }

    installLib = async (library) => {
        const installLibParams = ["lib", "install", library];
        this.logger.info(await this.arduinoCli.runAsync(installLibParams));
    }

    upgradeLib = async (library) => {
        const upgradeLibParams = ["lib", "upgrade", library];
        this.logger.info(await this.arduinoCli.runAsync(upgradeLibParams));
    }

    verifyInstalledCoreAsync = async (event, name, core) => {
        const checkCoreParams = ["core", "list", "--format", "json"];
        const installedCores = JSON.parse(await this.arduinoCli.runAsync(checkCoreParams));
        const isRequiredCoreInstalled = installedCores.map(v => v.ID).includes(core);

        const installingCoreMessage = { event: "PREPARING_COMPILATION_ENVIRONMENT", message: "INSTALLING_ARDUINO_CORE", payload: name, displayTimeout: 0 };
        event.sender.send('backend-message', installingCoreMessage);

        if (isRequiredCoreInstalled) {
            this.logger.info(`Required Core ${core} already installed, attempting upgrade...`);
            await this.upgradeCore(core);
            return;
        };
        this.logger.info(`Required Core ${core} not found, installing...`);
        await this.installCore(core);
    }

    verifyInstalledLibsAsync = async (event, name, libs) => {
        const checkLibsParams = ["lib", "list", "--format", "json"];
        const installedLibs = JSON.parse(await this.arduinoCli.runAsync(checkLibsParams));
        const installedLibsRealNames = installedLibs.map(l => l.library.real_name);

        const installingLibsMessage = { event: "PREPARING_COMPILATION_ENVIRONMENT", message: "INSTALLING_LEAPHY_LIBRARIES", payload: name, displayTimeout: 0 };
        event.sender.send('backend-message', installingLibsMessage);

        libs.forEach(async requiredLib => {
            if(installedLibsRealNames.includes(requiredLib)){
                this.logger.info(`Required Library ${requiredLib} already installed, attempting upgrade...`);
                await this.installLib(requiredLib); // Should be upgrade but that's not working, see https://github.com/arduino/arduino-cli/issues/1041
            } else {
                this.logger.info(`Required Library ${requiredLib} not found, installing...`);
                await this.installLib(requiredLib);
            }
        });
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

module.exports = PrerequisiteManager;