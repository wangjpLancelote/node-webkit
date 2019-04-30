const _ = require('lodash');
const numRank = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2];
const type2num = {
    'ERROR': -1,

    'SINGLE': 1,
    'PAIR': 2,

    'THREE': 3,
    'THREE_WITH_ONE': 4, //三带一
    'THREE_WITH_TWO': 5,

    'FOUR_WITH_ONE': 5,
    'FOUR_WITH_TWO': 6, //四带二
    'FOUR_WITH_THREE': 7,

    'PAIR_WITH_PAIR': 8, //连对

    'SEQUENCE': 9, //顺子
    'SEQUENCE_PAIR': 10, //双顺

    'PLANE': 11,
    'PLANE_WITHOUT': 12, //飞机无翅膀

    'BOMB': 13
}

/**
 * 计算牌组的类型
 * 单张 - 对子 - 三条  - 三带一 三带二 - 四带二 - 四带三 - 连对 - 顺子 - 飞机 - 飞机少翅膀 - 炸弹
 * [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 */
class CardPoint {
    constructor (cards, lastType = {}, ttype = null) {
        this.cards = cards;
        this.sort = _.curry((fn, array) => array.sort(fn));

        this.map = _.curry((fn, array) => array.map(fn));

        this.getCardPoint = card => card & 0x00F;

        this.getCardRank = card => numRank.indexOf(Number(card));

        this.mapCard = this.map(this.getCardPoint);

        this.sortCard = this.sort((a, b) => this.getCardRank(a) - this.getCardRank(b));

        this.sortCommon = this.sort((a, b) => a - b);

        this.formatCardByPoint = _.flow(this.mapCard, this.sortCard);

        this.tmpCardMap = {
            1: {
                count: 0,
                card: []
            },
            2: {
                count: 0,
                card: []
            },
            3: {
                count: 0,
                card: []
            },
            4: {
                count: 0,
                card: []
            }
        };

        //上一个人出的牌的类型 {t: , card: }
        this.lastType = lastType;

        this.ttype = ttype;

        this.res = {};
    }

    /**
     *  将牌转换成按照点数和权重排序的牌，从小到大
     */
    get getCardsNum () {
        return this.formatCardByPoint(this.cards);
    }

    get len () {
        return this.cards.length;
    }

    /**
     * 王炸
     */
    get isKingBomb () {
        return this.len === 2 && this.tmpCardMap[2].card[0] === 0 && this.isSameItemList(this.cards) && this.tmpCardMap[2].count === 2;
    }

    /**
     * 普通炸弹
     */
    get isCommonBomb () {
        return this.len === 4 && this.tmpCardMap[4].count === 4;
    }

    mapOf () {
        const N = this.cards.length;
        for (let i = 0; i < N; ++i) {
            let number = this.getCardsNum.lastIndexOf(this.getCardsNum[i]) -  this.getCardsNum.indexOf(this.getCardsNum[i]);
            // if (!this.tmpCardMap[number + 1]) this.tmpCardMap[number +1] = {};
            // if (!this.tmpCardMap[number + 1].card) this.tmpCardMap[number + 1].card = [];
            // if (!this.tmpCardMap[number + 1].count) this.tmpCardMap[number + 1].count = 0;
            if (!this.tmpCardMap[number + 1].card.includes(this.getCardsNum[i])) this.tmpCardMap[number + 1].card.push(this.getCardsNum[i]);
            this.tmpCardMap[number + 1].count = this.tmpCardMap[number + 1].card.length;
            
            if (i + number < N - 1) i += number;
        }
        return this;
    }


    /**
     * 计算cards能组成什么牌型，从大到小
     */
    cardType () {
        const four = this.tmpCardMap[4];
        const three = this.tmpCardMap[3];
        const two = this.tmpCardMap[2];
        const one = this.tmpCardMap[1];

        /**
         * 炸弹
         */
        if (this.isKingBomb) return {t: 13, card: this.getCardsNum};
        if (this.isCommonBomb) return {t: 13, card: four.card[0]};

        /**
         * 飞机 相连两个或两个以上的三同张牌 + 两张牌（顺子数张牌可以不同也可以相同） 44455557 --- 444555666789
         * 除特殊情况，如要带顺子数 * 2张牌 --> 4445556677
         */
        if (three.count + four.count > 1) {

            let plane = (len === 8 || len === 12) ? type2num.PLANE : type2num.PLANE_WITHOUT;
            let counts = three.count + four.count;
            let pCard = this.sortCard([...three.card, ...four.card]);
            if (this.isSequence(pCard) && this.len <= counts * 4) return {t: plane, card: three.card[0], len: this.len};
            if (counts === 3 && this.len <= 8 ||
                counts === 4 && this.len <= 12 ||
                counts === 5 && this.len <= 15
            ) {
                if (this.isSequence(pCard.slice(0, -1))) return {t: plane, card: pCard.slice(0, -1)[0], len : this.len};
                if (this.isSequence(pCard.slice(1))) return {t: plane, card: pCard.slice(1)[0], len: this.len};
            }
        }
        
        /**
         * 四带二/四带三/四带一
         */
        if (this.len === 7 && four.count === 1) return {t: type2num.FOUR_WITH_THREE, card: four.card[0], len: this.len};
        if (this.len === 6 && four.count === 1) return {t: type2num.FOUR_WITH_TWO, card: four.card[0], len: this.len};

        //单顺和双顺
        if (this.len === one.count && this.isSequence(one.card)) return {t: type2num.SEQUENCE, card: this.sortCommon(one.card)[0], len: this.len};
        if (this.len / 2 === two.count && this.isSequence(two.card)) return {t: type2num.SEQUENCE_PAIR, card: this.sortCommon(two.card)[0], len: this.len};

        //可能有四带一的情况
        if (this.len === 5 && four.count === 1) return {t: type2num.FOUR_WITH_ONE, card: four.card[0], len: this.len};
        /**
         * 三条/三带二/三带一
         */
        if (this.len === 5 && three.count === 1) return {t: type2num.THREE_WITH_TWO, card: three.card[0], len: this.len};
        if (this.len === 4 && three.count === 1) return {t: type2num.THREE_WITH_ONE, card: three.card[0], len: this.len};
        /**连对 */
        if (this.len === 4 && two.count === 2 && this.isSequence(two.card)) return {t: type2num.PAIR_WITH_PAIR, card: two.card[0], len: this.len};
        //三条
        if (this.len === 3 && three.count === 1) return {t: type2num.THREE, card: three.card[0], len: this.len};

        if (this.len === 2 && two.count === 1) return {t: type2num.PAIR, card: two.card[0], len: this.len};

        if (this.len === 1) return {t: type2num.SINGLE, card: this.getCardsNum[0], len: this.len};

        return {t: -1, card: this.getCardsNum, len: this.len};
    }

    isSameItemList (array) {
        let n = 0;
        let t = array[0];
        for (let i = -1; (i = array.indexOf(t, ++i)) != -1; ++n);
        return n;
    }

    /**
     * 是否是顺子
     * @param {[*]} array  经过正向排序的牌
     * 不能出现 k-A-2 || Q-k-A这种对子
     * @returns {Boolean}
     * [A,2,3,4,5,6,7,k]
     */
    isSequence (array) {
        if (!array || array.length < 2) return false;
        array = this.sortCommon(array);
        let L = array.length;
        for (let i = 0; i < L - 1; ++i) {
            if (array[i] + 1 !== array[i + 1]) return false;
            // if (array[i + 1] === 2) return false;
            // if ((array[i] + 1 !== array[i + 1]) && (array[i] - array[i + 1] !== 12)) return false;
        }
        return true;
    }

    /**
     * 是否能大过上家的牌 --> lastType
     * 第一手出牌，均可以出
     * 炸弹可以无视牌数len，和t 均可以打过非炸弹
     */
    willCover () {
        const nowT = this.cardType();
        if (nowT.t === -1) return console.error('[@willCover] 牌型不对，出不了'); /**不成牌型，不能打 */
        if (_.isEmpty(this.lastType)) return true;
        const lastT = this.lastType;
        if (lastT.t < 13) { /**上一家不是炸弹 */
            if (nowT.t < lastT.t) return false;
            if (nowT.t === lastT.t && numRank.indexOf(nowT.card) < numRank.indexOf(lastT.card)) return false;
            if (nowT.t === lastT.t && nowT.len !== lastT.len) return false;
            if (nowT.t > lastT.t && nowT.t !== 13) return false;
            this.lastType = nowT;
            return true;
        } else {
            if (nowT.t < 13) return false;
            if (lastT.card === 0) return false; /**王炸 没法打*/
            if (nowT.card !== 0 && numRank.indexOf(nowT.card) < numRank.indexOf(lastT.card)) return false;
            this.lastType = nowT;
            return true;
        }
    }
}

// let t = [0x0101, 0x0102, 0x0203, 0x0204, 0x0305]
// let lastType = {t: 9, card: 2, len: 5};
// let r = new CardPoint(t, lastType).mapOf();
// console.log('r',r.cardType());
// console.log('t', r.willCover());

/**
 * TexJudge 德州扑克赢牌的概率计算
 * 一副牌，去掉大小王-52张
 * 牌型大小：皇家同花顺【10-J-Q-K-A
 * 同花顺 - 同花 - 顺子 - 金刚 - 葫芦 - 三条 - 两对 - 一对 - 单张
 * 最后就是7张牌选5张，组成牌型最大的牌
 * 若相同的牌，则从大到小依次比牌，都一样，则相同的点数
 * 与花色无关
 */

const cards_Vector = [
    0x0101, 0x0102, 0x0103, 0x0104, 0x0105, 0x0106, 0x0107, 0x0108, 0x0109, 0x010a, 0x010b, 0x010c, 0x010d, // 黑桃
    0x0201, 0x0202, 0x0203, 0x0204, 0x0205, 0x0206, 0x0207, 0x0208, 0x0209, 0x020a, 0x020b, 0x020c, 0x020d, // 红心
    0x0301, 0x0302, 0x0303, 0x0304, 0x0305, 0x0306, 0x0307, 0x0308, 0x0309, 0x030a, 0x030b, 0x030c, 0x030d, // 梅花
    0x0401, 0x0402, 0x0403, 0x0404, 0x0405, 0x0406, 0x0407, 0x0408, 0x0409, 0x040a, 0x040b, 0x040c, 0x040d, // 方片
    0x0010, 0x0020 // 小王、大王
];

class TexGame {
    constructor () {
        this.allCards = cards_Vector.slice(0, -2);
        
        this.user = {};

        this.userSeat = {};

        this.seatList = {};

        this.userCard = {};

        this.showCards = [];

        this.response = [];
    }

    get seats () {
        return Reflect.ownKeys(this.seatList).map(Number);
    } 

    allocCards () {
        if (this.seats.length === 0) throw new Error('no such seatList');
        for (let s of this.seats) {
            this.userCard[s] = {};
            this.userCard[s].My = this.allCards.splice(0, 2);
        }
        return this;
    }

    turnCard () {
        if (!this.response) throw new Error('uncatch error');
        // if (!this.response.length) {
        //     let cards = this.allCards.shift();
        //     this.showCards.push(cards);
        // }
        return this;
    }
}

// let r = new TexGame();
// r.seatList = {1: 1000, 2: 2000};
// r.allocCards();
// console.log('r', r.userCard);

class TexJudge {
    constructor (cards, userCard) {
        this.cards = cards;

        this.userCard = userCard; //最初发的2张牌

        this.sort = _.curry((fn, array) => array.sort(fn));

        this.map = _.curry((fn, array) => array.map(fn));

        this.getPoint = card => card & 0x00F;

        this.color = card => card >> 8;

        this.numRank = [1, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]; /**单牌的大小 */

        this.std = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                    ];

        this.getRank = card => this.numRank.indexOf(card);

        this.getColor = this.map(this.color);

        this.getMapPoint = this.map(this.getPoint)

        this.sortByPoint = this.sort((a, b) => this.getRank(b) - this.getRank(a)); /**从大到小排序 */

        this.flow = _.flow(this.getMapPoint, this.sortByPoint);

        this.showCards = []; //这是在牌桌上展示的牌，一开始是发三张，每过一轮，就加一张，
    }


    indexOf (card) {
        let point = this.getPoint(card);
        let color = this.color(card);
        if (color < 1 || point < 1 || color > 3) return new Error('牌的范围错误');
        if (color === 1 && point < 14) return point -1;
        if (color === 2 && point < 14) return point + 12;
        if (color === 3 && point < 14) return point + 25;
        if (color === 4 && point < 14) return point + 38;
        return -1;
    }

    mapOf () {
        let c = this.cards;
        let N = c.length;
        for (let i = 0; i < N; ++i) {
            const index = this.indexOf(c[i]);
            this.std[index] += 1;
        }
        return this;
    }

    /**
     * 获取点数 计算是否加注的几率
     * 三轮，翻牌 - 转牌 - 河牌
     * 若showCards 的牌为5张，且牌点最大，则没有比较的意义
     */
    checkRadio () {

    }

    /**同花顺 */
    isColor_Sequence () {
        return this.isCommonColor() && this.isSequence();
    }

    /**顺子 */
    isSequence () {
        let N = this.std.length;
        for (let i = 0; i < N - 1; ++i) {
            if (this.std[i] === 0) continue;
            if (this.std[i] !== 0 && this.std[i + 1] === 0) continue;
            if (this.std[i] !== 1 && this.std[i + 1] !== 1) return false;
        }
        return true;
    }

    /**同花 */
    isCommonColor () {
        let cCards = this.getColor(this.cards);
        return cCards.every((c) => {
            return c === cCards[0];
        })
    }

    /**金刚 */
    isKong () {
        return this.std.some(c => {
            return c === 4;
        });
    }

    /**三条 且无对子*/
    isTriple () {
        let hasMark = false;
        for (const c of this.std) {
            if (c === 3 && !hasMark) {
                hasMark = true;
                continue;
            }
            if (hasMark && c === 2) return false;
        }
        return true;
    }

    /**葫芦 */
    isGourd () {
        return this.std.some(c => c === 3) && this.std.some(c => c === 2);
    }

    /**两对 */
    isDoublePair () {
        return this.std.lastIndexOf(2) - this.std.indexOf(2) > 0;
    }

    /**对子 只有一对*/
    isPair () {
        let isOnce = this.once(this.std, 2);
        // return this.std.some(c => c === 2);
        return isOnce;
    }

    /**最低概率赢下比赛 发到手里的牌是不同花色的2，7*/
    isLowRate2Win () {
        let userCardsColor = this.getColor(this.userCard);
        let point = this.flow(this.userCard).toString();
        if (!this.isSame(userCardsColor) && point === '2,7') return true;
        return false;
    }
    /**
     * 是否只出现一次
     * @template T[]
     * @param {T[*]} array 
     * @param {*} item 
     */
    once (array, item) {
        let count = 0;
        for (let i = 0; (i = array.indexOf(item, ++i)) !== -1; ++count);
        return count === 1 ? true : false;
    }

    isSame (array) {
        let I = 0;
        for (let i of array) {
            if (!I) {
                I = i;
            }
            else {
                if (I !== i) return false;
            }
        }
        return true;
    }

}
let c = [0x0101, 0x0101, 0x0103, 0x0105, 0x0105];
let k = [0x0101, 0x0101, 0x0201, 0x0201, 0x0203];
let r = new TexJudge(c, [0x0202, 0x0307]).mapOf();
// let kr = new TexJudge(k).mapOf();
console.log('r', r.isSame(c));
console.log('t', r.isLowRate2Win())