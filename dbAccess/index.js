module.exports = {
	packageName:			'DbAccess',
	libRelativePath:	function(){
		return __dirname;
	},
	client:			require('./client.js'),
	query:			require('./query.js'),
	getDbStructure:	require('./getDbStructure'),
	getEntityDbStructure:	require('./getEntityDbStructure'),
	dbTree:	require('./getDbTree'),
	entityManager:	require('./entityManager'),
	fbktShortcuts:	require('./fbktShortcuts'),
	serverExtensions:	require('./serverExtensions')
};
