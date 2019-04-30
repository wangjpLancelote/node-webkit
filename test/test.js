var should = require("should");
var assert = require("assert");
var name = "wwwjp";
describe("name",function(){
  it("the name should be wwwjp",function(){
    name.should.equal("wwwjp");
  });
});

var Person = function(name){
  this.name = name;
};

var wwwjp = new Person(name);
describe("InstanceOf",function(){
  it("wwwp should be an Instance Of Person",function(){
    wwwjp.should.be.an.instanceOf (Person);
  });
});

describe("array",function(){
  describe("indexof",function(){
    it("should be return -1 when the value not present",function(){
      should.equal(-1,[1,2,3].indexOf(5));
    });
  })
});
