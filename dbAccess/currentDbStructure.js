var _currentDbStructure = null;


module.exports = function(dbStructure){
	// console.log('_currentDbStructure', _currentDbStructure)
	// console.trace('dbStructure', dbStructure)
	if (dbStructure){
		_currentDbStructure = dbStructure;
	}
	return _currentDbStructure;
};