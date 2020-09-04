class PrerequisiteManager {
    constructor(arduinoCli, executable, os, app, path) {
        this.arduinoCli = arduinoCli;
        this.executable = executable;
        this.os = os;
        if (os.platform != "win32") return;
        this.ch341DriverInstallerPath = this.getCh341DriverInstallerPath(os, app, path);
    }

    verifyInstallation = async (event, payload) => {
        console.log('Verify Installation command received');
        const checkingPrerequisitesMessage = { event: "PREPARING_COMPILATION_ENVIRONMENT", message: `Checking prerequisites for ${payload.name}` };
        event.sender.send('backend-message', checkingPrerequisitesMessage);

        const updateCoreIndexParams = ["core", "update-index"];
        console.log(await this.arduinoCli.runAsync(updateCoreIndexParams));
        const updateLibIndexParams = ["lib", "update-index"];
        console.log(await this.arduinoCli.runAsync(updateLibIndexParams));

        await this.verifyInstalledCoreAsync(event, payload.name, payload.core);
        await this.verifyInstalledLibsAsync(event, payload.name, payload.libs);

        const platform = this.os.platform;
        if (platform == "win32") {
            const allDrivers = await this.executable.runAsync("driverquery");
            const isCH340DriverInstalled = allDrivers.indexOf("CH341SER_A64") > -1;
            if (!isCH340DriverInstalled) {
                const driverInstallationRequiredMessage = { event: "DRIVER_INSTALLATION_REQUIRED", message: "USB Driver installation is needed" };
                event.sender.send('backend-message', driverInstallationRequiredMessage);
                return;
            }
        }

        const installationVerifiedMessage = { event: "INSTALLATION_VERIFIED", message: "All prerequisites for this robot have been installed" };
        event.sender.send('backend-message', installationVerifiedMessage);
    }

    installUsbDriver = async (event, payload) => {
        console.log('Install USB Driver command received');
        // Only do this for windows
        const platform = this.os.platform;
        if (platform != "win32") return;

        switch (payload.fqbn) {
            case 'arduino:avr:uno':
                console.log(await his.executable.runAsync(this.ch341DriverInstallerPath, []));
                break;
            default:
                break;
        }

        const installationVerifiedMessage = { event: "INSTALLATION_VERIFIED", message: "All prerequisites for this robot have been installed" };
        event.sender.send('backend-message', installationVerifiedMessage);
    }

    installCore = async (core) => {
        const installCoreParams = ["core", "install", core];
        console.log(await this.arduinoCli.runAsync(installCoreParams));
    }

    installLib = async (library) => {
        const installLibParams = ["lib", "install", library];
        console.log(await this.arduinoCli.runAsync(installLibParams));
    }

    verifyInstalledCoreAsync = async (event, name, core) => {
        const checkCoreParams = ["core", "list", "--format", "json"];
        const installedCores = JSON.parse(await this.arduinoCli.runAsync(checkCoreParams));
        const isRequiredCoreInstalled = installedCores.map(v => v.ID).includes(core);
        if (isRequiredCoreInstalled) {
            console.log("Required core already installed");
            return;
        };
        const installingCoreMessage = { event: "PREPARING_COMPILATION_ENVIRONMENT", message: `Installing Arduino Core for ${name}` };
        event.sender.send('backend-message', installingCoreMessage);
        await this.installCore(core);
    }

    verifyInstalledLibsAsync = async (event, name, libs) => {
        const checkLibsParams = ["lib", "list", "--format", "json"];
        const installedLibs = JSON.parse(await this.arduinoCli.runAsync(checkLibsParams));
        const missingLibs = libs.filter(requiredLib => !installedLibs.map(l => l.library.real_name).includes(requiredLib));
        if (!missingLibs.length) {
            console.log("All required libraries already installed");
            return;
        }

        const installingLibsMessage = { event: "PREPARING_COMPILATION_ENVIRONMENT", message: `Installing Leaphy Libraries for ${name}` };
        event.sender.send('backend-message', installingLibsMessage);

        missingLibs.forEach(async missingLib => {
            await this.installLib(missingLib);
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