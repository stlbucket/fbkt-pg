"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildCompositeView.component.dependency',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps: {  // any number of functions
			"buildDependencyComponent": function (callInfo) {
				//fbkt().clog('GENERATING DEPENDENCY SUBQUERY', self.options, true);
				return fbkt().hbTemplateManager({
					params: {
						templateFilePath: `${__dirname}/template.hbs`,
						templateData:     callInfo.params
					}
				});
			}
		}
	}, callInfo || {});
};