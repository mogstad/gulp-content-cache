var through = require("through2");
function GulpContentCache() {
  this._cache = {};
}

GulpContentCache.prototype.content = function(stream) {
  return through.obj(function(file, encoding, callback) {
    var cachedFile = this._cachedFile(file);
    if (cachedFile) {
      return callback(null, cachedFile);
    } else {
      var clonedFile = file.clone();
      stream.once("data", function(data) {
        this._cacheFile(clonedFile, data);
        callback(null, data);
      }.bind(this));
      stream.write(file)
    }
  }.bind(this));
};

GulpContentCache.prototype._cacheFile = function(raw, file) {
  this._cache[raw.path] = {
    contents: raw.contents.toString("utf8"),
    file: file.clone()
  };
};

GulpContentCache.prototype._cachedFile = function(file) {
  var cache = this._cache[file.path];
  if (cache && cache.contents === file.contents.toString("utf8")) {
    return cache.file.clone();
  }
};

module.exports = GulpContentCache;