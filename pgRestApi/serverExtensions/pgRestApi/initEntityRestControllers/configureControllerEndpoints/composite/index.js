"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const _ = require('lodash');

const _compositeAgents = [];

const CompositeAgent = class {
  constructor(entityManager) {
    this.getAllHandler  = entityManager.getAll;
    this.findOneHandler = entityManager.findOne;
  }

  handleGetAllRequest(callInfo) {
    return this.getAllHandler(callInfo)
      .then((result)=> {
        // console.log('GET ALL COMPOSITE RESULT', result);
        return result.map(item => item.composite);
      })
      .catch((error)=> {
        console.log('GET ALL COMPOSITE ERROR', error);
        throw error;
      });
  }

  handleFindOneRequest(callInfo) {
    return this.findOneHandler(callInfo)
      .then((result)=> {
        // fbkt().clog('FIND ONE COMPOSITE RESULT', result, true);
        return result.composite;
      })
      .catch((error)=> {
        console.log('FIND ONE COMPOSITE ERROR', error);
        throw error;
      });
  }

};


module.exports = (callInfo)=> {
	const configureEndpoint = fbkt().restApiSupport.configureEndpoint;
	const configureGetAllEndpoint = configureEndpoint.getAll;
	const configureGetOneEndpoint = configureEndpoint.getOne;

  return fbkt().FbktPipe({
		name:           'initEntityRestControllers/configureControllerEndpoints/composite',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {
			"configureEndpoints": (callInfo)=> {
				var actionsAreConfigured = [];

				const p = callInfo.params;
        const agent = new CompositeAgent(p.entityManager);
        _compositeAgents.push(agent);

        actionsAreConfigured.push(configureGetAllEndpoint({
					params: {
						url:        `/${_.camelCase(p.schema)}/${_.camelCase(p.tableName)}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
            handler: agent.handleGetAllRequest.bind(agent)
          }
				}));

				actionsAreConfigured.push(configureGetOneEndpoint({
					params: {
						url:        `/${_.camelCase(p.schema)}/${_.camelCase(p.tableName)}`,
						schema:     p.schema,
						entityType: p.entityType,
						tableName:  p.tableName,
            handler: agent.handleFindOneRequest.bind(agent)
          }
				}));

				return Promise.all(actionsAreConfigured);
			}
		}
	}, callInfo);
};
