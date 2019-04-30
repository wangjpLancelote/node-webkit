const http = require('http');
const koa = require("koa");
const io = require('socket.io');
let servet = http.Server(new koa().callback());  //http.Server(koa)
console.log("--->>serveer", servet);
console.log('99', module.exports);
// console.log("io", io(servet));
// console.log("type", typeof new koa());