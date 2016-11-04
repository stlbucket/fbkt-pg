"use strict";
const fbkt = require('fbkt');
const moment = require('moment');
const R = require('ramda');
const Promise = require('bluebird');


var _agents = [];

const Agent = class {
	constructor(handler) {
		this.handler = handler;
	}

	handleRequest(requestInfo){
		console.log('REQUEST INFO METHOD', requestInfo);
		const paramsSource = R.contains(requestInfo.method, ['GET', 'DELETE']) ? 'params' : 'body';

		const callInfo = {
			user:   requestInfo.user,
			params: requestInfo[paramsSource],
		};

		const handler = this.handler;

		console.log('AGENT CALL INFO', callInfo);
		console.log('HANDLER', handler);
		return Promise.resolve(handler(callInfo))
			.then((result)=>{
				requestInfo.res.send(result);
			})
			.catch((error)=>{
				console.log('REST ERROR', error);
				switch(fbkt().config.getConfigValue('restErrorMode')) {
					case "OPEN":	
						requestInfo.res.send(error);
						break;
					default:
						requestInfo.res.send(500);
						break;
				}
			});
	}
};


module.exports = (callInfo)=>{
	const agent = new Agent(callInfo.params.handler);
	_agents.push(agent);
	return agent.handleRequest.bind(agent);
};