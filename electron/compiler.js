class Compiler {
    constructor(app, arduinoCli, prerequisiteManager, path, fs, logger){
        this.arduinoCli = arduinoCli;
        this.prerequisiteManager = prerequisiteManager;
        this.fs = fs;
        this.logger = logger;
        this.app = app;
        this.path = path;
        const sketchFileName = 'sketch.ino';
        this.sketchFolder = this.getSketchFolder(app, path);
        this.sketchPath = path.join(this.sketchFolder, sketchFileName);
        this.binariesFolder = this.getBinariesFolder(app, path);
        this.binaryPath = path.join(this.binariesFolder, sketchFileName);
    }

    recreateSketchFolder = (event, payload) => {
        this.clearSketchFolder();
        this.getSketchFolder(this.app, this.path);
        this.prerequisiteManager.verifyInstallation(event, payload);
    }

    clearSketchFolder = () => {
        console.log("Removing Sketch Folder")
        var sketchFolder = this.getSketchFolder(this.app, this.path);
        this.fs.rmSync(sketchFolder, { recursive: true, force: true });
    }

    getSketchFolder = (app, path) => {
        const userDataPath = app.getPath('userData');
        const sketchFolder = path.join(userDataPath, 'sketch');
        if (!this.fs.existsSync(sketchFolder)) {
            console.log("Creating the Sketch Folder")
            this.fs.mkdirSync(sketchFolder);
        }
        return sketchFolder;
    }
    getBinariesFolder = (app, path) => {
        const userDataPath = app.getPath('userData');
        const binFolder = path.join(userDataPath, 'bin');
        if (!this.fs.existsSync(binFolder)) {
            console.log("Creating the Binaries Folder")
            this.fs.mkdirSync(binFolder);
        }
        return binFolder;
    }
    writeCodeToCompileLocation = (code) => {
        this.fs.writeFileSync(this.sketchPath, code);
    }
    compile = async (event, payload) => {
        this.logger.verbose('Compile command received');
        this.writeCodeToCompileLocation(payload.code);
        const compileParams = ["compile", this.sketchFolder, "--fqbn", payload.fqbn, "--build-path", this.binariesFolder];
        const compilingMessage = { event: "COMPILATION_STARTED", message: "COMPILATION_STARTED", displayTimeout: 0 };
        event.sender.send('backend-message', compilingMessage);
        try {
            await this.arduinoCli.runAsync(compileParams);
        } catch (error) {
            this.logger.error("Compilation failed!", error)
            const compilationFailedMessage = { event: "COMPILATION_FAILED", message: "COMPILATION_FAILED", displayTimeout: 3000 };
            event.sender.send('backend-message', compilationFailedMessage);
            return;
        }
    
        const compilationCompleteMessage = { event: "COMPILATION_COMPLETE", message: "COMPILATION_COMPLETE", payload: this.binaryPath, displayTimeout: 1000 };
        event.sender.send('backend-message', compilationCompleteMessage);
    }
}

module.exports = Compiler;