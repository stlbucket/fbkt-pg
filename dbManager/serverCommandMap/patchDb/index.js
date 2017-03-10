const fbkt = require('fbkt');
const buildDb = require('../../buildDb');
const tasks = fbkt.baseCommandMap.tasks;

module.exports = {
	description: [
		'node fbktServer [app].[env] patchDb',
	],
	commandList: [
		tasks.createApp,
		tasks.initServerExtensions,
		buildDb,
		tasks.stopServer
	],
	args:        {
		executionMode: 'BUILD DB'
	}
};