const cheerio = require('cheerio');
const superagent = require('superagent');
const https = require('https');
var baseurl = 'https://meican.com/preorder/api/v2.1/recommendations/dishes?tabUniqueId=67b9fded-8992-4170-aa20-329684970dd3&targetTime=2018-07-05+17:00';
// superagent.get(baseurl).end(function(err,res){
//   if(err){
//     console.log(err);
//   }
//   var $ = cheerio.load(res.text);
//   var dishName = [];
//   $("ul li").each(function(idx,element){
//     var $ele = $(element);
//     console.log('ele',$ele);
//     dishName.push({
//       name:$ele.find('.k830dcw3hnfrFruRRJShf-style-dishTitle').text()
//     })
//   });
//   // console.log(dishName);
// })
https.get(baseurl,function(res){
  var html = '';
  res.on('data',function(data){
    html += data;
    console.log('html:',html);
  });
  res.on('end',function(){
    // var title = filterTitle(html);
    // printLog(title);
  })
}).on('error',function(){
  console.error('err');
});
function filterTitle(html){
  var $ = cheerio.load(html);
  var lis = $('ul._2eGiLxKIGdB63_g9I7nvTN-style-dishList li');
  var dishName = [];
  console.log(lis);
}
