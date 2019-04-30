'use strict';
const fs = require("fs");
const path = require("path");
const readline = require("readline");  //按行读取内容

var filePaths = path.resolve("test");
console.log("filePath", typeof filePath);



/**
 * 遍历文件夹，并把其中的文件依次读取
 * @param {String} filePath  文件夹路径
 */
function findAllFile (filePath) {
    console.log("aa", typeof filePath);
    fs.readdir(filePath, function (err, files) {
        if (err) {
            return new Error("遍历文件夹失败");
        } else {
            files.forEach(function (fileName) {
                console.log("fileName", fileName);
                let fileDir = path.join(filePath, fileName);
                if (fileName == 'testFile.js') {
                    let msg = "this is append data" + new Date() + "\r";
                    fs.appendFile(fileDir, msg, function (err) {
                        if (err) {
                            throw new Error("追加出错");
                        } else {
                            console.log("sucess");
                        }
                    });

                    fs.readFile(fileDir, 'UTF-8', (err, data) => {
                        console.log("data", data);
                    });

                    readLine(fileDir, function (data) {
                        console.log('lineData1:', data[0]);
                        // fs.writeFile(fileDir, data[0] + "this is another line Files", function (err, data) {
                        //     console.log('datas', data);
                        // });
                    });
                }
                // let fileDir = fileName;
                fs.stat(fileDir, function (error, stats) {
                    if (error) {
                        return new Error("解析出错");
                    } else {
                        let isFile = stats.isFile();
                        let isDir = stats.isDirectory();
                        if (isFile) console.log(fileDir);
                        if (isDir) findAllFile(fileDir);
                    }
                });
            });
        }
    });
}


/**
 * 按行读取文件内容，实际上就是把文件内容按每一行放进一个array
 * @param {String} fileName 文件路径
 * @param {function} callback  回调
 */
function readLine (fileName, callback) {
    let fRead = fs.createReadStream(fileName);
    let line = readline.createInterface({
        input : fRead
    });
    let arr = new Array();
    line.on('line', function (lines) {
        arr.push(lines);
    });
    line.on('close', function () {
        callback(arr);
    });
}   

findAllFile(filePaths);
module.exports = {
    findAllFile,
    readLine
};
// exports.findAllFile = findAllFile;

