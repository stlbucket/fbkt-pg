"use strict";
const fbkt = require('fbkt');

module.exports = ()=> {
  const pingOneEmitter = fbkt().libs.restApi.eventEmitters.ping().on(
    'PING_ONE',
    e=>{
      console.log('PING EMITTED', e);
      fbkt().dbTree.fbkt_core_db.table.ping_request.save({
        params: {
          uid:  e
        }
      })
  });
};