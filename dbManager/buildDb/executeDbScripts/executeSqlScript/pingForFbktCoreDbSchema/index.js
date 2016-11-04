"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'buildDb.executeDbScripts.executeSqlScript.findExistingPatch',
		filename:       __filename,
		expectedParams: {
		},
		pipelineParams: {
		},
		pipelineSteps: {  // any number of functions
			"pingForFbktCoreDbSchema": function (callInfo) {
				return fbkt().sqlTemplateManager({
					params:	{
						templateFilePath:	`${__dirname}/template.hbs`,
						templateData:			callInfo.params,
						executionMode: 		'PROD',
						reportFileName:		'./ignoreAllThis/pingForFbktCoreDbSchemaTemplateOutput.txt',
					}
				});
			},
		}
	}, callInfo || {});
};