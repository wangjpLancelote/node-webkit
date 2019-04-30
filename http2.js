'use strict';

//http2 keepalive
const http2 = require('http2');

const fs = require('fs');

const server = http2.createSecureServer({
    key: fs.readFileSync('testFile.js'),
    cert: fs.readFileSync('testFile.js')
});
server.on('error', function (error) {
    console.error(error);
});
server.on('stream', (stream, headers) => {
    stream.respond({
        'content': 'text/html',
        ':status': 200
    });
    stream.end('<h1>Hello World</h1>');
});
server.listen(4444);