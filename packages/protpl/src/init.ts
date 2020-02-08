import { existsSync, ensureDir, remove, readdirSync, copyFileSync, readFileSync, writeFileSync, ensureFileSync, removeSync } from 'fs-extra';
import * as Globby from 'globby';
import { execSync } from 'child_process';
import { resolve } from 'path';
import ProjectTypeMap from './projectTypeMap';
import * as tar from 'tar';
const { prompt, Confirm, Select } = require('enquirer');
export class Init {
  private options: any;
  constructor(options) {
    this.options = options;
  }

  public async start() {
    const config = await this.getConfig();
    await this.getTpl(config);
  }

  private async getConfig() {
    const { cwd, command, argv } = this.options;
    let type: string = command.length && command[0] || '';
    let moduleName = '';
    if (!type) {
      const typeSelect = new Select({
        name: 'type',
        message: 'Select a init type',
        choices: Object.keys(ProjectTypeMap).map((key: string) => {
          return {
            name: key,
            message: ProjectTypeMap[key].title,
          };
        }),
      });
      type = await typeSelect.run();
    }

    if (ProjectTypeMap[type]) {
      moduleName = ProjectTypeMap[type].source;
    } else {
      moduleName = argv.pureModuleName ? type : `protpl-${type}`;
      console.log(`will use ${moduleName} to create project`);
    }

    let projectName = '';
    let projectPath = '';
    while (!projectName) {
      const projectNameInput = await prompt({
        type: 'input',
        name: 'name',
        value: argv.name,
        message: 'What is your project name?',
      });
      projectPath = resolve(cwd, projectNameInput.name);
      if (existsSync(projectPath)) {
        const coverConfirm = new Confirm({
          name: 'question',
          message: `${projectNameInput.name} is existed, cover it?`,
        });

        const coverAnswer = await coverConfirm.run();
        if (coverAnswer === true) {
          await remove(projectPath);
          projectName = projectNameInput.name;
        }
      } else {
        projectName = projectNameInput.name;
      }
    }

    return {
      moduleName,
      projectName,
      projectPath,
    };
  }

  private async getTpl(config) {
    const { argv } = this.options;
    const { moduleName, projectPath } = config;
    const tmpDir = resolve(projectPath, `./.protpl-tmp-${Date.now()}-${Math.ceil(Math.random() * 1000000)}`);
    await ensureDir(tmpDir);
    execSync(`cd ${tmpDir};${ argv.npm || 'npm'} pack ${moduleName}`, {stdio: 'ignore'});
    const dirFileList = readdirSync(tmpDir);
    const tgzFileName = dirFileList.find((file: string) => {
      if (file.indexOf(moduleName) === 0 && file.endsWith('.tgz')) {
        return true;
      }
    });
    if (!tgzFileName) {
      console.error(`Init Failure! ${moduleName} not exists`);
      return;
    }
    await tar.x(
      {
        cwd: tmpDir,
        file: resolve(tmpDir, tgzFileName),
      },
    );
    const packagePath = resolve(tmpDir, 'package');
    let allFiles = await Globby(['*', '*/**/*.*'], { cwd: packagePath });
    if (allFiles.indexOf('package.json.ptotpl') !== -1) {
      allFiles = allFiles.filter((file: string) => file !== 'package.json');
    }
    allFiles.forEach((filePath: string) => {
      const source = resolve(packagePath, filePath);
      let target = resolve(projectPath, filePath);
      if (source.endsWith('.protpl')) {
        target = target.replace(/\.protpl$/, '');
        ensureFileSync(target);
        this.formatProTpl(source, target, {
          moduleName,
        });
      } else {
        ensureFileSync(target);
        copyFileSync(source, target);
      }
    });
    removeSync(tmpDir);
    console.log('Success!');
  }

  private formatProTpl(source, target, options) {
    let fileData = readFileSync(source).toString();
    fileData = fileData.replace(/<%\s*(.*?)\s*%>/img, (match, varName) => {
      if (options[varName]) {
        return options[varName];
      }
      return match;
    });
    writeFileSync(target, fileData);
  }
}
