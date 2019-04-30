const async = require("async");

let fun1 = function (cb) {
    console.log("this is first function");
    cb();
};
let fun2 = function (cb) {
    console.log("this is second function");
    cb();
};
let fun3 = function (cb) {
    console.log("this is three function");
    cb();
};

let stack = [];
stack.push(fun1, fun2, fun3);
async.series(stack, (err, result) => {
    if (err) {
        console.log("err", err);
    } else {
        console.log(result);
    }
})