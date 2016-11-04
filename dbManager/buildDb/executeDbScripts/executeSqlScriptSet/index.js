"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

var executeSqlScript = require('../executeSqlScript');

module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'buildDb.executeDbScripts.executeSqlScriptSet',
		filename:       __filename,
		expectedParams: {
		},
		pipelineParams: {
		},
		pipelineSteps: {  // any number of functions
			"executeSqlScriptSet": (callInfo)=>{
				return Promise.each(callInfo.params.dbScripts, (dbScript)=>{
					return executeSqlScript({
						params:	dbScript
					});
				});
			}
		}
	}, callInfo || {});
};