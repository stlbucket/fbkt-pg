"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const _ = require('lodash');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildCompositeView.component.base',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps: {  // any number of functions
			"buildBaseComponent": (callInfo)=> {
				return fbkt().hbTemplateManager({
					params: {
						templateFilePath: `${__dirname}/template.hbs`,
						templateData:     callInfo.params,
						executionMode:    'PROD',
						reportFileName:   './ignoreAllThis/' + _.camelCase(callInfo.params.tableName) + 'CompositeTemplateOutput.txt'
					}
				});
			}
		}
	}, callInfo || {});
};