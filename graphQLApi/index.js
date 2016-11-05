module.exports = {
	packageName:	'GraphQLApi',
	libRelativePath:	function(){
		return __dirname;
	},
	serverExtensions:	[
		require('./serverExtensions')
	],
	customRestControllers: [
		// require('./controllers/customRest/graphql')	
	]
};