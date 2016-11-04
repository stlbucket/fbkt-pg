
module.exports = {
	url:      '/FbktCoreDb/Fbkt',
	restEndpoints: {
		getAll: {
			disabled: false,
			auth:     'token',
			handler:  function (options) {
				throw new Error('NOT IMPLEMENTED');
			}
		}
	}
};