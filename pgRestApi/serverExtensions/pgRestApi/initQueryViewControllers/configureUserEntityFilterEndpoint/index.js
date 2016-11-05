var _ = require('lodash');
var when = require('when');
var pipeline = require('when/pipeline');
var fbkt = require('fbkt');
var dottie = require('dottie');

module.exports = function (callInfo) {
	var self = this instanceof module.exports ? this : new module.exports(callInfo);
	self.callInfo = _.clone(callInfo);

	self.go = function () {
		return pipeline([
			self.configureEndpoint
		])
			.catch(function (error) {
				return fbkt().error({
					source:   __filename,
					error:  	error,
					callInfo: self.callInfo
				})
					.then(function(fbktError){
						throw fbktError;
					});
			});
	};
	
	self.configureEndpoint = function(){
		
		var packageName = self.callInfo.packageName;
		var entityName = self.callInfo.queryEntity.entityName;
		var handler = new require('./userEntityFilterEndpointHandler')(self.callInfo);

		return fbkt().restApiSupport.configureEndpoint.configureGetAllEndpoint({
			url:	'/'+packageName+'/User'+entityName+'Filter',
			auth:			'token',
			handler:	handler
		})();
	};

	return self.go;
};