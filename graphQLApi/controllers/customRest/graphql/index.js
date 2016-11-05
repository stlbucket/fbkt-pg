const fbkt = require('fbkt');
const R = require('ramda');

module.exports = {
	url:      '/graphql',
	restEndpoints: {
		post: {
			disabled: false,
			auth:     'none',
			handler:  (callInfo)=>{
				fbkt().clog('GRAPH QL', callInfo, true);
				return {
					message:	'gotcha'
				};
			}
		}
	}
};