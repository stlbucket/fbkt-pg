"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const when = require('when');
module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'wipeDb',
		filename:       __filename,
		expectedParams: {
		},
		pipelineParams: {
			schemasToWipe:	"getSchemasToWipe"
		},
		pipelineSteps: {  // any number of functions
			"wipeSchema": function (callInfo) {
				const sql = `DROP SCHEMA IF EXISTS ${callInfo.params.schema} CASCADE;`;
				fbkt().clog(`WIPING: ${callInfo.params.schema}`, sql);
				return fbkt().libs.dbAccess.query({
					sql:	sql
				})
					.then(function(result){
						fbkt().clog("SCHEMA WIPED", callInfo.params.schema);
						return result;
					})
					.catch(function(error){
						console.log('WIPE ERROR', error);
						throw error;
					})
					;
			}
		}
	}, callInfo || {});
};