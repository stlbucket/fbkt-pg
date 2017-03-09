module.exports = {
  port: process.env.PORT || 20831,
  appRouteFilter: process.env.APP_ROUTE_FILTER,
	restErrorMode: process.env.REST_ERROR_MODE,
  defaultEntityControllerAuth: process.env.DEFAULT_ENTITY_CONTROLLER_AUTH,
  dbAccess:	{
		client: process.env.DB_CLIENT,
    connection: process.env.DB_CONNECTION,
		debug: process.env.DB_DEBUG === 'true',
	}
};
