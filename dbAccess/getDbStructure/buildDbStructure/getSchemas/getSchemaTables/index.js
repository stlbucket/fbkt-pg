"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const getTableColumns = require('./getTableColumns');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'getSchemaTables',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {
			"schemaTables":	"getSchemaTables"
		},
		pipelineSteps: {  // any number of functions
			"getSchemaTables": function (callInfo) {
				return fbkt().libs.dbAccess.client()
					.queryBuilder()
					.from('tables')
					.select('*')
					.where('table_type', '=', 'BASE TABLE')
					.where('table_schema', '=', callInfo.params.schema_name)
					.withSchema('information_schema')
					.then(function (tables) {
						return tables;
					});
			},
			"getTableColumns":	(callInfo)=>{
				return Promise.map(
					callInfo.params.schemaTables,
					(table)=>{
						return getTableColumns({
							params:	table
						})
							.then((tableColumns)=>{
								return R.merge(table, { columns:	tableColumns })
							});
					}
				)
			}
		}
	}, callInfo || {});
};
