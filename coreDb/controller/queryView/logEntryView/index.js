module.exports = {
	dbTreePath:	'fbkt_core_db.view.log_entry_view',
	gridColumns :                         {
		default: [
			'id', 'source', 'log_category', 'log_level', 'log_timestamp', 'message'
			//'attributes_json', 'log_category_id', 'log_level_id'
		]
	},
	enabledDataViews:		[ 'grid' ] //, 'map'
};