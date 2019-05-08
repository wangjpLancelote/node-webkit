'use strict'

const chalk = require('chalk'); /**chalk 终端显示banner */
const figlet = require('figlet'); /**chalk 终端banner字体镂空 */
const error = exports.error = chalk.bold.red; /**chalk error提示 */
const warning = exports.warning = chalk.keyword('orange'); /**chalk 警告提示 */
const success =  chalk.green;

const warnLog = exports.warnLog = (...params) => {
    return console.log(warning(params.join(' ')));
}

const errorLog = exports.errorLog = (...params) => {
    return console.log(error(params.join(' ')));
}

const successLog = exports.successLog = (...params) => {
    return console.log(success(params.join(' ').toString()));
}

const hole = exports.hole = (value) => {
    return console.log(chalk.yellow(figlet.textSync(value, {horizontalLayout: 'full'})))
}