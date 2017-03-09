"use strict";
const should = require('should');
const uuid   = require('uuid')
const expect = require('chai').expect;
const fbkt   = require('fbkt');

const pipeDef = require('./index');

describe(__filename, function () {

  it.only('CHECKS FOR SOMETHING', function (done) {
    const testId = uuid.v4();
    const user   = {login: "who@cares.com"};
    const params = {
      reportFileName: './ignoreAllThis/buildCompositeViewUnitTest.txt',
      composite: {
        componentType: 'BASE',
        schemaName: 'fbkt_core_db',
        tableName: 'log_entry',
        components: [
          {
            componentType: 'DEPENDENCY'
            , schemaName: 'fbkt_core_db'
            , tableName: 'log_category'
            , fkField: 'log_category_id'
            , components: [
              {
                componentType: 'DEPENDENCY'
                , schemaName: 'fbkt_core_db'
                , tableName: 'mmmmmmmmmmm'
                , fkField: 'mmmmmmmmmmm_id'
              }
            ]
          },
          {
            componentType: 'DEPENDENCY'
            , schemaName: 'fbkt_core_db'
            , tableName: 'log_level'
            , fkField: 'log_level_id'
          }
        ]
      }
    };

    const pipe = pipeDef();

    pipe.execute({
      user: user,
      params: params,
      recordPipe: false
    })
      .then((result)=> {
        // fbkt().clog('FUNCTION BUCKET WORKSPACE', pipe.ws, true);
        fbkt().clog('RESULT', result);
        done();
      })
      .catch(error=> {
        fbkt().clog('UNEXPECTED ERROR', error);
        done(error);
      });

  });


});