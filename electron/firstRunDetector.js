class FirstRunDetector {
    constructor(firstRun){
        this.firstRun = firstRun;
    }
    detectFirstRun = (event) => {
        const isFirstRun = this.firstRun();
        // Clear the firstRun setting, don't do this
        //this.firstRun.clear();

        if(isFirstRun){
            const firstRunDetectedMessage = { event: "FIRST_RUN" };
            event.sender.send('backend-message', firstRunDetectedMessage);
        }
    }
}

module.exports = FirstRunDetector;