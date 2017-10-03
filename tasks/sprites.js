const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const spritesmith = require('gulp.spritesmith');

module.exports = function(opt) {

	return function(callback) {
		var spriteData = gulp.src(opt.src).pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: '_sprites.scss'
		}));

		var imgStream = spriteData.img
	    // DEV: We must buffer our stream into a Buffer for `imagemin` 
			.pipe(gulp.dest(opt.public.img));

		var cssStream = spriteData.css
			.pipe(gulp.dest(opt.public.css));

		return merge(imgStream, cssStream);		
	};

};