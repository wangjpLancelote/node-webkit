'use strict'
/**
 * 一个用于格式化时间日期的工具
 * 实例化 DateFormat 调用 format方法
 * @params {string} pattern 匹配格式
 * @params {Date} date 待转换的日期
 * @returns
 * Y/M/D h:m:s ==>> 2019/05/06 ...
 */

 class DateFormat {
     constructor (pattern = 'Y/M/D h:m:s', date = new Date()) {
         this.pattern = null;

         this.res = this.format(pattern, date);
     }

     isLowerCase (word) {
        return word.charCodeAt(0) > 96 && word.charCodeAt(0) < 133;
     }

     isUpperCase (word) {
        return word.charCodeAt(0) > 64 && word.charCodeAt(0) < 91;
     }

     changeNumber (num) {
        return Number(num) < 10 ? '0' + num : Number(num); 
     }

     format (pattern, date) {
         //匹配格式
        this.pattern = pattern;

        let timer = '';
        /**时分秒 */
        let a = [
            this.changeNumber(date.getHours()),
            this.changeNumber(date.getUTCMinutes()),
            this.changeNumber(date.getUTCSeconds())
        ];
        /**年月日 */
        let b = [
            date.getUTCFullYear(),
            this.changeNumber(date.getUTCMonth() + 1),
            this.changeNumber(date.getUTCDate())
        ];

        let partArray = pattern.trim().split(/\s+/ig);
        partArray.forEach((ele, index) => {
            let res1 = this.handleFormat(ele, index, this.isLowerCase, a, timer);
            let res2 = this.handleFormat(ele, index, this.isUpperCase, b, timer);
            timer += (res1 ? res1 : '');
            timer += (res2 ? res2 : '');
            // console.log('tim', timer);
            // console.log('res1/res2', res1, res2);
            // if (/[^~a-zA-Z0-9]/ig.test(ele[0])) {
            //     timer += 
            // }
        });
        // console.log('tim', this.uniq(timer.split(' ')).join(' '));
        return this.uniq(timer.split(' ')).join(' ');
     }

     uniq (array) {
        return Array.from(new Set(array));
     }

     /**
      * 匹配规则的具体函数
      */
     handleFormat (ele, index, func, array, timer) {
        if (func(ele.indexOf('~') > -1 ? ele.slice(1) : ele)) {
            let b = '~' === ele.slice(0, 1) ? array.reverse() : array;
            let c = ele.match(/[^~a-zA-Z0-9]/ig) ? ele.match(/[^~a-zA-Z0-9]/ig) : '';

            for (let i = 0; i < c.length + 1; ++i) {
                timer += b[i] + (c[i] ? c[i] : '');
            }

            // for (let i = 0; i < c.length; ++i) {
            //     try {
            //         timer += b[i] + (c[i] ? c[i] : '');
            //     } catch (err) {
            //         throw new Error('You should user Separator like (Y/M/D h:m:s)', err);
            //     }
            // }
            timer += ' ';
            return timer;
        }
     }
 }

//  let r = new DateFormat();
//  let t = r.format('Y/M/D h:m:s', new Date());
//  console.log('t', t);

// module.exports = DateFormat;
module.exports.DateFormat = (pattern, date) => new DateFormat(pattern, date);