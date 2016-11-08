"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'buildDb.executeDbScripts.executeSqlScript.findExistingPatch',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {
		},
		pipelineParams: {
		},
		pipelineSteps: {  // any number of functions
      "rebuildDbTree":  (callInfo)=>{
        return fbkt().libs.dbAccess.dbTree({
          params: {
            rebuild: true
          }})
      },
			"findExistingPatch": function (callInfo) {
				if (R.is(Object, fbkt().dbTree.fbkt_core_db)){
					return fbkt().sqlTemplateManager({
						params:	{
							templateFilePath: `${__dirname}/template.hbs`,
							templateData:			callInfo.params,
							executionMode: 		'REPORTIT',
							reportFileName:		'./ignoreAllThis/insertPatchRecordTemplateOutput.txt',
						}
					});
				} else {
						return null;
				}
			},
		}
	}, callInfo || {});
};
