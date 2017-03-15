"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const buildEntityManager = require('./buildEntityManager');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildSchemaTree',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {
			"tableSchemaTree":	"buildTableSchemaTree"
		},
		pipelineSteps:  {
			"buildTableSchemaTree":	(callInfo)=>{
				return Promise.reduce(
					callInfo.params.schema.tables,
					(schemaTree, table)=>{
						return buildEntityManager({
							params:	{
								entity:	table
							}
						})
							.then((entityManager)=>{
								const tableTree = {
									table: {
										[table.table_name]: entityManager
									}
								};
								return R.mergeWith(
									R.merge,
									schemaTree,
									tableTree
								)
							});
					},
					{
						table:	{},
						view:	{}
					}
				);
			},
			"buildViewSchemaTree":	(callInfo)=>{
				return Promise.reduce(
					callInfo.params.schema.views,
					(schemaTree, view)=>{
						return buildEntityManager({
							params:	{
								entity:	view
							}
						})
							.then((entityManager)=>{
								const viewTree = {
									view: {
										[view.table_name]: entityManager
									}
								};
								return R.mergeWith(
									R.merge,
									schemaTree,
									viewTree
								)
							});
					},
					callInfo.params.tableSchemaTree
				);
			}
		}
	}, callInfo);
};
