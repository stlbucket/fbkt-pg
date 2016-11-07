"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const buildCompositeView = require("./buildCompositeView");

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildDb.buildCompositeViews',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {  // any number of functions
			"generateCompositeViews":	(callInfo)=>{
				const composites = fbkt().getComponentFromAllLibs('composites');
				return Promise.each(
					composites,
					(composite)=>{
						return buildCompositeView({params:{composite}});
					}
				)
			}
		}
	}, callInfo || {});
};
