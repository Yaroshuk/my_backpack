
const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const combine = require('stream-combiner2').obj;

/*const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber'); //обработка ошибки*/

module.exports = function(options) {

	return function(callback) {
		return gulp.src(options.src)//{base: 'frontend'} 
				.pipe($.plumber({errorHandler: $.notify.onError(function(err) {
					return {
						title: 'SCSS',
						message: err.message
					};
				})}))
				.pipe($.if(options.isDevelopment, $.sourcemaps.init()))
				.pipe($.sass({
					includePaths: require('node-bourbon').includePaths
				}))
				.pipe($.autoprefixer())
				/*.on('error', function(err) {
					console.log(err.message);
					this.end();
				})*/
				/*.on('error', notify.onError(function(err) {
					return {
						title: 'Styles',
						message: err.message
					};
				}))*/
				//.pipe(remember('styles'))
				.pipe($.if(options.isDevelopment, $.sourcemaps.write()))
				.pipe($.if(!options.isDevelopment, combine($.cssnano(), $.rev())))
				.pipe(gulp.dest(options.public))
				.pipe($.if(!options.isDevelopment, combine($.rev.manifest('css.json'), gulp.dest('manifest'))));
	};
};