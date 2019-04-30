const async = require("async");


//依次执行栈里的异步任务，后面的异步依赖于前面异步函数的输出
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

async.waterfall(stack, (err, config) => {
    console.log("----->>error", err);
    console.log("config", config);
})