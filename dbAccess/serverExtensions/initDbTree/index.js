"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const getDbTree = require('../../getDbTree');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'loadDbTree',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {
			"loadDbTree": (callInfo)=> {
				return getDbTree({})
					.then(dbTree=>{
						fbkt().dbTree = dbTree;
						return 'DB TREE LOADED'
					});
			}
		}
	}, {});
};