var when = require('when');
var _ = require('lodash');
var fbkt = require('fbkt');

// todo:  refactor this into an es6 class
module.exports = function (callInfo) {
	var self = this;
	self.callInfo = _.clone(callInfo);
	if(self.callInfo.user && self.callInfo.user["0"]){
		console.log('KNEX QUERY', self);
		console.log(self.callInfo.filters);
		console.log(self.callInfo.params);
		console.log(self.callInfo.user["0"]);
	}
	
	self.go = function () {
		var qb = fbkt().libs.dbAccess.client().queryBuilder();
		if (self.callInfo.debugQuery === true){
			qb.debug();
		}

		qb.from(self.callInfo.tableNameWithSchema);

		_.forOwn(self.callInfo.filters, function (methodArgSets, knexMethod) {
			_.forEach(methodArgSets, function (methodArgSet) {
				if (_.indexOf(['select', 'orderBy'], knexMethod) === -1){
					qb[knexMethod].apply(qb, methodArgSet);
				}
			});
		});

		var selectFields = self.callInfo.filters.select || '*';
		if (_.isInteger(self.callInfo.params.limit)) {
			qb.limit(self.callInfo.params.limit);
		}

		if (_.isArray(self.callInfo.params.orderBy)) {
			qb.orderBy(self.callInfo.params.orderBy[0], self.callInfo.params.orderBy[1]);
		}

		return qb.select(selectFields)
			.then(function (dbEntities) {
				var resultValue = _.values(fbkt().object.camelCase(dbEntities));
				var error = null;

				if (self.callInfo.expectScalar){
					if (resultValue.length > 1) {
						error = error || new Error(JSON.stringify({
								source:								'dbAccess/entityManager/knexQuery',
								message:							'expected scalar',
								callInfo:							self.callInfo,
								resultValue:					resultValue
							}));
					}

					resultValue = resultValue[0];
				}

				var retval = {
					callInfo:	self.callInfo,
					value:		resultValue,
				};

				if (error !== null) { retval.error = error; }

				return retval;
			});

	};

	return self.go;
};