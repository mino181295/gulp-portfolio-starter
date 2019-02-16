// Load plugins
const gulp = require("gulp");
const sass = require("gulp-sass");
const cssclean = require("gulp-clean-css");

const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");

const header = require("gulp-header");
const plumber = require("gulp-plumber");
const browsersync = require("browser-sync").create();

const licenseheader = require('./licenseheader')

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function (callback) {

  gulp.src([
    './node_modules/bootstrap/dist/**/*',
    '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
    '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
  ]).pipe(gulp.dest('./vendor/bootstrap'))

  // Font Awesome
  gulp.src(['./node_modules/@fortawesome/**/*'])
    .pipe(gulp.dest('./vendor'))

  // jQuery
  gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ]).pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  gulp.src([
    './node_modules/jquery.easing/*.js'
  ]).pipe(gulp.dest('./vendor/jquery-easing'))

  // Simple Line Icons
  gulp.src([
    './node_modules/simple-line-icons/fonts/**',
  ]).pipe(gulp.dest('./vendor/simple-line-icons/fonts'))

  gulp.src([
    './node_modules/simple-line-icons/css/**',
  ]).pipe(gulp.dest('./vendor/simple-line-icons/css'))

  callback();
});

gulp.task("css", function () {
  return gulp.src("./scss/*.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(licenseheader))
    .pipe(gulp.dest("./css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cssclean())
    .pipe(gulp.dest("./css"))
    .pipe(browsersync.stream());
});

gulp.task("javascript", function () {
  return gulp.src([
    './js/*.js',
    '!./js/*.min.js',
    '!./js/contact_me.js',
    '!./js/jqBootstrapValidation.js'
  ])
    .pipe(uglify())
    .pipe(header(licenseheader))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./js'))
    .pipe(browsersync.stream());
});

gulp.task("browsersync", function (callback) {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  });

  callback();
});


gulp.task("reload", function (callback) {
  browsersync.reload();

  callback();
});

gulp.task("watch", function (callback) {
  gulp.watch("./**/*.html", gulp.series('reload'));

  gulp.watch("./scss/**/*", gulp.series('css'));
  gulp.watch(["./js/**/*.js", "!./js/*.min.js"], gulp.series('javascript'));

  callback();
});


gulp.task("default", gulp.parallel('vendor', 'css', 'javascript'));
gulp.task("dev", gulp.parallel('watch', 'browsersync'));
