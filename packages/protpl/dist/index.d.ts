export declare class ProTpl {
    private argv;
    private cwd;
    constructor(argv: any);
    start(): Promise<void>;
    private showVersion;
    private initProject;
    private displayHelp;
}
