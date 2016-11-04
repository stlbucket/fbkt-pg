"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildCompositeView.buildSearchPath',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {
			searchPath:	"buildSearchPath"
		},
		pipelineSteps: {  // any number of functions
			"buildSearchPath": function (callInfo) {
				// fbkt().clog('BUILD SEARCH PATH', callInfo);
				const component = callInfo.params.component;
				// const schemas = R.reject(R.isNil, R.concat(
				// 	[component.compositeSchema, component.schemaName],
				// 	['public']
				// 	));
				const schemas = R.reject(R.isNil, [component.compositeSchema, component.schemaName]);

				return Promise.reduce(
					component.components || [],
					(schemas, component)=>{
						return module.exports({params: { component: component}})
							.then((componentSearchPath)=>{
								return R.union(schemas, componentSearchPath);
							});
					},
					schemas
				);
			},
			"addPublic":	(callInfo)=>{
				const f = R.compose(
					(searchPath)=>{
						return R.concat(searchPath, ['public'])
					},
					R.reject(schemaName=>schemaName==='public')
				);
				
				return f(callInfo.params.searchPath);
			}
		}
	}, callInfo || {});
};