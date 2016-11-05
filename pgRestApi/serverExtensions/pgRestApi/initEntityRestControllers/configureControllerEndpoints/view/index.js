"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const _ = require('lodash');

const configureGetAllEndpoint = require('../../../configureEndpoint/getAll');
const configureGetOneEndpoint = require('../../../configureEndpoint/getOne');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'initEntityRestControllers/configureControllerEndpoints',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {
			"configureEndpoints": (callInfo)=> {
				var actionsAreConfigured = [];

				const p = callInfo.params;

				actionsAreConfigured.push(configureGetAllEndpoint({
					params: {
						url:        `/${_.upperFirst(_.camelCase(p.schema))}/${_.upperFirst(_.camelCase(p.tableName))}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
						handler:    p.entityManager.getAll
					}
				}));

				actionsAreConfigured.push(configureGetOneEndpoint({
					params: {
						url:        `/${_.upperFirst(_.camelCase(p.schema))}/${_.upperFirst(_.camelCase(p.tableName))}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
						handler:    p.entityManager.findOne
					}
				}));
				
				return Promise.all(actionsAreConfigured);
			}
		}
	}, callInfo);
};