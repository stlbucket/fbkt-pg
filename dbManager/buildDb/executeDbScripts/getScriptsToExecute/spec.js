"use strict";
var uuid = require('uuid');
var fbkt = require('fbkt');
var should = require('should');

const pipeDef = require('./index');

describe(__filename, function() {
	
	it('find lib unit tests', function (done) {
		const testId = uuid.v4();
		const user ={ login:	"who@cares.com" };
		const	params = {
		};
		
		const pipe = pipeDef();
		
		pipe.execute({
			user:			user,
			params:		params
		})
			.then(function(result) {
				// fbkt().clog('FUNCTION BUCKET WORKSPACE', pipe.ws, true);
				// fbkt().clog('GET SCRIPTS TO EXECUTE TEST RESULT', result, true);
				done();
			})
			.catch(function(error){
				// fbkt().clog('FUNCTION BUCKET WORKSPACE', pipe.ws, true);
				// fbkt().clog('GET SCRIPTS TO EXECUTE ERROR', error, true);
				done(error);
			});
		
	});


});