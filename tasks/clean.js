const del = require('del');

module.exports = function(opt) {
	return function(callback) {
		return del(opt.src);
	}
};