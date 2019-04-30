const mail = require("nodemailer");
const http = require("http");
const router = require("./router.js")();
const url = require('url');

const mailTranPort = mail.createTransport({
    host: 'smtp.qq.com',
    secureConnection: true,
    auth : {
        user : '1343054261@qq.com', //目标用户邮箱
        pass : 'xunlsezjrzidiegc'  //授权码
    }
});

http.createServer(function (req, res) {
    res.writeHead(200);
    if (url.parse(req.url).path == '/favicon.ico') return;
    let pathName = url.parse(req.url, true).pathname;
    console.log('path', /\w/.exec(pathName));

    res.end("hello world");

}).listen(1111);

// http.createServer(router).listen(1111);
// router.get('/test', function (req, res) {
//     console.log('GET', req.query);
//     res.send(req.query);
// });

