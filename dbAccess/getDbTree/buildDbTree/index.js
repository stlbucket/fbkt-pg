"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const buildSchemaTree = require('./buildSchemaTree');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildDbTree',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {
			"dbTree":		"buildDbTree"
		},
		pipelineSteps: {
			"buildDbTree": function (callInfo) {

				return Promise.reduce(
					callInfo.params.dbStructure,
					(dbTree, schema)=>{
						return buildSchemaTree({ params:	{ schema:	schema }})
							.then((schemaTree)=>{
								return R.merge(dbTree, {
									[schema.schema_name]:	schemaTree
								})
							});
					},
					{}
				);


				// const dbTree = R.reduce((currentTree, schema)=>{
				// 	return R.merge(currentTree, {
				// 		[schema.schema_name]:	{
				// 			table:			R.reduce((schemaTableManagers, table)=>{
				// 				return R.merge(schemaTableManagers, {
				// 					[table.table_name]:	Promise.resolve(entityManager(table))
				// 				});
				// 			}, {}, schema.tables),
				// 			view:				{},
				// 			composite:	{},
				// 		}
				//	
				// 	});
				// }, {}, callInfo.params.dbStructure);


				// var _dbTree = {};
				
				// _.forEach(dbStructure, function (schema) {
				// 	//console.log('SCHEMA', schema);
				// 	_dbTree[schema.schema_name] = {
				// 		table:     {},
				// 		view:      {},
				// 		composite: {}
				// 	};
				//
				// 	_.forEach(schema.tables, function (table) {
				// 		//console.log('--TABLE', table.table_name);
				// 		var tableManager = Promise.resolve(new entityManager(table));
				// 		//console.log('TABLE MANAGER', tableManager);
				// 		_dbTree[schema.schema_name].table[table.table_name] = tableManager;
				//
				// 	});
				// 	_.forEach(schema.views, function (view) {
				// 		//console.log('--VIEW', table.table_name);
				// 		view.readonly = true;
				// 		_dbTree[schema.schema_name].view[view.table_name] = Promise.resolve(new entityManager(view));
				// 	});
				// });

				// return _dbTree;
			},
			// "report":	(callInfo)=>{
			// 	fbkt().clog('BUILD DB TREE RESULT', callInfo.params.dbTree, true); process.exit();
			// }
		}
	}, callInfo || {});
};