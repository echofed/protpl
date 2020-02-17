import * as chalk from 'chalk';

export default {
  error(msg: string = ''): void {
    console.log(chalk.red(msg));
    process.exit(1);
  },
  success(msg: string = ''): void {
    console.log(chalk.green(msg));
  },
  tips(msg: string = ''): void {
    console.log(msg);
  },
};
