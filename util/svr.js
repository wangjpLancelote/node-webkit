const rpc = require('./node_rpc');
const file = {test: 'testObj'};
const R = require('./client');

console.log('N', R);

const port = 6556;

const t = new rpc({
    combine: function (a, b, callback) {
        callback(a + b);
    },
    multiply: function (t, cb) {
        cb(t * 2);
    },
    getFile: function (cb) {
        cb(file);
    }
});

t.listen(port);
console.log(`========>>> port: ${port} is listening`);

