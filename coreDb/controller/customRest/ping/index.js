
module.exports = {
	url:      '/FbktCoreDb/Fbkt',
	restEndpoints: {
		getAll: {
			disabled: false,
			auth:     'none',
			handler:  function (options) {
				return "GET ALL PING";
			}
		},
		getOne: {
			disabled: false,
			auth:     'none',
			handler:  function (options) {
				return "GET ONE PING";
			}
		},
		post: {
			disabled: false,
			auth:     'none',
			handler:  function (options) {
				return "POST PING";
			}
		},
		put: {
			disabled: false,
			auth:     'none',
			handler:  function (options) {
				return "PUT PING";
			}
		},
		del: {
			disabled: false,
			auth:     'none',
			handler:  function (options) {
				return "DEL PING";
			}
		},
	}
};