'use strict';
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const handlerMap = {};
const cacheMap = {};
//代码实现热更新

/**
 * 加载文件代码，并监听更新热重载
 * 
 */
const realDirPath = path.resolve(__dirname, "..");  //node-webkit
const load = async function () {
    let files = await new Promise((resolve, rejection) => {
        fs.readdir(__dirname, function (err, files) {
            if (err) {
                rejection(err);
            } else {
                resolve(files);
            }
        })
    })

    for (let f in files) {
    if (/.*?\.js$/.test(files[f])) {
        handlerMap[files[f]] = await loadFiles(path.join(__dirname, files[f]));
    }
    }

    watch();
}

/**
 * 加载文件
 */
const loadFiles = async function (filename) {
    const exists = await new Promise((resolve, reject) => {
        fs.access(filename, fs.constants.F_OK | fs.constants.R_OK, err => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
    if (exists) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, function (err, data) {
                if (err) {
                    resolve(null)
                } else {
                    try {
                        new vm.Script(data);
                    } catch (e) {
                        reject(e);
                        return;
                    }

                    resolve(require(filename));
                }
            })
        });
    } else {
        //文件不存在
        return null;
    }
}

/**
 * 监听文件的变动
 */
const watch = function () {
    fs.watch(__dirname, {recursive: true}, function (eventType, filename) {
    if (/.*?\.js$/.test(filename)) {
        //删除缓存
        if (cacheMap[require.resolve(path.join(__dirname, filename))])
            delete cacheMap[require.resolve(path.join(__dirname, filename))];
    cacheMap[require.resolve(path.join(__dirname, filename))] = require.cache[require.resolve(path.join(__dirname, filename))];
    //重置require.cache
    require.cache[require.resolve(path.join(__dirname, filename))] = null;

    loadFiles(path.join(__dirname, filename)).then(function(data) {
        if (data) {
            handlerMap[filename] = data;
        } else {
            delete handlerMap[filename];
        }

        console.log("热更成功", filename, "当前代码", handlerMap);
    }).catch(function (err) {
        console.log("热更失败", err);
        require.cache[require.resolve(path.join(__dirname, filename))] = cacheMap[require.resolve(path.join(__dirname, filename))];
        cacheMap[require.resolve(path.join(__dirname, filename))] = null;
    })
    }
    })
}

load().then(function () {
    console.log("------------------>>>>run watch file");
}).catch(function (e) {
    console.log("err");
    console.error(e);
})