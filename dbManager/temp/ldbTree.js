var fbkt = require('fbkt');

module.exports = function(callInfo){
	console.log('==========LOAD DB TREE==========');

	if (fbkt().libs.dbAccess) {
		var rebuild = callInfo ? callInfo.rebuild === true : false;
		return fbkt().libs.dbAccess.dbTree({
			params: {
				rebuild:     rebuild
			}
		});
	}
};
