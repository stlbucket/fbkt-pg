"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const buildEntityQueryInfo = require('./buildEntityQueryInfo');

module.exports = (callInfo)=> {
	const configureGetAllEndpoint = fbkt().restApiSupport.configureEndpoint.getAll;

	return fbkt().FbktPipe({
		name:           'configureFbktQueryEndpoing',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {
			"queryEntitiesEndpoints":	"buildQueryEntitiesEndpoints",
		},
		pipelineSteps: {  // any number of functions
			"buildQueryEntitiesEndpoints": buildEntityQueryInfo,
			"configureEndpoint": function(callInfo){
				fbkt().queryEntitiesEndpoints = callInfo.params.queryEntitiesEndpoints;

				return configureGetAllEndpoint({
					params: {
						url: '/queryInfo',
						handler:  (callInfo)=> {
							return fbkt().queryEntitiesEndpoints;
						}
					}
				});
			},
			"report":	(callInfo)=>{
				let retval = [];
				R.mapObjIndexed((val, key, obj)=>{
					return R.mapObjIndexed((val, key, obj)=> {
						return R.mapObjIndexed((val, key, obj)=> {
							retval = R.concat(retval, [val]);
							return [ val ];
						}, val);
					}, val);
				}, callInfo.params.queryEntitiesEndpoints);

				return retval;
			}
		},
	}, callInfo || {});
};
