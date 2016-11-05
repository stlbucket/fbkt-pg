"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const _ = require('lodash');

const _handlerMap = {
	table:	require('./table'),
	// view:	require('./view'),
	// composite:	require('./composite'),
};

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'initRestApi.initEntityRestControllers.configureControllerEndpoints',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps: {  // any number of functions
			"configureControllerEndpoints": function (callInfo) {
				// fbkt().clog('configureControllerEndpoints', callInfo, true);
				return R.is(Function, _handlerMap[callInfo.params.entityType]) 
					? _handlerMap[callInfo.params.entityType](callInfo)
					: `NO ENTITY REST CONTROLLER FOR ENTITY TYPE: ${callInfo.params.entityType || 'NOT DEFINED'}`;
			}
		}
	}, callInfo);
};