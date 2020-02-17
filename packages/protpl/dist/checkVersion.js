"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const chalk = require("chalk");
const ora = require("ora");
const log_1 = require("./log");
const child_process_1 = require("child_process");
const pkg = require('../package.json');
class CheckVersion {
    constructor() {
        this.result = false;
        log_1.default.tips('start checking ..');
        this.spinner = ora({
            text: 'checking the protpl and node version',
            color: 'blue'
        }).start();
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkNode();
            const res = yield this.checkCli();
            return res;
        });
    }
    checkNode() {
        if (!semver.satisfies(process.version, pkg.engines.node)) {
            this.spinner.text = chalk.white('prptpl: checking protpl version failed, the error message as follows:');
            this.spinner.fail();
            log_1.default.tips();
            log_1.default.error(`  You must upgrade your node to ${pkg.engines.node} to use the protpl.`);
        }
    }
    checkCli() {
        try {
            let latestVersion = child_process_1.execSync(`npm view protpl dist-tags --json`).toString();
            if (latestVersion) {
                let latestVerObj = JSON.parse(latestVersion);
                this.spinner.text = chalk.green('protpl: checking protpl version succeed, its the latest version');
                this.spinner.succeed();
                let localVer = pkg.version;
                let latestVer = latestVerObj.latest;
                if (semver.lt(localVer, latestVer)) {
                    log_1.default.tips();
                    log_1.default.tips(chalk.blue('  A newer version of protpl is available.'));
                    log_1.default.tips();
                    log_1.default.tips(`  latest:    ${chalk.green(latestVer)}`);
                    log_1.default.tips(`  installed:    ${chalk.red(localVer)}`);
                    log_1.default.tips('  update protpl latest: npm update -g protpl');
                    log_1.default.tips();
                }
            }
            else {
                this.spinner.text = chalk.white('protpl: checking protpl version failed');
                this.spinner.fail();
                log_1.default.tips(chalk.red(`  can not find the latest vertion, please view the site: https://registry.npmjs.org/protpl`));
            }
        }
        catch (err) {
            if (err) {
                this.spinner.text = chalk.white('protpl:checking protpl version failed, error message as follows:');
                this.spinner.fail();
                log_1.default.tips();
                log_1.default.tips(chalk.red(`     ${err.message}`));
                log_1.default.tips();
            }
        }
        return true;
    }
}
exports.CheckVersion = CheckVersion;
