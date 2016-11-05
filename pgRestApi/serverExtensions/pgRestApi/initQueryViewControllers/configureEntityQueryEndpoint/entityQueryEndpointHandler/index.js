"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const convertFiltersToKnexQueryClauseSet = require('../convertFiltersToKnexQueryClauseSet');

const _queryAgents = [];

const QueryAgent = class {
	constructor(queryHandler){
		this.queryHandler = queryHandler;
	}
	
	handleQueryRequest(callInfo){
		
		return convertFiltersToKnexQueryClauseSet(callInfo)
			.then((clauses)=>{
				return this.queryHandler({
					params:	clauses
				});
			})
			.then((result)=>{
				// console.log('QUERY ENTITIES RESULT', result);
				return result;
			})
			.catch((error)=>{
				console.log('QUERY ENTITIES ERROR', error);
				throw error;
			});
	}
};

module.exports = (queryHandler)=>{
	const agent = new QueryAgent(queryHandler);
	_queryAgents.push(agent);
	return agent.handleQueryRequest.bind(agent);
};

// const blah = (callInfo)=> {
// 	return fbkt().FbktPipe({
// 		name:           'convertFiltersToKnexQueryClauseSet',
// 		filename:       __filename,
// 		expectedParams: {},
// 		pipelineParams: {},
// 		pipelineSteps: {
// 			"convertFiltersToKnexQueryClauseSet": function (callInfo) {
// 				// fbkt().clog(self.callInfo.queryEntity.entityName + " query controller", callInfo.params);
// 				return convertFiltersToKnexQueryClauseSet(callInfo)
// 					.then(function (knexQueryClauses) {
// 						return {
// 							user:             callInfo.user,
// 							params:           callInfo.params,
// 							knexQueryClauses: knexQueryClauses
// 						}
// 					});
// 			}
// 		}
// 	}, callInfo || {});
// };