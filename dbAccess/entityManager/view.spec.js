var uuid = require('node-uuid');
var util = require('util');
var should = require('should');
var _ = require('lodash');
var sequence = require('when/sequence');

var fbkt = require('fbkt');

describe(__filename, function() {
	it('do the view stuff', function (done) {

		var getAllLogEntryViews = function(){
			return fbkt().dbTree.fbkt_core_db.view.log_entry_view.getAll()
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
			getAllLogEntryViews
			, endItAll
		]);
	});

	it('view is readonly - no save', function(done){
		(fbkt().dbTree.fbkt_core_db.view.log_entry_view.save === null).should.be.ok;
		done();
	});

	it('view is readonly - no deleteById', function(done){
		(fbkt().dbTree.fbkt_core_db.view.log_entry_view.deleteById === null).should.be.ok;
		done();
	});

});