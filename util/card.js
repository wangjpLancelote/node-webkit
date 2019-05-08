const _ = require('lodash');
const Rx = require('rxjs');
const fs = require('fs');
const chalk = require('chalk'); /**chalk 终端显示banner */
const figlet = require('figlet'); /**chalk 终端banner字体镂空 */
const error = chalk.bold.red; /**chalk error提示 */
const warning = chalk.keyword('orange'); /**chalk 警告提示 */
const success =  chalk.green;

const warnLog = (...params) => {
    return console.log(warning(params.join(' ')));
}
const errorLog = (...params) => {
    return console.log(error(params.join(' ')));
}
const successLog = (...params) => {
    let paramsJoin = params.join(' ');
    return console.log(success(paramsJoin.toString()));
}
const holeLog = (value) => {
    return console.log(chalk.yellow(figlet.textSync(value, {horizontalLayout: 'full'})))
}
/**
 * countValue :计算数组内与value相同的元素的个数
 * @param {Array} array 
 * @param {*} value 
 */
const countValue = (array, value) => {
    if (!Array.isArray(array)) return new Error("no such array");
    let count = 0;
    for (let i = 0; i < array.length; i ++) {
        if (array[i] == value) count ++;
    }
    return count;
}

const countValues = (array, value) => {
    let n = 0;
    for (let i = -1; (i = array.indexOf(value, ++i)) !== -1; ++n);
    return n;
};

/**
 * loop ：循环array内的下一个
 * @param {*} array 
 * @param {*} head 
 */
const loop = (array, head) => {
    if (!Array.isArray(array) || !array.includes(head)) throw new Error("no such array");
    if (array.indexOf(head) === array.length - 1) return array[0];
    return array[array.indexOf(head) + 1];
}

/**
 * 是否有该元素
 * @param {*} array 
 * @param {*} value 
 */
const has =  (array, value) => {
    if (!Array.isArray(array) || !array.length) return false;
    if (array.includes(value)) return true;
    return false;
}

const next = () => {
    let arr = [1, 2, 3];
    nextT: {
        for (a of arr) {
            console.log("a, %d", a);
            if (a == 2) break nextT;
        }
    }
}

/**
 * 克隆对象
 * @param {} object 
 */
const clone = (object) => {
    return Object.assign(object);
}

/**
 * 合并对象
 * @param {*} source 
 * @param  {...any} target 
 */
const merge = (source, ...target) => {
    return Object.assign(source, ...target);
}

const GeneratorAutoRun = (gen) => {
    const g = gen();
    function next (err, data) {
        let result = g.next(data);
        if (result.done) return;
        result.value(next);
    }
    next();
}
function * test () {
    yield 'hello';
    yield 'world';
}
// GeneratorAutoRun(test);
// console.log("has", has([], 4));
// next();
// console.log('11', test().next());

/**
 * isSSY 是否是十三幺 十三幺就分为两快，数字牌和字牌
 * @param {[*]} userCard
 * @param {[*]} guipai
 */
const isSSY = function (userCard, guipai) {
    let allCards = userCard.slice();
    let huaCount = guipai.length;
    let isSsy = false;
    let tmpObj = {};
    let number = [], zipai = [];

    if (allCards.length != 14) return isSsy = false;
    for (let c of allCards) {
        tmpObj[c] ? tmpObj[c] ++ : tmpObj[c] = 1;
        if (tmpObj[c] > 2) return isSsy = false;
        let type = c >> 4;
        let num = c & 15;
        if ([6, 7].includes(type)) return isSsy = false;
        if ([1, 2, 3].includes(type) && (num < 9 && num > 1)) return isSsy = false;
        if (tmpObj[c] === 1) {
            if (type < 4) {
                number.push(c);
            } else {
                zipai.push(c);
            }
        }
     }
     console.log("number: %j, zipai: %j", number, zipai);
     if (number.length != 6 || zipai.length != 7) return isSsy = false;
     return isSsy = true;
    //  for (let t in number) {

    //  }
    
}
// let res = isSSY([0x11, 0x19, 0x21, 0x29, 0x31, 0x39, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x11], []);
// console.log("res", res);

/**
 * 是否是碰碰胡，手牌是有全刻子组成的，有一对将，不能有吃(无鬼)
 * @param {[*]} userCard 
 */
const isPPH = function (userCard) {
    let allCards = userCard.My.slice();
    if (userCard.Chi.length) return false;
    let tmp = {};
    let doubleCnt = 0;

    for (let c of allCards) {
        if (!tmp[c]) {
            tmp[c] = 1;
        } else {
            tmp[c] ++;
        }
    }

    for (let t in tmp) {
        if (tmp[t] != 3 && tmp[t] != 2) return false;
        if (tmp[t] === 2) doubleCnt ++;
    }
    if (doubleCnt !== 1) return false;
    return true;
}

/**
 * 杂一色，清一色的数字牌 + 风牌(假设牌没有排序) 必须是鸡胡
 * @param {[*]} userCard 
 */
const isZYS = function (userCard) {
    const cards = userCard.slice();
    const zipai = [];
    const lastType = 0;

    for (let c of cards) {
        let type = c >> 4;
        if ([6, 7].includes(type)) continue;
        if (type === 4) {
            zipai.push(c);
        } else {
            if (lastType && lastType != type) return false;
            lastType = type;
        }
    }
    if (!zipai.length) return false;
    return true;
}

/**
 * isQiDui 
 * @param {[*]} userCard
 */
//不使用鬼牌七对
const isQiDui = (userCard) => {
    if (userCard.length != 14) return false;
    let allCards = userCard.slice();
    let tmp = {};
    let doubleCnt = 0;
    allCards.forEach(c => {
        if (!tmp[c]) {
            tmp[c] = 1;
        } else {
            tmp[c] ++;
        }
    });

    for (let item in tmp) {
        if (tmp[item] % 2 != 0) return false;
        if (tmp[item] === 4) doubleCnt ++;
    }
    if (doubleCnt === 1) return 1; //双龙七对
    if (doubleCnt === 2) return 2; //豪华七对
    if (doubleCnt === 3) return 3; //超豪华七对
}

/**
 * 对对胡:1个刻子外，全是对子，且不能有吃碰杠。
 * @param {[*]} cards 
 * @param {[*]} guiCount 
 */
const isDDH = (userCard, guiCount) => {
    if (userCard.Chi.length || userCard.Peng.length || userCard.Gang.length) return false;
    if (userCard.My.length === 2) return false;
    let cards;
    let maxCnt = 0;
    let pairCnt = 0;
    if (guiCount) cards = userCard.My.filter(c => !this.guipai.includes(c));
    let tmp = {};
    for (const c of cards) {
        tmp[c] ? ++ tmp[c] : tmp[c] = 1; 
    }
    for (const i in tmp) {
        if (!guiCount && tmp[i] === 1) return false; /**无鬼有单张，不能胡 */
        if (tmp[i] === 4) pairCnt += 2;
        if (tmp[i] === 2) ++pairCnt;
        if (tmp[i] === 3 || tmp[i] === 1) ++maxCnt;
    }

    /**没有单张或3条，且对子 不只一对且有鬼牌，就是对对胡*/
    if (!maxCnt && pairCnt > 1 && guiCount) return [1101, 1];
    if (maxCnt <= guiCount) return false;
    return [1101, 1];
}


const test1 = async (a) => {
    await console.log('log', a);
}
[1,2,3,4].forEach(c => {
    if (c == 2) return;
    test1(c);
})

/**
 * 优先广度遍历
 */
class FindIdArray {
    constructor (item, arr) {
        this.result = [];
        this.isWideEnd = true;  //广度遍历结束
        this.isHighEnd = true;  //深度遍历结束
        this.item = item;
        this.array = arr;
        this.tmp = [];
    }

    BFS () {
        for (const c of this.array) {
            this.tmp.push(c.id);
            if (c.id == this.item) {
                this.result.push(c.id);
                break;
            }
            if (c.children && c.children.length) {
                this.DFS(c.children);
                if (this.result.length) break;
                this.tmp = [];
                continue;
            } else {
                continue;
            }
        }
    }

    DFS (children) {
        if (this.result.length) return;
        if (!this.array.length) return;
        for (let c of children) {
            if (this.item == c.id) {
                this.tmp.push(c.id);
                return this.result.push(c.id);
            } 
            if (!c.children || !c.children.length) continue;
            this.tmp.push(c.id);
            if (c.children && c.children.length) {
                this.isHighEnd = false;
                if (!this.isHighEnd) this.findByCallee(c.children);
                if (this.result.length) break;
                if (this.isHighEnd) continue;  //深度遍历结束后，就到下一个
            } else {
                continue;
            }
        }
    }

    findByCallee (target) {
        if (!target.length) return;
        for (let t of target) {
            this.tmp.push(t.id);
            if (t.id == this.item) {
                this.result.push(t.id);
                break; 
            }
            if (t.children && t.children.length) {
                this.isHighEnd = false;
                return this.findByCallee(t.children);
            } else {
                this.isHighEnd = true;
            }
        }
    }
}




let arr = [
    {
      id: 1,
      children: [
        {
          id: 3
        }
      ]
    },
    {
      id: 2,
      children: [
        {
          id: 4
        }
      ]
    },
    {
      id: 9,
      children: [
        {
          id: 14
        },
        {
          id: 12,
          children: [
            {
              id: 11
            }
          ]
        },
      ]
    },
    {
      id: 5,
      children: [
        {
          id: 6
        },
        {
          id: 7,
          children: [
            {
              id:20,
              children: [
                  {
                      id: 21,
                      children: [
                          {
                              id: 8
                          }
                      ]
                  }
              ]
            }
          ]
        }
      ]
    }
  ]
  let item = 6;

  let find = new FindIdArray(item, arr);
  find.BFS();
  find.tmp;

  /**
   * 数组中找到两个数之和等于target，返回两个数的位置
   * @param {*} nums 
   * @param {*} target 
   */
  const twoNum = (nums, target) => {
    let result = [];
    if (!Array.isArray(nums)) return;
    for (let c of nums) {
        for (let n of nums) {
            if (n === c) continue;
            if ((n + c) === target) {
                let idx1 = nums.indexOf(c);
                let idx2 = nums.indexOf(n);
                return result = [idx1, idx2];
            }
        }
    }
  }

//   let nums = [2, 7, 11, 15], target = 9;

  /**
   * 数组中选3个数求取最大的三角周长，返回周长
   * @param {[Array]} array
   */
  const longestPerimeter = (array) => {
    if (!Array.isArray(array) || array.length < 3) return;
    array.sort((a, b) => {return b - a}); //从大到小排列
    if (array.length < 3) return 0;
    for (let i = 0; i < array.length; i ++) {
        if (array[i] < array[i + 1] + array[i + 2]) return array[i] + array[i + 1] + array[i + 2];
    }
    return 0;
  }
//   let re = longestPerimeter([2,1,2]);

  /**
   * 在两个已排序数组中找到中间值
   * @param {*} nums1 
   * @param {*} nums2 
   */
  const findMedian = (nums1, nums2) => {
    // if (!nums1.length || !nums2.length) return;
    let len = Math.floor((nums1.length + nums2.length) / 2);
    let test = [];
    test = test.concat(nums1, nums2).sort();
    if (test.length === 1) return test[0];
    if (test.length % 2 > 0) {
        return test[Math.floor(test.length/2)];
    } else {
        return (test[test.length/2 - 1] + test[test.length/2])/2;
    }
  }
//   let res = findMedian([3], [-1,-2]);

/**
 * 数组中找到target，若存在就返回数组下标，否则返回target插入的位置
 * @param {[*]} nums 
 * @param {*} target 
 */
  const findOrInsert = (nums, target) => {
    if (!Array.isArray(nums)) return ;
    let result = 0;
    if (nums.includes(target)) {
        return nums.indexOf(target);
    } else {
        for (let c of nums) {
            if (target >= c) {
                result = nums.indexOf(c) + 1;
            } else {
                break;
            }
        }
        if (result) return result;
        return 0;
    }
  }

//   let re = findOrInsert([1,3,5,6], 0);

/**
 * 去除数组的array
 * @param {[*]]} array 
 * @param {Number} value 
 */
  const without = (array, value) => {
    if (!Array.isArray(array) || !array.length) return;
    return array.filter(c => c != value);
  }

  /**
   * 从一个三角数组中找到总数最小的一条路径，并输出总数
   * @param {[*]} triangle 
   * @returns {Number}
   * @example
   * [
   *    [2],
   *    [3,4],
   *    [6,5,7],
   *    [4,1,8,3]
   * ]
   * 返回: 2 + 3 + 5 + 1 = 11
   */
  const minimumSum = (triangle) => {
    if (!Array.isArray(triangle)) return;
    let result = 0;
    let tmp = 0;
    if (!triangle.length) return 0;
    for (const c of triangle) {
        if (c.length === 1) {
            result += c[0];
            continue;
        }
        result += Math.min(...c);
    }
    return result;
  }

  /**
   * 数组去重
   * @param {[*]} array 
   * @returns []
   */
  const uniq = (array) => {
    return Array.from(new Set(array));
  }

  /**
   * 合并数组
   * @param {[*]} arr 
   * @param {[*]} value 
   */
  const mergeArray = (arr, value) => {
    if (!Array.isArray(arr) || !Array.isArray(value)) return;
    return [...arr, ...value];
  }

  const mergeObject = (object, value) => {
      if (JSON.stringify(object) !== '{}') return;
      return {...object, ...value};
  }

  /**
   * 合并去重数组
   * @param {[*]]} arr 
   * @param {[*]} value 
   */
  const mergeArrayUniq = (arr, value) => {
    if (!Array.isArray(arr) || !Array.isArray(value)) return;
    return uniq([...arr, ...value]);
  }

  const product = (nums) => {
    let result = [];
    let i = 0;
    let l = 0;
    let r = 1;
    for (i += l; i < nums.length; ++i, ++l) {
        for (const c of nums) {
            if (c === nums[i]) continue;
           r *= c;
        }
        result.push(r);
        r = 1;
    }
    return result;
  }

  const reduce = (arr) => {
    if (!Array.isArray(arr)) return 0;
    let result = 0;
    for (const c of arr) {
        result += c;
    }
    return result;
  }

  /**
   * 堆排序，一棵完全二叉树，父节点比子节点都小或者都大，小顶堆或大顶堆。
   * 先将array调整为初始顶堆。
   * 先填充左节点，先填充同一级的子节点。
   * 策略就是交换元素
   * 这里堆排序的思想就是构成一个大顶堆
   */
  const heapSort = (array) => {
    
  }


  let uCard = {
      My: [0x11, 0x11, 0x12, 0x13, 0x14, 0x61, 0x71],
      huaPai: [0x63],
      newHuaPai: []
  }

  let publicCards = [0x31, 0x72, 0x73, 0x34, 0x45, 0x44];
//   cf.changeMyCard();
  class de {
      constructor (a) {
        this.a = a;
      }
      add () {
          this.a.splice(0, 1);
      }
  }

  
  /**扩展运算符 */

  /**
   * 一个计算胡的函数，有鬼牌,鸡胡/七对/碰碰胡/十三幺/（所有胡牌类型）
   * 构造函数传入手牌对象{object}
   * @example
   * {
   *    My: [],
   *    Chi: [],
   *    Peng: [],
   *    Gang: []
   * }
   */

   const HU_TYPE = {  /**胡牌类型 */
       JH: 1
   }
  class calcCard {
      constructor (cards, guipai) {
        this.guiCnt = 0; //鬼牌
        this.userCards = cards.My;  //手牌
        this.chi = cards.Chi; //吃
        this.peng = cards.Peng; //碰
        this.gang = cards.Gang; //杠
        this.guipai = guipai || null;
        this.cardLen = cards.My.length;  //手牌的数量
        this.jiang = 0;  //将
        this.init();
      }
      
      init () { /**将从手牌中移除鬼牌放到this.gui， */
        if (this.guipai) {
            this.userCards.forEach(c => {
                if (c === this.guipai) {
                    ++ this.guiCnt;
                    return true
                } else {
                    this.guiCnt = 0;
                    return false;
                }
            })
            this.userCards.filter(c => c != this.guipai);
        }

        // let tmpCards = this.chooseColor(this.userCards);
        // for (let c of tmpCards) {
        //     this.judgeSeq(tmpCards[c]);
        // }
      }

      push (card) { //应对点炮/听牌时将牌加入到手牌中
        if (this.isGui(card)) {
            this.guiCnt ++;
        } else {
            this.userCards.push(card);
        }
      }

      isGui (card) {
        return card === this.guipai;
      }

      /**判断鸡胡，是否指定将,这里最后只会剩下2张将牌 */
      checkJH (jiang = 0) {
          let cardsLength = this.userCards.length + this.guiCnt;
          if (!cardsLength % 3) throw new Error('相公了');
          let canHu = this.judgeSeq(this.userCards, jiang);
          if (jiang && canHu) {
              this.jiang = jiang;
              return [HU_TYPE.JH, 1];
          }
          if (cardsLength === 2 && canHu) {
              this.jiang = this.guiCnt === 2 ? this.guipai : this.userCards[0];
              return [HU_TYPE.JH, 1];
          }
          if (canHu) return [HU_TYPE.JH, 1];
          return 0;
      }

      /**检查3张的牌，3张的牌有可能是3同张或顺子,每填一张牌，就要把guipai去掉一张  这里经过遍历都是单花色的牌
       * 策略是先将3同张的牌取出来，再取顺子，最后是将。
       * 若有鬼牌，则先将所有的顺子，3同张换完，最有再考虑将牌
       * 手牌里没有鬼牌
       * 是否指定将牌
       * @returns {Boolean}
      */
      judgeSeq (cards, jiang = 0) {
          cards.sort();
          let colorCard = [];
          if (cards.length === 2) { /**两张手牌 */
              if (this.sameArray(cards)) {
                  this.jiang = cards[0];
                  return true
              } else if (cards.includes(this.guipai)) {
                  this.jiang = cards.filter(c => c != this.guipai);
                  return true;
              } else {
                  return false;
              }
          }
          let firstType = this.type(cards[0]);
          let firstColor = this.color(cards[0]);
          if (firstType < 8 && firstColor <= 3) {
            
          }
      }

      chooseColor (cards = this.userCards) {  //将牌按花色分成 {1: [], 2: [], 3: [], 4: []}
        const result = {};
        for (const c of cards) {
            let type = c >> 4;
            if (!result[type]) {
                result[type] = [];
                result[type].push(c);
            } else {
                result[type].push(c);
            }
        }
        for (let o in result) {  //对key值的数组进行从大到小排序
            result[o].sort((a, b) => {
                return a > b;
            })
        }
        return result;
      }

      cardCount (card, item) { /**计算item在card里的数量 */
        if (!card.length) return 0;
        card.sort();
        let idx1 = card.indexOf(item);
        let idx2 = card.lastIndexOf(item);
        return idx1 - idx2 + 1;
      }

      /**找出cards中的具有num张相同的牌，并返回找到的所有的牌 */
      selectCount (cards, num) {
          let tmp = {};
          let result = [];
        for (const c of cards) {
            tmp[c] ? ++ tmp[c] : tmp[c] = 1;
        }
        for (let i in tmp) {
            if (tmp[i] == num) {
                for (let j = 0; j < num; ++ j) result.push(i | 0);
            } 
        }
        return result;
      }

      /**删除cards中的value数组 */
      deleteSeq (cards, value) {
        for (const c of value) {
            let idx = cards.indexOf(c);
            cards.splice(idx, 1);
        }
        return cards;
      }

      sameArray (array) {
        if (!array.length) return false;
        array.sort();
        let first = array[0];
        let last = array[array.length - 1];
        if (first === last) return true;
        return false;
      }

      type (card) {
        return card & 0x0F;
      }
      color (card) {
        return card >> 4;
      }
  }

  let cards = {My: [0x11, 0x13, 0x12, 0x31, 0x31, 0x41]};
  let chiNum = {};
  if (!chiNum[1] || !chiNum[1][2]) {
    chiNum[1] = {[2]: 3};
  }
//   let a = [1,2,3,4];
//   let b;
//   for (let i of a) {
//       console.log('i', i);
//       if (i === 2) b = i;
//   }
//   console.log('b', b);
//   console.log("22", 1);
//   console.log("chiNum", chiNum);

const HUPAI_JH = 1;
const HUPAI_QYS = 8;
const HUPAI_ZYS = 3;
const HUPAI_ZiYS = 7;

class JHJudgement {
    /**
     * 鸡胡的判断结果
     * @param {number[]} std       传引用，修改后恢复原样
     * @param {Card}     jiang     传值，会修改
     * @param {number}   guiCount  传值，会修改
     */
    constructor (std, jiang, guipai) {
        this.std = std;
        this.jiang = jiang;
        this.guiCount = guipai.length;
        this.guipai = guipai;
        this.result = this._searchJH(3, 0);
    }
    _searchJH (color, point) {
        let i = color * 9;
        // 跳过没有的牌、点数遍历完后进入下一花色。这之后应把 i、color、point 作为常量使用
        findNext: {
            const N = i + (color < 3 ? 9 : 7);
            for (i += point; i < N; ++i, ++point) 
                if (this.std[i] > 0)
                    break findNext;
            if (color > 0)
                return this._searchJH(color - 1, 0);
            else {
                let jiang = this.jiang;
                let guiCount = this.guiCount % 3;
                if (!jiang && guiCount === 2) {
                    // jiang = -1;
                    jiang = this.guipai[0];
                    guiCount = 0;
                }
                if (jiang && guiCount === 0) {
                    this.jiang = jiang;
                    this.guiCount = guiCount;
                    return true;
                }
                return false;
            }
        }
        // 将对、刻子
        if (this.std[i] === 2) {
            if (!this.jiang) {
                this.std[i] = 0; this.jiang = ((color + 1) << 4) | (point + 1);
                if (this._searchJH(color, point + 1)) {
                    this.std[i] = 2;
                    return true;
                }
                this.std[i] = 2; this.jiang = 0;
            }
        } else if (this.std[i] === 3) {
            this.std[i] = 0;
            if (this._searchJH(color, point + 1)) {
                this.std[i] = 3;
                return true;
            }
            this.std[i] = 3;
        }
        // 顺子（未完）
        if (color < 3 && point < 7 && this.std[i + 1] > 0 && this.std[i + 2] > 0) {
            --this.std[i]; --this.std[i + 1]; --this.std[i + 2];
            if (this._searchJH(color, point)) {
                ++this.std[i]; ++this.std[i + 1]; ++this.std[i + 2];
                return true;
            }
            ++this.std[i]; ++this.std[i + 1]; ++this.std[i + 2];
        }
        // 使用鬼牌
        if (this.guiCount > 0) {
            // 补顺子
            if (color < 3) {
                // 补外顺子（未完）
                if (point < 8 && this.std[i + 1] > 0) {
                    --this.std[i]; --this.guiCount; --this.std[i + 1];
                    if (this._searchJH(color, point)) {
                        ++this.std[i]; ++this.guiCount; ++this.std[i + 1];
                        return true;
                    }
                    ++this.std[i]; ++this.guiCount; ++this.std[i + 1];
                }
                // 补内顺子（未完）
                if (point < 7 && this.std[i + 2] > 0) {
                    --this.std[i]; --this.guiCount; --this.std[i + 2];
                    if (this._searchJH(color, point)) {
                        ++this.std[i]; ++this.guiCount; ++this.std[i + 2];
                        return true;
                    }
                    ++this.std[i]; ++this.guiCount; ++this.std[i + 2];
                }
            }
            // 自用
            if (this.std[i] === 1) {
                // 补成将对
                if (!this.jiang) {
                    --this.guiCount; this.std[i] = 0; this.jiang = ((color + 1) << 4) | (point + 1);
                    if (this._searchJH(color, point + 1)) {
                        this.std[i] = 1;
                        return true;
                    }
                    ++this.guiCount; this.std[i] = 1; this.jiang = 0;
                }
                // 补成刻子
                if (this.guiCount > 1) {
                    this.guiCount -= 2; this.std[i] = 0;
                    if (this._searchJH(color, point + 1)) {
                        this.std[i] = 1;
                        return true;
                    }
                    this.guiCount += 2; this.std[i] = 1;
                }
            } else if (this.std[i] === 2) {
                // 补成刻子
                --this.guiCount; this.std[i] = 0;
                if (this._searchJH(color, point + 1)) {
                    this.std[i] = 2;
                    return true;
                }
                ++this.guiCount; this.std[i] = 2;
            } else if (this.std[i] === 4) {
                // 补成将对+刻子
                if (!this.jiang) {
                    --this.guiCount; this.std[i] = 0; this.jiang = ((color + 1) << 4) | (point + 1);
                    if (this._searchJH(color, point + 1)) {
                        this.std[i] = 4;
                        return true;
                    }
                    ++this.guiCount; this.std[i] = 4; this.jiang = 0;
                }
                // 补成刻子+刻子
                if (this.guiCount > 1) {
                    this.guiCount -= 2; this.std[i] = 0;
                    if (this._searchJH(color, point + 1)) {
                        this.std[i] = 4;
                        return true;
                    }
                    this.guiCount += 2; this.std[i] = 4;
                }
            }
        }
        // 此路不通
        return false;
    }
}

class CardCounter {
    constructor () {
        /**
         * 最后一张牌，一般是番型判断时胡的那张牌，应当已经加入 std 或 gui
         * - 仅用于标记，不作为存储
         * @type {Card}
         */
        this.lastCard = 0;
        /** 
         * 普通卡牌，向量态
         * @type {number[]}
         */
        this.std = [
            0,0,0,0,0,0,0,0,0, // 万 end=9
            0,0,0,0,0,0,0,0,0, // 条 end=18
            0,0,0,0,0,0,0,0,0, // 饼 end=27
            0,0,0,0,0,0,0,     // 风牌:东南西北, 箭牌:中发白 end=34
            0,0,0,0,0,0,0,0    // 四季牌:春夏秋冬, 花牌:梅兰竹菊 end=42
        ];
        /**
         * 鬼牌，序列态
         * - 注意：这里的牌加入时未经校验
         * @type {Card[]}
         */
        this.gui = [];
        /**
         * 鬼牌过滤器，返回 true 则认为是鬼牌
         * @type {(card: Card) => boolean}
         */
        this.isGui = null;
    }
    /**
     * 取得卡牌在 this.std 中的 index，没有这种卡牌就返回 -1
     * @example cc.std[cc.indexOf(card)]++
     * @param {Card} card 
     * @returns {number} index
     */
    indexOf (card) {
        const color = card >> 4;
        const point = card & 0x0F;
        if (color < 1 || color > 7 || point < 1) { /* 基本的范围错误 */ }
        else if (color === 1) { if (point < 10) return point - 1; }
        else if (color === 2) { if (point < 10) return point + 8; } 
        else if (color === 3) { if (point < 10) return point + 17; } 
        else if (color === 4) { if (point < 8) return point + 26; } 
        else if (color === 5) { /* 该花色已弃用 */ }
        else if (color === 6) { if (point < 5) return point + 33; } 
        else if (color === 7) { if (point < 5) return point + 37; } 
        return -1;
    }
    /**
     * 获取 this.std 上特定 index 对应的卡牌
     * @param {number} index
     * @returns {Card} card
     */
    cardOf (index) {
        if (index >= 0 && index < 42) {
            return CARDS_VECTOR_CARD[index];
        } else {
            return 0;
        }
    }
    /**
     * 添加卡牌
     * @param {Card[]} cards 
     */
    add (cards) {
        if (this.isGui) {
            for (const card of cards) {
                if (!this.isGui(card)) {
                    const index = this.indexOf(card);
                    if (index !== -1) {
                        this.std[index]++;
                    }
                } else {
                    this.gui.push(card);
                }
            }
        } else {
            for (const card of cards) {
                const index = this.indexOf(card);
                if (index !== -1) {
                    this.std[index]++;
                }
            }
        }
        return this;
    }

    addFilter (card) {
        let index = this.indexOf(card);
        let guiIndex = this.indexOf(this.gui[0]);
        let cardsLen = this.std[index];
        if (cardsLen) this.std[index] = 0;
        if (this.gui.length) {
            this.std[guiIndex] = cardsLen;
        }
        return this;
    }
    /**
     * 按区块加入牌，每 chunkLength 张牌为一个区块，将区块中第一张不是鬼牌的牌按3张计加入数据结构
     * @param {Card[]} cards 
     * @param {number} chunkLength 
     */
    addByChunk (cards, chunkLength) {
        if (chunkLength < 1) return this;
        if (this.isGui) {
            for (let index = -1, i = 0, j = chunkLength; j < cards.length; j += chunkLength) {
                do {
                    if (!this.isGui(cards[i]) && ~(index = this.indexOf(cards[i]))) {
                        this.std[index] += 3;
                        i = j; break;
                    }
                } while (++i < j);
            }
        } else {
            for (let index = -1, i = 0, j = chunkLength; j < cards.length; j += chunkLength) {
                do {
                    if (~(index = this.indexOf(cards[i]))) {
                        this.std[index] += 3;
                        i = j; break;
                    }
                } while (++i < j);
            }
        }
        return this;
    }
    /**
     * 减去卡牌
     * @param {Card[]} cards 
     */
    subtract (cards) {
        if (this.isGui) {
            for (const card of cards) {
                if (!this.isGui(card)) {
                    const index = this.indexOf(card);
                    if (index !== -1) {
                        this.std[index]--;
                    }
                } else {
                    const i = this.gui.indexOf(card);
                    if (i !== -1) {  // quick remove
                        this.gui[i] = this.gui[this.gui.length - 1];
                        this.gui.pop(); 
                    }
                }
            }
        } else {
            for (const card of cards) {
                const index = this.indexOf(card);
                if (index !== -1) {
                    this.std[index]--;
                }
            }
        }
        return this;
    }
    /**
     * 推入卡牌并记录为 lastCard
     * @param {Card} card 
     * @returns {void}
     */
    push (card) {
        if (!this.isGui || !this.isGui(card)) {
            const index = this.indexOf(card);
            if (index !== -1) {
                this.std[index]++;
                this.lastCard = card;
            }
        } else {
            this.gui.push(card);
            this.lastCard = card;
        }
    }
    /**
     * 弹出 lastCard
     * @returns {Card}
     */
    pop () {
        const lastCard = this.lastCard;
        if (lastCard) {
            this.lastCard = 0;
            if (!this.isGui || !this.isGui(lastCard)) {
                const index = this.indexOf(lastCard);
                if (index !== -1 && this.std[index] > 0) {
                    this.std[index]--;
                    return lastCard;
                }
            } else {
                const i = this.gui.indexOf(lastCard);
                if (i !== -1) {  // quick remove
                    this.gui[i] = this.gui[this.gui.length - 1];
                    this.gui.pop(); 
                    return lastCard;
                }
            }
        }
        return 0;
    }
    /**
     * 移除一张牌
     * - 如果这是 lastCard，lastCard 的记录将被清除，无论是否成功移出这张牌
     * @param {Card} card 
     * @returns {Card} 被移出的牌
     */
    remove (card) {
        if (this.lastCard === card) {
            this.lastCard = 0;
        }
        if (!this.isGui || !this.isGui(card)) {
            const index = this.indexOf(card);
            if (index !== -1 && this.std[index] > 0) {
                this.std[index]--;
                return card;
            }
        } else {
            const i = this.gui.indexOf(card);
            if (i !== -1) {  // quick remove
                this.gui[i] = this.gui[this.gui.length - 1];
                this.gui.pop(); 
                return card;
            }
        }
        return 0;
    }
    /**
     * 设置 lastCard
     * @param {Card} card 
     */
    setLastCard (card) {
        this.lastCard = card;
        return this;
    }
    /**
     * 设置 lastCard 为 cards 的最后一张
     * @param {Cards[]} cards 
     */
    setLastCardBy (cards) {
        this.lastCard = cards[cards.length - 1];
        return this;
    }
    /**
     * 添加卡牌并设置 lastCard 为 cards 的最后一张
     * @param {Card[]} cards 
     */
    extend (cards) {
        this.add(cards);
        this.lastCard = cards[cards.length - 1];
        return this;
    }
    /**
     * 设置鬼牌过滤器
     * @param {(card: Card) => boolean} filter 
     */
    setGuiFilter (filter) {
        this.isGui = filter;
        return this;
    }
    /**
     * 序列化，顺序是：顺序排序的普通牌（std）、输入时顺序的鬼牌（gui）、最后一张牌（lastCard)
     * - 如果 lastCard 在 std, gui 中都没有找到，则不会加入序列
     * @returns {Card[]}
     */
    serialize () {
        const cards = [];
        const lastCard = this.lastCard;
        let foundLastCard = false;
        // std
        for (let index = 0; index < 42; ++index) {
            let count = this.std[index];
            if (count > 0) {
                const card = this.cardOf(index);
                if (card === lastCard) {
                    count--;
                    foundLastCard = true;
                }
                for (; count > 0; --count) cards.push(card);
            }
        }
        // gui
        if (lastCard && !foundLastCard) {
            for (let gui = this.gui, i = 0, n = gui.length; i < n; ++i) {
                if (gui[i] !== lastCard) {
                    cards.push(gui[i]);
                } else {
                    foundLastCard = true;
                    for (++i; i < n; ++i) cards.push(gui[i]);
                    break;
                }
            }
        } else {
            Array.prototype.push.apply(cards, this.gui);
        }
        // lastCard
        if (lastCard && foundLastCard) cards.push(lastCard);
        // well
        return cards;
    }
    /**
     * 转化成十六进制数字数组的字面值，策略同 serialize()
     * - 是一个高效的实现
     * - 能将放在最后的 lastCard 用一个空格隔开来表示这是 lastCard，并且不影响字面值的解析含义 
     * @returns {string}
     */
    toString () {
        const strings = ['['];
        const lastCard = this.lastCard;
        let foundLastCard = false;
        // std
        for (let index = 0; index < 42; ++index) {
            let count = this.std[index];
            if (count > 0) {
                const card = this.cardOf(index);
                if (card === lastCard) {
                    count--;
                    foundLastCard = true;
                }
                for (; count > 0; --count) {
                    strings.push(`0x${card.toString(16)},`);
                }
            }
        }
        // gui
        if (lastCard && !foundLastCard) {
            for (let gui = this.gui, i = 0, n = gui.length; i < n; ++i) {
                if (gui[i] !== lastCard) {
                    strings.push(`0x${gui[i].toString(16)},`);
                } else {
                    foundLastCard = true;
                    for (++i; i < n; ++i) {
                        strings.push(`0x${gui[i].toString(16)},`);
                    }
                    break;
                }
            }
        } else {
            for (let gui = this.gui, i = 0, n = gui.length; i < n; ++i) {
                strings.push(`0x${gui[i].toString(16)},`);
            }
        }
        // lastCard
        if (lastCard && foundLastCard) {
            strings.push(` 0x${lastCard.toString(16)}`);
        } else if (strings.length > 1) {
            strings.push(strings.pop().slice(0, -1));
        }
        // well
        strings.push(']');
        return strings.join('');
    }
    /**
     * std[start,end) 是否每一项都符合条件
     * @param {number} start 
     * @param {number} end 
     * @param {(count: number, index: number) => boolean} filter
     * @returns {boolean}
     */
    every (start, end, filter) {
        if (filter) {
            for (let i = start; i < end; ++i) {
                if (!filter(this.std[i], i)) return false;
            }
        } else {
            for (let i = start; i < end; ++i) {
                if (!this.std[i]) return false;
            }
        }
        return true;
    }
    /**
     * std[start,end) 是否至少有一项符合条件
     * @param {number} start 
     * @param {number} end 
     * @param {(count: number, index: number) => boolean} filter
     * @returns {boolean}
     */
    some (start, end, filter) {
        if (filter) {
            for (let i = start; i < end; ++i) {
                if (filter(this.std[i], i)) return true;
            }
        } else {
            for (let i = start; i < end; ++i) {
                if (this.std[i]) return true;
            }
        }
        return false;
    }
    /**
     * 统计 std[start,end) 中符合条件的个数
     * @param {number} start 
     * @param {number} end 
     * @param {(count: number, index: number) => boolean} filter
     * @returns {number}
     */
    count (start, end, filter) {
        let count = 0;
        if (filter) {
            for (let i = start; i < end; ++i) {
                if (filter(this.std[i], i)) ++count;
            }
        } else {
            for (let i = start; i < end; ++i) {
                if (this.std[i]) ++count;
            }
        }
        return count;
    }
    /**
     * 求和 std[start,end) 中符合条件的项
     * @param {number} start 
     * @param {number} end 
     * @param {(count: number, index: number) => boolean} filter
     * @returns {number}
     */
    sum (start, end, filter) {
        let sum = 0;
        if (filter) {
            for (let i = start; i < end; ++i) {
                if (filter(this.std[i], i)) sum += this.std[i];
            }
        } else {
            for (let i = start; i < end; ++i) {
                if (this.std[i]) sum += this.std[i];
            }
        }
        return sum;
    }
    /**
     * 从 std[start,end) 中选择出符合条件的 index
     * @param {number} start 
     * @param {number} end 
     * @param {(count: number, index: number) => boolean} filter
     * @param {number} maxSelection
     * @returns {number[]} index[]
     */
    select (start, end, filter, maxSelection) {
        const selection = [];
        if (filter) {
            if (maxSelection) {
                for (let i = start; i < end && selection.length < maxSelection; ++i) {
                    if (filter(this.std[i], i)) selection.push(i);
                }
            } else {
                for (let i = start; i < end; ++i) {
                    if (filter(this.std[i], i)) selection.push(i);
                }
            }
        } else {
            if (maxSelection) {
                for (let i = start; i < end && selection.length < maxSelection; ++i) {
                    if (this.std[i]) selection.push(i);
                }
            } else {
                for (let i = start; i < end; ++i) {
                    if (this.std[i]) selection.push(i);
                }
            }
        }
        return selection;
    }
    /**
     * 比较 std[start, end) 是否等于 target
     * @param {number[]} target 
     * @param {number}   start 
     * @param {number}   end 
     * @deprecated
     */
    equals (target, start, end) {
        for (let i = 0, n = end - start; i < n; ++i) {
            if (target[i] !== this.std[start + i]) return false;
        }
        return true;
    }
    /**
     * std[start, end) ++
     * @param {number} start 
     * @param {number} end 
     * @returns {void}
     */
    inc (start, end) {
        for (let i = start; i < end; ++i) {
            ++this.std[i];
        }
    }
    /**
     * std[start, end)--
     * @param {number} start 
     * @param {number} end 
     * @returns {void}
     */
    dec (start, end) {
        for (let i = start; i < end; ++i) {
            --this.std[i];
        }
    }
    /**
     * 设置这张牌的数量
     * @param {Card}   card 
     * @param {number} count 
     * @returns {this}
     * @todo 考虑如何增加对 this.gui 的处理
     */
    set (card, count) {
        const index = this.indexOf(card);
        if (index !== -1) this.std[index] = count;
        return this;
    }
    /**
     * 获取这张牌的数量，无效卡牌返回 0
     * @param {Card} card 
     * @returns {number}
     * @todo 考虑如何增加对 this.gui 的处理
     */
    get (card) {
        const index = this.indexOf(card);
        if (index !== -1) return this.std[index];
        return 0;
    }
    /**
     * 是否有这张牌
     * @param {Card} card 
     * @returns {boolean}
     * @todo 考虑如何增加对 this.gui 的处理
     */
    has (card) {
        return !!this.get(card);
    }
    /**
     * 删除这种牌
     * @param {Card} card 
     * @returns {boolean}
     * @todo 考虑如何增加对 this.gui 的处理
     */
    delete (card) {
        const index = this.indexOf(card);
        if (index !== -1) {
            if (this.std[index] > 0) {
                this.std[index] = 0;
                return true;
            }
        }
        return false;
    }
    /* ---------- 以下是番型判断区 ---------- */
    /**
     * 判断鸡胡
     * - 牌型：序数牌、字牌、鬼牌(数量)
     * - 规则：鸡胡(HUPAI_JH)：一个将对(AA) + 多个坎牌（顺子(ABC) / 刻子(AAA)）。鬼牌必须用完
     * - 算法：DFS
     * - 性能：O(2^N)/O(1)
     * @param {Card} jiang 
     * @returns
     * huType: 胡牌类型
     * guiCost: 用了多少张鬼牌
     * jiang: 将牌
     */
    hasJH (jiang) {
        const ret = {
            huType: 0,
            guiCost: 0,
            jiang: 0,
        };
        const judgement = new JHJudgement(this.std, jiang || 0, this.gui);
        if (judgement.result) {
            ret.huType = HUPAI_JH;
            ret.guiCost = this.gui.length - judgement.guiCount;
            ret.jiang = judgement.jiang;
        }
        return ret;
    }

    /**
     * 判断七对番型
     * - 牌型：序数牌、字牌、鬼牌(数量)
     * - 规则：小七对(HUPAI_QIDUI)：7组两牌相同
     * - 规则：龙七对(HUPAI_HH_QIDUI)：5组两牌相同、1组四牌相同
     * - 规则：双龙七对(HUPAI_CHH_QIDUI)：3组两牌相同、2组四牌相同
     * - 规则：三龙七对(HUPAI_CCHH_QIDUI)：1组两牌相同、3组四牌相同
     * - 算法：统计
     * - 性能：O(1)/O(1)
     * - 注意：虽然单种牌数量仍不得超过4，但总牌数不一定要是14，会优先提取更多杠子的番型
     * @param {number} maxGangzi 最大几个杠子，默认不限制
     */
    hasQD (maxGangzi) {
        const ret = {
            huType: 0,
            guiCost: 0,
            gangzi: 0,
            duizi: 0,
        };
        if (maxGangzi == null) maxGangzi = Infinity;
        let guiCount = this.gui.length;
        let duizi = 0;
        let gangzi = 0;

        if (!guiCount) {
            let tmpArr = this.std.map(i => i > 0);
            tmpArr.every(i => {
                if (i % 2 === 0) return true;
                return false;
            })
        }
        // 试图解释普通牌，可用鬼牌补救
        for (let i = 0; i < 34; ++i) {
            const count = this.std[i];
            if (count === 0) continue;
            else if (count === 1) {
                if (guiCount > 0) {
                    guiCount--;
                    duizi++;
                } else return ret;
            }
            else if (count === 2) {
                duizi++;
            }
            else if (count === 3) {
                if (guiCount > 0) { 
                    guiCount--; 
                    if (gangzi < maxGangzi) gangzi++;
                    else duizi += 2;
                } else return ret;
            }
            else if (count === 4) {
                if (gangzi < maxGangzi) gangzi++;
                else duizi += 2;
            }
            else return ret;
        }

        // 剩余鬼牌得是偶数
        if (guiCount & 1) return ret;

        // 有多的鬼牌怎么办，先升级对子成杠子
        if (guiCount > 0) {
            const upgrade = Math.min(duizi, guiCount >> 1, maxGangzi - gangzi);
            guiCount -= upgrade << 1;
            duizi -= upgrade;
            gangzi += upgrade;
        }

        // 还有鬼牌怎么办，能组杠子就杠子，不能的必须是对子，这里鬼牌就安排明白了
        if (guiCount > 0) {
            const newGangzi = Math.min(guiCount >> 2, maxGangzi - gangzi);
            duizi += (guiCount >> 1) - (newGangzi << 1);
            gangzi += newGangzi;
            guiCount = 0;
        }

        let huType = 0;
        if (gangzi > 2 && duizi > 0) huType = HUPAI_CCHH_QIDUI;
        else if (gangzi > 1 && duizi > 2) huType = HUPAI_CHH_QIDUI;
        else if (gangzi > 0 && duizi > 4) huType = HUPAI_HH_QIDUI;
        else if (duizi > 6) huType = HUPAI_QIDUI;
        if (huType) {
            ret.huType = huType;
            ret.guiCost = this.gui.length - guiCount;
            ret.gangzi = gangzi;
            ret.duizi = duizi;
        }
        return ret;
    }

    /**
     * 一色牌型
     * @returns
     * 清一色：QYS
     * 杂一色：ZYS
     * 字一色：ZiYS
     */
    hasYS () {
        const ret = {
            huType: 0,
            guiCost: 0,
            color: 0,
            hasZiPai: false
        }

        let singleColor = 0;
        if (this.some(0, 9)) {
            singleColor = 1;
        }
        if (this.some(9, 18)) {
            if (singleColor) return ret; /**若之前已有其他花色，直接返回，已不可能凑成一色牌型 */
            singleColor = 2;
        }
        if (this.some(18, 27)) {
            if (singleColor) return ret
            singleColor = 3;
        }
        let hasZiPai = this.some(27, 34);
        let huType = 0;
        if (singleColor) {
            if (hasZiPai) huType = HUPAI_ZYS;
            if (!huType) huType = HUPAI_QYS;
        } else {
            if (hasZiPai) huType = HUPAI_ZiYS;
        }
        ret.huType = huType;
        ret.color = singleColor;
        ret.hasZiPai = hasZiPai;
        return ret;
    }

    hasQYS4YA13 () {
        const ret = {
            huType: 0,
            guiCost: 0,
            color: 0,
            hasZiPai: false
        }
        let guiIndex = this.indexOf(this.gui[0]);
        // let guiCnt = this.std[guiIndex];
        // this.std[guiIndex] = 0;
        //鬼牌不在std中
        let res = this.hasYS();
        // this.std[this.gui[0] & 0x0F] = guiCnt;
        ret.huType = res.huType;
        ret.color = res.color;
        if (res.huType && res.huType === HUPAI_QYS) return true;
        return false;
    }

    /** 
     * 判断碰碰胡（大对子）番型
     * - 牌型：序数牌、字牌、鬼牌(数量)
     * - 规则：碰碰胡(HUPAI_PPH)：和牌时，可用一个将对、多个刻子的模式完全解释自己的牌
     * - 算法：遍历统计
     * - 性能：O(1)/O(1)
     */
    hasPPH () {
        const ret = {
            huType: 0,
            guiCost: 0,
        };
        /** 仍未被解释的单牌数量 */
        let singleCount = 0;
        /** 仍未被解释的对子数量 */
        let doubleCount = 0;
        for (let i = 0; i < 34; ++i) {
            const count = this.std[i];
            if (count === 0) continue;
            else if (count === 1) ++singleCount;
            else if (count === 2) ++doubleCount;
            else if (count === 4) ++singleCount;
        }
        /** 剩余鬼牌 */
        let guiCount = this.gui.length - (doubleCount - 1) - (singleCount << 1);
        if (guiCount >= 0 && guiCount % 3 === 0) {
            ret.huType = HUPAI_PPH;
            ret.guiCost = this.gui.length - guiCount;
        }
        return ret;
    }
}

/**
 * 路由匹配
 */
class InitRouter {
    constructor (location) {
        this.routes = {};  /**保存路由对应的函数 */
        this.hashUrl = '';  /**当前的hash值 */
        this.location = location;  /**windows 的location对象包含当前的url, 路由匹配的思想就是解析当前的url并执行对应的函数 */
    }

    init () {
        return this.reload();
    }
    reload () {
        this.hashUrl = this.location.hash.substring(1) || '/'; /**获取当前的hash值, 去掉#*/
        this.routes[this.hashUrl]();
    }
    map (key, callBack) {
        this.routes[key] = callBack;
    }

    create () {
        return new InitRouter(this.location).init();
    }

}

/**函数只执行一次 */
const onceCall = (fn) => {
    let result;
    return function () {
        if (fn) {
            result = fn.apply(this, arguments);
            fn = null;
        }
        return result;
    }
}
let once = (func) => {
    func.apply(this, arguments);
    once = function (){};
}

const noop = () => {
    return undefined;
}

/**
 * 所有的单词的首字母大写，其余的小写
 * 策略是先将所有的字母都转换成小写，然后将首字符大写，最后再拼接起来
 * @param {string} str 
 */
const toEveryHeadLetterUpperCase = (str) => {
    let strs = str.toLowerCase().split(" ");
    let resStrs = [];
    for (const l of strs) {
        resStrs.push(l[0].toUpperCase() + l.slice(1));
    }
    return resStrs.join(' ');
}
// console.log('to', toEveryHeadLetterUpperCase("ti is Ok")); Ti Is Ok;

/**
 * 判断是否是回文，是就返回true，否则返回false
 * @param {string}} str 
 */
const isHuiWenString = (str) => {
    let str1 = str.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
    let str2 = str.split('').reverse().join('');
    if (str1 === str2) return true;
    return false;
}

/**
 * 解析url的参数并转换成一个对象
 * @param {string} url 
 */
const parseUrl2Obj = (url) => {
    let res = {};
    let ques = url.indexOf('?');
    if (!~ques) return {};
    let t = url.slice(ques + 1); /**目标字符串(除去?) */
    let ts = t.split('&'); /**a=1&b=2... */
    for (const l of ts) {
        let key = l.split('=')[0];
        let value = l.split('=')[1];
        res[key] = value;
    }
    return res;
}
// console.log('ss', parseUrl2Obj('http://127.0.0.1:2222/to?a=1&b=2&c=3')); {a: '1', b: '2', c: '3'}

/**
 * 找到无限循环字符串的第n位
 * num: '12345543212345432';
 * @param {string} num 
 */
const findAheadOfN = (n) => {
    let s = '12345543212345432';
    let k = '123455432';
    return k.charAt(n%k.length - 1);
}
// console.log('ad', findAheadOfN(10)); 1

/**
 * 计算出现最多的字符是什么，统计次数，并返回该字符
 * 策略是先去重，减少遍历次数
 * @param {string} str 
 */
const findMostTimesStr = (str) => {
    let symbolStr = Array.from(new Set(str.split('')));
    let count = 0;
    let char = null;
    let res = {};
    for (const l of symbolStr) {
        console.log('l', str.split(l).length - 1); /**原理是根据该字符截取整个str，截取的长度就是该字符出现的次数 + 1（截段比截口多1） */
        if (!char) { 
            char = l;
            count = str.split(l).length - 1;
        } else {
            if (count < str.split(l).length - 1) {
                char = l;
                count = str.split(l).length - 1;
            } 
        }
    }
    res[char] = count;
    return res;
}
// console.log('ss',findMostTimesStr('ssdddddsfdgfg')); {char: count}

/**
 * 找到无重复字符的最大长度
 * @param {string} str
 */
const findUnRepeatStr = (str) => {
    let char = '';
    for (const l of str.split('')) {
        if (!char) {
            char += l[0];
        } else {
            let idx = char.indexOf(l[0]);
            // if (~idx) char = char.substr(idx + 1);
            // char += l[0];
            if (~idx) continue;
            char += l[0];
        }
    }
    return char;
}
// console.log('l', findUnRepeatStr('eretrydfdffffd'));

/**
 * 将num用,每3个隔开
 * 策略是先将数字反转变成string，每3个截取一段，最后join(‘，’)
 * @param {number} num
 * @example
 * 100000 =>  100,000
 */
const toLocaleStringT = (num) => {
    if (!num) return;
    let arr = [];
    num = (num | 0).toString();
    callee(num);
    function callee (num) {
        if (num.length < 3 && num.length) {
            arr.push(num);
        } else {
            arr[arr.length] = num.slice(-3);
            if (num.length) callee(num.slice(0,-3));
        }
    }
    return arr.reverse().join(',');
}
let t = toLocaleStringT(123);

/**
 * 烂牌是具有序数牌和字牌，但是序数牌的间隔大于1，且所有的牌不能有重复的牌
 * 不同种花色的序数牌之间的间隔要对应，例如：147,258||135,246,
 * 同种花色不一定只有3张，
 * @param {[*]} userCard
 */
const checkLP = (userCard) => {
    if (!userCard || !Array.isArray(userCard) || !userCard.length) return false;
    
    if (userCard.length !== _.uniq(userCard)) return false;
    userCard.sort();
    let zipai = 0;
    let count = [0,0,0,0,0,0,0,0,0];

    let seq = {
        wan: [],
        tiao: [],
        bing: []
    };
    for (const c of userCard) {
        if (c >> 4 === 4) {
            ++zipai;
            continue;
        } else {
            if (c >> 4 === 1) seq.wan.push(c);
            if (c >> 4 === 2) seq.tiao.push(c);
            if (c >> 4 === 3) seq.bing.push(c);
        }
    }
    let diff1, diff2;
    for (const i in seq) {
        for (const t in seq[i]) {
            ++ count[seq[i][t] & 0x0F];
            if (seq[i][t + 1] = seq[i][t] + 1) return false;
            if (!diff1) diff1 = seq[i][t + 1] - seq[i][t];
            if (!diff2) diff2 = seq[i][t + 1] - seq[i][t];

            if (seq[i + 1][t] + diff1 != seq[i][t]) return false;
            if (seq[i + 1][t + 1] + diff2 != seq[i + 1][t + 1]) return false;
        }
    }
    for (const n of count) {
        if (n > 1 || !n) break;
        if (zipai === 7) return [7, 2] /**七星十三烂 所有的数字牌总共是1-9，且字牌有7张*/
    }
    if (zipai === 7) return [7, 1]; /**七星烂牌 */
    return [7, 0];
}

/**
 * 永安13张，七对, 不能有吃碰杠,有鬼牌,鬼牌先凑杠，再凑对
 * @param {[*]} userCard (tmpCards)
 */
const checkYAQD = (userCard, guipai, tmpCards) => {
    if (userCard.length != 14) return false;
    let double = 0, quadra = 0, guiCnt = 0;
    let tmp = {};
    if (_.isEmpty(tmpCards) || tmpCards == undefined) {
        for (const c of userCard) {
            if (guipai.includes(c)) {
                ++ guiCnt;
                continue;
            }
            if (tmp[c]) {
                ++ tmp[c];
            } else {
                tmp[c] = 1;
            }
        }
    } else {
        tmp = tmpCards;
    }

    if (!guiCnt) {
        let tmpArr = Object.values(tmp);
        tmpArr.every(t => {
            if (t % 2 == 0) return true;
            return false;
        })
    }

    for (const i in tmp) {
        if (tmp[i] === 1) {
            guiCnt --;
            double ++;
        } else if (tmp[i] === 2) {
            double ++;
        } else if (tmp[i] === 3) {
            guiCnt --;
            quadra ++;
        } else {
            quadra ++;
        }
    }
    if (guiCnt < 0) return false;
    if (guiCnt % 2 != 0) return false;
    /**鬼牌有多，先将对子补成杠 这里没有什么意义*/
    quadra ++ ;
    guiCnt -= 2;
    return true;
}

// let ss = checkYAQD([0x11, 0x11, 0x11, 0x22, 0x22, 0x22, 0x44, 0x44, 0x16, 0x17, 0x18, 0x19, 0x21, 0x21], [0x11]);
// console.log('ss', ss); //false

//process
// process.stdin.resume();
// let a1, b1;
// process.stdout.write('请输入a的值');
// process.stdin.on('data', (data) => {
//     console.log('a', a1);
//     if (a1 == undefined) {
//         process.stderr.write('a', a);
//         a1 = Number(data);
//         process.stdout.write('请输入b的值');
//     } else {
//         b1 = Number(data);
//         console.log('a1: %d, b : %d, sum: %d', a1, b1, a1+b1);
//         process.stdout.write('结果是:'+ (a1 + b1));
//         process.exit(0);
//     }
// })

// console.log(chalk.red('Hello', chalk.underline.bgBlue('World') + '!'));
// console.log(chalk.yellow(figlet.textSync('Hello', {horizontalLayout: 'full'})));
// console.log(chalk.green('I am green line' + chalk.blue.underline.bold('with blue substring') + 'that become green again'));
// console.log(chalk.keyword('orange')('yay for orange text'));
// console.log(chalk.rgb(123, 45, 67).underline('underlined reddish color'));
// console.log(chalk.hex('#DEADED').bold('good day'));
// console.log(`CPU: ${chalk.red('90%')}`);
const random = (from, to) => {
    from = from | 0;
    to = to | 0;
    if (from > to) return new Error('not valid data');
    return from + Math.floor(Math.random() * (to - from + 1))
}
/**
 * shuffle：实质就是前面的数和后面的数交换，后面的数是随机下标获取的
 * @param {[*]} array 
 */
const shuffle = (array) => {
    for (const i in array) {
        let randomIdx = random(i, array.length - 1);
        let value = array[randomIdx];
        
        array[randomIdx] = array[i];
        array[i] = value;
    }
    return array;
}
// console.log('shuffle', shuffle([1,2,3,4,5]));

/**
 * 检查是否能吃牌
 * @param {[*]} userCards 
 * @param {*} target 
 * @param {Boolean} canWind 是否能吃字牌 default : false
 * 风牌可以任意3张牌吃牌【东南西北】，箭牌则3张一组。【中发白】
 */
const checkCalls = (userCards, target, canWind) => {
    if (userCard.My.length < 2) return false;
    if (!canWind && target >> 4 > 3) return false;
    let num = target & 0x0F;
    let type = target >> 4;
    if (!canWind) {
        let f1 = target - 1;
        let f2 = target - 2;
        let b1 = target + 1;
        let b2 = target + 2;
        if (userCards.My.includes(f1) && userCards.My.includes(f2)) return [f2, f1, target];
        if (userCards.My.includes(f1) && userCards.My.includes(b1)) return [f1, target, b1];
        if (userCards.My.includes(b1) && userCards.My.includes(b2)) return [target, b1, b2];
        return false;
    } else {
        if (target >> 4 === 4) { /**风牌 */
            let windCards = userCards.My.filter(c => {
                return ((c & 0x0F) <= 4) && ((c >> 4) === 4)
            }) /**字牌数量 */
            let swordCards = userCards.My.filter(c => {
                return ((c & 0x0F) > 4) && ((c >> 4) === 4);
            }); /**箭牌 */
            if (num <= 4 && _.uniq(windCards.filter(c => c != target)).length >= 2 ) return [target, _.uniq(windCards.filter(c => c != target))[0],  _.uniq(windCards.filter(c => c != target))[1]];
            if (num > 4 && _.uniq(swordCards.filter(c => c != target)).length >= 2) return [target, _.uniq(swordCards.filter(c => c != target))[0], _.uniq(swordCards.filter(c => c != target))[1]];
        }
        return false;
    }
}
let guipai = [];
let myCards = [0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x11, 0x11];
let isGui = c => guipai.includes(c);
let mycc = new CardCounter().setGuiFilter(isGui).add(myCards); /**设定鬼牌过滤器，添加手牌到std牌组中 */
let myccFilter = mycc.addFilter(0x47); /**应对特殊的xx牌变成yy牌 例如：白板当成鬼牌的基本牌*/
let mycc_noGui = new CardCounter().add(myCards); /**没有鬼牌的情况，把手牌添加到std牌组中 例如：推倒胡 */
// console.log('myccYS', mycc.hasJH());
// console.log('myccFilter', myccFilter.hasJH());
// console.log('mycc_noGui', mycc_noGui.hasJH());
successLog('huType', mycc.hasJH().huType);
errorLog('error');
warnLog('warning', 'ddd');
successLog('success', 1, 2);
holeLog('hole');
let bs = [1,2,3,4];

const lastOf = (array) => {
    return array[array.length - 1];
}
const setArray = (array) => {
    let item = [];
    for (const c of array) {
        if (!item) {
            item.push(c);
        } else {
            if (lastOf(item) === c) continue;
            item.push(c);
        }
    }
    return item;
}

const countCardsTimes =_.curry((userCards, times) => {
    let res = {};
    for (const c of userCards) {
        if (res[c]) {
            ++ res[c];
        } else {
            res[c] = 1;
        }
    }
    let timesArray = Object.values(res);
    return timesArray.some(t => {
        return t === times;
    });
});

// let ss = [1, 2, 3, 4, 5, 5, 5, 5];
// let hasGang = countCardsTimes(ss)(4);
// console.log('hasGang', hasGang);

const commonWithArray = (array) => {
    if (!array.length) return false;
    for (let i = 0; i < array.length; i ++) {
        if (array[i + 1] && array[i] !== array[i + 1]) {
            return false;
        }
    }
    return true;
};
let r = commonWithArray([1, 1, 2]);

/**
 * 检测target数组元素是否都在array里
 * @param {*} array 
 * @param {*} target 
 */
const includeArray = (array, target) => {
    if (target.length === 0 || array.length === 0) return false;
    return target.every(c => {
        return array.includes(c);
    })
};
/**
 * 是否能杠的情况
 * 1: 杠了之后不影响原来听牌的, 能杠
 * 2: 听牌之前手牌就有一副杠牌， 不能杠
 * 3: 手牌中有3张与要的牌一样， 如果手牌中的3张是一坎牌，能杠
 * 4: 要的牌是碰牌，能杠
 * @param {[*]} array 手牌 并且已经加入了要的牌 为lastCard 能胡的牌
 * @param {*} number 状态码
 */
const gangStatus = _.curry((statusCode, array) => { /**检查能杠的情况 */
    let lastCard = array.slice(-1);
    let jiang = new CardCounter().add(array).hasJH().jiang;
    if (countValues(array, lastCard) === 4) return false;
});

/**
 * ChangeFlower [补花]
 * checkMy : [检查手牌中花]
 * findAhead : [递归补花]
 * @param {[*]} typeRange 花牌范围
 * @param {[*]} publicCards 所有牌
 * @param {*} userCard
 * @param {*} point 限制条件
 */
class ChangeFlower {
    constructor (typeRange, publicCards, userCard, point) {
        this.range = typeRange || [6, 7];
        this.point = point;
        this.publicCards = publicCards;
        this.userCard = userCard;
        this.result = {
            huaPai: [],
            pai: []
        }
    }
    checkMy () {
        for (const c of this.userCard.My) {
            if (this.range.includes(c >> 4)) {
                this.findAhead();
            }
        }

        userCard.huaPai.concat(this.result.huaPai);
        userCard.My.push(this.result.pai);
    }
    findAhead () {
        let card = this.publicCards.shift();
        if (this.range.includes(card >> 4)) {
            if (point === undefined) {
                this.result.huaPai.push(card);
                return this.findAhead();
            } else {
                this.result.pai.push(card);
                return this;
            }
        }
        this.result.pai.push(card);
        return this;
    }
}

// let rs = new ChangeFlower([6, 7]);

/**
 * 检查碰杠
 * @default false
 * @param {[*]} myCards [已经将lastCard,添加到手牌,并标记为最后一张]
 * @param {[*]} pengCards [碰牌]
 */
const checkOption = _.curry((num, myCards, pengCards) => {
    if (myCards.length === 0) return false;
    let res = [];
    let tmp = {};
    for (const c of myCards) {
        if (tmp[c]) {
            ++tmp[c];
        } else {
            tmp[c] = 1;
        }
    }
    let lastCard = myCards.slice(-1).pop();
    if (num === 3) {
        if (tmp[lastCard] >= 3) res.push(lastCard);
    } else {
        if (pengCards.includes(lastCard)) res.push(lastCard);
        for (let i in tmp) {
            if (tmp[i] === 4) res.push(i | 0);
        }
    }
    return res;
});

const checkPeng = checkOption(3); /**碰 */
const checkGang = checkOption(4); /**杠 */

/**
 * 找出综合各方面计算出的最优先胡的玩家 主要是用于点炮和抢杠胡 /(自摸)没有什么意义
 * @param {*} huCheck [玩家的座位号对应的分数] => {seatid: score} 默认score == 0
 * @param {*} seatList [玩家座位号对应的uid] => {seatid: uid}
 */
class PriorHu {
    constructor (huCheck, seatList, lastBet) {
        this.huCheck = huCheck;
        this.seatList = seatList;
        

          //最后操作的人，抢杠胡是nowBet, 点炮是lastBet
        this.lastBet = lastBet;

        /**
         * 返回的所有胡牌人座位号
         */
        this.result = this.find();
       
    }
    /**玩家座位号组成的数组 */
    get seats () {
        return Reflect.ownKeys(this.seatList).map(Number);
    } 

    /**已胡的玩家 */
    get seat4Hu () {
        return this.seats.filter(s => this.huCheck[s] > 0);
    } 

    /**
     * @returns {seatid: huFen}
     */
    static getHuRes () {
        return this.huCheck;
    }

    find () {
        if (this.seat4Hu.length === 1) return this.seat4Hu;

        let seatList = this.refleSeat();
        let res = seatList.sort((a, b) => {
            let aDist = this.huCheck[a], bDist = this.huCheck[b];
            if (aDist > bDist) return -1;
            if (aDist === bDist && seatList.indexOf(a) < seatList.indexOf(b)) return -1;
            return 1;
        });
        return res;
    }

    refleSeat () {
        let newArray = [];
        let N = this.seat4Hu.length;
        for (let i = 0; i < N; ++i) {
            if (this.seat4Hu[i] >= this.lastBet) newArray.push(this.seat4Hu[i]);
        }
        for (let j = 0; j < N; ++j) {
            if (this.seat4Hu[j] < this.lastBet) newArray.push(this.seat4Hu[j]);
        }
        // for (const s of this.seat4Hu) {
        //     if (s >= this.lastBet) {
        //         newArray.push(s);
        //         this.seat4Hu = this.seat4Hu.filter(v => v !== s);
        //     }
        // }
        // newArray = [...newArray, ...this.seat4Hu];
        return this.uniq(newArray);
    }

    uniq (arr) {
        return Array.from(new Set(arr));
    }
};
// PriorHu.getHuRes = () => {
//     return 2;
// }

/**
 * [Array.indexOf(param1,param2)]
 * indexOf 方法两个参数，默认使用第一个参数，返回的数组中param1在数组中所在的位置，第二个参数，返回的是param1所在位置，如果param2的数值大小比param1真实的位置要小或相等，就返回真实的位置，否则返回-1
 */

 /**
  * 应对多种胡牌类型，确定其先后顺序，决定胡牌的顺序
  * @param {*} huTypeList 出现的所有胡牌类型，且已排好序
  * @param {*} huTypeItem  需要确定的顺序
  * @returns 
  * [1104, 8, 1103, 1024, 1] -> 8
  * 位置 ==>> 1
  */
 const huTypeRank = (huTypeList, huTypeItem) => {
    return huTypeList.indexOf(huTypeItem);
 };

 const ACTS = {
    'outCard':  1,
    'turnCard': 2,
    'pass':     3,
    'chi':      4,
    'peng':     5,
    'pao':      6,
    'hu':       7,
    'wei':      8,
    'ti':       9,
    'selfti':   10
};

 class HowToAutoNext {
    constructor (nowBet, cNext = {}, userCard) {
        //当前操作人
        this.nowBet = nowBet;
        //game.cNext
        this.cNext = _.isEmpty(cNext) ? {1: [], 2: [], 3: [], 4: []} : cNext;

        this.tmpAction = {};

        this.userCard = userCard; /**所有人手牌 */


        this.getNumber = card => card & 0x00F;

        this.res = this.next();
    }

    get seats () {
        return  Reflect.ownKeys(this.cNext).map(Number);
    }

    get smellyCard () {
        let res = {};
        for (let s of this.seats) {
            res[s].Chi = [];
            res[s].Peng = [];
        }
        return res;
    }

    refleArr (arr, nowBet) {
        let N = this.seats.length;
        let res = [];
        for (let i = 0; i < N; ++i) {
            if (this.seats[i] >= nowBet) res.push(this.seats[i]);
        }
        let index = this.seats.indexOf(nowBet);
        console.debug('index', index);
        
        // if (index === 0) return res;
        for (let j = 0; j < index; ++j) res.push(this.seats[j]);
        console.debug('res', res);
        
        return this.uniq(res);
        
    }

    uniq (arr) {
        if (!arr.length) return false;
        return Array.from(new Set(arr));
    }

    next () {
        for (let s in this.cNext) {
            if (!this.cNext[s].length) continue;
            this.cNext[s].sort((a, b) => { return a < b; });
            if (_.isEmpty(this.tmpAction)) {
                this.tmpAction[s] = this.cNext[s][0];
            } else {
                if (Object.values(this.tmpAction)[0] < this.cNext[s][0]) {
                    this.tmpAction = {};
                    this.tmpAction[s] = this.cNext[s][0];
                }
                if (Object.values(this.tmpAction)[0] === this.cNext[s][0]) {
                    let l = this.refleArr(this.seats, this.nowBet);
                    let t = Reflect.ownKeys(this.tmpAction).map(Number);
                    if (l.indexOf(t) > l.indexOf(Number(s))) {
                        this.tmpAction = {};
                        this.tmpAction[s] = this.cNext[s][0];
                    }
                }
            }
        }
        return this.tmpAction;
    }

    loop (array, bet) {
        if (!~array.indexOf(bet)) return new Error('no such a item in array');
        let n = array.indexOf(bet);
        for (let i in array) {
            if (i <= n) continue;
            if (n === array.length - 1) return array[0];
            return array[i];
        }
    }

    has (item, array) {
        item = Array.isArray(item) ? [...item] : [item];
        for (let i of item) {
            if (!array.includes(i)) return false;
        }
        return true;
    }

    hasTi (seatid) {
        let res = [];
        let L = this.pushZeros(this.userCard[seatid].My);
        for (let i in this.userCard[seatid].My) {
            if (!L[i]) {
                L[i] = 1;
            } else {
                ++L[i];
            }
        }
        L.find(c => {
            if (res.includes(this.userCard[seatid].My[c])) continue;
            if (c === 4) res.push(this.userCard[seatid].My[c]);
        });
        return res;
    };

    /**是否能吃（是否检查臭牌） 涉及到吃牌前的比牌*/
    hasChi (seatid, card, checkSmelly) {
        if (checkSmelly) {
            if (has(card, this.userCard[seatid].HisOut)) return false; //臭牌限制吃
            if (has(card, this.smellyCard[seatid].Chi)) return false; //吃的臭牌,不能吃
        }

        let cards = [];
        let ti = this.hasTi(seatid).length ? this.hasTi(seatid) : [];
        let myCard = this.userCard[seatid].My.slice();
        if (ti.length) {
            ti.forEach(c => {
                myCard = myCard.filter(v => v !== c);
            });
        };

        /**ABC 牌 */
        if (this.has([card - 2, card - 1], myCard)) cards.push([card - 2, card - 1, card]);
        if (this.has([card - 1, card + 1], myCard)) cards.push([card - 1, card, card + 1]);
        if (this.has([card + 1, card + 2], myCard)) cards.push([card, card + 1, card + 2]);

        /**二七十 牌*/
        let num = this.getNumber(card);
        if (num === 2 && this.has([card + 5, card + 8])) cards.push([card, card + 5, card + 8]);
        if (num === 7 && this.has([card - 5, card, card + 3])) cards.push([card - 5, card, card + 3]);
        if (num === 10 && this.has([card - 8, card - 3, card])) cards.push([card - 8, card - 3, card]);

        /**ABB 牌*/

        if (cards.length === 0) return false;

        return cards;
    }


    getNextBet () {
        let S = this.refleArr(this.seats, this.nowBet);
        return this.loop(S, this.nowBet);
    }


    calcCNext (act, lastCard) { /**计算当前操作之后的所有人的cNext */
        let nextbet = this.getNextBet();
        if (act === 1) { /**出牌 */
            for (let s of this.seats) {
                if (s === this.nowBet) continue;
                /**出牌之后，别人只能跑/碰/下家吃/下家出 */
                if (has(lastCard, this.userCard[s].Kan)) this.cNext[s].push(ACTS['pao']);
                if (has(lastCard, this.userCard[s].Wei)) this.cNext[s].push(ACTS['pao']);
                if (s === nextbet) {
                    this.cNext[s].push(ACTS['turnCard']);
                    if (this.hasChi(s, card, true)) this.cNext[s].push(ACTS['chi']);
                }
            }
        } else { /**进牌 -> 吃碰跑偎提 */

        }
    }

    /**将数组初始化为 0*/
    pushZeros (array) {
        let R = array.slice();
        for (let i in R) {
            if (R[i] === 0) continue;
            R[i] = 0;
        }
        return R;
    }
}
let cNext = {1: [], 2: [], 3: [2,9], 4: [9, 1]};
// let l = new HowToAutoNext(2, cNext).res;

{
    /**
     * [RXJS]
     * RxJs 能够将数组或对象转化为可观察的对象，再利用发布订阅，获取对象的值
     * Observable 就是一个典型的可观察对象
     * Subscribe 订阅的常用函数，一般一个对象只能订阅一次，使用Subject处理的可观察对象，可多次订阅
     * 将Node的回调都转变成Observable序列 通过订阅查找
     * 
     * 其文简-其意博-其理奥-其趣深
     * Reactive 响应式
     * Lodash for events
     * Observable 
     * Stream based
     * 
    */
    let ob = [];
    let timeStart = Date.now();
    for (let i = 0; i < 1000; ++i) {
        ob.push(i);
    }
    // Rx.from(ob, null, null, Rx.Scheduler.default).subscribe(
    //     function onMessage () {console.log('message on')},
    //     function onCompleted () {console.log('TotalTime: ' + (Date.now() - timeStart) + 'ms')}
    // );
    Rx.interval(1000).subscribe((v) => {
        console.log('v', v);
    })
    
    let readdir = Rx.bindNodeCallback(fs.readdir);
    let source = readdir(__dirname);
    
    // source.subscribe(
    //     function (res) {console.log('res', res)},
    //     function (error) {console.log('err', error)},
    //     function () {console.log('done')}
    // )
    // Rx.from(ob).subscribe({
    //     next: function (x) {console.log('x', x);},
    //     error : function (err) {console.log('error', err);},
    //     complete: function () {console.log('onCompleted', (Date.now() - timeStart) + 'ms');}
    //     }
    // )
    
}
class Rank_Match {
    constructor (users) {
        this.users = users;

        this.onMatchUsers = [];

    }
    get userLen () {
        return this.users.length;
    }
    get rank () {
        let res = [];
        for (let i = 0; i < this.userLen; ++i) {
            res.push(0);
        }
        return res;
    }

    calcRank () {
        /**赢家包括还在打比赛的玩家，和已经赢下比赛但是在等待的玩家 先赢下的玩家排名靠前，还在打比赛的玩家根据分数和进场时间排名
         * 赢家赢下比赛后，user.onTable会被清掉
         * 输家出局越早，排名越靠后
         * 输家的排名是固定的，所以只需要关心赢家的排名
        */
    //    let winUsers = [];
       let loseUsers = [];
       let loseLen = loseUsers.length;
       let N = this.rank.length - loseLen;
       let newRank = this.rank.slice(0, -loseLen);
       newRank.sort((a, b) => {
            let aUser = a, bUser = b;
            // if (aUser.onTable && b.onTable) {

            // } else {

            // }
       })
    }
}
let std = process.stdin.resume();
let out = process.stdout;
let argv = process.argv; //命令行参数,以数组的形式
// console.log('std', argv);
/**
 * 天胡，必须是庄家，且是起手就胡，就叫天胡
 * @template T
 * @param {T[*]} userCard 
 */
const isTianHu = (userCard) => {
    let my = userCard.My;
    let cards = [...userCard.Out, userCard.Chi, ...userCard.Peng, ...userCard.Gang];

    if (my.length !== 14 || cards.length !== 0) return false;
    let mycc = new CardCounter().add(my);
    if (!mycc.hasJH().huType) return false;
    return true;
    
}
/**
 * 听的牌对应胡牌类型
 * [牌]:[胡牌类型]
 * @default:[牌]:[]
 */
const ting = {
    // [card]: []
}
const checkTing4YA = (ttype, userCard, game, seatid) => {
    let myCards = userCard.My.sort((a, b) => a - b);
    myCards.forEach(c => {
        ting[c] = [];
    });
    for (let i of game.allCards) {
        let mycc = new CardCounter(myCards.slice().push(i))
        if ((mycc.hasCommonHu())) ting[i].push(mycc.hasCommonHu()[0]);
        if (mycc.hasJH().huType && mycc.hasQD().huType) ting[i].push(mycc.hasQD().huType);
    }
}


// new No().hasInstance();
// let a = [1,2];
let paohuzi = function (newOnMatchUsers) {
    let len = newOnMatchUsers.length;
    let roomUsers = [];
    if (len % 3 === 0) return _.chunk(newOnMatchUsers, 3);
    if ((len % 3) === 1 || (len % 3) === 2) {  //分两个2人桌
        
        let onMatchUsers = newOnMatchUsers.slice();
        let lastRoom1 = onMatchUsers.splice(-2);
        let lastRoom2 = [];
        if (len % 3 === 1 && onMatchUsers.length) {
            lastRoom2 = onMatchUsers.splice(-2);

        };
        roomUsers = [..._.chunk(onMatchUsers, 3), [...lastRoom1]];
        if (lastRoom2.length) roomUsers = [...roomUsers, [...lastRoom2]];
        
        console.debug('roomusers', roomUsers);
        return roomUsers;
    }
}
// paohuzi(a);

const splitNumber = (num) => {
    return num.toString().split('');
}

/**
 * 幸运数字，通过自身数位的相乘是否会 === 1
 * @param {[*]} number 
 */
const happyNumber = (number) => {
    let N = splitNumber(number).map(Number);
    let t = 0;
    // let res = N.reduce((p, c) => {
    //     return t += p * p + c * c;
    // });
    for (let i of N) {
        t += i * i;
    }
    if (t !== 1) return happyNumber(t);
    return t;
}
// happyNumber(19); //@returns 1: true

/**
 * charCode
 * 数字：49 - 57
 * +: 43
 * -: 45
 * *: 42
 * /: 47
 * %: 37
 * 空格：32
 * (): 40, 41
 * [] : 91, 93
 * 实现字符串的运算，并且考虑运算法则
 * 将字符串的引号去掉，并将计算结果得出
 * @param {*} string 
 */
const basicCalculator = (string) => {
    let r = splitNumber(string);
    r = r.filter(a => a.charCodeAt() !== 32); //去掉空格
    console.log('r', r);
    let t = '';
    let tmpNumber = [];
    let tmpCalc = [];
    let L = r.length;
    for (let i = 0; i < L; ++i) {
        if (r[i].charCodeAt() >= 49 && r[i].charCodeAt() <= 57) {
            t += r[i];
            if (i === L - 1) tmpNumber.push(t);
        } else {
            if (t.charCodeAt() <= 57 && t.charCodeAt() >= 49) tmpNumber.push(t);
            tmpCalc.push(r[i]);
            t = '';
            continue;
        }
    }
    tmpNumber = tmpNumber.map(Number);
    console.log('t : %j, c : %j', tmpNumber, tmpCalc);
    let head = tmpNumber[0];
    let N = tmpNumber.length;
    for (let j = 0; j < N; ++j) {
        if (tmpCalc[j].charCodeAt() === 40 || tmpCalc[j].charCodeAt() === 41) continue;
        if (j === 0) {
            continue;
        }
        head = actual(head, tmpNumber[j], tmpCalc[j]);
    }
    console.log('head', head);
    return head;
}

function actual (head, number, act) {
    let code = act.charCodeAt();
    switch(code) {
        case 43:
            return head + number | 0;
        break;
        case 45:
            return head - number | 0;
        break;
        case 42:
            return head * number | 0;
        break;
        case 47:
            return head / number | 0;
        break;
        default:    
            return 0;
        break;
    }
}
// basicCalculator('(12 + 1)'); //13

/**
 * 有关游戏平衡性的一些思考
 * 游戏AI的设计
 */
class Balance {
    constructor (userCard = {}) {
        this.userCard = userCard;

        this.getNumber = card => card & 0x00F;

        /**通过位操作，先左移x位，再与num做或操作 */
        this.getByte = (byte, num) => (byte << 4) | num;

    }

     /**将整数转为4个字节byte ==>> int => byte[] */
    getInt4Byte (mark) {
        let byte = [];
        let T = new Uint8Array(4);
        for (let i = 0; i < 4; ++i) {
            byte.push(mark >>> (24 - i * 8));
            // T.set(mark >>> (24 - i * 8));
            //24 是指byte中element的数量，这里是4位byte, 就是 (4 - 1) * 8 == 24 | 1byte == 8bit
            T[i] = mark >>> (24 - i * 8);
        }
        console.log('t', T);
        return byte;
    }

    //byte[] 转为一个int值
    getByte4Int (byte) {
        let T = 0xff; //4字节最大值，做与操作
        let tmp = 0;
        let res = 0;
        for (let i = 0; i < 4; ++i) {
            res <<= 8;
            tmp = byte[i] & T;
            res |= tmp;
        }
        return res;
    }

    /**计算每张牌出现的权重 */
    checkWeight () {
        let myCards = this.userCard.My;
    }
}
/*
 * 关于动态规划的最小路径的问题
 * 对于有边界问题的情况下
 * 需要先把边界问题处理
 * @params {[*]} triangle 
 * @returns 
 * @example 
 *  [2],
 *  [3, 4],
 *  [6, 5, 7],
 *  [4, 1, 8, 3]
 * ==>> 2 + 3 + 5 + 1
 */

const dpArray = (array) => {
    let res = [];
    for (let i = 0; i < array.length; ++i) {
        if (Array.isArray(array[i])) {
            dpArray(array[i]);
        } else {
            res.push(array[i]);
        }
    }
    return res;
};

/**重写lodash min 算法 递归 */
_.prototype.min = function (item) {
    if (Array.isArray(item)) {
        let res = [];
        for (let i = 0; i < item.length; ++i) {
            item = dpArray(item);
        }
    } else {
        item = [item];
    }
    return [...item];
};

// let triangle = [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]];

const dpTriangle = (triangle) => {
    if (!triangle.length) return 0;
    let dp = 0;
    for (let i = 0; i < triangle.length; ++i) {
        let row = [];
        let t = triangle[i];
        if (t.length === 1) {
            row.push(t);
            dp += t[0];
            continue;
        };
        dp += _.min(t);
    }
    return dp;
};

// console.log('min', dpTriangle(triangle));
{
    /**
     * 博弈树
     * 博弈树初始格局都是初始节点，
     * 主要应用与棋盘情况的穷举。
     * 最多的例子就是五子棋 AI自走棋等
     * 因这种博弈是两者相对而言，且互相以对方为基础进行设计，所以除了初始节点外（理论上初始节点有无数种子结果）子节点会越来越少。
     * 博弈树涉及到极大极小值搜索（找到博弈树的最优解）我方要在每一轮要作出极大值，且同时对方要选取出极小值（我方赢的概率才会越来越大）[MINMAX]
     * alpha, beta 剪枝
     * 剪枝的目的就是减少搜索的层级，因为根据极大极小搜索，当搜索到当前子节点的最优解后，同以父节点下的相邻兄弟节点必然不可能比当前的最优解更大，所以，可以直接排除搜索。
     */
}
