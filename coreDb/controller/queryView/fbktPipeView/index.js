module.exports = {
	dbTreePath:	'fbkt_core_db.view.fbkt_pipe_view',
	gridColumns :                         {
		default: [
			'id', 'uid', 'name', 'status'
		]
	},
	enabledDataViews:		[ 'grid' ], //, 'map',
	compositeUrl:	'/fbktCoreDb/fbktPipeComposite'
};
