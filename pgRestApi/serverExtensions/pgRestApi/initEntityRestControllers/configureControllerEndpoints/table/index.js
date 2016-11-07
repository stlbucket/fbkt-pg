"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const _ = require('lodash');



module.exports = (callInfo)=> {
	const configureEndpoint = fbkt().restApiSupport.configureEndpoint;
	const configureGetAllEndpoint = configureEndpoint.getAll;
	const configureGetOneEndpoint = configureEndpoint.getOne;
	const configurePostEndpoint = configureEndpoint.post;
	const configurePutEndpoint = configureEndpoint.put;
	const configureDeleteEndpoint = configureEndpoint.delete;

	return fbkt().FbktPipe({
		name:           'initEntityRestControllers/configureControllerEndpoints/table',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {
			"configureEndpoints": (callInfo)=> {
				var actionsAreConfigured = [];

				const p = callInfo.params;

				actionsAreConfigured.push(configureGetAllEndpoint({
					params: {
						url:        `/${_.camelCase(p.schema)}/${_.camelCase(p.tableName)}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
						handler:    p.entityManager.getAll
					}
				}));

				actionsAreConfigured.push(configureGetOneEndpoint({
					params: {
						url:        `/${_.camelCase(p.schema)}/${_.camelCase(p.tableName)}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
						handler:    p.entityManager.findOne
					}
				}));

				actionsAreConfigured.push(configurePostEndpoint({
					params: {
						url:        `/${_.camelCase(p.schema)}/${_.camelCase(p.tableName)}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
						handler:    p.entityManager.save
					}
				}));

				actionsAreConfigured.push(configurePutEndpoint({
					params: {
						url:        `/${_.camelCase(p.schema)}/${_.camelCase(p.tableName)}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
						handler:    p.entityManager.save
					}
				}));

				actionsAreConfigured.push(configureDeleteEndpoint({
					params: {
						url:        `/${_.camelCase(p.schema)}/${_.camelCase(p.tableName)}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
						handler:    p.entityManager.deleteById
					}
				}));

				return Promise.all(actionsAreConfigured);
			}
		}
	}, callInfo);
};
