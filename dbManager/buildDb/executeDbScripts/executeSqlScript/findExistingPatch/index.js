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
          const split    = callInfo.params.filename.split('/');
          const filename = callInfo.params.libName + '/' + split.slice(split.length - 1)[0];
          return fbkt().sqlTemplateManager({
						params:	{
							templateFilePath: `${__dirname}/template.hbs`,
							templateData:			{
                filename: filename
              },
							executionMode: 		'REPORTIT',
							reportFileName:		'./ignoreAllThis/findExistingPatchRecordTemplateOutput.txt',
						}
					});
				} else {
						return null;
				}
			},
		}
	}, callInfo || {});
};
