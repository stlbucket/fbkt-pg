
var _ = require('lodash');

module.exports = {
	componentType: 'BASE',
	schemaName:			'fbkt_core_db',
	tableName:			'log_entry',
	components:	[
		{
			componentType: 'DEPENDENCY'
			, schemaName:  'fbkt_core_db'
			, tableName:   'log_category'
			, fkField:     'log_category_id'
		},
		{
			componentType: 'DEPENDENCY'
			, schemaName:  'fbkt_core_db'
			, tableName:   'log_level'
			, fkField:     'log_level_id'
		}
	]
};