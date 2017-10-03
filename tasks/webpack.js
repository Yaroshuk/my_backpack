
const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const combine = require('stream-combiner2').obj;
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const named = require('vinyl-named');
const uglify = require('gulp-uglify');
const gulplog = require('gulplog');
const AssetsPlugin = require('assets-webpack-plugin');
const path = require('path');

module.exports = function(opt) {
	return function(callback) {

	let firstBuildReady = false;

	function done(err, stats) {
		firstBuildReady = true;

		if(err) {
			return;
		} 

		gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
			colors: true
		}));

	}


	let options = {
		output: {
			publicPath: '/js/',
			filename: opt.isDevelopment ? '[name].js' : '[name]-[chunkhash:10].js'
		},
		watch: opt.isDevelopment,
		devtool: opt.isDevelopment ? 'cheap-module-inline-source-map' : 'null',
		module: {
			loaders: [{
				test: /\.js$/,
				include: path.join(__dirname, '../src/'),
				loader: 'babel-loader?presets[]=es2015'
			}]
		},
		plugins: [
			new webpack.NoErrorsPlugin()
		]
	};

	if (!opt.isDevelopment) {
		options.plugins.push(new AssetsPlugin({
			filename: 'webpack.json',
			path: path.join(__dirname, '../manifest/'),
			processOutput(assets) {
				for (let key in assets) {
					assets[key + '.js'] = assets[key].js.slice(options.output.publicPath.length);
					delete assets[key];
				}
				return JSON.stringify(assets);
			}
		}));
	}

	return gulp.src(opt.src)
		.pipe($.plumber({
			errorHandler: $.notify.onError(function(err) {
				return {
					title: 'WEBPACK',
					message: err.message
				}
			})
		}))
		.pipe(named())
		.pipe(webpackStream(options, null, done))
		.pipe($.if(!opt.isDevelopment, uglify()))
		.pipe(gulp.dest(opt.public))
		.on('data', function() {
			if (firstBuildReady) {
				callback();
			}
		});

	}
}