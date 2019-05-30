'use strict';

const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const client = new kafka().Client;
const cons = new Consumer(client, [{topic: 'CAR_NUMBER', partition: 0}], {autoCommit: true});

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'master',
    database: 'seckill'
});

connection.connect();

cons.on('message', (message) => {
    connection.query('INSERT INTO seckill set ? ', {data: new Date()}, (err, res, fileds) => {
        if (err) throw new Error(err);
        console.log('query response', res);
    })
});