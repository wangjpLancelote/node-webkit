const async = require("async");

var arr = [1, 2, 3, 4];
function double(data, cb) {
    var err = null;
    if (typeof data !== 'number') {
        err = new Error("only number allow");
    }
    data *= data;
    setTimeout(function () {
        console.log(data);
        cb & cb(err,data);
    }, Math.floor(Math.random() * 1000));
}

async.each(arr, double, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log('result', result);
    }
})