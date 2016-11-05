var _ = require('lodash');
var when = require('when');
var fbkt = require('fbkt');

module.exports = function (callInfo) {
	var self = this instanceof module.exports ? this : new module.exports(callInfo);
	self.callInfo = _.clone(callInfo);

	self.go = function () {
			return when(self.callInfo.params);
	};
	
	return self.go;
};