var uuid = require('uuid');
var util = require('util');
var should = require('should');
var _ = require('lodash');
var sequence = require('when/sequence');

var fbkt = require('fbkt');

describe(__filename, function() {
	var testId = uuid.v4();
	var workspace = {};

	it('findSert', function(done){
		var expected = `FINDSERT_${testId}`;
		fbkt().dbTree.fbkt_core_db.table.log_level.findSert({
				params:	{
					name:	expected,
				},
				findBy:	'name'
			})
			.then(function(findSertLevel) {
				// fbkt().clog('FINDSERT UNIT TEST LEVEL', findSertLevel);
				findSertLevel.should.be.ok;
				findSertLevel.name.should.equal(expected);
				workspace.findSertLevel = findSertLevel;
				fbkt().dbTree.fbkt_core_db.table.log_level.findSert({
						params: {
							name: expected,
						},
						findBy: 'name'
					})
					.then(function (findSertLevel) {
						// fbkt().clog('FINDSERT UNIT TEST LEVEL', findSertLevel);
						findSertLevel.should.be.ok;
						findSertLevel.name.should.equal(expected);
						findSertLevel.id.should.equal(workspace.findSertLevel.id);
						done();
					})
			});
	});
});