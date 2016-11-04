"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

var getScriptsToExecute = require('./getScriptsToExecute');
var executeSqlScriptSet = require('./executeSqlScriptSet');
var executeTheFunctionBucketiestScriptOfAll = require('./executeTheFunctionBucketiestScriptOfAll');

module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'buildDb.executeDbScripts',
		filename:       __filename,
		expectedParams: {
		},
		pipelineParams: {
			dbScripts:	"getScriptsToExecute"
		},
		pipelineSteps: {  // any number of functions
			"executeTheFunctionBucketiestScriptOfAll": executeTheFunctionBucketiestScriptOfAll,
			"getScriptsToExecute":	getScriptsToExecute,
			"executeSqlScriptSet":	executeSqlScriptSet
		}
	}, callInfo || {});
};