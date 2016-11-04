"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'buildDb.executeDbScripts.getScriptsToExecute',
		filename:       __filename,
		expectedParams: {
		},
		pipelineParams: {
		},
		pipelineSteps: {
			"getScripts": ()=>{
				return R.reduce(
					(allScripts, lib)=> {
						const libScripts = lib.dbScripts || [];
						const scripts = libScripts.map((script)=> {
							return {
								libName:     lib.packageName,
								filename:    script,
								repatchable: false
							}
						});
						const libPatches = lib.dbPatches || [];
						const patches = libPatches.map((script)=> {
								return {
									libName:     lib.packageName,
									filename:    script,
									repatchable: true
								}
							}) || [];

						return allScripts.concat(scripts).concat(patches);
					}, 
					[], 
					R.values(fbkt().libs));
			}
		}
	}, callInfo);
};