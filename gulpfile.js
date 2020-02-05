const { src, task, dest, series } = require("gulp");
const Uglify = require("gulp-uglify");
const Concat = require("gulp-concat");

task("compress", () =>
  src("dist/**/*.js")
    .pipe(Uglify())
    .pipe(Concat("main.min.js"))
    .pipe(dest("publish"))
);
