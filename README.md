# gulp-content-cache

## Usage

```js
var GulpContentCache = require("gulp-content-cache")
var cache = new GulpContentCache();

gulp.task("compile", function() {
  return gulp.src("**/*.coffee")
    .pipe(cache.content(coffee()))
    .pipe(concat("web.js"))
    .pipe(src.dest("js"));
});
```