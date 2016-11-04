"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildDb.loadBuildDbDataNotOptional',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {
			"loadDataPackages":	(callInfo)=>{
				const dataPackageLoaders = fbkt().getComponentFromAllLibs('loadBuildDbDataNotOptional');
				return Promise.each(
					dataPackageLoaders,
					(dataPackageLoader)=>{
						return dataPackageLoader();
					}
				)
			}
			
		}
	}, callInfo || {});
};