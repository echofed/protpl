export declare class CheckVersion {
    private spinner;
    result: boolean;
    constructor();
    check(): Promise<unknown>;
    private checkNode;
    private checkCli;
}
