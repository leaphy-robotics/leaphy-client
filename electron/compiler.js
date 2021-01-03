class Compiler {
    constructor(app, arduinoCli, path, fs){
        this.arduinoCli = arduinoCli;
        this.fs = fs;
        this.sketchFolder = this.getSketchFolder(app, path);
        this.sketchPath = path.join(this.sketchFolder, 'sketch.ino');
    }
    getSketchFolder = (app, path) => {
        const userDataPath = app.getPath('userData');
        const sketchFolder = path.join(userDataPath, 'sketch');
        if (!this.fs.existsSync(sketchFolder)) {
            this.fs.mkdirSync(sketchFolder);
        }
        return sketchFolder;
    }
    writeCodeToCompileLocation = (code) => {
        this.fs.writeFileSync(this.sketchPath, code);
    }
    compile = async (event, payload) => {
        console.log('Compile command received', payload);
        this.writeCodeToCompileLocation(payload.code);
        const compileParams = ["compile", "--fqbn", payload.fqbn, this.sketchPath, "--build-path", this.sketchFolder];
        const compilingMessage = { event: "COMPILATION_STARTED", message: "COMPILATION_STARTED", displayTimeout: 0 };
        event.sender.send('backend-message', compilingMessage);
        try {
            await this.arduinoCli.runAsync(compileParams);
        } catch (error) {
            const compilationFailedMessage = { event: "COMPILATION_FAILED", message: "COMPILATION_FAILED", displayTimeout: 3000 };
            event.sender.send('backend-message', compilationFailedMessage);
            return;
        }
    
        const compilationCompleteMessage = { event: "COMPILATION_COMPLETE", message: "COMPILATION_COMPLETE", payload: this.sketchPath, displayTimeout: 1000 };
        event.sender.send('backend-message', compilationCompleteMessage);
    }
}

module.exports = Compiler;