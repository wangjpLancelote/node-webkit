'use strict';

//数据加密
const crypto = require("crypto");
const assert = require('assert');
const sign = crypto.createSign('SHA256');  //生成数字签名

const alice  = crypto.createECDH('secp521r1');
const aliceKey = alice.generateKeys();

const bob = crypto.createECDH('secp521r1');
const bobKey = bob.generateKeys();


const aliceSecret = alice.computeSecret(aliceKey);
const bobSecret = alice.computeSecret(bobKey);

console.log('alicekey', aliceSecret);
console.log('bobkey', bobSecret);

// assert.strictEqual('strict', aliceSecret.toString('hex'), bobSecret.toString('hex'));

let message = 'hello word';

let hash = crypto.createHmac('sha256', message).update('111').digest('hex');

console.log('hash', hash);

sign.write("sign data");
sign.end();
// const privateKey = getPrivateKeySomeHow();
console.log(sign.sign(hash, 'hex'));