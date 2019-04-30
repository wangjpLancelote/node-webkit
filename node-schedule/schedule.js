'use strict'
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");

/** 定时器参数
 * * * * * * *
┬ ┬ ┬ ┬ ┬ ┬
│ │ │ │ │ |
│ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
│ │ │ │ └───── month (1 - 12)
│ │ │ └────────── day of month (1 - 31)
│ │ └─────────────── hour (0 - 23)
│ └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
 * 
 */

 function scheduleT() {
    let count = 1;
    let task = schedule.scheduleJob('* * * * * *', function () {
        console.log("定时器触发次数" + count + new Date());
        console.log("arch" + process.arch);
        count ++;
    })

    // setTimeout(function () {
    //     console.log("定时器取消");
    //     console.log("process" + process.execPath);
    //     console.log("process" + process.env);
    //     task.cancel();
    // }, 1000)
 }
 scheduleT();