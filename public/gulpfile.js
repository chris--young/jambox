(function () {

  'use strict';

  var gulp = require('gulp'),
      sourcemaps = require('gulp-sourcemaps'),
      sass = require('gulp-sass'),
      browserify = require('browserify'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      notify = require('gulp-notify');

  gulp.task('bundle', function () {
    var b = browserify({
      entries: './app.js',
      debug: true
    });

    b.bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('.'))
      .pipe(notify({
        message: '<%= file.relative %> bundled',
        title: 'Browserify'
      }));
  });

  gulp.task('sass', function () {
    gulp.src('app.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('.'))
      .pipe(notify({
        message: '<%= file.relative %> compiled',
        title: 'Sass'
      }));
  });

  gulp.task('watch', function () {
    gulp.watch('/**/*.js', ['bundle']);
    gulp.watch('/**/*.scss', ['sass']);
  });

  gulp.task('default', ['bundle', 'sass']);

})();
