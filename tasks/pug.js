
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
const fs = require('fs');
const path = require('path');

function getJsonData(dir) {
  const obj = {};
  const errors = [];

  fs.readdirSync(dir).forEach((filename) => {
    const basename = path.basename(filename, '.json');
    const filepath = path.join(dir, filename);

    try {
      const data = fs.readFileSync(filepath);
      obj[basename] = JSON.parse(data);
    } catch (err) {
      errors.push(filename);
    }
  });

  return errors.join(', ') || obj;
}

module.exports = function(options) {

	return function(callback) {

	let jsonDataCache = null;

	if (!jsonDataCache) {
		jsonDataCache = getJsonData('src/pug/data');
	}
	return gulp.src(options.src)//{base: 'frontend'} 
			.pipe($.plumber({errorHandler: $.notify.onError(function(err) {
				return {
					title: 'PUG',
					message: err.message
				};
			})}))
			.pipe($.pugInheritance({basedir: 'src/pug'}))
			.pipe($.pug({
				pretty: true,
				data: jsonDataCache
			}))
			.pipe($.if(!options.isDevelopment, $.revReplace({
				manifest: gulp.src('manifest/css.json', {allowEmpty: true})
			})))
			.pipe($.if(!options.isDevelopment, $.revReplace({
				manifest: gulp.src('manifest/webpack.json', {allowEmpty: true})
			})))
			.pipe(gulp.dest(options.public));
	};
};