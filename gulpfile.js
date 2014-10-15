var gulp           = require('gulp');
var browserify     = require('browserify');
var source         = require('vinyl-source-stream');
var buffer         = require('vinyl-buffer');
var jshint         = require('gulp-jshint');
var uglify         = require('gulp-uglify');
var stylus         = require('gulp-stylus');
var nib            = require('nib');
var minifyCss      = require('gulp-minify-css');
var sourcemaps     = require('gulp-sourcemaps');
var rename         = require('gulp-rename');
var flatten        = require('gulp-flatten');
var concat         = require('gulp-concat');
var gulpFilter     = require('gulp-filter');
var imageMin       = require('gulp-imagemin');
var del            = require('del');
var mainBowerFiles = require('main-bower-files');
var watchify       = require('watchify');
var mocha          = require('gulp-mocha');
var preprocess     = require('gulp-preprocess');

var production = (process.env.NODE_ENV === 'production');

// Clean dist Files
gulp.task('clean', function(cb) {
  del(['./public/dist/js/*',
       './public/dist/css/*',
       './public/dist/fonts/*',
       './public/dist/images/*'], cb);
});

// Clean CSS map 
gulp.task('clean:cssMap', function(cb) {
  del(['./public/dist/css/*.map'], cb);
});

// Lint Javascripts
gulp.task('lint', function() {
  gulp.src('./public/javascripts/**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Bundle Javascripts.  Watchify on client app.js.
gulp.task('build:app', ['lint'], function() {
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    entries: ['./public/javascripts/app.js'],
    debug: !production
  });

  var bundler = watchify(b, watchify.args);

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/dist/js'));
  }
  return rebundle();
});

// Process Stylus and Minify
gulp.task('stylus', ['clean:cssMap'], function() {
  return gulp.src('./public/stylesheets/stylus/main.styl')
    .pipe(stylus({
      use: [nib()],
      sourcemap: {
        inline: true,
        sourceRoot: '.',
        basePath: './public/dist/css'
      }
    }))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifyCss())
    .pipe(sourcemaps.write('./', {
      includeContent: false,
      sourceRoot: '.'
    }))
    .pipe(gulp.dest('./public/dist/css'));
});

// Build Bower JS
gulp.task('vendor:js', function() {
  var jsFilter = gulpFilter('*.js');

  return gulp.src(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/dist/js'))
    .pipe(jsFilter.restore());
});

// Build Bower CSS & Fonts
gulp.task('vendor:css', function() {
  var cssFilter = gulpFilter('*.css');
  var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*tff']);

  return gulp.src(mainBowerFiles())
    .pipe(cssFilter)
    .pipe(concat('vendor.css'))
    .pipe(minifyCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/dist/css'))
    .pipe(cssFilter.restore())
    // Get Bower Fonts
    .pipe(fontFilter)
    .pipe(flatten())
    .pipe(gulp.dest('./public/dist/fonts'));
});

// Compress Images
gulp.task('images', function() {
  return gulp.src('./public/images/*')
    .pipe(imageMin({
      optimizationLevel: 5 // png support
    }))
    .pipe(gulp.dest('./public/dist/images'));
});

// Rerun tasks on file change
gulp.task('watch', function() {
  gulp.watch('./public/stylesheets/stylus/main.styl', ['stylus']);
  gulp.watch('./public/images/*', ['images']);
  gulp.watch('./public/bower_components/**/*', ['build:vendor']);
});

// Mocha tests
gulp.task('test', function() {
  return gulp.src('./app/test/**/*.js')
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('build:vendor', ['vendor:js', 'vendor:css']);
gulp.task('dist', ['clean', 'stylus', 'build:app', 'build:vendor']);
gulp.task('default', ['watch', 'dist']); 

















