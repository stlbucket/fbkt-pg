"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const buildDbStructure = require('./buildDbStructure');

let _dbStructure = null;

module.exports = (callInfo)=> {
	if (_dbStructure) {
		return Promise.resolve(_dbStructure);
	} else {
		return fbkt().FbktPipe({
			name:           'getDbStructure',
			filename:       __filename,
			exitProcessOnError: true,
			expectedParams: {},
			pipelineParams: {
				dbStructure:	"dbStructure",
			},
			pipelineSteps: {  // any number of functions
				"dbStructure":	(callInfo)=>{
					if (R.is(Object, _dbStructure)) return _dbStructure;
					else return buildDbStructure();
				},
				"captureDbStructure":	(callInfo)=>{
					return _dbStructure = callInfo.params.dbStructure;
				}
			}
		}, callInfo || {});
	}
};
