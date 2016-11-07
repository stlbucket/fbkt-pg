"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildCompositeView.component.aggregation',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps: {  // any number of function
			"aggregation": function (callInfo) {
				return fbkt().hbTemplateManager({
					params: {
						templateFilePath: `${__dirname}/template.hbs`,
						templateData:     callInfo.params,
						executionMode:    'PROD',
						reportFileName:   './ignoreAllThis/cvgAggregationTemplateOutput.txt'
					}
				});
			}
		}
	}, callInfo);
};
