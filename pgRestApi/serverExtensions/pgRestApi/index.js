"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const initEntityRestControllers = require('./initEntityRestControllers');
const initQueryViewControllers = require('./initQueryViewControllers');

const initControllers = (callInfo)=>{0
	return fbkt().FbktPipe({
		name:           'pgRestApi',
		filename:       __filename,
		expectedParams: {
		},
		pipelineParams: {
		},
		pipelineSteps: {  // any number of functions
			"initEntityRestControllers":	(callInfo)=>{
				if (fbkt().dbTree){
					return initEntityRestControllers(callInfo);
				}
			},
			"initQueryViewControllers":	(callInfo)=>{
				if (fbkt().dbTree){
					return initQueryViewControllers(callInfo);
				}
			},
			"captureAppRoutes":	()=>{
				return fbkt().restApiSupport.captureAppRoutes();
			}
		}
	}, callInfo || {});
};

module.exports = (callInfo)=>{
	if (fbkt().executionMode !== 'BUILD_DB'){
		return initControllers(callInfo);
	} else {
		return 'NO CONTROLLERS';
	}
};
