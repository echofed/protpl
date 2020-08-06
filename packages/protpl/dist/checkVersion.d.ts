export declare class CheckVersion {
    result: boolean;
    private spinner;
    constructor();
    check(): Promise<boolean>;
    private checkNode;
    private checkCli;
}
