"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const entityQueryEndpointHandler = require('./entityQueryEndpointHandler');


module.exports = (callInfo)=> {
	const configurePostEndpoint = fbkt().restApiSupport.configureEndpoint.post;

	return fbkt().FbktPipe({
		name:           'configureEntityQueryEndpoint',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps: {
			"configureEntityQueryEndpoint": function (callInfo) {
				const schema = callInfo.params.schema;
				const entityName = callInfo.params.entity;
				const dbTreeSplit = callInfo.params.dbTreePath.split('.');

				const handler = entityQueryEndpointHandler(fbkt().dbTree[dbTreeSplit[0]][dbTreeSplit[1]][dbTreeSplit[2]].query);
				
				return configurePostEndpoint({
					params:{
						url: 			'/' + schema + '/query_' + entityName,
						handler:  handler
					}
				});
			}
		}
	}, callInfo || {});
};