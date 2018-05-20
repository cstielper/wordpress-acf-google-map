const gulp = require('gulp'),
  gulpif = require('gulp-if'),
  plumber = require('gulp-plumber'),
  rollup = require('gulp-better-rollup'),
  babel = require('rollup-plugin-babel'),
  eslint = require('rollup-plugin-eslint'),
  resolve = require('rollup-plugin-node-resolve'),
  commonjs = require('rollup-plugin-commonjs'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  argv = require('yargs').argv;

/**************/

gulp.task('js', () => {
  gulp
    .src('./src/wp-acf-map.class.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      rollup(
        {
          plugins: [
            resolve({
              jsnext: true,
              main: true,
              browser: true
            }),
            commonjs(),
            eslint(),
            babel({
              exclude: 'node_modules/**'
            }),
            //uglify()
          ]
        },
        {
          format: 'es'
        }
      )
    )
    .pipe(gulpif(argv.production, uglify()))
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest('./dist'))
    .pipe(notify({ message: 'TASK: "js" completed', onLast: true }));
});

/**************/

gulp.task('build', () => {
  gulp.start('js');
});

gulp.task('watch', () => {
  gulp.watch('./src/js/**/*.js', ['js']);
});

gulp.task('default', ['watch']);

/**************/