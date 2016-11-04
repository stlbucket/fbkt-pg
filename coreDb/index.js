module.exports = {
	packageName:	'FbktCoreDb',
	libRelativePath:	function(){
		return __dirname;
	},
	theFbktiestScriptOfAll: `${__dirname}/db/sqlScripts/lockedDoNotEdit/tables/fbkt_core_db_1_0_0.sql`,
	fbktShortcuts:	require('./fbktShortcuts'),
	dbScripts:	[
	],
	dbPatches:	[
		`${__dirname}/db/sqlScripts/unlocked/views/log_entry_view.sql`,
		`${__dirname}/db/sqlScripts/unlocked/views/log_entry_category_source_view.sql`,
		`${__dirname}/db/sqlScripts/unlocked/views/fbkt_pipe_view.sql`,
	],
	composites:	[
		require('./composite/fbktPipe'),
		require('./composite/logEntry')
	],
	queryViewControllers:	[
		require('./controller/queryView/logEntryView'),
		require('./controller/queryView/fbktPipeView')
	],	
	customRestControllers:	[
		// require('./controller/customRest/throwTestError'),
		// require('./controller/customRest/returnTestError'),
		// require('./controller/customRest/returnTestValue'),
	]
};