var _ = require('lodash');
var when = require('when');
var dottie = require('dottie');

var fbkt = require('fbkt');
var fbktBookshelf = require('../bookshelf.js');
var knexQuery = require('./knexQuery');

var _entityScopeEnforcement = [
	// {
	// 	scopeTable:	{
	// 		schemaName:						'fbkt_login',
	// 		tableName:						'organization',
	// 		identifierColumn:			'id'
	// 	},
	// 	defaultFkColumnName:		'organization_id',
	// 	sourceDataLocation:			'user.licenseOrganizationId',
	// }
];

// todo:  refactor this into an es6 class
module.exports = function(options) {
	var self = this instanceof module.exports ? this : new module.exports(options);
	self.options = options;
	self.tableNameWithSchema = self.options.table_schema + '.' + self.options.table_name;
	
	self.initialize = function(){
		return fbktBookshelf()
			.then((bookshelf)=>{
				self.entity = bookshelf.Model.extend({
					tableName: self.tableNameWithSchema
				});
				// self.entityCollection = fbktBookshelf.Collection.extend({model: self.entity});
				self.disableDelete = false;

				self.entityScopeEnforcement = {
					columns:	[]
				};
				
				return 'initialized';
			});

		// setup entityScopeEnforcement for this entity manager
		// _.forEach(_entityScopeEnforcement, function(entityScopeEnforcement){
		// 	if (
		// 		self.options.table_schema === entityScopeEnforcement.scopeTable.schemaName
		// 		&& self.options.table_name === entityScopeEnforcement.scopeTable.tableName
		// 	){
		// 		self.disableDelete = true;
		// 		self.entityScopeEnforcement.columns.push({
		// 			columnName:								entityScopeEnforcement.scopeTable.identifierColumn,
		// 			sourceDataLocation:				entityScopeEnforcement.sourceDataLocation,
		// 			isIdentifierColumn:				true
		// 		});
		// 	} else if (_.find(self.options.columns, function(column){
		// 			return column.column_name === entityScopeEnforcement.defaultFkColumnName;
		// 		})) {
		// 		//table-scope enforcement currently disables delete
		// 		self.entityScopeEnforcement.columns.push({
		// 			columnName:								entityScopeEnforcement.defaultFkColumnName,
		// 			sourceDataLocation:				entityScopeEnforcement.sourceDataLocation
		// 		});
		// 	}
		// });
		// end of entityScopeEnforcement setup
	};

	self.convertParamsToFilters = function(params){
		var filters = {
			where:	[]
		};

		_.forOwn(params, function(value, key){
			filters.where.push([_.snakeCase(key), '=', value]);
		});

		return filters;
	};

	self.fixCallInfo = function(callInfo){
		// fbkt().clog('ENTITY MANAGER CALL INFO', callInfo);

		callInfo = callInfo || {};
		callInfo.user = callInfo.user || {};
		callInfo.params = callInfo.params || {};
		callInfo.tableNameWithSchema = self.tableNameWithSchema;

		// fbkt().clog('ENTITY MANAGER CALL INFO', callInfo);
		callInfo.filters = callInfo.filters
		|| callInfo.params.filters
		|| callInfo.convertParamsToFilters ? self.convertParamsToFilters(callInfo.params) : callInfo.params;
		callInfo.filters.where = callInfo.filters.where || [];
		// fbkt().clog('ENTITY MANAGER FILTERS', callInfo.filters);

		if (callInfo.suppressEntityScopeEnforcement !== true){
			_.forEach(self.entityScopeEnforcement.columns, function(entityScopeEnforcement){
				var sourceData = dottie.get(callInfo, entityScopeEnforcement.sourceDataLocation);
				callInfo.filters.where.push([entityScopeEnforcement.columnName, '=', sourceData]);
			});
		}

		return callInfo;
	};

	self.query = function (callInfo) {
		// if(callInfo && callInfo.user && callInfo.user['0']){
		// 	fbkt().clog("QUERY", callInfo, true);
			// process.exit();
		// }
		callInfo = self.fixCallInfo(callInfo);
		if (callInfo.tableNameWithSchema === 'fbkt_login.location'){
			// fbkt().clog('CALL INFO', callInfo, true);
			// callInfo.debugQuery = true;
		}
		return new knexQuery(callInfo)()
			.then(function(result){
				if (callInfo.tableNameWithSchema === 'fbkt_login.location'){
					// fbkt().clog('ENTITY MANAGER RESULT', result, true);
					// process.exit();
				}
				if (!result.error && result.callInfo.applyEntityScopeEnforcementPostQuery === true){
					_.forEach(self.entityScopeEnforcement.columns, function(entityScopeEnforcement){
						var sourceValue = dottie.get(result.callInfo, entityScopeEnforcement.sourceDataLocation);
						var resultValue = result.value ? result.value[_.camelCase(entityScopeEnforcement.columnName)] : null;

						if (result.value && resultValue !== sourceValue) {
							result.value = null;

							if (callInfo.scopeViolationNull !== true) {
								result.error = result.error || new Error(JSON.stringify({
										source:              'dbAccess/entityManager/getById',
										message:             'scopeViolation',
										tableNameWithSchema: self.tableNameWithSchema,
										sourceValue:         sourceValue,
										resultValue:         resultValue
									}));
							}
						}
					});
				}

				if (result.error) {
					return result.error;
				} else {
					return result.value;
				}
			});
	};

	self.getAll = function (callInfo) {
		//console.log("SELF: ", self);
		//console.log("CALLINFO: ", callInfo);
		return self.query(callInfo);
	};

	self.getById = function (callInfo) {
		callInfo.convertParamsToFilters = true;
		callInfo.expectScalar = true;
		callInfo.applyEntityScopeEnforcementPostQuery = callInfo.suppressEntityScopeEnforcement !== true;
		callInfo.suppressEntityScopeEnforcement = true;
		return self.query(callInfo);
	};

	self.findAll = function(callInfo){
		callInfo.convertParamsToFilters = true;
		callInfo.applyEntityScopeEnforcementPostQuery = callInfo.suppressEntityScopeEnforcement !== true;
		callInfo.suppressEntityScopeEnforcement = callInfo.suppressEntityScopeEnforcement !== false;
		return self.query(callInfo);
	};

	self.findOne = function(callInfo){
		return self.findAll(callInfo)
			.then(results=>{
				return results[0];
			});
	};

	self.interface = {
		entity:			self.tableNameWithSchema,
		getAll:     self.getAll,
		getById:    self.getById,
		query:      self.query,
		findOne:		self.findOne,
		findAll:		self.findAll
	};

	if (self.options.readonly !== true) {

		self.findSert = function(callInfo){
			var findByFields =
				callInfo.findBy ?
					_.isString(callInfo.findBy) ?
						[ callInfo.findBy ] :
						callInfo.findBy :
					callInfo.findBy;

			var findOneParams = _.pick(callInfo.params, findByFields);

			return self.findOne({
				user:		callInfo.user,
				params:	findOneParams,
				suppressEntityScopeEnforcement:	false
			})
				.then(function(dbEntity){
					if (dbEntity){
						return dbEntity;
					} else {
						return self.save({
							user:		callInfo.user,
							params:	callInfo.params
						});
					}
				})
				.then(function(dbEntity){
					return self.findOne({
						user:		callInfo.user,
						params:	{
							id:	dbEntity.id
						}
					});
				});
		};

		self.save = function (callInfo) {
			var error = null;
			_.forEach(self.entityScopeEnforcement.columns, function(entityScopeEnforcement){
				var columnName = _.camelCase(entityScopeEnforcement.columnName);
				if(
					callInfo.suppressEntityScopeEnforcement !== true
					&& callInfo.params[columnName]
					&& callInfo.params[columnName] !== dottie.get(callInfo, entityScopeEnforcement.sourceDataLocation
					)){
					error = error || new Error(JSON.stringify({
							source:									'dbAccess/entityManager/save',
							message:								'scopeViolation',
							entityScopeEnforcement:	entityScopeEnforcement,
							callInfo:								callInfo
						}));
				} else if (
					callInfo.suppressEntityScopeEnforcement !== true
					&& entityScopeEnforcement.isIdentifierColumn !== true
				) {
					callInfo.params[columnName] = dottie.get(callInfo, entityScopeEnforcement.sourceDataLocation);
				}
			});

			if (error){
				return error;
			} else {
				return new self.entity(fbkt().object.snakeCase(callInfo.params))
					.save()
					.then(function (dbEntity) {
						return dbEntity ? fbkt().object.camelCase(dbEntity.toJSON()) : null;
					})
			}
		};

		self.deleteById = function (callInfo) {
			if (self.disableDelete === true && callInfo.suppressEntityScopeEnforcement !== true){
				return new when(Error(JSON.stringify({
					source:									'dbAccess/entityManager/deleteById',
					message:								'scopeViolation',
					entityScopeEnforcement:	self.entityScopeEnforcement,
					callInfo:								callInfo
				})));
			} else {

				_.forEach(self.entityScopeEnforcement.columns, function(entityScopeEnforcement){
					if (entityScopeEnforcement.isIdentifierColumn !== true){
						var columnName = _.camelCase(entityScopeEnforcement.columnName);
						callInfo.params[columnName] = dottie.get(callInfo, entityScopeEnforcement.sourceDataLocation);
					}
				});

				return self.getById(callInfo)
					.then(function (dbEntity) {
						if (dbEntity) {
							return new self.entity({
								id: dbEntity.id
							}).destroy();
						}
					});
			}


			//return new self.entity(callInfo.params).delete();

		};

		self.interface = _.extend(self.interface, {
			save:       self.save,
			deleteById: self.deleteById,
			findSert:		self.findSert
		});
	}
	
	return self.initialize()
		.then((result)=>{
			return self.interface;
		});
};