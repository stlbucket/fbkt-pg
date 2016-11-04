"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const initCustomRestControllers = require('./initCustomRestControllers');
const initEntityRestControllers = require('./initEntityRestControllers');
const captureAppRoutes = require('./captureAppRoutes');
const initQueryViewControllers = require('./initQueryViewControllers');

const initControllers = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'restApi.initRestApi',
		filename:       __filename,
		expectedParams: {
		},
		pipelineParams: {
		},
		pipelineSteps: {  // any number of functions
			"initCustomRestControllers":	initCustomRestControllers,
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
			"captureAppRoutes":						captureAppRoutes
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
