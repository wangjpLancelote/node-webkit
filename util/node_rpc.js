'user strict';

const net = require('net');


const log = {
    e : function () {
        const args = new Array(arguments.length);
        for (let ai = 0, al = arguments.length; ai < al; ++ai) {
            args[ai] = arguments[ai];
        }
        console.log('args : %j', args);
    }
};

const descrCmd = '_D';
const resultCmd = '_R';
const errorCmd = '_E';

class Light_RPC {
    constructor (wrapper = {}, logger = {}) {

        this.descrCmd = '_D';
        this.resultCmd = '_R';
        this.errorCmd = '_E';

        this.wrapper = wrapper;
        this.logger = logger;

        this.log = log;
        this.description = {};
        this.callbacks = {};

        for (let i in this.wrapper) {this.description[i] = {}};

        this.descrStr = this.command(this.descrCmd, this.description);
        
        this.connection = null;

        this.connectionCallback = null;

        this.server = null;

        this.bufferBytes = undefined;

        this.getLength = true;

        this.length = -1;

        this.lineCode = '\n'.charCodeAt(0);

    }

            /**
     * rpc 连接的关键函数
     */
    connect (port, host, callBack) {
        if (!callBack) {
            callBack = host;
            host = 'localhost';
        }
        const connection = net.createConnection(port, host);
        connection.setKeepAlive(true); //长连接
        connection.on('connect', () => {
            connection.write(this.command(this.descrCmd));
        })
        this.connectionCallback = callBack;
        this.connection = connection;

        let lengthObj = {
            bufferBytes : undefined,
            getLength: true,
            length : -1
        };
        console.debug('c', this.connectionCallback);
       /**onData */
        connection.on('data', this.getOnDataFn(this.commandCallBack, lengthObj));
        connection.on('data', () => {
            console.log('e', this.connectionCallback);
        })
        /**onError */
        connection.on('error', (err) => {
            log.e('CONNECTION_DAWN_ERROR', err);
        });
        connection.on('timeout', () => {
            log.e('RPC tiemout');
        });
        connection.on('end', () => {
            log.e('RPC si end');
        });
    }

    idGenerator (a) {
        return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, this.idGenerator);
    }

    command (name, data) {
        const cmd = {
            command: name,
            data: data
        }
        const cmdStr = JSON.stringify(cmd);
        return Buffer.byteLength(cmdStr) + '\n' + cmdStr;
    }

    /**获取被调用函数的server */
    getServer () {
        const server = net.createServer((c) => {
            const commandCallback = (cmd) => {
                if (cmd.command === this.descrCmd) {
                    c.write(this.descrStr);
                }
                else if (!self.wrapper[cmd.command]) {
                    c.write(this.command('error', {code: 'UNKNOWN_COMMAND'}));
                }
                else {
                    let args = cmd.data.args;
                    args.push(this.getSendCallFunction(c, cmd.data.id));

                    try {
                        this.wrapper[cmd.command].apply({}, args);
                    } catch (err) {
                        log.e(err);
                        let resultCommand = this.command(this.errorCmd, {id: cmd.data.id, err: err});
                        c.write(resultCommand);
                    }
                }
            }

            let lengthObj = {
                bufferBytes: undefined,
                getLength: true,
                length : -1
            }
            c.on('data', this.getOnDataFn(this.commandCallBack, lengthObj));
            c.on('error', (exception) => log.e(exception));

        });
        this.server = server;
        return server;
    }

    /**监听端口 */
    listen (port) {
        this.getServer();
        this.server.listen(port);
    }

    /**关闭连接 */
    close () {
        this.server.close();
    }


    /**调用方法后的响应内容 */
    commandCallBack (cmd) {
        console.log('cmd', cmd);
        if (cmd.command === this.resultCmd) {
            if (this.callbacks[cmd.data.id]) {
                this.callbacks[cmd.data.id].apply(this, cmd.data.args);
                delete this.callbacks[cmd.data.id];
            }
        } else if (cmd.command === this.descrCmd) {
            let remoteObj = {};
            for (let p in cmd.data) {
                remoteObj[p] = this.getRemoteCallFunction(p, this.callBacks, this.connection);
            }
            this.connectionCallback(remoteObj, this.connection);
        } else if (cmd.command === this.errorCmd) {
            if (this.callbacks[cmd.data.id]) {
                this.callbacks[cmd.data.id].apply(this, cmd.data.args);
                delete this.callbacks[cmd.data.id];
            }
        }
    }

    getRemoteCallFunction (cmdNames, callbacks, connection) {
        let vm = this;
        return function () {
            let id = vm.idGenerator();
            if (typeof arguments[arguments.length - 1] === 'function') {
                callbacks[id] = arguments[arguments.length - 1];
            }
            let args = [];
            for (let ai = 0, al = arguments.length; ai < al; ++ai) {
                if (typeof arguments[ai] !== 'function') {
                    args.push(arguments[ai]);
                }
            }
            let newCmd  = vm.command(cmdNames, {id: id, args: args});
            connection.write(newCmd);
        }
    }

    /**请求响应之后发送的消息回调 */
    getSendCallFunction (connection, cmdId) {
        return function () {
            let innerArgs = [];
            for (let i = 0 , al = arguments.length; ai < al; ++ai) {
                if (typeof arguments[ai] !== 'function') innerArgs.push(arguments[ai]);
            }
            let resultCommand = this.command(this.resultCmd, {id: cmdId, args: innerArgs});
            connection.write(resultCommand);
        };
    }

    /**数据处理回调 */
    getOnDataFn (commandCallBack, lengthObj) {
        let vm = this;
        return function (data) {
            if (lengthObj.bufferBytes && lengthObj.bufferBytes.length > 0) {
                let tmpBuff = new Buffer(lengthObj.bufferBytes.length + data.length);
                lengthObj.bufferBytes.copy(tmpBuff, 0);
                data.copy(tmpBuff, lengthObj.bufferBytes.length);
                lengthObj.bufferBytes = tmpBuff;
            }
            else {
                lengthObj.bufferBytes = data;
            }
            vm.bufferBytes = lengthObj.bufferBytes;
            vm.getLength = lengthObj.getLength;
            vm.length = lengthObj.length;
            let commands = vm.getCommand.call(vm);
            console.log('commands', commands);
            // let N = commandCallBack.call(this);
            // commands.forEach(commandCallBack);
            commands.forEach((cmd) => {
                console.log('cm', cmd);
                vm.commandCallBack(cmd);
            })
        };
    }
    /**获取cmd */
    getCommand () {
        const commands = [];
        let i = -1;
        let vm = this;
        const parseCommands = function () {
            if (this.getLength === true) {
                i = vm.getNewLineIndex(this.bufferBytes);
                if (i > -1) {
                    this.length = Number(this.bufferBytes.slice(0, i).toString());
                    this.getLength = false;
                    this.bufferBytes = vm.clearBuffer(this.bufferBytes, i + 1);
                }
            }

            if (this.bufferBytes && this.bufferBytes.length >= this.length) {
                let cmd = this.bufferBytes.slice(0, this.length).toString();
                this.getLength = true;
                try {
                    var parseCmd = JSON.parse(cmd);
                } catch (e) {
                    log.e('ERROR PARSE');
                    log.e(cmd);
                    log.e(this.length, this.bufferBytes.toString());
                    return;
                }
                commands.push(parseCmd);
                this.bufferBytes = vm.clearBuffer(this.bufferBytes, this.length);
                if (this.bufferBytes && this.bufferBytes.length) {
                    parseCommands.call(this);
                }
            }
        }
        parseCommands.call(this);
        return commands;
    }

    getNewLineIndex (buffer) {
        if (buffer) {
            for (let i = 0; i < buffer.length; ++i) {
                if (buffer[i] === this.lineCode) return i;
            }
        }
        return -1;
    }

    /**清除buffer */
    clearBuffer (buffer, length) {
        if (buffer.length > length) {
            return buffer.slice(length);
        }
        return undefined;
    }


    // /**静态方法 */
    // static connect () {
    //     return new Light_RPC().connect.call(this, arguments);
    //     // new Light_RPC().connect()
    // }

}

module.exports = Light_RPC;