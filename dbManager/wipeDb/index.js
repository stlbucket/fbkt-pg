"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const wipeSchema = require('./wipeSchema');

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
			"wipeSchemas":	()=> {
				const schemas = fbkt().getComponentFromAllLibs('schema', []);
				return Promise.each(schemas,
					(schema)=> {
						return wipeSchema({
							params: {
								schema: schema
							}
						})
					})
					.then(function () {
						return 'DATA BASE WIPED';
					});
			}
		}
	}, callInfo || {});
};