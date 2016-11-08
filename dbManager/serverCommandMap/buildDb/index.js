const fbkt = require('fbkt');
const wipeDb = require('../../wipeDb');
const buildDb = require('../../buildDb');
const tasks = fbkt.baseCommandMap.tasks;

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