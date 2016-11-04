var when = require('when');
var fbkt = require('fbkt');

module.exports = {
	url:      '/FbktCoreDb/ThrowTestError',
	restEndpoints: {
		getOne: {
			disabled: false,
			auth:     'token',
			handler:  function (options) {
				return when(true)
					.then(function(){
						return fbkt().dbTree.indit();
						// console.log('THROWING ERROR');
						// return new Error('This is a thrown test error from the controller: '+options.params.id);
					});
			}
		}
	}
};