import gulp from "gulp";
import cleanCSS from "gulp-clean-css";
import terser from "gulp-terser";
import gulpIf from "gulp-if";

const isProduction = process.env.NODE_ENV === "production";

export function styles() {
  return gulp
    .src("code/css/**/*.css")
    .pipe(gulpIf(isProduction, cleanCSS()))
    .pipe(gulp.dest("docs/css"));
}

export function scripts() {
  return gulp
    .src("code/app/**/*.js")
    .pipe(gulpIf(isProduction, terser()))
    .pipe(gulp.dest("docs/app"));
}

export default gulp.parallel(styles, scripts);
