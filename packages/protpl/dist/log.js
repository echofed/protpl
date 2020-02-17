"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
exports.default = {
    error(msg = '') {
        console.log(chalk.red(msg));
        process.exit(1);
    },
    success(msg = '') {
        console.log(chalk.green(msg));
    },
    tips(msg = '') {
        console.log(msg);
    },
};
