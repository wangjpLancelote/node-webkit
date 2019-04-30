'use strict';

//域名服务解析，使用底层的操作系统工具进行域名解析
const dns = require('dns');
const Resolve = require('dns').promises;
const resolver = new Resolve();
resolver.setServers = (['4.4.4.4']);

dns.lookup('www.baidu.com', (err, address, family) => {
    console.log("百度：ip地址%j, IPv%s", address, family);
});
dns.lookup('www.google.com', (err, address, family) => {
    console.log('谷歌：ip地址%j, IPv%s', address, family);
});

//使用其他的域名服务器解析
dns.resolve4('archive.org', (err, address) => {
    if (err) throw err;
    console.log(`ip地址:${JSON.stringify(address)}`);

    address.forEach(item => {
        dns.reverse(item, (err, hostName) => {
            if (err) throw err;
            console.log(`ip地址：${item}, 逆向解析域名：${JSON.stringify(hostName)}`);
        });
    });
});
resolver.resolve4('example.org').then((address) => {
    console.log(`ip地址：${JSON.stringify(address)}`);
}).catch((err) => {
    throw err;
}).finally((data) => {
    console.log('data', data);
});