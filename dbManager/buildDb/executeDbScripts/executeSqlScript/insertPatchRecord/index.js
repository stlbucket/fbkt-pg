"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'buildDb.executeDbScripts.executeSqlScript.insertPatchRecord',
		filename:       __filename,
		expectedParams: {
		},
		pipelineParams: {
		},
		pipelineSteps: {  // any number of functions
			"insertPatchRecord": function (callInfo) {
				return fbkt().sqlTemplateManager({
					params:	{
						templateFilePath:	`${__dirname}/template.hbs`,
						templateData:			{ 
							libName:	callInfo.params.libName,
							filename:	callInfo.params.filename,
							repatchable:	callInfo.params.repatchable
						},
						executionMode: 		'REPORTIT',
						reportFileName:		'./ignoreAllThis/insertPatchRecordTemplateOutput.txt',
					}
				});
			},
		}
	}, callInfo || {});
};