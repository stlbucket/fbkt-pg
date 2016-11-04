"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const _ = require('lodash');

const configureGetAllEndpoint = require('../../../configureEndpoint/getAll');
const configureGetOneEndpoint = require('../../../configureEndpoint/getOne');
const configurePostEndpoint = require('../../../configureEndpoint/post');
const configurePutEndpoint = require('../../../configureEndpoint/put');
const configureDeleteEndpoint = require('../../../configureEndpoint/delete');

module.exports = (callInfo)=> {
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

				actionsAreConfigured.push(configurePostEndpoint({
					params: {
						url:        `/${_.upperFirst(_.camelCase(p.schema))}/${_.upperFirst(_.camelCase(p.tableName))}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
						handler:    p.entityManager.save
					}
				}));

				actionsAreConfigured.push(configurePutEndpoint({
					params: {
						url:        `/${_.upperFirst(_.camelCase(p.schema))}/${_.upperFirst(_.camelCase(p.tableName))}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
						handler:    p.entityManager.save
					}
				}));

				actionsAreConfigured.push(configureDeleteEndpoint({
					params: {
						url:        `/${_.upperFirst(_.camelCase(p.schema))}/${_.upperFirst(_.camelCase(p.tableName))}`,
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