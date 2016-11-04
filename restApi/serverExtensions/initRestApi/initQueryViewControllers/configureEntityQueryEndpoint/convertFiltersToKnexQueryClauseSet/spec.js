"use strict";
var uuid = require('node-uuid');
var fbkt = require('fbkt');
var should = require('should');

const pipeDef = require('./index');

describe(__filename, function () {

	it('convertFiltersToKnexQueryClauseSet', function (done) {
		this.timeout(5000);

		const testId = uuid.v4();
		const user = {login: "who@cares.com"};
		const params = {
			filters:	[
				{
					fieldName:	'site',
					dataType:		'string',
					comparator:	'=',
					value:			'DEMO'
				},
				{
					fieldName:	'document_key',
					dataType:		'string',
					comparator:	'like',
					value:			'04_47'
				}
			],
			limit:	10
		};

		// const pipe = mixedPipe();
		// then pipe.execute(params)...
		// then fbkt().clog('PIPE WORKSPACE', pipe.ws, true);

		pipeDef({
			user:   user,
			params: params
		})
			.then(function (result) {
				// fbkt().clog('PIPE RESULT', result, true);
				done();
			});

	});


});