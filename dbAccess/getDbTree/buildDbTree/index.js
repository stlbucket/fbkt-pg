"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const buildSchemaTree = require('./buildSchemaTree');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildDbTree',
		filename:       __filename,
		exitProcessOnError: true,
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
			},
			// "report":	(callInfo)=>{
			// 	fbkt().clog('BUILD DB TREE RESULT', callInfo.params.dbTree, true); process.exit();
			// }
		}
	}, callInfo || {});
};
