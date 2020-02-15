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
const fs_extra_1 = require("fs-extra");
const Globby = require("globby");
const child_process_1 = require("child_process");
const path_1 = require("path");
const projectTypeMap_1 = require("./projectTypeMap");
const tar = require("tar");
const { prompt, Confirm, Select } = require('enquirer');
class Init {
    constructor(options) {
        this.options = options;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.getConfig();
            yield this.getTpl(config);
        });
    }
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const { cwd, command, argv } = this.options;
            let type = command.length && command[0] || '';
            let moduleName = '';
            if (!type) {
                const typeSelect = new Select({
                    name: 'type',
                    message: 'Select a init type',
                    choices: Object.keys(projectTypeMap_1.default).map((key) => {
                        return {
                            name: key,
                            message: projectTypeMap_1.default[key].title,
                        };
                    }),
                });
                type = yield typeSelect.run();
            }
            if (projectTypeMap_1.default[type]) {
                moduleName = projectTypeMap_1.default[type].source;
            }
            else {
                moduleName = argv.pureModuleName ? type : `protpl-${type}`;
                console.log(`will use ${moduleName} to create project`);
            }
            let projectName = '';
            let projectPath = '';
            while (!projectName) {
                const projectNameInput = yield prompt({
                    type: 'input',
                    name: 'name',
                    value: argv.name,
                    message: 'What is your project name?',
                });
                projectPath = path_1.resolve(cwd, projectNameInput.name);
                if (fs_extra_1.existsSync(projectPath)) {
                    const coverConfirm = new Confirm({
                        name: 'question',
                        message: `${projectNameInput.name} is existed, cover it?`,
                    });
                    const coverAnswer = yield coverConfirm.run();
                    if (coverAnswer === true) {
                        yield fs_extra_1.remove(projectPath);
                        projectName = projectNameInput.name;
                    }
                }
                else {
                    projectName = projectNameInput.name;
                }
            }
            return {
                moduleName,
                projectName,
                projectPath,
                author: yield this.getUserName(),
            };
        });
    }
    getUserName() {
        return __awaiter(this, void 0, void 0, function* () {
            let defaultAuthorName = '';
            try {
                defaultAuthorName = child_process_1.execSync(`git config --get user.name`).toString().replace(/\n/img, '');
            }
            catch (e) { }
            const authorInput = yield prompt({
                type: 'input',
                name: 'name',
                value: defaultAuthorName,
                message: 'What is your author name?',
            });
            return authorInput.name;
        });
    }
    getTpl(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { argv } = this.options;
            const { moduleName, projectName, author, projectPath } = config;
            const tmpDir = path_1.resolve(projectPath, `./.protpl-tmp-${Date.now()}-${Math.ceil(Math.random() * 1000000)}`);
            yield fs_extra_1.ensureDir(tmpDir);
            child_process_1.execSync(`cd ${tmpDir};${argv.npm || 'npm'} pack ${moduleName}`, { stdio: 'ignore' });
            const dirFileList = fs_extra_1.readdirSync(tmpDir);
            const tgzFileName = dirFileList.find((file) => {
                if (file.indexOf(moduleName) === 0 && file.endsWith('.tgz')) {
                    return true;
                }
            });
            if (!tgzFileName) {
                console.error(`Init Failure! ${moduleName} not exists`);
                return;
            }
            yield tar.x({
                cwd: tmpDir,
                file: path_1.resolve(tmpDir, tgzFileName),
            });
            const packagePath = path_1.resolve(tmpDir, 'package');
            const allFiles = yield Globby(['.*', '*', '*/**/*', '*/**/.*'], { cwd: packagePath });
            let isPkgTpl = false;
            if (allFiles.indexOf('package.json.ptotpl') !== -1) {
                isPkgTpl = true;
            }
            allFiles.forEach((filePath) => {
                if (filePath === 'package.json' && isPkgTpl) {
                    return;
                }
                if (filePath === 'CHANGELOG.md') {
                    return;
                }
                const source = path_1.resolve(packagePath, filePath);
                let target = path_1.resolve(projectPath, filePath);
                if (source.endsWith('.protpl')) {
                    target = target.replace(/\.protpl$/, '');
                    fs_extra_1.ensureFileSync(target);
                    this.formatProTpl(source, target, {
                        projectName,
                        author,
                    });
                }
                else {
                    fs_extra_1.ensureFileSync(target);
                    fs_extra_1.copyFileSync(source, target);
                }
            });
            fs_extra_1.removeSync(tmpDir);
            console.log('Success!');
        });
    }
    formatProTpl(source, target, options) {
        let fileData = fs_extra_1.readFileSync(source).toString();
        fileData = fileData.replace(/<%\s*(.*?)\s*%>/img, (match, varName) => {
            if (options[varName]) {
                return options[varName];
            }
            return match;
        });
        fs_extra_1.writeFileSync(target, fileData);
    }
}
exports.Init = Init;
