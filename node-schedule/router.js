const url = require("url");

const packRes = function (res) {
    let end = res.end()
    res.end = function (data, encoding, cb) {
        if (data && !(data instanceof Buffer) && (typeof data !== 'function')) {
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            } else if (typeof data === 'number') {
                data = data.toString();
            }
        }
        end.call(res, data, encoding, cb);
    };
    res.send = function (data, type) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'text/' + (type || 'plain') + '; charset=UTF-8'
        });
        res.end(data);
    };
    res.sendImg = function (data, type, timeout) {
        res.writeHead(200, {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type' : 'image/' + (type || 'png'),
            'Content-Length' : Buffer.byteLength(data),
            'Cache-Control': 'max-age=' + (timeout || 518400)
        });
        res.end(data);
    };
    return res;
};

//路由规则
const route = function () {
    let _self = this;
    this._get = {};
    this._post = {};

    /**
     * 处理请求
     */
    function handle(req, res) {
        packRes(res);
        let urls = url.parse(req.url, true);
        let pathName = urls.pathname;
        if (!pathName.endsWith('/')) {
            pathName = pathName + '/';
        }
        let query = urls.query;
        let method = req.method.toLowerCase();

        if (_self['_' + method][pathName]) {
            if (method == 'post') {
                let postData = '';
                req.on('data', function (postDataChunk) {
                    postData += postDataChunk;
                });
                req.on('end', function () {
                    try {
                        postData = JSON.parse(postData);
                    } catch (e) {
                        
                    }
                    req.query = postData;
                    _self['_' + method][pathName](req, res)
                });
            } else {
                req.query = query;
                _self['_' + method][pathName](req, res);
            }
        } else {
            res.send(method + 'error url' + pathName);
        }
    };

    /**
     * get
     */
    handle.get = function (string, cb) {
        if (!string.startsWith('/')) {
            string = '/' + string;
        }
        _self._get[string] = cb;
    }

    /**
     * post
     */
    handle.post = function (string, cb) {
        if (!string.startsWith('/')) {
            string = '/' + string;
        }
        if (!string.endsWith('/')) {
            string = string + '/';
        }
        _self._post[string] = cb;
    }
    return handle;
};

module.exports = function () {
    return new route();
}

