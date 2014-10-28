var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

var livereload = require('gulp-livereload');

var paths = {
  externals: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/fastdom/index.js',
    'bower_components/cropper/src/cropper.js',
    'bower_components/eventEmitter/EventEmitter.js',
    'bower_components/eventie/eventie.js',
    'bower_components/imagesloaded/imagesloaded.js',
    'bower_components/getviewport/src/getviewport.js',
  ],
  scripts: [
    'src/bettercropper.js',
  ],
  css: [
    'bower_components/cropper/src/cropper.css',
    'stylesheets/*'
  ],
  images : [
    // 'images/*',
    // 'images/index/*',
  ]
};

gulp.task('css', function() {
  return gulp.src(paths.css)
    .pipe(concat('build.css'))
    //.pipe(minifyCSS({noRebase:true,noAdvanced:false,}))
    .pipe(gulp.dest('dist/'))
    .pipe(livereload());
});

gulp.task('externals', function() {
  return gulp.src(paths.externals)
    .pipe(concat('_externals.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(concat('_scripts.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(['images/**'], ['images']);
  gulp.watch(['src/**']).on('change', livereload.changed);
  gulp.watch([paths.css], ['css']);
});

gulp.task('default', ['externals', 'scripts', 'css', 'watch']);
