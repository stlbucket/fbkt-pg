var _ = require('lodash');
var fbkt = require('fbkt');

module.exports = function(_fbkt){
	var routes = _.map(fbkt().app._router.stack, function(stackItem){
		//if (stackItem.route && stackItem.route.path.indexOf('FbktLogin') > -1){
		//	fbkt().clog('stackItem', stackItem.route, true);
		//}
		return {
			url:		stackItem.route ? stackItem.route.path : null,
			type:		stackItem.route ? _.keys(stackItem.route.methods)[0] : null,
		}
	});

	return _fbkt.appRoutes = _.filter(routes, function(route){
		return route.url !== null;
	});
};