var uuid = require('uuid');
var util = require('util');
var should = require('should');
var _ = require('lodash');
var sequence = require('when/sequence');

var fbkt = require('fbkt');

describe(__filename, function() {

	it('do the table stuff', function (done) {
		
		var _testId = 'SaveEntityTest';
		var _dbLogLevel = null;
		var _dbLogCategory = null;
		var _user = null;
		
		var saveLogCategory = function () {
			return fbkt().dbTree.fbkt_core_db.table.log_category.save({
					user:	_user,
					params:	{
						name: _testId
					}
				})
				.then(function (dbLogCategory) {
					_dbLogCategory = dbLogCategory;
					//fbkt().clog('SAVE LOG CATEGORY RESULT', dbLogCategory);
					_dbLogCategory.should.be.ok;
					_dbLogCategory.name.should.equal(_testId);
				});
		};

		var saveLogLevel = function () {
			return fbkt().dbTree.fbkt_core_db.table.log_level.save({
					user:	_user,
					params:	{
						name: _testId
					}
				})
				.then(function (dbLogLevel) {
					_dbLogLevel = dbLogLevel;
					//fbkt().clog('SAVE LOG LEVEL RESULT', dbLogLevel);
					_dbLogLevel.should.be.ok;
					_dbLogLevel.name.should.equal(_testId);
				});
		};

		var saveLogEntry = function () {
			return fbkt().dbTree.fbkt_core_db.table.log_entry.save({
					user:	_user,
					params:	{
						message: 				_testId,
						source:					_testId,
						logCategoryId:	_dbLogCategory.id,
						logLevelId:			_dbLogLevel.id
					}
				})
				.then(function (dbLogEntry) {
					//fbkt().clog('SAVE LOG ENTRY RESULT', dbLogEntry);
					dbLogEntry.should.be.ok;
					dbLogEntry.message.should.equal(_testId);
				});
		};
		
		var getAllLogEntries = function(){
			return fbkt().dbTree.fbkt_core_db.table.log_entry.getAll({
					user:	_user
			})
				.then(function (dbLogEntries) {
					//fbkt().clog('GET ALL LOG ENTRIES RESULT', dbLogEntries);
					dbLogEntries.should.be.ok;
					dbLogEntries.length.should.be.ok;
				});
		};

		var endItAll = function(){
			done();
		};

		sequence([
			saveLogCategory
			, saveLogLevel
			, saveLogEntry
			, getAllLogEntries
			, endItAll
		]);
	});

	it('fail to save a bad log entry', function (done) {
		var _testId = 'SaveEntityTest';
		var _dbLogLevel = null;
		var _dbLogCategory = null;
		
		var failSaveLogEntry = function () {
			return fbkt().dbTree.fbkt_core_db.table.log_entry.save({
					message: 				_testId,
					source:					_testId,
				})
				.then(function (dbLogEntry) {
					dbLogEntry.should.not.be.ok;
				})
				.catch(function(error){
					//console.log('error', error);
					error.should.be.ok;
				});
		};

		var endItAll = function(){
			done();
		};

		sequence([
			failSaveLogEntry
			, endItAll
		]);
	});
	
	it('query fbkt_db_patch', function(done){
		fbkt().dbTree.fbkt_core_db.table.fbkt_db_patch.query({
			params: {
				where: [
					[ 'id', '=', 1]
				],
				orWhere: [
					[ 'id', '=', 2]
				]
			}
		})
			.then(function(result){
				// fbkt().clog('QUERY FBKT DB PATCH RESULT', result);
				result.should.be.ok;
				result.length.should.equal(2);
				done();
			});
	});
	
});