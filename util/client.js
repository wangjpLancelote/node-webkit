const rpc = require('./node_rpc');
const step = require('step'); //流程控制

/**
 * RPC 客户端测试
 */
let total = 0;
let intervalId;
let start = 0;
let finish = 0;

let R = new rpc();

function Next () {
    if (total === 100) {
        clearInterval(intervalId);
        console.log(`start: ${start} ---->> end: ${finish}`);
        return;
    }
    console.log(`next: ${total}`);
    ++total;

    // step (function () {
    //     for (let i = 0; i < 100; ++i) {
    //         rpc.connect(6556, 'localhost', function (remote, conn) {
    //             ++start;
    //             remote.combine(1, 2, function (res) {
    //                 if (res !== 3) console.log('act', res);
    //                 remote.getFile((f) => {
    //                     let l = JSON.stringify(f).length;
    //                     if (l !== 21) console.log('dd', l);
    //                     ++finish;
    //                     if (finish === start) console.log(`start: ${start} ----->> finsih:${finish}`);
    //                     conn.destory();
    //                     conn.end();
    //                 });
    //             })
    //         })
    //     }
    // });
    R.connect(6556, 'localhost', function (remote, conn) {
        console.log('remote', remote, conn);
    })
    console.log('R', R.connectionCallback);
};

intervalId = setInterval(Next, 1000);

module.exports = R;