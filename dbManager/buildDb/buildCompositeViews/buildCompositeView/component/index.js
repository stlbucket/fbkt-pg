"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');
const _ = require('lodash');

const templators = {
	base:	require('./base')
	,dependency:	require('./dependency')
	// ,association:	require('./association')
	,aggregation:	require('./aggregation')
	,extension:		require('./extension')
	,composite:		require('./composite')
};

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'buildDb.buildCompositeView.component',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {
			"indentLevel":	"getIndentLevel",
			"componentResults":	"processComponents"
		},
		pipelineSteps: {  // any number of functions
			"getIndentLevel":	(callInfo)=>{
				return R.is(Number, callInfo.params.indentLevel) ? callInfo.params.indentLevel+1 : 1;
			},
			"processComponents": (callInfo)=>{
				const components = R.map(
					(component)=>{
						const subComponent = R.merge(component, {
							parentTableName:	callInfo.params.component.tableName,
							indentLevel:			callInfo.params.indentLevel +1,
						});

						return {
							params:	{
								component:	subComponent
							}
						};
					},
					callInfo.params.component.components || []
				);
				
				if (components.length > 0){
					return Promise.map(
						components,
						(component)=>{
							return module.exports(component)
								.then((result)=>{
									return result.output;
								});
						}
					);
				} else {
					return 'NO SUB COMPONENTS';
				}
			},
			"processEntity":	(callInfo)=>{
				return templators[_.toLower(callInfo.params.component.componentType)]({
					params:	{
						viewName:					callInfo.params.component.viewName || `${callInfo.params.component.tableName}_composite_view`,
						searchPath:				callInfo.params.searchPath,
						componentName:		callInfo.params.component.componentName || callInfo.params.component.tableName,
						selectFields:			callInfo.params.component.selectFields,
						indent:						new Array(callInfo.params.indentLevel + 1).join('  '),
						schemaName:				callInfo.params.component.schemaName,
						tableName:				callInfo.params.component.tableName,
						componentResults:	callInfo.params.componentResults,	
						parentTableName:	callInfo.params.component.parentTableName,
						fkField:					callInfo.params.component.fkField
					}
				});
			}
		}
	}, callInfo || {});
};