require("should");

var assert = require("assert");
describe("not equal",function(){
  it("thesr two lis is equal",function(){
    // typeof("string").should.be(string);
    // should.throw(typeof("string"));
  should.equal(-1,[2,3,4].indexOf(5));
});
it("eql",function(){
  [1,2,3].should.eql([1,2,3]);
});
it("args",function(){
  var args = (function(){
    return arguments
  })(1,2,3);
  args.should.be.arguments;
  [].should.not.be.arguments;
});
it("string",function(){
  ''.should.be.a.String;
});
it("containDeep",function(){
  [[1],[2],[3]].should.containDeep([[1]]);
});
it ("delete", function () {
  let game = {};
  let id = 1;
  if (!game[id]) game[id] = true;
  console.log("game", game);
  function deleteGame (id) {
    if (game[id]) {
      delete game[id];
    } else {
      return "no this game";
    }
  }
  deleteGame(id);
  console.log("w", game);
});
})
