"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const entityManager = require('../../../../entityManager');


module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildEntityManager',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {
			"buildEntityManager":	(callInfo)=>{
				return new entityManager(callInfo.params.entity);
			}
		}
	}, callInfo);
};
