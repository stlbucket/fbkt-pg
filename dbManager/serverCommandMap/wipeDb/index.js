const fbkt = require('fbkt');
const tasks = fbkt(null,null,true).tasks;
const wipeDb = require('../../wipeDb');

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