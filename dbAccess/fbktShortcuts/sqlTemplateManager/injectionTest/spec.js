var uuid = require('uuid');
var util = require('util');
var _ = require('lodash');
var should = require('should');

var fbkt = require('fbkt');

describe(__filename, function () {
	var testId = uuid.v4();
	var workspace = {};

	it('make schema and table to test against', function (done) {
		var sql = [
			'DROP SCHEMA IF EXISTS sql_inject_test CASCADE;',
			'CREATE SCHEMA sql_inject_test;',
			'',
			'SET search_path TO sql_inject_test, public;',
			'',
			'CREATE TABLE inject (',
			'id 						serial  NOT NULL,',
			'text_field			text,',
			'text_field_escaped			text,',
			'CONSTRAINT 		pk_inject PRIMARY KEY ( id )',
			')'
		].join('\n');

		fbkt().libs.dbAccess.query({
			sql:	sql
		})
			.then(function(createTableResult){
				// fbkt().clog('CREATE TABLE RESULT', createTableResult);
				done();
			})
	});

	it('insert data via sqlTemplateManager', function (done) {
		var testString = 'TEST';
		
		return fbkt().sqlTemplateManager({
			params: {
				templateFilePath: `${__dirname}/template.hbs`,
				executionMode:    'REPORTIT',
				reportFileName:   './ignoreAllThis/injectTestTemplateOutput.txt',
				templateData:     {
					textData: testString,
				},
				expectScalar:     true
			}
		})
			.then(function(dbResult){
				// fbkt().clog('injection dbResult', dbResult);
				done();
			})
			.catch(done);
	});

	it('insert data via sqlTemplateManager', function (done) {
		var testString = '~!@#$%^&*()_+';

		return fbkt().sqlTemplateManager({
			params: {
				templateFilePath: `${__dirname}/template.hbs`,
				executionMode:    'REPORTIT',
				reportFileName:   './ignoreAllThis/injectTestTemplateOutput.txt',
				templateData:     {
					textData: testString
				},
				expectScalar:     true
			}
		})
			.then(function(dbResult){
				// fbkt().clog('injection test result', {
				// 	testString:	'~!@#$%^&*()_+',
				// 	insertResult:	dbResult
				// });
				done();
			})
			.catch(done);
	});

	it('cleanup', function (done) {
		var sql = [
			'DROP SCHEMA IF EXISTS sql_inject_test CASCADE;',
		].join('\n');

		fbkt().libs.dbAccess.query({
			sql:	sql
		})
			.then(function(cleanupResult){
				// fbkt().clog('CLEANUP TABLE RESULT', cleanupResult);
				done();
			})
	});

});