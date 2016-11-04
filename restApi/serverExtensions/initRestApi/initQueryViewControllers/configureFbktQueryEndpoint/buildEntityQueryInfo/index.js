"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const _ = require('lodash');
const fbkt = require('fbkt');

const comparatorMap = require('./comparatorMap');
const dataTypesMap = require('./dataTypesMap');

module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'initQueryViewControllers.configureFbktQueryEndpoint.buildEntityQueryInfo',
		filename:       __filename,
		expectedParams: {},
		pipelineParams: {
			dbStructure:        "getDbStructure",
			entityDbStructures: "getEntityDbStructures"
		},
		pipelineSteps:  {
			"getDbStructure":        (callInfo)=> {
				return Promise.resolve(fbkt().libs.dbAccess.getDbStructure());
			},
			"getEntityDbStructures": (callInfo)=> {
				return Promise.map(
					callInfo.params.queryViewControllers,
					(controller)=> {
						return fbkt().libs.dbAccess.getEntityDbStructure({params: {dbTreePath: controller.dbTreePath}});
					}
				)
					.then((result)=> {
						return R.reject(R.isNil, result);
					});
			},
			"buildFilterSet":        (callInfo)=> {
				const entityDbStructures = callInfo.params.entityDbStructures;

				return R.reduce(
					(tree, entityDbStructure)=> {
						const packageName = _.upperFirst(_.camelCase(entityDbStructure.schema));
						const type = _.upperFirst(_.camelCase(entityDbStructure.type))
						const entityName = _.upperFirst(_.camelCase(entityDbStructure.entityName));
						const dbTreePath = `${entityDbStructure.schema}.${entityDbStructure.type}.${entityDbStructure.entityName}`;
						const queryViewController = R.find(R.propEq('dbTreePath', dbTreePath), callInfo.params.queryViewControllers);
						const filterTypes = R.reject(R.isNil, R.map((column)=> {
							const filterTypeDataType = dataTypesMap[column.data_type];
							const filterTypeComparators = comparatorMap[filterTypeDataType];
							if (filterTypeComparators) {
								return {
									fieldName:   column.column_name,
									dataType:    filterTypeDataType,
									comparators: filterTypeComparators
								};
							} else return null;
						}, entityDbStructure.structure.columns));

						let newTree = R.clone(tree);
						newTree[packageName] = newTree[packageName] || {};
						newTree[packageName][type] = newTree[packageName][type] || {};
						newTree[packageName][type][entityName] = newTree[packageName][type][entityName] || {
								schema:                              packageName,
								type:                                type,
								entity:                              entityName,
								entitySetKey:                        `${packageName}_${type}_${entityName}`,
								dbTreePath:                          dbTreePath,
								filteredEntityCollectionRelativeUrl: `/${packageName}/Query${entityName}`,
								filterTypes:                         filterTypes,
								aliases:                             queryViewController.aliases || [],
								gridColumns:                         queryViewController.gridColumns || {
									'default': ['name', 'id']
								},
								mapConfig:													 queryViewController.mapConfig,
								enabledDataViews:                    queryViewController.enabledDataViews || ['grid'],
								compositeUrl:                        queryViewController.compositeUrl || ''
							};
						return newTree;

					},
					{},
					entityDbStructures
				);
			}
		}
	}, callInfo || {});
};