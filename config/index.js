module.exports = {
  port: process.env.PORT || 20831,
  appRouteFilter: process.env.APP_ROUTE_FILTER,
	restErrorMode: process.env.REST_ERROR_MODE,
  defaultEntityControllerAuth: process.env.DEFAULT_ENTITY_CONTROLLER_AUTH,
  dbAccess:	{
		client: process.env.DB_CLIENT,
    connection: process.env.DB_CONNECTION,
		// connection: {
		// 	host: process.env.DB_CONNECTION_HOST,
		// 	port: process.env.DB_CONNECTION_PORT,
		// 	user: process.env.DB_CONNECTION_USER,
		// 	password: process.env.DB_CONNECTION_PASSWORD,
		// 	charset: process.env.DB_CONNECTION_CHARSET,
		// 	database: process.env.DB_CONNECTION_DATABASE
		// },
		debug: process.env.DB_DEBUG === 'true',
	}
};
