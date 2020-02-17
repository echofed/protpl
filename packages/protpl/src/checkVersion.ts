import * as semver from 'semver';
import * as chalk from 'chalk';
import * as ora from 'ora';
import axios from 'axios';
import log from './log';

const pkg = require('../package.json')

export class CheckVersion {

  private spinner;

  public result = false;

  constructor() {
    log.tips('start checking ..');

    this.spinner = ora({
      text: 'checking the protpl and node version',
      color: 'blue'
    }).start();

    // this.check();
  }
  async check() {
    this.checkNode();
    const res = await this.checkCli()
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
  private async checkCli() {
    try {
      let res = await axios({
        url: 'https://registry.npmjs.org/protpl',
        method: 'get',
        timeout: 1000
      });
      return new Promise((resolve, reject) => {
        if (res.status === 200) {
          this.spinner.text = chalk.green('protpl: checking protpl version succeed, its the latest version');
          this.spinner.succeed();

          let localVer = pkg.version;
          let latestVer = res.data['dist-tags'].latest;

          if (semver.lt(localVer, latestVer)) {
            log.tips();
            log.tips(chalk.blue('  A newer version of protpl is available.'));
            log.tips();
            log.tips(`  latest:    ${chalk.green(latestVer)}`);
            log.tips(`  installed:    ${chalk.red(localVer)}`);
            log.tips('  update protpl latest: npm update -g protpl');
            log.tips()
          }
          resolve(true)
        } else {
          log.tips(chalk.red(`     ${res.statusText}: ${res.status}`));
          log.tips(chalk.red(`     ${res.data.error}`));
          reject(true)
        }
      })
    } catch (err) {
      if (err) {
        let res = err.response;

        this.spinner.text = chalk.white('protpl:checking protpl version failed, error message as follows:');
        this.spinner.fail();

        log.tips();

        if (res) {
          log.tips(chalk.red(`     ${res.statusText}: ${res.status}`));
          log.tips(chalk.red(`     ${res.data.error}`));
        } else {
          log.tips(chalk.red(`     ${err.message}`));
        }
        log.tips();
        return true;
      }
    }
    // .then(res => {
    //   if (res.status === 200) {
    //     this.spinner.text = chalk.green('protpl: checking protpl version succeed, its the latest version');
    //     this.spinner.succeed();

    //     let localVer = pkg.version;
    //     let latestVer = res.data['dist-tags'].latest;

    //     if (semver.lt(localVer, latestVer)) {
    //       log.tips();
    //       log.tips(chalk.blue('  A newer version of protpl is available.'));
    //       log.tips();
    //       log.tips(`  latest:    ${chalk.green(latestVer)}`);
    //       log.tips(`  installed:    ${chalk.red(localVer)}`);
    //       log.tips('  update protpl latest: npm update -g protpl');
    //       log.tips()
    //     }
    //     return true;
    //   }
    // })
    // .catch(err => {
    //   if (err) {
    //     let res = err.response;

    //     this.spinner.text = chalk.white('protpl:checking protpl version failed, error message as follows:');
    //     this.spinner.fail();

    //     log.tips();

    //     if (res) {
    //       log.tips(chalk.red(`     ${res.statusText}: ${res.headers.status}`));
    //     } else {
    //       log.tips(chalk.red(`     ${err.message}`));
    //     }
    //     log.tips();
    //     return true;
    //   }
    // })
  }
}