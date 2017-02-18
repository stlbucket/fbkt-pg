"use strict";
const uuid = require('uuid');
const fbkt = require('fbkt');
const should = require('should');

const pipeDef = require('./index');

describe(__filename, function () {

	it('buildSearchPath', function (done) {
		this.timeout(5000);

		const testId = uuid.v4();
		const user = {login: "who@cares.com"};
		const params = {
			component: {
				componentType: 'BASE'
				, schemaName: 'keviz'
				, tableName: 'kv_project'
				, components: [
					{
						componentType: 'DEPENDENCY'
						, schemaName:  'keviz'
						, tableName:   'kv_user'
						, fkField:     'kv_user_id'
					},
					{
						componentType: 'DEPENDENCY'
						, schemaName:  'fbkt_login'
						, tableName:   'organization'
						, fkField:     'organization_id'
					},
				]
			},
		};

		// const pipe = mixedPipe();
		// then pipe.execute(params)...
		// then fbkt().clog('PIPE WORKSPACE', pipe.ws, true);

		pipeDef({
			user:   user,
			params: params
		})
			.then((result)=> {
				fbkt().clog('PIPE RESULT', result, true);
				// result.testId.should.equal(testId);
				done();
			})
			.catch((error)=> {
				done(error);
			});

	});


});