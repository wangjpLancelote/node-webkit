#! /usr/bin/env node
'use strict';

// require('json-comments');
// const dgram = require('dgram');
// const Table = require('cli-table');
const inquirer = require('inquirer');
// const moment = require('moment');
const fs = require('fs');
// // const conf = require(__dirname + '/config/common');
// const conf = require(__dirname + '/config/c_monster.js');
// const EOL = require('os').EOL;

// const CODE_PATH = conf.codePath;
// const LOCAL_HOST = '127.0.0.1';
// const id2name = conf.id2name;

let separator = new inquirer.Separator();

const update = () => {
    console.log('this is test update');
};

const promptMatch = [
    {
        type: 'input',
        name: 'matchID',
        message: '请输入比赛场ID'
    }
]
const promptPhone = [
    {
        type: 'input',
        name: 'phone',
        message: '请输入phone number'
    }
]
const questions = [
    {
        type: 'list',
        name: 'app',
        choices: ['1) heyuan', '2) guangdong', '3) 比赛场管理'],
        message: 'Please choose a app:',
        pageSize: 15
    },
    {
        type: 'list',
        name: 'action',
        choices: [
            { name: 'update controller', value: 'update' },
            { name: 'update models', value: 'update' },
            { name: 'update configs', value: 'update' },
            { name: 'update events', value: 'update' },
            { name: 'update okeys', value: 'update' },
            new inquirer.Separator('比赛场操作'),
            {name: '比赛场管理', value: 'update'},
            // { name: 'check command.json', value: 'checkCommand' },
            // { name: 'check cmdstatus.json', value: 'checkCmdstatus' },
            // { name: 'check const.json', value: 'checkConst' },
            // separator,
            // { name: 'stop game', value: 'stopGame' },
            // { name: 'start game', value: 'startGame' },
            // separator,
            // { name: 'close mail', value: 'closeMail' },
            // { name: 'start mail', value: 'startMail' },
            // separator,
            // { name: 'close debug', value: 'closeDebug' },
            // { name: 'start debug', value: 'startDebug' },
            // separator,
            { name: '返回上一级', value: 'backToPre' }
        ],
        message: 'Please choose a action:',
        pageSize: 25,
        // when (answers) {
        //     if (!answers.app && nowApp) answers.app = nowApp;
        //     return true;
        // }
    },
    {
        type: 'list',
        name: 'match',
        message: '选择比赛场管理操作',
        choices: ['停止比赛', '比赛场踢人', {name: '回到上一级', value: 'back'}]

    }
];

const promptList = [
    {
        type: 'rawList',
        message: '比赛场管理',
        name: 'raw',
        choices: [
            // {type: 'input',
            // name: 'matchID',
            // message: '请输入比赛场ID'},
            // {
            //     type: 'input',
            //     name: 'userID',
            //     message: '请输入用户ID'
            // }
        ]
    },
    {
        type: 'list',
        message: '比赛场管理',
        name: 'list',
        choices: [
            {
                name: 'promptMatch',
                id: 1
            },
            {
                name: 'promptPhone',
                id: 2
            }
        ]
    }
];

function match (id) {
    console.log('id', id);
}


function ask (ques = questions) {
    inquirer.prompt(ques).then((answers) => {
        // console.log('ques', ques);
        console.log(`answers`, answers);
        // if (answers.cc === 'back') setTimeout(() => ask(rawList), 200);
        if (answers.match === 'back') setTimeout(() => ask(), 200);
        // console.log('app', answers.app.split(')'))[0] | 0;
        // let id = answers.app.split(')')[0] | 0;
        // console.log('match', answers.app.split(')')[1]);
        // if (id === 1) {
        //     console.log('44');
        // }
        // console.log('match', answers.matchID);
        // match(answers.matchID);
        console.log('match', answers.list);
        ask(answers.list);
    }).catch((err) => {
        console.log('err', err)
    });
}
ask(promptList);
// ask();

process.on('uncaughtException', err => {
    console.log(err);
    process.exit(1);
});
