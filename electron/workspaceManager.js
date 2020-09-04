class WorkspaceManager {
    constructor(fs, dialog) {
        this.fs = fs;
        this.dialog = dialog;
    }

    save = async (event, payload) => {
        console.log("Save Workspace command received");
        this.fs.writeFileSync(payload.projectFilePath, payload.workspaceXml);
        const message = { event: "WORKSPACE_SAVED", payload: payload.projectFilePath };
        event.sender.send('backend-message', message);
    }

    saveAs = async (event, payload) => {
        console.log("Save Workspace As command received");
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
            const message = { event: "WORKSPACE_SAVE_CANCELLED", message: "Workspace not saved" };
            event.sender.send('backend-message', message);
            return;
        }
        thisfs.writeFileSync(response.filePath, payload.workspaceXml);
        const message = { event: "WORKSPACE_SAVED", payload: response.filePath };
        event.sender.send('backend-message', message);
    }

    restore = async (event, robotType) => {
        console.log("Restore Workspace command received");
        const openDialogOptions = {
            filters: [
                { name: `${robotType.id} files`, extensions: [robotType.id] }
            ]
        }
        const response = await this.dialog.showOpenDialog(openDialogOptions);
        if (response.canceled) {
            const message = { event: "WORKSPACE_RESTORE_CANCELLED", message: "Workspace restore cancelled" };
            event.sender.send('backend-message', message);
            return;
        }
        const workspaceXml = this.fs.readFileSync(response.filePaths[0], "utf8");
        const payload = { projectFilePath: response.filePaths[0], workspaceXml };
        const message = { event: "WORKSPACE_RESTORING", payload: payload };
        event.sender.send('backend-message', message);
    }
}

module.exports = WorkspaceManager;