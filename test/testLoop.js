'use strict';

const Benchmark = require("benchmark");

const suite = new Benchmark.Suite;

let loop = function (seatArray, now) {
    if (!Array.isArray(seatArray)) return false;
    if (seatArray.length == 0) return false;
    now = Number(now);
    seatArray.sort((a, b) => a - b);
    let index = seatArray.indexOf(now);
    if (seatArray[index + 1]) return seatArray[index + 1];
    // for (let i in seatArray) {
    //     let u = Number(seatArray[i]);
    //     if (u > now) return u;
    // }
    
    return seatArray[0];
};
let anotherLoop = function (seatArray, now) {
    if (!Array.isArray(seatArray)) return false;
    if (seatArray.length == 0) return false;
    now = Number(now);
    seatArray.sort((a, b) => a - b);
    for (let i in seatArray) {
        let u = Number(seatArray[i]);
        if (u > now) return u;
    }
    return seatArray[0];
};
let user = [1,2,3];
// let next = loop (user, 3);
// console.log("33333", next);

suite
    .add('loops', function () {
        loop(user, 3);
    })
    .add('anotherLoop', function () {
        anotherLoop(user, 3);
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log("Fastest is" + this.filter('fastest').map('name'));
    })
    .run({'async': true});