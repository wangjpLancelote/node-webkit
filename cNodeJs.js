const requestA = require('request');

/**利用request实现一个能够返回对应数据的sdk */
class CNodeJS {
    constructor (options = {}) {
        this.options = options;
        this.options.token = options.token || null;
        this.options.url = options.url || 'https://cnodejs.org/api/v1/';
    }

    baseParams (params = {}) {
        params = {...params};
        if (this.options.token) {
            params.accessToken = this.options.token;
        }
        return params;
    }

    request (method, path, params, callback) {
        return new Promise((_resolve, _reject) => {
            /**这里将resolve和reject定义为方法就是为了实现callback的方式 ,这样在调用了request方法后就能使用promise 和callback获取到响应内容*/
            const resolve = ret => {
                _resolve(ret);
                callback && callback(null, ret);
            }
            const reject = err => {
                _reject(err);
                callback && callback(null, err);
            }
            let opts = {
                method: method.toUpperCase(),
                url: this.options.url + path,
                json: true /**自动解析返回的结果 */
            }

            if (opts.method == 'GET' || opts.method == 'HEAD') {
                opts.qs = this.baseParams(params);
            } else {
                opts.body = this.baseParams(params);
            }

            requestA(opts, (err, res, body) => {
                if (err) return reject(err);
                if (body.success) {
                    resolve(res)
                } else {
                    reject(new Error(body.error_msg));
                }
            })
        })
    }

    /**为每一个API封装一个单独的方法 */
    getTopics (params, callback) {
        return this.request('GET', 'topics', params, callback).then((res) => {
            Promise.resolve(res.data);
        })
    }
}

module.exports = CNodeJS;