'use strict'
const cron = require("cron").CronJob;
const cluster = require("cluster");
const cpus = require("os").cpus().length
const http = require("http");

const task = new cron('00 40 11 * * *', function () {
    console.log("this is task in 1130");
}, null, true);

// for (let i = 0; i < 1000000; i ++) {
//     console.log("------>>i: " + i);
// }
// console.log("a");
console.log("cpus" + cpus);
console.log("--", cluster.isMaster);
if (cluster.isMaster) {
    console.log("----->>>--master start--<<<<-------");
    for (let i = 0; i < cpus; i ++) {
        cluster.fork();
    }
    cluster.on('listening', function (worker, address) {
        console.log('listening worker : ' + worker.process.pid, 'address:' + address.port);
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker' + worker.process.pid + 'died');
    });

} else {
    http.createServer(function (req, res) {
        res.writeHead(200);
        res.end('hello')
    }).listen(0);
}