var ws = require('nodejs-websocket');

console.log("开始建立链接。。");
var server = ws.createServer(function(conn){
  conn.on("text",function(ctx){
    console.log('接受到到信息为：',JSON.parse(ctx).name);
    conn.sendText("success");
    conn.send(conn.headers.host);
    conn.send(ctx);
    console.log('header',conn.headers);
    // console.log('socket',conn.socket);
    console.log('path',conn.path);
    console.log('server',server);
  })
}).listen(4000);
// ws.onclose(function(){
//   console.log("关闭链接。。");
// })
