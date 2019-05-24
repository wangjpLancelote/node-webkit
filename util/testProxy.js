const handler = {
    get (target, key, receiver) {
        console.log('target', target, key, receiver);
    },
    set (target, key) {

    }
}
const data = [{name : 'wjp', age: 20}];
let proxy = new Proxy(data, handler);
console.log(proxy);