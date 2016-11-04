const Promise = require('bluebird');
const bookshelf = require('bookshelf');
const client = require('./client.js');

let _bookshelf = null;

module.exports = function(){
	return Promise.resolve(client())
		.then((client)=>{
			_bookshelf = _bookshelf || new bookshelf(client);
			return _bookshelf
		})
};