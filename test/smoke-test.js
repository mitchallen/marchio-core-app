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
    FlakeIdGen = require('flake-idgen'),
    biguint = require('biguint-format'),
    flakeGenerator = new FlakeIdGen(),
    killable = require('killable'),
    modulePath = "../modules/index",
    TEST_PORT = process.env.TEST_PORT || 8080;

describe('module factory smoke test', () => {

    var _factory = null;

    var _server = null;

    var _modelName = 'coretest';

    var _testModel = {
        name: _modelName,
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" },
            // In a real world example, password would be hashed by middleware before being saved
            password: { type: String, select: false },  // select: false, exclude from query results
            // alpha:    { type: String, required: true, default: "AAA" },
            // beta :    { type: String, default: "BBB" },
        }
    };

    var _testHost = `http://localhost:${TEST_PORT}`;

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
        .then( obj => {
            should.exist(obj);
        })
        .catch( err => {  
            // console.error(err); 
            done();  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with spec.model should return object', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            done();
        })
        .catch( err => {  
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with spec.model should return app', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            should.exist(obj.app);
            done();
        })
        .catch( err => {  
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('app should be able to listen', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            _server = app.listen(TEST_PORT, () => {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            done();
        })
        .catch( err => {  
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('app should be able to get model and id', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model/:id';
            var fGet = ( req, res, next ) => {
                var dbId = req.params._id;  // set by validateParams
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( req.params );

            };
            app.get(path, fGet);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            // var _recordId = res.body._id; 
            var _recordId = 123;    // can be anything, not validating here against post / db
            var _getUrl = `/${_testModel.name}/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .get(_getUrl)
                .expect(200)
                .end( (err, res) =>  {
                    should.not.exist(err);
                    // console.log(res.body);
                    should.exist(res.body.model);
                    should.exist(res.body._id);
                    should.exist(res.body.id);
                    res.body.model.should.eql(_testModel.name);
                    res.body._id.should.eql(123);
                    res.body.id.should.eql('123');
                    done();
                });
        })
        .catch( err => {  
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with numeric true should be able to get model and id', done => {
        _factory.create({
            model: _testModel,
            numeric: true
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model/:id';
            var fGet = ( req, res, next ) => {
                var dbId = req.params._id;  // set by validateParams
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( req.params );

            };
            app.get(path, fGet);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            // var _recordId = res.body._id; 
            var _recordId = 123;    // can be anything, not validating here against post / db
            var _getUrl = `/${_testModel.name}/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .get(_getUrl)
                .expect(200)
                .end( (err, res) =>  {
                    should.not.exist(err);
                    // console.log(res.body);
                    should.exist(res.body.model);
                    should.exist(res.body._id);
                    should.exist(res.body.id);
                    res.body.model.should.eql(_testModel.name);
                    res.body._id.should.eql(123);
                    res.body.id.should.eql('123');
                    done();
                });
        })
        .catch( err => {  
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with numeric false should be able to get model and id', done => {
        _factory.create({
            model: _testModel,
            numeric: false
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model/:id';
            var fGet = ( req, res, next ) => {
                var dbId = req.params._id;  // set by validateParams
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( req.params );

            };
            app.get(path, fGet);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            // var _recordId = res.body._id; 
            var _recordId = 123;    // can be anything, not validating here against post / db
            var _getUrl = `/${_testModel.name}/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .get(_getUrl)
                .expect(200)
                .end( (err, res) =>  {
                    should.not.exist(err);
                    // console.log(res.body);
                    should.exist(res.body.model);
                    should.exist(res.body._id);
                    should.exist(res.body.id);
                    res.body.model.should.eql(_testModel.name);
                    res.body._id.should.eql('123'); 
                    res.body.id.should.eql('123');
                    done();
                });
        })
        .catch( err => {  
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('create method with non-numeric id should be able to get model and id', done => {
        _factory.create({
            model: _testModel,
            numeric: false
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model/:id';
            var fGet = ( req, res, next ) => {
                var dbId = req.params._id;  // set by validateParams
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( req.params );

            };
            app.get(path, fGet);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            // var _recordId = res.body._id; 
            var _recordId = biguint( flakeGenerator.next(), 'dec');
            var _getUrl = `/${_testModel.name}/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .get(_getUrl)
                .expect(200)
                .end( (err, res) =>  {
                    should.not.exist(err);
                    // console.log(res.body);
                    should.exist(res.body.model);
                    should.exist(res.body._id);
                    should.exist(res.body.id);
                    res.body.model.should.eql(_testModel.name);
                    res.body._id.should.eql(_recordId); 
                    res.body.id.should.eql(_recordId);
                    done();
                });
        })
        .catch( err => {  
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('app should return 404 for invalid model', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model/:id';
            var fGet = ( req, res, next ) => {
                var dbId = req.params._id;  // set by validateParams
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( req.params );

            };
            app.get(path, fGet);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            // var _recordId = res.body._id; 
            var _recordId = 123;    // can be anything, not validating here against post / db
            var _getUrl = `/BOGUS/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .get(_getUrl)
                .expect(404)
                .end( (err, res) =>  {;
                    done();
                });
        })
        .catch( err => { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('app should return 404 if expected id not found', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model/:id';
            var fGet = ( req, res, next ) => {
                var dbId = req.params._id;  // set by validateParams
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( req.params );

            };
            app.get(path, fGet);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            var _getUrl = `/${_testModel.name}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .get(_getUrl)
                .expect(404)
                .end( (err, res) =>  {
                    done();
                });
        })
        .catch( err => {  
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('app should be able to post model and id', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model/:id';
            var fPost = ( req, res, next ) => {
                var dbId = req.params._id;  // set by validateParams
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( req.params );

            };
            app.post(path, fPost);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            // var _recordId = res.body._id; 
            var _recordId = 123;    // can be anything, not validating here against post / db
            var _postUrl = `/${_testModel.name}/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .post(_postUrl)
                .send({})
                .expect(200)
                .end( (err, res) =>  {
                    should.not.exist(err);
                    // console.log(res.body);
                    should.exist(res.body.model);
                    should.exist(res.body._id);
                    should.exist(res.body.id);
                    res.body.model.should.eql(_testModel.name);
                    res.body._id.should.eql(123);
                    res.body.id.should.eql('123');
                    done();
                });
        })
        .catch( function(err) { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('app should be able to post model with no id', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model';
            var fPost = ( req, res, next ) => {
                var dbId = 123;  // would usually get from db after post
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( { model: model, _id: dbId } );

            };
            app.post(path, fPost);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            // var _recordId = res.body._id; 
            var _recordId = 123;    // can be anything, not validating here against post / db
            var _postUrl = `/${_testModel.name}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .post(_postUrl)
                .send({})
                .expect(200)
                .end( (err, res) =>  {
                    should.not.exist(err);
                    // console.log(res.body);
                    should.exist(res.body.model);
                    res.body.model.should.eql(_testModel.name);
                    should.exist(res.body._id);
                    should.not.exist(res.body.id);
                    done();
                });
        })
        .catch( err => {  
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });


    it('app should be able to put model and id', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model/:id';
            var fPut = ( req, res, next ) => {
                var dbId = req.params._id;  // set by validateParams
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( req.params );

            };
            app.post(path, fPut);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            // var _recordId = res.body._id; 
            var _recordId = 123;    // can be anything, not validating here against post / db
            var _putUrl = `/${_testModel.name}/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .post(_putUrl)
                .send({})
                .expect(200)
                .end( (err, res) =>  {
                    should.not.exist(err);
                    // console.log(res.body);
                    should.exist(res.body.model);
                    should.exist(res.body._id);
                    should.exist(res.body.id);
                    res.body.model.should.eql(_testModel.name);
                    res.body._id.should.eql(123);
                    res.body.id.should.eql('123');
                    done();
                });
        })
        .catch( err => { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('app should be able to patch model and id', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model/:id';
            var fPatch = ( req, res, next ) => {
                var dbId = req.params._id;  // set by validateParams
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( req.params );

            };
            app.patch(path, fPatch);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            // var _recordId = res.body._id; 
            var _recordId = 123;    // can be anything, not validating here against post / db
            var _patchUrl = `/${_testModel.name}/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .patch(_patchUrl)
                .send({})
                .expect(200)
                .end( (err, res) =>  {
                    should.not.exist(err);
                    // console.log(res.body);
                    should.exist(res.body.model);
                    should.exist(res.body._id);
                    should.exist(res.body.id);
                    res.body.model.should.eql(_testModel.name);
                    res.body._id.should.eql(123);
                    res.body.id.should.eql('123');
                    done();
                });
        })
        .catch( err => {  
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });

    it('app should be able to delete model and id', done => {
        _factory.create({
            model: _testModel
        })
        .then( obj => {
            should.exist(obj);
            var app = obj.app;
            var path = '/:model/:id';
            var fDel = ( req, res, next ) => {
                var dbId = req.params._id;  // set by validateParams
                var model = req.params.model;
                // console.log( req.params );
                res
                    .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                    .status(200)    
                    .json( req.params );

            };
            app.delete(path, fDel);
            _server = app.listen(TEST_PORT, function() {
                // console.log(`listening on port ${TEST_PORT}`);   
            });
            killable(_server);
            return Promise.resolve(true);
        })
        .then( () => {
            // var _recordId = res.body._id; 
            var _recordId = 123;    // can be anything, not validating here against post / db
            var _delUrl = `/${_testModel.name}/${_recordId}`;
            // console.log("GET URL: ", _getUrl);
            request(_testHost)
                .del(_delUrl)
                .expect(200)
                .end( (err, res) =>  {
                    should.not.exist(err);
                    // console.log(res.body);
                    should.exist(res.body.model);
                    should.exist(res.body._id);
                    should.exist(res.body.id);
                    res.body.model.should.eql(_testModel.name);
                    res.body._id.should.eql(123);
                    res.body.id.should.eql('123');
                    done();
                });
        })
        .catch( err => { 
            console.error(err); 
            done(err);  // to pass on err, remove err (done() - no arguments)
        });
    });
});
