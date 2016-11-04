const Promise = require('bluebird');
const fbkt = require('fbkt');
const client = require('./client.js');

module.exports = function(callInfo) {
	return Promise.resolve(client())
		.then((client)=>{
			return client.raw(callInfo.sql)
			// .debug()
			// .then(function(result){
			// 	console.log('result', result.rows.length);
			// 	return result;
			// })
		})
		.catch(function(error){
			// console.log('fbkt query error', error);
			throw error;
		});
};
