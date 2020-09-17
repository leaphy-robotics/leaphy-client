class WebBrowserLauncher {
    constructor(os){
        this.os = os;
    }
    openWebPage = (event, url) => {
        const platform = this.os.platform;
        const command = platform == "win32" ? `start ${url}` : `open ${url}`;
        require('child_process').execSync(command);
    }
}

module.exports = WebBrowserLauncher;