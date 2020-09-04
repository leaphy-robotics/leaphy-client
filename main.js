const { app } = require('electron');
const path = require("path");

const squirrel = require('./electron/squirrel.js');
if (squirrel.handleEvent(app, path)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

const { BrowserWindow, ipcMain, dialog } = require('electron');
const url = require("url");
const fs = require('fs');
const os = require("os");
const util = require('util');
const runExecutableAsync = util.promisify(require('child_process').execFile);

let mainWindow;

function loadUrl(mainWindow) {
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "dist", "index.html"),
            protocol: "file:",
            slashes: true,
        })
    );
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.setMenu(null);
    mainWindow.setMenuBarVisibility(false);

    loadUrl(mainWindow);

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.webContents.on('did-fail-load', function () {
        loadUrl(mainWindow);
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

const asyncExecFile = util.promisify(require('child_process').execFile);

const ArduinoCli = require('./electron/arduinoCli.js');
const arduinoCli = new ArduinoCli(asyncExecFile, os, path, app);

const Compiler = require('./electron/compiler.js');
const compiler = new Compiler(app, arduinoCli, path, fs);

const DeviceManager = require('./electron/deviceManager.js');
const deviceManager = new DeviceManager(arduinoCli);

const WorkspaceManager = require('./electron/workspaceManager');
const workspaceManager = new WorkspaceManager(fs, dialog);

app.setAppLogsPath();

let arduinoCliPath;
let ch341DriverInstallerPath;
setupExecutables();

async function installCore(core) {
    const installCoreParams = ["core", "install", core];
    console.log(await tryRunArduinoCli(installCoreParams));
}

async function installLib(library) {
    const installLibParams = ["lib", "install", library];
    console.log(await tryRunArduinoCli(installLibParams));
}

async function verifyInstalledCoreAsync(event, name, core) {
    const checkCoreParams = ["core", "list", "--format", "json"];
    const installedCores = JSON.parse(await tryRunArduinoCli(checkCoreParams));
    const isRequiredCoreInstalled = installedCores.map(v => v.ID).includes(core);
    if (isRequiredCoreInstalled) {
        console.log("Required core already installed");
        return;
    };
    const installingCoreMessage = { event: "PREPARING_COMPILATION_ENVIRONMENT", message: `Installing Arduino Core for ${name}` };
    event.sender.send('backend-message', installingCoreMessage);
    await installCore(core);
}

async function verifyInstalledLibsAsync(event, name, libs) {
    const checkLibsParams = ["lib", "list", "--format", "json"];
    const installedLibs = JSON.parse(await tryRunArduinoCli(checkLibsParams));
    const missingLibs = libs.filter(requiredLib => !installedLibs.map(l => l.library.real_name).includes(requiredLib));
    if (!missingLibs.length) {
        console.log("All required libraries already installed");
        return;
    }

    const installingLibsMessage = { event: "PREPARING_COMPILATION_ENVIRONMENT", message: `Installing Leaphy Libraries for ${name}` };
    event.sender.send('backend-message', installingLibsMessage);

    missingLibs.forEach(async missingLib => {
        await installLib(missingLib);
    });
}

ipcMain.on('verify-installation', async (event, payload) => {
    console.log('Verify Installation command received');
    const checkingPrerequisitesMessage = { event: "PREPARING_COMPILATION_ENVIRONMENT", message: `Checking prerequisites for ${payload.name}` };
    event.sender.send('backend-message', checkingPrerequisitesMessage);

    const updateCoreIndexParams = ["core", "update-index"];
    console.log(await tryRunArduinoCli(updateCoreIndexParams));
    const updateLibIndexParams = ["lib", "update-index"];
    console.log(await tryRunArduinoCli(updateLibIndexParams));

    await verifyInstalledCoreAsync(event, payload.name, payload.core);
    await verifyInstalledLibsAsync(event, payload.name, payload.libs);

    const platform = os.platform;
    if (platform == "win32") {
        const allDrivers = await tryRunExecutableAsync("driverquery");
        const isCH340DriverInstalled = allDrivers.indexOf("CH341SER_A64") > -1;
        if(!isCH340DriverInstalled){
            const driverInstallationRequiredMessage =  { event: "DRIVER_INSTALLATION_REQUIRED", message: "USB Driver installation is needed"};
            event.sender.send('backend-message', driverInstallationRequiredMessage);
            return;    
        }
    }

    const installationVerifiedMessage = { event: "INSTALLATION_VERIFIED", message: "All prerequisites for this robot have been installed" };
    event.sender.send('backend-message', installationVerifiedMessage);
});

ipcMain.on('install-usb-driver', async (event, payload) => {
    console.log('Install USB Driver command received');
    // Only do this for windows
    const platform = os.platform;
    if (platform != "win32") return;

    switch (payload.fqbn) {
        case 'arduino:avr:uno':
            console.log(await tryRunExecutableAsync(ch341DriverInstallerPath, []));
            break;
        default:
            break;
    }

    const installationVerifiedMessage = { event: "INSTALLATION_VERIFIED", message: "All prerequisites for this robot have been installed" };
    event.sender.send('backend-message', installationVerifiedMessage);
});


ipcMain.on('compile', compiler.compile);

ipcMain.on('update-device', deviceManager.updateDevice);
ipcMain.on('get-serial-devices', deviceManager.getDevices);

ipcMain.on('save-workspace', workspaceManager.save);
ipcMain.on('save-workspace-as', workspaceManager.saveAs);
ipcMain.on('restore-workspace', workspaceManager.restore);

async function tryRunArduinoCli(params) {
    return await tryRunExecutableAsync(arduinoCliPath, params);
}

async function tryRunExecutableAsync(path, params) {
    try {
        const { stdout, stderr } = await runExecutableAsync(path, params);
        if (stderr) {
            console.log('stderr:', stderr);
        }
        return stdout;
    } catch (e) {
        console.error(e);
        throw (e);
    }
}

function setupExecutables() {
    let platformFolder;
    let arduino_cli;
    let ch341_driver_installer;
    const platform = os.platform;
    if (platform == "win32") {
        platformFolder = "win32";
        arduino_cli = "arduino-cli.exe";
        ch341_driver_installer = "CH341SER.EXE";
    } else if (platform == "darwin") {
        platformFolder = "darwin";
        arduino_cli = "arduino-cli";
        ch341_driver_installer = "NA";
    }
    arduinoCliPath = path.join(app.getAppPath(), 'lib', platformFolder, 'arduino_cli', arduino_cli);
    ch341DriverInstallerPath = path.join(app.getAppPath(), 'lib', platformFolder, 'ch341_driver_installer', ch341_driver_installer);
}