"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'coreDb/composite/load',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {
			"sqlResult":	"applyTemplate"
		},
		pipelineSteps: {
			"applyTemplate":    function (callInfo) {
				// fbkt().clog('applyTemplate', callInfo);
				return fbkt().sqlTemplateManager({
					params: {
						templateFilePath: callInfo.params.templateFilePath,
						templateData:     callInfo.params.templateData || callInfo.params.data,
						executionMode:    callInfo.params.executionMode,
						reportFileName:   callInfo.params.reportFileName || './ignoreAllThis/sqlTemplateManagerTemplateOutput.txt',
						expectScalar:     true
					}
				});
			},
			"processSqlResult": function (callInfo) {
				if (typeof callInfo.params.sqlResult !== 'object') {
					throw fbkt().FbktCustomError("FbktCompositeLoadError", "Expected scalar composite result");
				}
				return fbkt().object.camelCase(callInfo.params.sqlResult.composite);
			}
		}
	}, callInfo || {});
};