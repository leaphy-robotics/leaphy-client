//if (require('electron-squirrel-startup')) return;
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");

if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
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
const url = require("url");
const fs = require('fs');
const os = require("os");

let mainWindow

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
    mainWindow.webContents.openDevTools()

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

ipcMain.on('compile', (event, data) => {
    console.log('got a compile event with data', data);

    let platformFolder = "";
    let executable = "";
    //const fqbn = "esp8266:esp8266:nodemcuv2";
    const fqbn = "arduino:avr:uno";
    const port = "COM8";
    //const ext = "bin";
    const ext = "hex";

    const platform = os.platform;
    if (platform == "win32") {
        platformFolder = "arduino-cli_0.9.0_Windows_64bit";
        executable = "arduino-cli.exe";
    }
    const userDataPath = app.getPath('userData');
    const sketchFolder = path.join(userDataPath, 'sketch');
    if (!fs.existsSync(sketchFolder)) {
        fs.mkdirSync(sketchFolder);
    }
    const sketchPath = path.join(sketchFolder, 'sketch.ino');
    fs.writeFileSync(sketchPath, data);

    var runExecutable = require('child_process').execFile;
    const appPath = app.getAppPath();
    var executablePath = path.join(appPath, 'lib', platformFolder, executable);
    var compileParams = ["compile", "--fqbn", fqbn, sketchPath];
    var uploadParams = ["upload", "-b", fqbn, "-p", port, "-i", `${sketchPath}.${fqbn.split(":").join(".")}.${ext}`];

    runExecutable(executablePath, compileParams, function (err, data) {
        if (err) { console.log(err); }
        console.log(data.toString());
        event.sender.send('compilation-complete');

        runExecutable(executablePath, uploadParams, function (err, data) {
            if (err) { console.log(err); }
            console.log(data.toString());
            event.sender.send('upload-complete');
        })
    });
});

