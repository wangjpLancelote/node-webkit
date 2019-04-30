'use strict';

/**
 * 游戏匹配算法
 * 将所有符合条件的玩家都放进一个匹配池中，判断基准：ETO(RANK score), waitTime(等待时长)
 */
const _ = require('lodash');
class rankCalc {
    constructor () {
        this.rankScore = 0;
        this.time = new Date().getTime();
        this.player =  {
            rankScore : this.rankScore,
            time : this.time
        };
        this.matchPool = [];
    }
    /**
     * 将符合条件的玩家放进匹配池中
     * @param {Object rankScore: *, time Date} player 
     */
    add (player) {
        console.log('user', player);
        console.log("11", typeof player == "object");
        if (typeof player != "object") return;
        
        if (!player.time || !player.rankScore) return;
        
        player.time = 0;
        this.matchPool.push(player);

        // this.interVal(1000, 1, player.time);
        
        // player.time = new Date().getSeconds();
        // let interVal = setInterval(function () {
        //     player.time += 1;
            
        //     console.log("time", player.time);
        //     console.log("matchPool", this.matchPool);
        // }, 1000);
        // clearInterval(interVal);
        
    }
    /**
     * 从匹配池中移除已匹配的玩家
     * @param {Object} player
     */
    reduce (player) {
        if (_.isEmpty(this.matchPool)) throw new Error("=============>>MATCH NO DATA");
        let index = this.matchPool.indexOf(player);
        if (index == -1) throw new Error("no this player in matchPool");
        this.matchPool.splice(index, 1);
    }

    /**
     * 匹配
     * 基于elo系统，拆分玩家的属性值：rank分，匹配时间time
     */
    match () {
        if (this.matchPool.length == 0) throw new Error("no match player");
        this.matchPool.forEach(user => {
            let score = user.rankScore;
            let time = user.time;
            if (time > 5) console.log(user);
            console.log("333");
        });
    }

    /**设置间歇调用行为 计数器
     * @param {Date} time
     * @param {Number} count
     */
    interVal (time, count, param) {
        if (!time || !count) return;
        let interVal = setInterval(function () {
            param += count;
            console.log("param", param);
        }, time);
        return interVal;
    }
}

let users = {
    rankScore: 10,
    time: new Date().getTime()
};

let rank = new rankCalc();
rank.add(users);
rank.match();
// rank.match();