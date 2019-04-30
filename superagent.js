const superagent = require("superagent");
const cheerio = require("cheerio");
const asyuc = require("async");
const url = require("url");
var nodeUrl = "https://cnodejs.org/";

superagent.get(nodeUrl).end(function(res,err){
  if(err) {return};
  let topicList = [];
  var $ = cheerio.load(res.text);
  // console.log($);
  $("#topic_lsit .topic_list").each(function(idx,el){
    if(idx<40){
      var $el = $(el);
      var href = url.resolve(nodeUrl,$el.attr("href"));
      topicList.push(href);

    }
  })
  //并发计数器
  var currentCount = 0;
  var fetch = function(url,cb){
    console.log("耗时");
    currentCount++;
    superagent.get(url).end(function(res,err){
      console.log("并发数：",currentCount--,"fetch",url);
      cb(null,[url,res.text]);
    })
  }
  async.mapLimit(topicList,11,function(topic,callback){
    fetch(topic,callback);
    console.timeEnd("耗时");
  },function(err,result){
    result = result.map(function(pair){
      var $ = cheerio.load(load[1]);
      return ({
        title: $('.topic_full_title').text().trim(),
        href: pair[0],
        comment1: $('.reply_content').eq(0).text().trim(),
        author1: $('.reply_author').eq(0).text().trim() || "评论不存在",
      })
    })
    console.log("final:",result);
  })
})
