#! /usr/bin/env node
'use strict';

const util = require('util');
const events = require('events');
const fs = require('fs');
const argvName = process.argv;

const chalk = require('./chalk');

/**
 * Core 
 * 基于events 事件驱动的服务核心
 */
class Core {
    constructor () {
        this._config = null;

        /**是否初始化 */
        this.inited = false

        /**是否装载成功 */
        this.booted = false

        /**中间件 */
        this.middleWare = [];

        /**装载函数 */
        this.bootItem = [];

        /**文件 */
        this.models = {};

        /**定时程序 */
        this.crontab = {};

        /**事件绑定的最大值 */
        this.onEventsLimit = 10;

        /**操作队列 */
        this.actionQueue = [];
    }

    static boot () {
        return this;
    }

    static uniqExact (array) {
        if (array.length === 0)return array;
        let res = [];
        let base = array[0];
        res.push(base);
        for (let i = 1; i < array.length; ++i) {
            if (array[i] === base) {
                continue;
            } else {
                base = array[i];
                res.push(array[i]);
            }
        }
        return res;
    }

    /**文件名去重 */
    static uniqFileName (fileName, res, pre) {

        let fn = fileName.split('.')[0];
        if (res.includes(fn)) {
            let idx = res.indexOf(fn);
            let f = pre[idx];
            if (!pre.includes(fileName)) {
                chalk.warnLog('are you want to choose ' + chalk.error(f) + ' ?');
            } else {
                fs.readFile(__dirname + '/' + f, 'utf-8', (err, data) => {

                    let r = this.uniqExact(data.split('\n'))
                    console.log(r.join('\r'));
                    // console.log(r);
                    r.join('');
                    if (!fs.statSync(__dirname + '/' + f).isDirectory()) {
                        fs.unlinkSync(__dirname + '/' + f);
                        fs.writeFile(__dirname + '/' + f, r, {'flag': 'a'}, (err, data) => {
                            if (err) throw new Error(err);
                            console.log('文件修改成功');
                        })
                    }
                });
                
                // console.log('files', files);
                // let fT = files.split(' ');
                // console.log('ft', fT);
            }
            
        } else {
            console.log('无此文件');
        }
    }

    /**filter 是否过滤文件名，过滤之后只保留文件名，不包含后缀 */
    static readDir (fileName, dir, filter) {
        if (!dir) dir = __dirname;
        if (fileName.length === 2) return;
        if (fileName.length === 1) throw new Error('no file choose')
        let res = [];
        let pre = [];
        fs.readdir(dir, (err, f) => {
            if (err) throw new Error(err);
            f.forEach(async (e) => {
                let n = e.split('.')[0];
                res.push(n);
                pre.push(e);
            })
            fileName = fileName.slice(-1)[0];
            this.uniqFileName(fileName, res, pre);
            // console.log('pre', pre);
        });
    }
}

console.log('files', Core.readDir(argvName));
console.log('qq', Core.uniqExact([1, 1, 3, 4]));
