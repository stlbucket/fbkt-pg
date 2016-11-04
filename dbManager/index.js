module.exports = {
	packageName:			'DbManager',
	libRelativePath:	function(){
		return __dirname;
	},
	wipeDb:			require('./wipeDb'),
	buildDb:		require('./buildDb'),
	serverCommandMap:	require('./serverCommandMap')
};
