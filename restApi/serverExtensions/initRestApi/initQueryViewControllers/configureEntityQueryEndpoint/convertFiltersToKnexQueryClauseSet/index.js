"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const _ = require('lodash');

const queryClauseGeneratorMap = require('./queryClauseGeneratorMap');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'convertFiltersToKnexQueryClauseSet',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps: {
			"convertClauses": (callInfo)=> {
				var knexQueryClauses = {};

				// fbkt().clog('CONVERT FILTERS TO KNEX QUERY CLAUSE SET CALL INFO', {
				// 	params: callInfo.params
				// }, true);
				
				_.forEach(callInfo.params.filters, function (filter) {
					queryClauseGeneratorMap[filter.dataType][filter.comparator](filter, knexQueryClauses);
				});

				if (callInfo.params.limit) {
					knexQueryClauses.limit = callInfo.params.limit;
				}

				if (callInfo.params.orderBy) {
					knexQueryClauses.orderBy = callInfo.params.orderBy;
				}

				// fbkt().clog('KNEX QUERY CLAUSES', knexQueryClauses, true);
				return knexQueryClauses;
			}
		}
	}, callInfo || {});
};