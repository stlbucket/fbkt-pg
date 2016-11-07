"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'getTableColumns',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {  // any number of functions
			"getTableColumns":	(callInfo)=>{
				return fbkt().libs.dbAccess.client()
					.queryBuilder()
					.from('columns')
					.select('*')
					.where('table_schema', '=', callInfo.params.table_schema)
					.where('table_name', '=', callInfo.params.table_name)
					.withSchema('information_schema');
			}
		}
	}, callInfo || {});
};
