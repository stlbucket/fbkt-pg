"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'restApi.captureAppRoutes',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {
			captureAppRoutes:	(callInfo)=>{
				var routes = R.map(function(stackItem){
					return {
						url:		stackItem.route ? stackItem.route.path : null,
						type:		stackItem.route ? R.keys(stackItem.route.methods)[0] : null,
					}
				}, fbkt().app._router.stack);

				return fbkt().restApiRoutes = R.filter(function(route){
					// return route.url !== null;
					return route.url != null && route.url.indexOf('graphql') > 0;
				}, routes);
			}
		}
	}, callInfo || {});
};