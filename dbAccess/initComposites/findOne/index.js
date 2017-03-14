"use strict";
const R       = require('ramda');
const Promise = require('bluebird');
const fbkt    = require('fbkt');

module.exports = R.curry((composite, callInfo)=> {
  // fbkt().clog('BLAH', composite, true); //process.exit();

  return fbkt().FbktPipe({
    name: 'initComposite.findOne',
    filename: __filename,
    expectedParams: {},
    pipelineParams: {},
    pipelineSteps: {  // any number of functions
      "findOne": function (callInfo) {
        // fbkt().clog('FIND ONE COMPOSITE', callInfo, true);
        return fbkt()
          .dbTree[composite.schemaName]
          .view[composite.tableName + '_composite_view']
          .findOne(callInfo)
          .then(function (viewResult) {
            fbkt().clog('viewResult', viewResult, true);
            process.exit();
            return viewResult ?
              R.is(Error, viewResult) ? viewResult : viewResult
              : null;
          });
      }
    }
  }, callInfo);
});

// module.exports = R.curry((composite, callInfo)=> {
//   fbkt().clog('BLAH', composite, true); //process.exit();
//
// 	return fbkt().FbktPipe({
// 		name:           'initComposite.findOne',
// 		filename:       __filename,
// 		expectedParams: {},
// 		pipelineParams: {},
// 		pipelineSteps: {  // any number of functions
// 			"findOne": function (callInfo) {
// 				fbkt().clog('FIND ONE COMPOSITE', callInfo, true);
// 				return fbkt()
// 					.dbTree[callInfo.params.composite.schemaName]
// 					.view[callInfo.params.composite.tableName + '_composite_view']
// 					.findOne(callInfo.params)
// 					.then(function (viewResult) {
// 						fbkt().clog('viewResult', viewResult);
// 						return viewResult ?
// 							R.is(Error, viewResult) ? viewResult : viewResult
// 							: null;
// 					});
// 			}
// 		}
// 	}, R.mergeWith(R.mergeWith, callInfo, {params: {composite: composite}}));
// });