class Executable {
    constructor(asyncExecFile, logger) {
        this.logger = logger;
        this.asyncExecFile = asyncExecFile;
    }

    runAsync = async (path, params) => {
        try {
            const { stdout, stderr } = await this.asyncExecFile(path, params);
            if (stderr) {
                this.logger.error('stderr:', stderr);
            }
            return stdout;
        } catch (e) {
            console.error(e);
            throw (e);
        }
    }
}

module.exports = Executable;