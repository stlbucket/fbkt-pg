"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const getSchemas = require('./getSchemas');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'getDbStructure.buildDbStructure',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {
			schemas:	"getSchemas",
		},
		pipelineSteps:  {
			"getSchemas":	getSchemas,
			"mapToTree":	(callInfo)=>{
				return R.map((schema)=>{
					return R.clone(schema);
				}, callInfo.params.schemas)
			}
		}
	}, callInfo || {});
};
