"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const when = require('when');

const executeDbScripts = require('./executeDbScripts');
const buildCompositeViews = require('./buildCompositeViews');
const loadBuildDbDataNotOptional = require('./loadBuildDbDataNotOptional');

module.exports = (callInfo)=>{
	return fbkt().FbktPipe({
		name:           'buildDb',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {},
		pipelineSteps:  {  // any number of functions
			"executeDbScripts":           executeDbScripts,
			"buildCompositeViews":        buildCompositeViews,
			"loadDbTree":                 (callInfo)=> {
				return fbkt().libs.dbAccess.dbTree({
					params: {
						rebuild:     true
					}
				});
			},
			"loadBuildDbDataNotOptional": loadBuildDbDataNotOptional
		}
	}, callInfo || {});
};