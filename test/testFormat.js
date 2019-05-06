/**
 * test 4 DateFormat
 */
const DateFormat = require('../util/dateFormat').DateFormat;
const DF = require('../util/dateFormat').DateFormat;
console.log('DF', DF);

let r = DF('Y/M/D h:m:s', new Date());
// let t = new DateFormat('Y|M|D h/m/s', new Date());
console.log('r', r.res); //2019/05/06 14:59:02
// console.log('t', t.res); //2019|05|06 14/59/02