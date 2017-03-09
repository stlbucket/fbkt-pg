"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const buildSearchPath = require('./buildSearchPath');
const component = require('./component');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildDb.buildCompositeViews.buildCompositeView',
		filename:       __filename,
		expectedParams: {},
		exitProcessOnError:	true,
		pipelineParams: {
			searchPath:	"buildSearchPath",
			generatedCompositeView:	"generateCompositeView"
		},
		pipelineSteps: {  // any number of functions
			"buildSearchPath":       function (callInfo) {

        if (callInfo.params.compositeSearchPath) {
					return callInfo.params.compositeSearchPath;
				} else {
					return buildSearchPath({
						params: {
							component: callInfo.params.composite
						}
					})
						.then((pathArr)=> {
							return pathArr.join(', ');
						});
				}
			},
			"generateCompositeView": (callInfo)=> {
        fbkt().clog('SAVE OUTPUT', callInfo, true);
        process.exit();
        return component({
					params: {
						component:  callInfo.params.composite,
						searchPath: callInfo.params.searchPath
					}
				})
			},
			"saveOutput":            function (callInfo) {
        const executionMode = callInfo.params.executionMode || 'PROD';
				var fileName = callInfo.params.reportFileName || './ignoreAllThis/compositeViewGeneratorTemplateOutput.txt';
				return fbkt().file.writeFileWithPromise({
					fileName:     fileName,
					fileContents: callInfo.params.generatedCompositeView.output
				});
			},
			// "executeSqlStatement":   function (callInfo) {
			// 	return fbkt().libs.dbAccess.query({
			// 		sql: callInfo.params.generatedCompositeView.output
			// 	})
			// 		.then(function () {
			// 			console.log('COMPOSITE VIEW GENERATED:', callInfo.params.composite.tableName);
			// 		});
			// }
		}
	}, callInfo);
};