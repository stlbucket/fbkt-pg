var makeWhereClause = function(filter, filterSet){
	filterSet.where = filterSet.where || [];
	filterSet.where.push([filter.fieldName, filter.comparator, filter.value]);
};

var makeLikeClause = function(filter, filterSet){
	filterSet.whereRaw = filterSet.whereRaw || [];
	filterSet.whereRaw.push([filter.fieldName+' like \'%'+filter.value+'%\'']);
};

var makeWhereInClause = function(filter, filterSet){
	filterSet.whereIn = filterSet.whereIn || [];
	filterSet.whereIn.push([filter.fieldName, filter.value]);
};

module.exports = {
	string:	{
		'=':		makeWhereClause,
		'!=':		makeWhereClause,
		'like':	makeLikeClause,
		'in':		makeWhereInClause
	},
	boolean:	{
		'=':		makeWhereClause,
		'!=':		makeWhereClause
	},
	number:	{
		'=':		makeWhereClause,
		'!=':		makeWhereClause,
		'>':		makeWhereClause,
		'>=':		makeWhereClause,
		'<':		makeWhereClause,
		'<=':		makeWhereClause
	},
	date:	{
		'=':		makeWhereClause,
		'!=':		makeWhereClause,
		'>':		makeWhereClause,
		'>=':		makeWhereClause,
		'<':		makeWhereClause,
		'<=':		makeWhereClause
	}
};
