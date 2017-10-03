const gulp = require('gulp');

module.exports = function(opt) {

	return function(callback) {
		return gulp.src(opt.src, {since: gulp.lastRun('fonts')}) //пересобирать файлы которые изменились с последнего запуска
				//.pipe(newer('public')) //если такой файл уже есть, то его не обрабатывать.
			.pipe(gulp.dest(opt.public));
	}

};