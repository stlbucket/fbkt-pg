"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

const buildDbTree = require('./buildDbTree');
const getDbStructure = require('../getDbStructure');
var initComposites = require('../initComposites');

let _dbTree = null;

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'getDbTree',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {
			"dbStructure":	"getDbStructure"
		},
		pipelineSteps: {
			"getDbStructure": getDbStructure,
			"getDbTree": (callInfo)=> {
				// fbkt().clog('getDbTree', _dbTree, callInfo);
				if (callInfo.params.rebuild === true) {
					_dbTree = null;
				}
				if (!_dbTree) {
					return buildDbTree(callInfo)
						.then((dbTree)=> {
							// _dbTree = dbTree;
							// fbkt().dbTree = _dbTree;
							// return _dbTree;

							return initComposites({
								params: {
									dbTree:  dbTree,
									rebuild: callInfo.params.rebuild
								}
							})
								.then(function (dbTree) {
									_dbTree = dbTree;
									fbkt().dbTree = _dbTree;
									return _dbTree;
								});
						});
				} else {
					return _dbTree;
				}
			}
		}
	}, callInfo);
};
