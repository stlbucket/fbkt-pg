var when = require('when');
var _ = require('lodash');
var fbkt = require('fbkt');

module.exports = function () {
	var self = this instanceof module.exports ? this : new module.exports();

	self.go = function () {
		var deezConfigs = {};

		_.forOwn(fbkt(), function(lib, libName){
			if (_.isObject(lib.fbktQueryControllers)){
				if (!lib.packageName){ throw new Error('CANNOT CONFIGURE QUERY CONTROLLERS FOR LIB WITH NO PACKAGE NAME: '+libName); }
				deezConfigs[lib.packageName] = lib.fbktQueryControllers;
			}
		});
		
		return when(deezConfigs);
	};

	return self.go;
};