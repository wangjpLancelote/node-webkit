'use strict';
const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "content-type" : "text/plain",
        "Cache-Control" : "max-age=5"
    })
    res.write("test node hot");
    res.write("test node hot 222");

    res.end();
});



server.listen(7777);
let re = path.resolve(__dirname, "..")
console.log("cd..", re);
console.log("join", path.join(re, "hotOverride"));
console.log("server lsiten 7777 ---------------");
console.log("dirname", __dirname);  //返回当前文件夹目录
console.log("require.resolve", require.resolve("./testHot.js"));
console.log("path.resolve", path.resolve(__dirname));
// console.log("require", require.resolve(''));

let options = {
    flags: 'a',
    encoding: 'utf8'
}
let stdout = fs.createWriteStream('../log/out.log', options);
let stderr = fs.createWriteStream('../log/err.log', options);
let logger = new console.Console(stdout, stderr);

// for (let i = 0; i < 100; i ++) {
//     logger.log(`log messege ${i}`);
//     logger.error(`error messege ${i}`);
// }

// console.log("global:", global);
let str = "/send"
console.log('string' + str.replace(/\//g));
console.log("__dirname", __dirname);
