export class RobotType {
    constructor(
        public id: string, 
        public name: string, 
        public svgname: string, 
        public board: string, 
        public fqbn: string, 
        public ext: string, 
        public core: string, 
        public libs: string[], 
        public isWired: boolean = true, 
        public showLeaphyExtra: boolean = true
        ) { }
}
