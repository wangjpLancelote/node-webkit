var fs = require("fs");
require("./witerStream");
var data = '这是一个写入的流文件';

var writerStream = fs.createWriteStream("output.txt");

writerStream.write(data,'UTF-8');
writerStream.end();
writerStream.on("finish",function(){
  console.log('success');
  console.log(data);
});
writerStream.on('error',function(err){
  console.log(err.stack);
});
console.log("程序执行完毕");
