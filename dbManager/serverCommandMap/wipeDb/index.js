const fbkt = require('fbkt');
const wipeDb = require('../../wipeDb');
const tasks = fbkt.baseCommandMap.tasks;

module.exports = {
	description: [
		'node fbktServer [app].[env] wipeDb',
	],
	commandList: [
		tasks.createApp,
		tasks.initServerExtensions,
		wipeDb,
		tasks.stopServer
	],
	args:        {
		executionMode: 'BUILD DB'
	}
};