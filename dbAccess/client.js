const Promise = require('bluebird');
var _ = require('lodash');
var knex = require('knex');
var _client = null;

var fbkt = require('fbkt');
var _connectionInfo = null;

module.exports = function(){
	_connectionInfo = fbkt().getConfigValue('dbAccess');

	if (_client){
		//console.log('========POSTGRES CLIENT ALREADY CONNECTED=============');
		return _client;
	} else {
		var _ciDisplay = _.cloneDeep(_connectionInfo);
		delete _ciDisplay.connection.password;
		console.log('CONNECTION INFO', _ciDisplay);
		_client = knex(_connectionInfo);

		// console.log('CLIENT', _client);
		return Promise.resolve(_client)
			.then(()=>{
				return _client.queryBuilder().select(1);
			})
			.then((result)=> {
				console.log('++++++++++NEW POSTGRES CLIENT CONNECTED++++++++++');
				console.log('DATABASE NAME', _connectionInfo.connection.database);
				console.log('++++++++++NEW POSTGRES CLIENT CONNECTED++++++++++');
				// console.log('CONNECTION RESULT', result);
				return _client;
			})
			.catch((error)=>{
				fbkt().clog('CONNECTION ERROR', error);
				const target = config.target();
				console.log(
					`CURRENT TARGET: ${target}\n`,
					'\n',
					'Please create a database and update your config appropriately\n',
					'\n',
					`CURRENT DB CONFIG - (please look in: scripts/config/${target.split('.')[0]}/dev)\n`,
					'\n',
					_connectionInfo	
				);
				process.exit();
			});
	};
};