class Executable {
    constructor(asyncExecFile) {
        this.asyncExecFile = asyncExecFile;
    }

    runAsync = async (path, params) => {
        try {
            const { stdout, stderr } = await this.asyncExecFile(path, params);
            if (stderr) {
                console.log('stderr:', stderr);
            }
            return stdout;
        } catch (e) {
            console.error(e);
            throw (e);
        }
    }
}

module.exports = Executable;