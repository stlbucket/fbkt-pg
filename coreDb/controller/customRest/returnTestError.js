var when = require('when');
var fbkt = require('fbkt');

module.exports = {
	url:      '/FbktCoreDb/ReturnTestError',
	restEndpoints: {
		getOne: {
			disabled: false,
			auth:     'token',
			handler:  function (options) {
				return when(true)
					.then(function(){
						return new Error('This is a returned error: '+options.params.id);
					});
			}
		}
	}
};