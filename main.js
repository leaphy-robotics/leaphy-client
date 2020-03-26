const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const fs = require('fs');

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

    const userDataPath = app.getPath('userData');
    const sketchFolder = path.join(userDataPath, 'sketch');
    if(!fs.existsSync(sketchFolder)) {
        fs.mkdirSync(sketchFolder);
    }
    const sketchPath = path.join(sketchFolder, 'sketch.ino');
    fs.writeFileSync(sketchPath, data);

    var child = require('child_process').execFile;
    const appPath = app.getAppPath();
    var executablePath = path.join(appPath, 'lib', 'arduino-cli_0.9.0_Windows_64bit', 'arduino-cli.exe');
    var parameters = ["compile", "--fqbn", "esp8266:esp8266:nodemcuv2", sketchPath];

    child(executablePath, parameters, function (err, data) {
        if(err) { console.log(err); }
        console.log(data.toString());
        event.sender.send('compilation-complete');
    });
});

