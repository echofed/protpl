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
const minimist = require("minimist");
const commandLineUsage = require("command-line-usage");
const init_1 = require("./init");
class ProTpl {
    constructor(argv) {
        this.cwd = process.cwd();
        this.argv = minimist(argv.slice(2));
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const commandList = this.argv._ || [];
            const command = commandList.shift();
            switch (command) {
                case 'i':
                case 'init':
                    return this.initProject(commandList);
                default:
                    return this.displayHelp();
            }
        });
    }
    initProject(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const init = new init_1.Init({
                cwd: this.cwd,
                command,
                argv: this.argv,
            });
            yield init.start();
        });
    }
    displayHelp() {
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
exports.ProTpl = ProTpl;
