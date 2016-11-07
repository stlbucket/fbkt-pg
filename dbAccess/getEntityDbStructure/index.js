"use strict";
const R = require('ramda');
const Promise = require('bluebird');
const fbkt = require('fbkt');


module.exports = (callInfo)=> {
	return fbkt().FbktPipe({
		name:           'dbAccess.getEntityDbStructure',
		filename:       __filename,
		exitProcessOnError: true,
		expectedParams: {},
		pipelineParams: {
			dbStructure:	"getDbStructure"
		},
		pipelineSteps:  {
			"getDbStructure":	fbkt().libs.dbAccess.getDbStructure,
			"getEntityDbStructure":	(callInfo)=>{
				const dbStructure = callInfo.params.dbStructure;
				// fbkt().clog('getEntityDbStructure', callInfo);
				// fbkt().clog('CURRENT dbStructure', dbStructure);

				if (dbStructure.length > 0){
					const split = R.split(".", callInfo.params.dbTreePath);
					const schema = R.find(R.propEq('schema_name', split[0]), dbStructure);
					const type = 		split[1];
					const entityStructure = R.find(R.propEq('table_name', split[2]), schema[`${type}s`]);

					return {
						schema:			schema.schema_name,
						type:				type,
						entityName:	entityStructure.table_name,
						dbTreePath:	callInfo.params.dbTreePath,
						structure:		entityStructure
					};
				} else {
					return null;
				}
			}

		}
	}, callInfo || {});
};
