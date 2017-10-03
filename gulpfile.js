'use script'

const gulp = require('gulp');
//const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const newer = require('gulp-newer');
const autoprefixer = require('gulp-autoprefixer');
const remember = require('gulp-remember');
const path = require('path');
const concat = require('gulp-concat');
const cached = require('gulp-cached');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber'); //обработка ошибки
const revReplace = require('gulp-rev-replace');
//combiner&&multipipe - тоже обработка ошибок
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const named = require('vinyl-named');
const uglify = require('gulp-uglify');
const gulplog = require('gulplog');
const AssetsPlugin = require('assets-webpack-plugin');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const spritesmith = require('gulp.spritesmith');

//gulp-rev -- hash
//gulp-cssnano
//gulp-rev-replace

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

global.isDevelopment = isDevelopment;

var paths = { //пути к файлам

	src: { //пути к исходным файлам
		pug: 'src/pug/*.pug',
		html2: 'app/**/*.html',
		js: 'src/js/*.js',
		scss: 'src/scss/style.scss',
		assets: 'src/assets/**/*.*', 
		fonts: 'src/fonts/**/*.*',
		libs: 'src/libs/**/*.*',
		sprites: 'src/assets/sprites/*.*'
	},

	public: {
		pug: 'public/',
		js: 'public/js/',
		scss: 'public/css/',
		assets: 'public/assets/',
		fonts: 'public/fonts',
		libs: 'public/libs',
		spritesImg: 'src/assets',
		spritesCss: 'src/scss/modules'
	},	

    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        pug: 'src/pug/**/*.pug',
        //js: 'src/js/**/*.js',
        scss: 'src/scss/**/*.scss',
        assets: 'src/assets/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },

    clean: 'public'
};

function lazyRequireTask(taskName, path, options) {
	options = options || {};
	options.taskName = taskName;
	options.isDevelopment = isDevelopment;
	gulp.task(taskName, function(callback) {
		let task = require(path).call(this, options);

		return task(callback);
	});
}

lazyRequireTask('scss', './tasks/scss', {
	src: paths.src.scss,
	public: paths.public.scss
});

lazyRequireTask('pug', './tasks/pug', {
	src: paths.src.pug,
	public: paths.public.pug
});

lazyRequireTask('webpack', './tasks/webpack', {
	src: paths.src.js,
	public: paths.public.js
});

lazyRequireTask('clean', './tasks/clean', {
	src: paths.clean,
});

lazyRequireTask('assets', './tasks/assets', {
	src: paths.src.assets,
	ignore: '!' + paths.src.sprites,
	public: paths.public.assets
});

lazyRequireTask('fonts', './tasks/fonts', {
	src: paths.src.fonts,
	public: paths.public.fonts
});

lazyRequireTask('libs', './tasks/libs', {
	src: paths.src.libs,
	public: paths.public.libs
});

lazyRequireTask('sprites', './tasks/sprites', {
	src: paths.src.sprites,
	public: {
		img: paths.public.spritesImg,
		css: paths.public.spritesCss
	}
});

gulp.task('serve', function() {
	browserSync.init({
		server: 'public'
	});

	browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('build', gulp.series('clean', gulp.parallel('scss', 'webpack', 'assets', 'fonts', 'libs'), 'pug'));

gulp.task('watch', function() {

	gulp.watch(paths.watch.scss, gulp.series('scss'));

	gulp.watch(paths.watch.pug, gulp.series('pug'));

	gulp.watch(paths.watch.assets, gulp.series('assets'));

	gulp.watch(paths.watch.fonts, gulp.series('fonts'));

	//gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
