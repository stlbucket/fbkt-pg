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
        const disableEntityRestControllers = fbkt().config.disableEntityRestControllers || false;
				if (fbkt().dbTree && disableEntityRestControllers === false){
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
  if (process.env.NODE_ENV !== 'buildDb'){
		return initControllers(callInfo);
	} else {
		return 'NO CONTROLLERS';
	}
};
