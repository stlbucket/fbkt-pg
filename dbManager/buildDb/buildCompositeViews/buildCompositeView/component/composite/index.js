"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildCompositeView.component.composite',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps: {  // any number of functions
			"composite": function (callInfo) {
				//fbkt().clog('GENERATING COMPOSITE SUBQUERY', self.options, true);
				return fbkt().hbTemplateManager({
					params:	{
						templateFilePath: `${__dirname}/template.hbs`,
						templateData:     callInfo.params,
						executionMode:    'PROD',
						reportFileName:   './ignoreAllThis/cvgCompositeTemplateOutput.txt'
					}
				});
			}
		}
	}, callInfo || {});
};