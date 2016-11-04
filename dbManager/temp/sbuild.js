const fbkt = require('fbkt');


return fbkt().libs.dbManager.buildDb()
	.then(function(){
		return loadDbTree({
			rebuild:		true
		});
	});
