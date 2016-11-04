var _ = require('lodash');
var sequence = require('when/sequence');
var fbkt = require('fbkt');

module.exports = function(){
	//console.log('BUILD DB', options);
	var libDbSetsAreLoaded = [];

	_.forOwn(fbkt(), function(lib, libName){
		if (typeof lib.loadBuildDbData === 'function'){
			console.log('LOADING DATA FOR LIB:', libName);
			libDbSetsAreLoaded.push(lib.loadBuildDbData);
		}
	});
	
	return sequence(libDbSetsAreLoaded);
};
