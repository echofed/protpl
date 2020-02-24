import * as minimist from 'minimist';
import * as commandLineUsage from 'command-line-usage';
import { Init } from './init';

const pkg = require('../package.json');

export class ProTpl {
  private argv: any;
  private cwd = process.cwd();

  constructor(argv) {
    this.argv = minimist(argv.slice(2));
  }

  public async start() {
    const commandList = this.argv._ || [];
    const command = commandList.shift();
    switch (command) {
      case 'i':
      case 'init':
        return this.initProject(commandList);
      case 'v':
      case 'version':
        return this.showVersion(pkg.version);
      default:
        return this.displayHelp();
    }
  }
  // 展示当前版本
  private async showVersion(version: string) {
    const commandList = {
      header: 'Version:',
      content: [
        { name: 'latest version', summary: version },
      ],
    };
    console.log(commandLineUsage(commandList));
  }

  private async initProject(command) {
    const init = new Init({
      cwd: this.cwd,
      command,
      argv: this.argv,
    });
    await init.start();
  }

  private displayHelp() {
    const commandList = {
      header: 'Commands',
      content: [
        { name: 'h, help', summary: 'Display help information.' },
        { name: 'i, init', summary: 'Init a project.' },
        { name: 'v, version', summary: 'Print the version.' },
      ],
    };
    console.log(commandLineUsage(commandList));
  }
}
