var fs = require("fs");
var data = "";
global.data = data;

var readerStream = fs.createReadStream('output.txt');
readerStream.setEncoding('UTF-8');
readerStream.on('data',function(chunk){
  data += chunk;
});
readerStream.on('end',function(){
  console.log("文件内容：",data);
});
readerStream.on('error',function(err){
  console.log(err.stack);
});

console.log('文件读取完毕');
