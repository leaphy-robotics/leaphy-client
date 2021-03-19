class WorkspaceManager {
    constructor(fs, dialog, app, logger) {
        this.fs = fs;
        this.dialog = dialog;
        this.app = app;
        this.logger = logger;
    }

    save = async (event, payload) => {
        this.logger.verbose("Save Workspace command received");
        this.fs.writeFileSync(payload.projectFilePath, payload.workspaceXml);
        const message = { event: "WORKSPACE_SAVED", message: "WORKSPACE_SAVED", payload: payload.projectFilePath };
        event.sender.send('backend-message', message);
    }

    saveAs = async (event, payload) => {
        this.logger.verbose("Save Workspace As command received");
        const saveAsOptions = {
            filters: [
                { name: `${payload.robotType.id} files`, extensions: [payload.robotType.id] }
            ]
        }
        if (payload.projectFilePath) {
            saveAsOptions.defaultPath = payload.projectFilePath;
        }
        const response = await this.dialog.showSaveDialog(saveAsOptions);
        if (response.canceled) {
            const message = { event: "WORKSPACE_SAVE_CANCELLED", message: "WORKSPACE_SAVE_CANCELLED" };
            event.sender.send('backend-message', message);
            return;
        }
        this.fs.writeFileSync(response.filePath, payload.workspaceXml);
        const message = { event: "WORKSPACE_SAVED", message: "WORKSPACE_SAVED", payload: response.filePath };
        event.sender.send('backend-message', message);
    }

    saveTemp = async (event, payload) => {
        this.logger.verbose("Save Temp Workspace command received");
        const filePath = `${this.app.getPath("userData")}/tmp.${payload.robotType.ext}`
        this.fs.writeFileSync(filePath, payload.workspaceXml);
        const message = { event: "WORKSPACE_SAVED_TEMP", message: "WORKSPACE_SAVED_TEMP", payload: filePath };
        event.sender.send('backend-message', message);
    }

    restoreTemp = async (event, robotType) => {
        this.logger.verbose("Restore Temp Workspace command received");
        if(!robotType) return;
        const workspaceXml = this.fs.readFileSync(`${this.app.getPath("userData")}/tmp.${robotType.ext}`, "utf8");
        const payload = { workspaceXml };
        const message = { event: "WORKSPACE_RESTORING_TEMP", message: "WORKSPACE_RESTORING_TEMP", payload: payload };
        event.sender.send('backend-message', message);
    }

    restore = async (event, robotType) => {
        this.logger.verbose("Restore Workspace command received");
        const openDialogOptions = {
            filters: [
                { name: `${robotType.id} files`, extensions: [robotType.id] }
            ]
        }
        const response = await this.dialog.showOpenDialog(openDialogOptions);
        if (response.canceled) {
            const message = { event: "WORKSPACE_RESTORE_CANCELLED", message: "WORKSPACE_RESTORE_CANCELLED" };
            event.sender.send('backend-message', message);
            return;
        }
        const workspaceXml = this.fs.readFileSync(response.filePaths[0], "utf8");
        const payload = { projectFilePath: response.filePaths[0], workspaceXml };
        const message = { event: "WORKSPACE_RESTORING", message: "WORKSPACE_RESTORING", payload: payload };
        event.sender.send('backend-message', message);
    }
}

module.exports = WorkspaceManager;