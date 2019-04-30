'use strict';

const https = require('https');
const fs = require('fs');

let option = {
    key: fs.readFileSync('./key-cert/key.pem'),
    cert: fs.readFileSync('./key-cert/key-cert.pem')
};

const server = https.createServer(option, (err, req, res) => {
    if (err) throw err;
    res.writeHead(200),
    res.end("hello world");
});
server.listen(8888);

console.log("https服务已经启动");