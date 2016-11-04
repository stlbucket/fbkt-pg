var when = require('when');
var fbkt = require('fbkt');

module.exports = {
	url:      '/FbktCoreDb/ReturnTestValue',
	restEndpoints: {
		getOne: {
			disabled: false,
			auth:     'token',
			handler:  function (options) {
				return when(true)
					.then(function(){
						return options.params.id;
						// console.log('THROWING ERROR');
						// return new Error('This is a thrown test error from the controller: '+options.params.id);
					});
			}
		}
	}
};