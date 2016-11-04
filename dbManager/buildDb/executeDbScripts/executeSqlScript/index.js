"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

var findExistingPatch = require('./findExistingPatch');
var executeSqlScript = require('../executeSqlScript');
var insertPatchRecord = require('./insertPatchRecord');
var pingForFbktCoreDbSchema = require('./pingForFbktCoreDbSchema');

module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'buildDb.executeDbScripts.executeSqlScript',
		filename:       __filename,
		expectedParams: {
		},
		pipelineParams: {
			sql:							"readScriptFile",
			existingPatches:	"findExistingPatches",
			coreDbExists:			"pingForFbktCoreDbSchema",
			executeScript:		"decideToExecute"
		},
		pipelineSteps: {  // any number of functions
			"pingForFbktCoreDbSchema":	(callInfo)=>{
				return pingForFbktCoreDbSchema()
					.then((result)=>{
						return result[0].exists;
					});
			},
			"findExistingPatches":	(callInfo)=>{
				if (callInfo.params.coreDbExists){
					return findExistingPatch(callInfo);
				} else {
					return null;
				}
			},
			"decideToExecute":	(callInfo)=>{
				const existingPatches = callInfo.params.existingPatches || [];
				if (existingPatches.length > 1 && callInfo.params.repatchable === false) {
					throw fbkt().FbktCustomError(
						"FbktExistingPatchError",
						{
							message:	`MULTIPLE PATCHES EXIST FOR UNPATCHABLE PATCH: ${callInfo.params.libName} - ${callInfo.params.filename}`
						}
					);
				} else if (existingPatches.length > 0 && callInfo.params.repatchable === false){
					return false;
				} else {
					return true;
				}
			},
			"readScriptFile": function (callInfo) {
				if (callInfo.params.executeScript === true){
					return fbkt().file.readFileWithPromise(callInfo.params.filename);
				} else {
					return "PATCH SKIPPED";
				}
			},
			"executeSql": function(callInfo) {
				//console.log('EXECUTE SQL', self.sql);
				if (callInfo.params.executeScript === true){
					return fbkt().libs.dbAccess.query({
						sql: callInfo.params.sql
					})
						.then(function (result) {
							const output = result.rows[0] ? result.rows[0].message || 'INVALID RESULT' : 'INVALID RESULT';

							if (output === 'INVALID RESULT') {
								console.log('INVALID RESULT', result);
								process.exit();
							}

							console.log('SQL SCRIPT EXECUTED: ', callInfo.params.filename);
							return output;
						});
				} else {
					return "PATCH SKIPPED";
				}
			},
			"insertPatchRecord": (callInfo)=>{
				if (callInfo.params.executeScript === true){
					return insertPatchRecord(callInfo)
				} else {
					console.log(`PATCH EXISTS: CANNOT OVERWRITE: ${callInfo.params.libName} - ${callInfo.params.filename}`)
					return `PATCH EXISTS: CANNOT OVERWRITE: ${callInfo.params.libName} - ${callInfo.params.filename}`
				}
			}
		}
	}, callInfo);
};