"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = R.curry((composite, callInfo)=> {
	return fbkt().FbktPipe({
		name:           'initComposites.getAll',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps: {  // any number of functions
			"getAll": function (callInfo) {
				return fbkt()
					.dbTree[callInfo.params.composite.schemaName]
					.view[callInfo.params.viewName]
					.getAll({
						user: callInfo.user
					})
					.then(function (viewResults) {
						return viewResults ?
							R.is(Error, viewResults) ? viewResult : R.map(function (viewResult) {
								return viewResult.composite;
							}, viewResults) : null;
					});
			}
		}
	}, R.mergeWith(R.mergeWith, callInfo, {params: {composite: composite}}));
});