"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = R.curry((composite, callInfo)=> {
	return fbkt().FbktPipe({
		name:           'initComposite.findOne',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps: {  // any number of functions
			"findOne": function (callInfo) {
				fbkt().clog('FIND ONE COMPOSITE', callInfo);
				return fbkt()
					.dbTree[callInfo.params.composite.schemaName]
					.view[callInfo.params.composite.tableName + '_composite_view']
					.findOne(callInfo.params)
					.then(function (viewResult) {
						fbkt().clog('viewResult', viewResult);
						return viewResult ?
							R.is(Error, viewResult) ? viewResult : viewResult
							: null;
					});
			}
		}
	}, R.mergeWith(R.mergeWith, callInfo, {params: {composite: composite}}));
});