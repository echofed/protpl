import * as minimist from 'minimist';
import * as commandLineUsage from 'command-line-usage';
import { Init } from './init';
export class ProTpl {
  private argv: any;
  private cwd = process.cwd();

  constructor(argv) {
    this.argv = minimist(argv.slice(2));
    console.log(this.argv, this.cwd);
  }

  public async start() {
    const commandList = this.argv._ || [];
    const command = commandList.shift();
    switch (command) {
      case 'i':
      case 'init':
        return this.initProject(commandList);
      default:
        return this.displayHelp();
    }
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
