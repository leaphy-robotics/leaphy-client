//if (require('electron-squirrel-startup')) return;
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");

if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}
const url = require("url");
const fs = require('fs');
const os = require("os");
const util = require('util');
const runExecutable = util.promisify(require('child_process').execFile);

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

app.setAppLogsPath();

let arduinoCliPath;
let ch341DriverInstallerPath;
setupExecutables();

async function installCore(core) {
    const updateIndexParams = ["core", "update-index"];
    const installCoreParams = ["core", "install", core];
    console.log(await tryRunArduinoCli(updateIndexParams));
    console.log(await tryRunArduinoCli(installCoreParams));
}

async function installLib(library) {
    const installLibParams = ["lib", "install", library];
    console.log(await tryRunArduinoCli(installLibParams));
}

function writeCodeToCompileLocation(code) {
    const userDataPath = app.getPath('userData');
    const sketchFolder = path.join(userDataPath, 'sketch');
    if (!fs.existsSync(sketchFolder)) {
        fs.mkdirSync(sketchFolder);
    }
    const sketchPath = path.join(sketchFolder, 'sketch.ino');
    fs.writeFileSync(sketchPath, code);
    return sketchPath;
}

async function verifyInstalledCoreAsync(event, name, core) {
    const checkCoreParams = ["core", "list", "--format", "json"];
    const installedCores = JSON.parse(await tryRunArduinoCli(checkCoreParams));
    const isRequiredCoreInstalled = installedCores.map(v => v.ID).includes(core);
    if (isRequiredCoreInstalled) {
        console.log("Required core already installed");
        return
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

    const updateIndexParams = ["lib", "update-index"];
    console.log(await tryRunArduinoCli(updateIndexParams));

    missingLibs.forEach(async missingLib => {
        await installLib(missingLib);
    });
}

ipcMain.on('compile', async (event, payload) => {

    const sketchPath = writeCodeToCompileLocation(payload.code);

    await verifyInstalledCoreAsync(event, payload.name, payload.core);
    await verifyInstalledLibsAsync(event, payload.name, payload.libs);

    const compileParams = ["compile", "--fqbn", payload.fqbn, sketchPath];
    const compilingMessage = { event: "COMPILATION_STARTED", message: "Compiling..." };
    event.sender.send('backend-message', compilingMessage);
    await tryRunArduinoCli(compileParams);

    const updatingMessage = { event: "ROBOT_UPDATING", message: "Updating robot..." };
    event.sender.send('backend-message', updatingMessage);
    const uploadParams = ["upload", "-b", payload.fqbn, "-p", payload.port, "-i", `${sketchPath}.${payload.fqbn.split(":").join(".")}.${payload.ext}`];
    try {
        await tryRunArduinoCli(uploadParams);
    } catch (error) {
        unsuccesfulUploadMessage = { event: "NO_ROBOT_FOUND", message: "No connected robot found to upload to" };
        event.sender.send('backend-message', unsuccesfulUploadMessage);
        return;
    }

    const allDoneMessage = { event: "ROBOT_UPDATED", message: "Robot is ready for next sketch" };
    event.sender.send('backend-message', allDoneMessage);
});


ipcMain.on('install-board', async (event, payload) => {

    await installCore(payload.core);

    switch (payload.fqbn) {
        case 'arduino:avr:uno':
            console.log(await tryRunExecutable(ch341DriverInstallerPath, []));
            break;
        default:
            break;
    }
});


ipcMain.on('get-board-port', async (event) => {
    const updateIndexParams = ["core", "update-index"];
    console.log(await tryRunArduinoCli(updateIndexParams));

    const listBoardsParams = ["board", "list", "--format", "json"];
    const connectedBoards = JSON.parse(await tryRunArduinoCli(listBoardsParams));
    let message;
    if (!connectedBoards.length) {
        message = { event: "NO_ROBOT_FOUND", message: "No connected robot found" };
    } else {
        message = { event: "ROBOT_FOUND_ON_PORT", message: connectedBoards[0].address };
    }
    event.sender.send('backend-message', message);
});

async function tryRunArduinoCli(params) {
    return await tryRunExecutable(arduinoCliPath, params);
}

async function tryRunExecutable(path, params) {
    try {
        const { stdout, stderr } = await runExecutable(path, params);
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

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }
    console.log("Handling Squirrel Event");

    const ChildProcess = require('child_process');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        } catch (error) { }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
};

