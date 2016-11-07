"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

var configureFbktQueryEndpoint = require('./configureFbktQueryEndpoint');
var configureEntityQueryEndpoint = require('./configureEntityQueryEndpoint');


module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'initRestApi.initQueryViewControllers',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {
			"queryViewControllers":	"getQueryViewControllers",
			"configuredControllers":	"configureFbktQueryEndpoint",
		},
		pipelineSteps: {  // any number of functions
			"getQueryViewControllers":       (callInfo)=> {
				return fbkt().getComponentFromAllLibs('queryViewControllers');
			},
			"configureFbktQueryEndpoint":    configureFbktQueryEndpoint,
			"configureEntityQueryEndpoints": (callInfo)=> {
				return Promise.each(
					callInfo.params.configuredControllers,
					(configuredController)=> {
						return configureEntityQueryEndpoint({
							params: configuredController
						})
					}
				)
			},
		}
	}, callInfo || {});
};
