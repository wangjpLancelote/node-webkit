'use strict';
require("should");

const _ = require("lodash");

const assert = require("assert");

describe("lodashtest", function () {
    it("testLast", function () {
        let arr = [1,2,3];
        let last = _.last(arr);
        console.log("last", last);
        // console.log("pop", arr.pop());
        arr.splice(0, 1, 1);
        console.log(arr);
        // console.log(arr.slice(0, -1));
        let newArr = arr.find(card => card != 2);
        console.log("newArr", newArr);
        
    });

    it('curry', function () {
        let add = function (x) {                                       
            return function (y) {
                return x + y;
            };
        };
        let ot = function () {
            return function (x) {
                return x;
            };
        };
        // let curryed = _.curry(add, 5);
        let curryed = _.curry(ot, 1);
        // curryed(5);
        console.log("curryed", curryed);
    });
    it("return this ", function () {
        class card {
            constructor() {
                this.arr = [0, 0, 0, 0];
            }
            add (card) {
                for (let c of card) {
                    let pointer = c & 0x0F;
                    console.log('po', pointer);
                    if (pointer < 10) ++this.arr[pointer - 1];
                }
                console.log("this111", this);
                return this;
            }
        }
        let cardT = new card();
        let ca = [0x11, 0x12, 0x13, 0x14];
        let res = cardT.add(ca);
        console.log("this", res);
        // cardT.add(ca);
    });
    it("class", function () {
        class myClass {
            constructor () {
                this.author = "";
                this.date = '';
                this.counter = [0,0,0,0,0];
                this.isAct = false;
            }
            init (name, time) {
                this.author = name;
                this.date = time;
                return this;
            }
            setCounter (card) {
                test: for (let c in card) {
                    if (this.hasSame(card)) return;
                    this.counter[c - 1] = card[c];
                }
            }
            chooseAct () {
                if (this.hasFalse(this.counter)) return this.isAct = false;
                this.isAct = true;
            }
            hasSame (arr) {
                let cnt = {};
                for (let i in arr) {
                    cnt[i] ? cnt[i]++ : 1;
                    if (cnt[i] > 1) return;
                }
            }
            hasFalse (arr) {
                for (let i in arr) {
                    if (arr[i] === 0) return false;
                }
                return true;
            }
            threeOrFour (arr) {
                let rest = {
                    3 : {
                        cards : [],
                        count : 0
                    },
                    4 : {
                        cards : [],
                        count : 0
                    }
                };
                let cnt = {};
                for (let i in arr) {
                    console.log("cnt", arr[i]);
                    cnt[arr[i]] ? cnt[arr[i]] ++ : cnt[arr[i]] = 1;
                }
                for (let i in cnt) {
                    console.log("cc", cnt[i]);
                    console.log(rest[3]);
                    cnt[i] == 3 ? rest[3].cards.push(i | 0) : rest[3].cards = [];
                    cnt[i] == 4 ? rest[4].cards.push(i) : rest[4].cards = [];
                    rest[3].count = rest[3].cards.length;
                    rest[4].count = rest[4].cards.length;
                    return rest;
                }
            }
        }

        let myc = new myClass();
        myc.init("wangjp", "2018-10-11"); //init myClass
        console.log("myc", myc);
        // myc.hasSame()
        let arr = [1,1,1,2,2,3,4,5];
        let rest = myc.threeOrFour(arr);
        console.log("rest", rest);
    });
});

