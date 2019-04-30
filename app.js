const Koa = require("koa");
const app = new Koa();
const fs = require('fs');
const cors = require("koa-cors");
const server = require("koa-static");
const router = require('koa-router')();
const path = require('path');
const ws = require("nodejs-websocket");
const httpServer = require('http').Server(app.callback());  //监听app
const io = require('socket.io')(httpServer);  //webSocket io 并监听http
const ONLINE_USERS = {};
const ONLINE_COUNT = {};

module.exports.io = io;
global.app = app;
// const superagent = require("superagent");
// 对于任何请求，app将调用该异步函数处理请求：
  router.get('/',async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    // ctx.response.body = '<h1>Hello, koa2!</h1>';
    // 引入外部的模版文件
    ctx.response.body = fs.createReadStream('./publics/index.html');
    ws.onmessage = function(evt){
      console.log('recive messege',evt.data);
      ws.close();
    }

});

  // io.on('connection', function (socket) {
  //   console.log("a new user connected");
  //   socket.on('login', function (obj) {
  //     console.log("obj", obj);
  //   });
  // });

  router.get('/404',async (ctx,next) => {
    await next();
    ctx.response.type = 'text/html';

    ctx.response.body = '<h2>404</h2>';
  });
  router.get('/chatRoom', async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = fs.createReadStream('./publics/chatRoom/index.html');


  });
  router.get('/snake', async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = fs.createReadStream('./publics/snake/snake.html');
  })
// 路由配置
app.use(router.routes());
// 跨域处理
app.use(cors());
// 配置静态资源
app.use(server(path.join(__dirname,"/resource")));
// 在端口3000监听:
app.listen(4000);

console.log("-------", app);

console.log('app started at port 3000...');
