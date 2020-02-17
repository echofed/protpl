export declare class CheckVersion {
    private spinner;
    result: boolean;
    constructor();
    check(): Promise<boolean>;
    private checkNode;
    private checkCli;
}
