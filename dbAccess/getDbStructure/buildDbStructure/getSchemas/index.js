"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const getSchemaTables = require('./getSchemaTables');
const getSchemaViews = require('./getSchemaViews');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'getSchemas',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {
			client:							"getClient",
			schemas:						"getSchemas",
			schemasWithTables:	"getTables"

		},
		pipelineSteps:  {  // any number of functions
			"getClient":	(callInfo)=>{
				return fbkt().libs.dbAccess.client();
			},
			"getSchemas": (callInfo)=>{
				return callInfo.params.client
					.queryBuilder()
					.from('schemata')
					.select('*')
					.withSchema('information_schema')
					.then(function (schemas) {
						const schemaNames = fbkt().getConfigValue('schemas') || null;
						// fbkt().clog('schemaNames', schemaNames);
						// fbkt().clog('schemas', schemas);
						const retval = schemaNames ? R.filter(function (schema) {
							return schemaNames.indexOf(schema.schema_name) !== -1;
						}, schemas) : schemas;
// fbkt().clog('retval', retval); process.exit();
						return retval;
					});
			},
			"getTables":	(callInfo)=>{
				return Promise.map(
					callInfo.params.schemas,
					(schema)=>{
						return getSchemaTables({
							params:	schema
						})
							.then((schemaTables)=>{
								return R.merge(schema, { tables:	schemaTables })
						});
					}
				)
			},
			"getViews":	(callInfo)=>{
				return Promise.map(
					callInfo.params.schemasWithTables,
					(schema)=>{
						return getSchemaViews({
							params:	schema
						})
							.then((schemaViews)=>{
								return R.merge(schema, { views:	schemaViews })
							});
					}
				)
			}
		}
	}, callInfo || {});
};
