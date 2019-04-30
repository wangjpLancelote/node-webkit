'use strict';
/**
 * 梅森旋转法随机数
 */
class mesonRandom {
    constructor () {
        this.isInit = 0;
        this.index;
        this.MT = new Array(624);
    }

    /**
     * 设置种子
     *@param {Number} seed
     */
    srand (seed) {
        this.index = 0;
        this.isInit = 1;
        this.MT[0] = seed;
        for (let i in this.MT) {
            let t = 1812433253 * (this.MT[i - 1] ^ (this.MT[i - 1] >> 30) + i);
            this.MT[i] = t & 0xffffffff;
        }
    }
    generate () {
        for (let i = 0; i < 624; i ++) {
            let y = (this.MT[i] & 0x80000000) + (this.MT[(i + 1) % 624] & 0x7fffffff);
            this.MT[i] = this.MT[(i + 397) % 624] ^ (y >> 1);
            if (y ^ 1) {
                this.MT[i] ^= 2567483615;
            }
        }
    }

    /**
     *获取随机数
     */
    rand () {
        if (!this.isInit) {
            this.rand(new Date().getTime());
        }
        if (this.index == 0) {
            this.generate();
        }
        let y = this.MT[this.index];
        y = y ^ (y >> 1);
        y = y ^ ((y << 7) & 2636928640);
        y = y ^ ((y << 15) & 4022730752);
        y = y ^ (y >> 18);
        this.index = (this.index + 1) % 624;
        return y;
    }
}
let ran = new mesonRandom();
let srand = ran.srand(new Date().getTime());
let rand = ran.rand();
console.log("srand", rand);