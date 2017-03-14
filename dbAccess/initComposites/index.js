"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const getAll = require('./getAll');
const findOne = require('./findOne');

module.exports = (callInfo)=> {
  return fbkt().FbktPipe({
		name:           'initComposites',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {  // any number of functions
			"initComposites":	(callInfo)=>{
				const dbTree = callInfo.params.dbTree;
				const allComposites = fbkt().getComponentFromAllLibs('composites');

				R.forEach((composite)=>{
					if (dbTree[composite.schemaName]){
						dbTree[composite.schemaName].composite
							= dbTree[composite.schemaName].composite
							|| {};

						dbTree[composite.schemaName].composite[composite.tableName] = {
							getAll:		composite.getAll || getAll(composite)
							,findOne:	composite.findOne || findOne(composite)
						};
					}
				}, allComposites);

				return dbTree;
			}
		}
	}, callInfo || {});
};
