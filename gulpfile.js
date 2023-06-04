const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');




function styles(){
  return src('app/scss/style.scss')
  .pipe(autoprefixer({ overrideBrowsersList: ['last 10 version']}))
  .pipe(concat('style.min.css'))
  .pipe(scss({ outputStyle: 'compressed' }))
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())
}

function images(){
  return src(['app/images/src/*.*', '!app/images/src/*.svg'])
  .pipe(newer('app/images'))
  .pipe(avif({ quality : 50 }))

  .pipe(src('app/images/src/*.*'))
  .pipe(newer('app/images'))
  .pipe(webp())

  .pipe(src('app/images/src/*.*'))
  .pipe(newer('app/images'))
  .pipe(imagemin())

  .pipe(dest('app/images'))
}

function fonts(){
  return src('app/fonts/src/*.*')
    .pipe(fonter({
      formats: ['woff', 'ttf']
    }))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'))
}

function pages(){
  return src('app/pages/*.html')
    .pipe(include({
      includePaths: 'app/components'
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream())
}

function scripts(){
  return src('app/js/main.js')
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function watching(){
  watch(['app/*.html']).on('change', browserSync.reload);
  watch(['app/images/src'], images)
  watch(['app/scss/style.scss'], styles)
  watch(['app/components/*', 'app/pages/*'], pages)
  watch(['app/js/main.js'], scripts)

}

function browsersync(){
  browserSync.init({
    server:{
      baseDir: 'app/'
    }
  });
}

function cleanDist(){
  return src('dist')
  .pipe(clean())
}

function building(){
  return src([
    'app/css/style.min.css',
    'app/**/*.html',
    'app/images/*.*',
    'app/fonts/*.*',
    'app/js/main.min.js',
  ], {base: 'app'})
  .pipe(dest('dist'))
}




exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.pages = pages;
exports.scripts = scripts;

exports.browsersync = browsersync;
exports.watching = watching;
exports.building = building;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, scripts, pages, browsersync, watching);