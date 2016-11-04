"use strict";
const handlebars = require('handlebars');
const R = require('ramda');
const fbkt = require('fbkt');

module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'hbTemplateManager',
		filename:       __filename,
		expectedParams: {
			libRelativePath: 'string'
		},
		pipelineParams: {
			templateResult: "applyTemplate",
			output:					"buildOutput"
		},
		pipelineSteps: {  // any number of functions
			"applyTemplate": function (callInfo) {
				return fbkt().hbTemplateManager({
					params:	{
						templateFilePath: callInfo.params.templateFilePath,
						templateData:     callInfo.params.templateData,
						executionMode:    callInfo.params.executionMode,
						reportFileName:   callInfo.params.reportFileName || './ignoreAllThis/sqlTemplateManagerTemplateOutput.txt'
					}
				});
			},
			"executeSql":    function (callInfo) {
				if (callInfo.params.executionMode === 'ONLY-REPORTIT') {
					return {
						info: 'ONLY-REPORTIT',
						data: callInfo.params.data
					};
				} else {

					return fbkt().libs.dbAccess.query({
						sql: callInfo.params.templateResult.output
					})
						.then(function (sqlResult) {
							if (sqlResult.rows) {
								//if(callInfo.params.reportFileName==='./ignoreAllThis/filterTransmissionSummaryView.txt'){
								//	fbkt().clog("callInfo.params", callInfo.params);
								//	fbkt().clog("sqlResult.rows (first)", sqlResult.rows[0]);
								//}
								var rowData = callInfo.params.camelCaseResults === true ? _.values(fbkt().object.camelCase(sqlResult.rows)) : sqlResult.rows;
								//if(callInfo.params.reportFileName==='./ignoreAllThis/filterTransmissionSummaryView.txt'){
								//	fbkt().clog('SQL TEMPLATE MANAGER RESULT (first)', rowData[0]);
								//}
								return callInfo.params.expectScalar === true ? rowData[0] : rowData;
							} else {
								throw fbkt().FbktCustomError('FbktSqlTemplateManagerError', {
									options: callInfo
								});
							}
						});
				}
			}
		}
	}, callInfo);
};