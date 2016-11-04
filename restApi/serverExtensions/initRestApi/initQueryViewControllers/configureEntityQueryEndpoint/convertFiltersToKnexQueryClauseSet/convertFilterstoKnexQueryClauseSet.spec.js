var uuid = require('node-uuid');
var util = require('util');
var _ = require('lodash');
var should = require('should');

var fbkt = require('fbkt');
var convertFilterstoKnexQueryClauseSet = require('./index');

describe.skip(__filename, function () {
	var testId = uuid.v4();
	var workspace = {};

	it('login user', function (done) {
		new fbkt().fbktLogin.loginUser({
			params: {
				login:          'functionbucket@gmail.com',
				hashedPassword: fbkt().crypto.sha2encrypt('smartPwd')
			}
		})()
			.then(function (authenticatedUser) {
				fbkt().clog('AUTHENTICATED USER', authenticatedUser);
				workspace.authenticatedUser = authenticatedUser;
				done();
			});
	});

	it('convert filters to knex query clause set', function (done) {
		convertFilterstoKnexQueryClauseSet({
			params:	{
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
			}
		})()
			.then(function(knexQueryClauseSet){
				fbkt().clog('KNEX QUERY CLAUSE SET', knexQueryClauseSet);
				workspace.knexQueryClauseSet = knexQueryClauseSet;
				done();
			});
	});

	it('query transmissions', function (done) {
		fbkt().dbTree.in_situ.view.transmission_summary_view.query({
			user:	{},
			params:	workspace.knexQueryClauseSet,
			debugQuery: true
		})
			.then(function(queryResult){
				fbkt().clog('KNEX QUERY RESULT', queryResult);
				workspace.queryResult = queryResult;
				done();
			});
	});

	it('query transmission summary views directly', function (done) {
		var qb = fbkt().fbktDb.client().queryBuilder();

		qb.from('in_situ.transmission_summary_view')
			.select()
			.whereRaw("document_key like '%04_47%'")
			.then(function(result){
				fbkt().clog('TRANSMISSION SUMMARY VIEWS', result);
				done();
			});
	});

	it.skip('query transmission summary views', function (done) {
		fbkt().dbTree.in_situ.view.transmission_summary_view.query({
			user:	{},
			params:	{
				where:	[
					['id', '=',	1]
				]
			},
			debugQuery:	true
		})
			.then(function(result){
				fbkt().clog('TRANSMISSION SUMMARY VIEWS', result);
				done();
			});
	});

	it.skip('query transmission summary views', function (done) {
		fbkt().dbTree.in_situ.view.transmission_summary_view.query({
			user:	{},
			params:	{
				where:	[
					['site','=','DEMO']
				],
				whereRaw:	[
					["document_key like '%04_47%'"]
				]
			},
			debugQuery:	true
		})
			.then(function(result){
				fbkt().clog('TRANSMISSION SUMMARY VIEWS', result);
				fbkt().clog('TRANSMISSION SUMMARY VIEWS', _.map(result, function(xm){
					return {
						id:	xm.id,
						name: xm.name
					}
				}));
				done();
			});
	});

});