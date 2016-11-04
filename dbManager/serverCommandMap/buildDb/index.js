const fbkt = require('fbkt');
const tasks = fbkt(null,null,true).tasks;
const wipeDb = require('../../wipeDb');
const buildDb = require('../../buildDb');

module.exports = {
	description: [
		'node fbktServer [app].[env] buildDb',
	],
	commandList: [
		tasks.createApp,
		tasks.initServerExtensions,
		wipeDb,
		buildDb,
		tasks.stopServer
	],
	args:        {
		executionMode: 'BUILD DB'
	}
};