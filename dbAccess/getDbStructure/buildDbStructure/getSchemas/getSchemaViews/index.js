"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const getViewColumns = require('./getViewColumns');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'getSchemaViews',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {
			"schemaViews":	"getSchemaViews"
		},
		pipelineSteps: {  // any number of functions
			"getSchemaViews": function (callInfo) {
				return fbkt().libs.dbAccess.client()
					.queryBuilder()
					.from('tables')
					.select('*')
					.where('table_type', '=', 'VIEW')
					.where('table_schema', '=', callInfo.params.schema_name)
					.withSchema('information_schema')
					.then(function (tables) {
						return tables;
					});
			},
			"getViewColumns":	(callInfo)=>{
				return Promise.map(
					callInfo.params.schemaViews,
					(view)=>{
						return getViewColumns({
							params:	view
						})
							.then((viewColumns)=>{
								return R.merge(view, { columns:	viewColumns })
							});
					}
				)
			}
		}
	}, callInfo || {});
};