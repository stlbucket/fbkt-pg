let Fbkt = require('fbkt');
const fbktpg = require('./index');
let config = require('./config/dev');

let appLibs = {
	dbAccess:		fbktpg.dbAccess,
	coreDb:			fbktpg.coreDb,
	dbManager:	fbktpg.dbManager,
	pgRestApi:	fbktpg.pgRestApi
};


const fbkt = Fbkt(config, appLibs);

fbkt.runServer();