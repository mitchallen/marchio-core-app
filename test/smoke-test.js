/**
    Module: marchio-core-app
      Test: smoke-test
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint mocha: true */
/*jshint esversion: 6 */

"use strict";

var request = require('supertest'),
    should = require('should'),
    killable = require('killable'),
    modulePath = "../modules/index",
    TEST_PORT = process.env.TEST_PORT || 8080;;

describe('module factory smoke test', () => {

    var _factory = null;

    var _server = null;

    var _testModel = {
        name: 'datastore-test',
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" },
            // In a real world example, password would be hashed by middleware before being saved
            password: { type: String, select: false },  // select: false, exclude from query results
            // alpha:    { type: String, required: true, default: "AAA" },
            // beta :    { type: String, default: "BBB" },
        }
    };

    before( done => {
        // Call before all tests
        delete require.cache[require.resolve(modulePath)];
        _factory = require(modulePath);
        done();
    });

    after( done => {
        // Call after all tests
        done();
    });

    beforeEach( done => {
        // Call before each test
        _server = null;
        done();
    });

    afterEach( done => {
        // Call after eeach test
        if( _server ) {
            // console.log("killing server");
            if( _server.kill ) {
                _server.kill(() => {});
            }
        }

        _server = null;
        done();
    });

    it('module should exist', done => {
        should.exist(_factory);
        done();
    });

    it('create method with no spec should fail', done => {
        _factory.create()
        .then(function(obj){
            should.exist(obj);
        })
        .catch( function(err) { 
            // console.error(err); 
            done();  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with spec.model should return object', done => {
        _factory.create({
            model: _testModel
        })
        .then(function(obj){
            should.exist(obj);
            done();
        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with spec.model should return app', done => {
        _factory.create({
            model: _testModel
        })
        .then(function(obj){
            should.exist(obj);
            should.exist(obj.app);
            done();
        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method should be able to listen', done => {
        _factory.create({
            model: _testModel
        })
        .then(function(obj){
            should.exist(obj);
            var app = obj.app;
            _server = app.listen(TEST_PORT, () => {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            done();
        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });
});
