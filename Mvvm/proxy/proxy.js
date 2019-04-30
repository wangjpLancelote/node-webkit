const person = {
    name: 'wangjp',
    age: 18
}

let proxy = new Proxy(person, {
    get: function (target, property) {
        console.log(`target: ${target}, property: ${property}`);
        // return 10;
        if (property in target) {
            return target[property];
        } else {
            throw new ReferenceError("Property \"" + property + "\" does not exsit");
        }
    }
})

console.log("age", proxy.age);
console.log("ss", proxy.xx);