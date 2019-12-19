const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const uglifycss = require('gulp-uglifycss');

const JS_SRC_DIR = 'src/js/';
const JS_OUTPUT_DIR = 'public/js/';
const JS_OUTPUT_FILE = 'app';

gulp.task('js', function () {
  return gulp.src([
      JS_SRC_DIR + 'helpers.js',
      JS_SRC_DIR + 'compat.js',
      JS_SRC_DIR + 'sort.js',
      JS_SRC_DIR + 'components/*.js',
      JS_SRC_DIR + 'app.js',
  ])
  .pipe(concat(JS_OUTPUT_FILE + '.js'))
  .pipe(rename(JS_OUTPUT_FILE + '.min.js'))
  .pipe(uglify()).on('error', (e) => console.log(e))
  .pipe(gulp.dest(JS_OUTPUT_DIR));
});

const CSS_SRC_DIR = 'src/css/';
const CSS_OUTPUT_DIR = 'public/css/';
const CSS_OUTPUT_FILE = 'app';

gulp.task('css', function () {
  return gulp.src([
      CSS_SRC_DIR + 'app.css',
      CSS_SRC_DIR + 'search.css',
      CSS_SRC_DIR + 'radical_selection.css',
      CSS_SRC_DIR + 'about.css',
  ])
  .pipe(concat(CSS_OUTPUT_FILE + '.css'))
  .pipe(rename(CSS_OUTPUT_FILE + '.min.css'))
  .pipe(uglifycss())
  .pipe(gulp.dest(CSS_OUTPUT_DIR));
});
