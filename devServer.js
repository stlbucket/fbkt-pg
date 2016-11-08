let Fbkt = require('fbkt');
let config = require('./config/dev');
const fbktpg = require('./index');
let appLibs = {
	dbAccess:		fbktpg.dbAccess,
	coreDb:			fbktpg.coreDb,
	dbManager:	fbktpg.dbManager,
	pgRestApi:	fbktpg.pgRestApi
};


const fbkt = Fbkt(config, appLibs);

fbkt.runServer();