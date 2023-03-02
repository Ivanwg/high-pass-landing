const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const webp = require('gulp-webp');
const sass = require('gulp-sass')(require('sass'));
// const svgmin = require('gulp-svgmin');
// const cheerio = require('gulp-cheerio');
// const replace = require('gulp-replace');

const clean = () => {
  return del(['dist'])
}

const resourcesJS = () => {
  return src('src/resources/**/*.js')
    .pipe(dest('dist/js'))
}

const resourcesCSS = () => {
  return src('src/resources/**/*.css')
    .pipe(dest('dist/css'))
}

const fonts = () => {
  return src([
    'src/fonts/**/*.woff',
    'src/fonts/**/*.woff2'
  ])
    .pipe(dest('dist/fonts'))
}

const styles = () => {
  return src('src/css/**/style.scss')
    .pipe(gulpif(!argv.prod, sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulpif(argv.prod, cleanCSS({
      level: 2
    })))
    .pipe(gulpif(!argv.prod, sourcemaps.write()))
    .pipe(dest('dist/css'))
    .pipe(gulpif(!argv.prod, browserSync.stream()))
};

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(gulpif(argv.prod, htmlMin({
      collapseWhitespace: true,
    })))
    .pipe(dest('dist'))
    .pipe(gulpif(!argv.prod, browserSync.stream()))
}

const svgSprites = () => {
  return src('src/img/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dist/img'))
}

const scripts = () => {
  return src(
    'src/js/main.js'
    )
    .pipe(gulpif(!argv.prod, sourcemaps.init()))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(gulpif(argv.prod, uglify({
      toplevel: true
    }).on('error', notify.onError())))
    .pipe(gulpif(!argv.prod, sourcemaps.write()))
    .pipe(dest('dist/js'))
    .pipe(gulpif(!argv.prod, browserSync.stream()))

}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

const img = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.jpeg',
    'src/img/**/*.png',
  ])
    .pipe(image())
    .pipe(dest('dist/img'))
}

const imgWebp = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.jpeg',
    'src/img/**/*.png'
  ])
    .pipe(webp({
      quality: 100
    }))
    .pipe(dest('dist/img'))
}

// const svgSpriteBuild = function () {
// 	return src('src/img/**/*.svg')
// 		// minify svg
// 		.pipe(svgmin({
// 			js2svg: {
// 				pretty: true
// 			}
// 		}))
// 		// remove all fill and style declarations in out shapes
// 		.pipe(cheerio({
// 			run: function ($) {
// 				$('[fill]').removeAttr('fill');
// 				$('[style]').removeAttr('style');
// 			},
// 			parserOptions: { xmlMode: true }
// 		}))
// 		// cheerio plugin create unnecessary string '>', so replace it.
// 		.pipe(replace('&gt;', '>'))
// 		// build svg sprite
// 		.pipe(svgSprite({
// 				mode: "symbols",
// 				preview: false,
// 				selector: "icon-%f",
// 				svg: {
// 					symbols: 'sprite.svg'
// 				}
// 			}
// 		))
// 		.pipe(dest('dist/img'));
// };

watch('src/**/*.html', htmlMinify);
watch('src/css/**/*.scss', styles);
watch('src/img/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resources/**/*.js', resourcesJS);

exports.styles = styles
exports.scripts = scripts
exports.htmlMinify = htmlMinify
exports.svgSprites = svgSprites
exports.clean = clean
exports.webp = imgWebp


exports.default = series(clean, resourcesJS, resourcesCSS, scripts, fonts, styles, img, imgWebp, htmlMinify, watchFiles)
exports.prod = series(clean, resourcesJS, resourcesCSS, scripts, fonts, styles, img, imgWebp, htmlMinify)
