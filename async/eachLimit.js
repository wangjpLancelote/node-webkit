const async = require("async");


//并行处理limit条任务
let mails = ['a@example.com', 'b@example.com', 'c@example.com', 'd@example.com', 'e@example.com', 'f@example.com'];

let limit = 5;

let sendMail = function (result, cb) {
    console.log('=============>>>>>mail::',result);
}

let handler = function (mail) {
    sendMail (mail, (err) => {
        return cb(err);
    })
}

async.eachLimit(mails, limit, handler, (err) => {
    console.log("error");
})