var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

var ContentCache = require("../index");
var spy = require("through2-spy");
var File = require("vinyl"); 

describe("GulpContentCache", function() {
  beforeEach(function() {
    this.compiler = sinon.spy();
    this.end = sinon.spy();

    this.cache = new ContentCache();
    this.stream = spy.obj(function() {});
    this.stream
      .pipe(this.cache.content(spy.obj(this.compiler)))
      .pipe(spy.obj(this.end));

    this.file = new File({
      cwd: "/",
      base: "/test/",
      path: "/test/file.coffee",
      contents: new Buffer("testing")
    });
  });

  describe("empty cache", function() {
    beforeEach(function() {
      this.stream.write(this.file);
    });
    it("calls the compiler", function() {
      expect(this.compiler).to.have.been.calledOnce;
    });
    it("pipes it past the compiler", function() {
      expect(this.end).to.have.been.calledOnce;
    });
  });
  
  describe("populated cache", function() {
    beforeEach(function() {
      cacheStream = this.cache.content(spy.obj(function() {}));
      cacheStream.write(this.file.clone());
      this.stream.write(this.file.clone());
    });
    it("skips calling the compiler", function() {
      expect(this.compiler).not.to.have.been.calledOnce;
    });
    it("pipes it past the compiler", function() {
      expect(this.end).to.have.been.calledOnce;
    });
  });

  describe("populated cache", function() {
    beforeEach(function() {
      cacheStream = this.cache.content(spy.obj(function() {}));
      cacheStream.write(this.file);
      var file = this.file.clone();
      file.contents = new Buffer("invalid cache");
      this.stream.write(file);
    });
    it("calls the compiler", function() {
      expect(this.compiler).to.have.been.calledOnce;
    });
    it("pipes it past the compiler", function() {
      expect(this.end).to.have.been.calledOnce;
    });
  });
});
