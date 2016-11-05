"use strict";
module.exports = {
	packageName:			'RestApi',
	libRelativePath:	function(){
		return __dirname;
	},
	fbktShortcuts:	{
	},
	customRestControllers:	[
	],
	serverExtensions:	[
		require('./serverExtensions'),
	],
};