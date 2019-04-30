const qs = require("querystring");
const https = require("https");
const fs = require('fs');
const path = require("path");

let outToken = fs.createWriteStream('./Token.log');
let logger = new console.Console(outToken);

const param = qs.stringify({
    'grant_type' : 'client_credentials',
    'client_id' : 'KP4GmXmdywrn2lDtXzEdcs78',
    'client_secret' : 'dkwy1gPOqzn9ZTD1oykmbGDxaXLuHDjI'
});

https.get({
    hostname: 'aip.baidubce.com',
    path: '/oauth/2.0/token?' + param,
    agent : false
}, function (res) {
    // console.log("00", res);
    // res.pipe(process.stdout);
    // logger.log(process.stdout);
    // console.log("11", res.pipe());

    // let str = '';
    // fs.createReadStream(res).on('data', function (chunk) {
    //     str += chunk;
    // }).on('end', function () {
    //     console.log("-------->>>", str);
    // })
    
    // res.pipe();
});