const gulp = require('gulp');

module.exports = function(opt) {
	return function(callback) {
		return gulp.src(opt.src, {since: gulp.lastRun('libs')}) //пересобирать файлы которые изменились с последнего запуска
			.pipe(gulp.dest(opt.public));
	}

};