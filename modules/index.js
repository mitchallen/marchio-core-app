/**
    Module: marchio-core-app
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

const bodyParser = require('body-parser');

/**
 * Module
 * @module marchio-core-app
 */

/**
 * 
 * Factory module
 * @module marchio-core-app-factory
 */

/** 
 * Factory method 
 * It takes one spec parameter that must be an object with named parameters
 * @param {Object} spec Named parameters object
 * @param {Object} spec.model Model definition
 * @param {Object} [spec.use] Middleware to be passed on to app.use
 * @param {boolean} [spec.numeric] If true (default), id parameter is converted to a number
 * @returns {Promise} that resolves to {module:marchio-core-app}
 * @example <caption>Usage example</caption>
    "use strict";

    var killable = require('killable'),
        factory = require("marchio-core-app");

    var _modelName = 'coretest';

    var _testModel = {
        name: _modelName,
        fields: {
            email:    { type: String, required: true },
            status:   { type: String, required: true, default: "NEW" }
        }
    };
 
    factory.create({
        model: _testModel
    })
    .then( (obj) => {
        var app = obj.app;
        var path = '/:model/:id';
        var fGet = ( req, res, next ) => {
            var dbId = req.params._id; 
            var model = req.params.model;
            // console.log( req.params );
            res
                .location( req.baseUrl + "/" + [ _modelName, dbId ].join('/') )  // .location("/" + model + "/" + doc._id)
                .status(200)    
                .json( req.params );

        };
        app.get(path, fGet);
        _server = app.listen(TEST_PORT, function() {
            console.log(`listening on port ${TEST_PORT}`);   
        });
        killable(_server);
    })
    .catch( (err) => { 
        console.error(err); 
    });
 */
module.exports.create = (spec) => {

    return new Promise((resolve, reject) => {

        const express = require('express'),
              app = express();
      
        spec = spec || {};

        var model = spec.model,
            numeric = spec.numeric === undefined ? true : spec.numeric,
            middleware = spec.use;

        if( ! model ) {
            reject( new Error(".create: model must be defined"));
        }

        if( ! model.name ) {
            reject ( new Error(".create: model.name must be defined"));
        }

        model.fields = model.fields || {};

        // Automatically parse request body as JSON
        app.use(bodyParser.json());

        app.param('model', function(req, res, next) {
            var eMsg = '';

            if( req.params.model !== model.name ) {
                eMsg = `### ERROR: '${req.params.model}' is not a valid database model`;
                // console.error(eMsg);
                res
                    .status(404)
                    .json({ error: eMsg });
                return; // on error do NOT call next
            }

            next();
        });

        app.param('id', function(req, res, next) {

            // for Google Datastore: if string would go in as 'name' and not 'id' 

            var dbId = req.params.id;

            if( numeric ) {

                dbId = parseInt( req.params.id, 10 ) || -1;

                if( dbId === -1 ) {
                    // Invalid id format
                    var eMsg = `### ERROR: '${req.params.id}' is not a valid id`;
                    // console.error(eMsg);
                    res
                        .status(404)
                        .json({ error: eMsg });
                    return; // on error do NOT call next
                }
            }

            req.params._id = dbId;

            next();
        });

        if(middleware) {
            app.use(middleware);
        }

        spec.app = app;

        resolve(spec);
    });
};


