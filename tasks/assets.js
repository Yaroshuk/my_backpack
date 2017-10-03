const gulp = require('gulp');
const imagemin = require('gulp-imagemin');


module.exports = function(opt) {
	return function(callback) {
		return gulp.src([opt.src, opt.ignore],{since: gulp.lastRun('assets')}) //пересобирать файлы которые изменились с последнего запуска
			//.pipe(newer('public')) //если такой файл уже есть, то его не обрабатывать.
			.pipe(imagemin())
			.pipe(gulp.dest(opt.public));
	}
};