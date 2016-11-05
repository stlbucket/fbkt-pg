const R = require('ramda');
let Fbkt = require('fbkt');
let config = require('./config/dev');
const fbktpg = require('./index');
let appLibs = {
	dbAccess:		fbktpg.dbAccess,
	coreDb:			fbktpg.coreDb,
	dbManager:	fbktpg.dbManager,
	pgRestApi:	fbktpg.pgRestApi
};


var command = process.argv[3] || 'runServer';
const fbkt = Fbkt(config, appLibs);

fbkt.clog('FBKT CONFIG', fbkt.config, true);
fbkt.runServer(command);
