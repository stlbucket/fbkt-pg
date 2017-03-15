"use strict";
const _ = require('lodash');
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const configureControllerEndpoints = require('./configureControllerEndpoints');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'initRestApi.initEntityRestControllers',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {  // any number of functions
			"initTableControllers":	(callInfo)=>{
				const endpointsAreConfigured = R.values(R.flatten(R.keys(fbkt().dbTree).map((schema)=> {
					return R.keys(fbkt().dbTree[schema]).map((entityType)=> {
						return R.keys(fbkt().dbTree[schema][entityType]).map((entityName)=> {
							const useEntityName = entityName;
							const useEntityType = entityType;
							const useEntityManagerName = entityName;

							const entityManager = fbkt().dbTree[schema][useEntityType][useEntityManagerName];

							if (R.isNil(entityManager)){
								console.log('EM', entityManager, schema, entityType, entityName, useEntityName);
								process.exit();
							}

							return {
								url:           `/${_.camelCase(schema)}/${_.camelCase(useEntityName)}`,
								schema:        schema,
								entityType:    entityType,
								tableName:     useEntityName,
								entityManager: entityManager
							}
						});
					});
				})));

				return Promise.each(endpointsAreConfigured, (endpoint)=>{
					configureControllerEndpoints({
						params: endpoint
					})
				});
			}
		}
	}, callInfo || {});
};
