var uuid = require('node-uuid');
var util = require('util');
var _ = require('lodash');
var should = require('should');
var fs = require('fs');
var fbkt = require('fbkt');

describe.skip(__filename, function () {
	var testId = uuid.v4();
	var workspace = {
		testId:											testId,
		targetSchemaName:						'fbkt_data_import_staging',
		targetTableName:						'unit_test',
		delimiterType:							'TAB',
		fileName:										'scripts/fbktLibs/fbktDataImport/function/testData.txt',
		// tdsManager:									fbkt().fbktDataImport.tdsManager.unitTest
	};

	it('login user', function (done) {
		new fbkt().fbktLogin.loginUser({
			params: {
				login:          'functionbucket@gmail.com',
				hashedPassword: fbkt().crypto.sha2encrypt('smartPwd')
			}
		})()
			.then(function (authenticatedUser) {
				// fbkt().clog('AUTHENTICATED USER', authenticatedUser);
				workspace.authenticatedUser = authenticatedUser;
				done();
			});
	});

	it('stream data in', function (done) {
		fbkt().execFbktPipelineMethod({
			pipeline:	fbkt().fbktDataImport.service.streamDataIn,
			callInfo: {
				user:	workspace.user,
				params:	{
					targetSchemaName:	workspace.targetSchemaName,
					targetTableName:	workspace.targetTableName,
					delimiterType:		workspace.delimiterType,
					sourceStream:			fs.createReadStream(workspace.fileName),
					tdsManager:				workspace.tdsManager
				}
			},
			recordPipeline:	true,
		})()
			.then(function(streamDataInResult){
				// fbkt().clog('STREAM DATA IN RESULT', streamDataInResult);
				_.isObject(streamDataInResult).should.be.ok;
				streamDataInResult.importedRecordCount.should.be.ok;
				workspace.streamDataInResult = streamDataInResult;
				done();
			});
	});

	it('add typed columns', function(done){
		var sql = [
			'ALTER TABLE fbkt_data_import_staging.unit_test',
			'ADD COLUMN integer_field_converted integer;',
			'',
			'UPDATE fbkt_data_import_staging.unit_test',
			'SET integer_field_converted = integer_field::integer;',
			'',
			'ALTER TABLE fbkt_data_import_staging.unit_test',
			'ADD COLUMN real_field_converted real;',
			'',
			'UPDATE fbkt_data_import_staging.unit_test',
			'SET real_field_converted = real_field::real;',
			'',
			'SELECT * FROM fbkt_data_import_staging.unit_test;'
		].join('\n');

		return fbkt().fbktDb.query({
			sql: sql
		})
			.then(function(sqlResult){
				// fbkt().clog('sqlResult', sqlResult.rows);
				done();
			});
	});

	it('query for integer_field_converted > 4', function(done){
		var handler = new require('./entityQueryEndpointHandler')({
			queryHandler:	workspace.streamDataInResult.entityManager.query,
			packageName:	'fbkt_data_import_staging',
			queryEntity:	{ name: 'unit_test' }
		});

		handler({
			user:	workspace.authenticatedUser,
			params:	{
				filters:	[
					{
						fieldName:	'integer_field_converted',
						dataType:		'number',
						comparator:	'>',
						value:			4
					},
				]
			}
		})
			.then(function(queryResult){
				// fbkt().clog('QUERY RESULT', queryResult);
				done();
			});

	});

	it('query for all limit 2 order by integer_field_converted desc', function(done){
		var handler = new require('./entityQueryEndpointHandler')({
			queryHandler:	workspace.streamDataInResult.entityManager.query,
			packageName:	'fbkt_data_import_staging',
			queryEntity:	{ name: 'unit_test' }
		});

		handler({
			user:	workspace.authenticatedUser,
			params:	{
				filters:	[
					{
						fieldName:	'integer_field_converted',
						dataType:		'number',
						comparator:	'>',
						value:			4
					},
				],
				limit:	2,
				orderBy:	['integer_field_converted', 'desc']
			}
		})
			.then(function(queryResult){
				fbkt().clog('QUERY LIMIT 2 RESULT', queryResult);
				done();
			});

	});

});