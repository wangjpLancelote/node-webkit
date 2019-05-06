/**
 * test 4 DateFormat
 */
const DateFormat = require('../util/dateFormat').DateFormat;

let r = new DateFormat();
let t = new DateFormat('Y|M|D h/m/s', new Date());
console.log('r', r.res); //2019/05/06 14:59:02
console.log('t', t.res); //2019|05|06 14/59/02