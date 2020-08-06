import * as semver from 'semver';
import * as chalk from 'chalk';
import * as ora from 'ora';
import log from './log';
import { execSync } from 'child_process';

const pkg = require('../package.json');

export class CheckVersion {

  public result = false;

  private spinner;

  constructor() {
    log.tips('start checking ..');

    this.spinner = ora({
      text: 'checking the protpl and node version',
      color: 'blue',
    }).start();

    // this.check();
  }
  public async check() {
    this.checkNode();
    const res = await this.checkCli();
    return res;
  }
  // 检查node版本
  private checkNode() {
    if (!semver.satisfies(process.version, pkg.engines.node)) {
      this.spinner.text = chalk.white('prptpl: checking protpl version failed, the error message as follows:');
      this.spinner.fail();
      log.tips();
      log.error(`  You must upgrade your node to ${pkg.engines.node} to use the protpl.`);
    }
  }
  // 检查cli工具版本
  private checkCli() {
    try {
      const latestVersion = execSync(`npm view protpl dist-tags --json`).toString();
      if (latestVersion) {
        const latestVerObj = JSON.parse(latestVersion);
        this.spinner.text = chalk.green('protpl: checking protpl version succeed, its the latest version');
        this.spinner.succeed();

        const localVer = pkg.version;
        const latestVer = latestVerObj.latest;

        if (semver.lt(localVer, latestVer)) {
          log.tips();
          log.tips(chalk.blue('  A newer version of protpl is available.'));
          log.tips();
          log.tips(`  latest:    ${chalk.green(latestVer)}`);
          log.tips(`  installed:    ${chalk.red(localVer)}`);
          log.tips('  update protpl latest: npm update -g protpl');
          log.tips();
        }
      } else {
        this.spinner.text = chalk.white('protpl: checking protpl version failed');
        this.spinner.fail();
        log.tips(chalk.red(`  can not find the latest vertion, please view the site: https://registry.npmjs.org/protpl`));
      }
    } catch (err) {
      if (err) {
        this.spinner.text = chalk.white('protpl:checking protpl version failed, error message as follows:');
        this.spinner.fail();

        log.tips();

        log.tips(chalk.red(`     ${err.message}`));
        log.tips();
      }
    }
    return true;
  }
}
