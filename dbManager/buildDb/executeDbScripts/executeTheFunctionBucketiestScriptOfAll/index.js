"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

var executeSqlScript = require('../executeSqlScript');

module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'buildDb.executeTheFunctionBucketiestScriptOfAll',
		filename:       __filename,
		expectedParams: {
		},
		pipelineParams: {
		},
		pipelineSteps: {  // any number of functions
			executeTheFunctionBucketiestScriptOfAll:	()=>{
				return executeSqlScript({
					params:	{
						libName:	'fbktCoreDb',
						filename: 	fbkt().libs.coreDb.theFbktiestScriptOfAll,
						repatchable:	false,
						forceExecution:	true
					}
				});
			}
		}
	}, callInfo || {});
};