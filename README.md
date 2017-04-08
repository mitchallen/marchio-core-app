marchio-core-app
==
marchio-core-app
--

<p align="left">
  <a href="https://travis-ci.org/mitchallen/marchio-core-app">
    <img src="https://img.shields.io/travis/mitchallen/marchio-core-app.svg?style=flat-square" alt="Continuous Integration">
  </a>
  <a href="https://codecov.io/gh/mitchallen/marchio-core-app">
    <img src="https://codecov.io/gh/mitchallen/marchio-core-app/branch/master/graph/badge.svg" alt="Coverage Status">
  </a>
  <a href="https://npmjs.org/package/marchio-core-app">
    <img src="http://img.shields.io/npm/dt/marchio-core-app.svg?style=flat-square" alt="Downloads">
  </a>
  <a href="https://npmjs.org/package/marchio-core-app">
    <img src="http://img.shields.io/npm/v/marchio-core-app.svg?style=flat-square" alt="Version">
  </a>
  <a href="https://npmjs.com/package/marchio-core-app">
    <img src="https://img.shields.io/github/license/mitchallen/marchio-core-app.svg" alt="License"></a>
  </a>
</p>

## Installation

    $ npm init
    $ npm install marchio-core-app --save
  
* * *

## Introduction

The purpose of this module is to provide core expressjs processing middleware for REST urls in the form of __/:model/:id?__.

If a matching model name is not found, or an id is expected, a 404 will be returned by the middleware.

* * *

## Modules

<dl>
<dt><a href="#module_marchio-core-app">marchio-core-app</a></dt>
<dd><p>Module</p>
</dd>
<dt><a href="#module_marchio-core-app-factory">marchio-core-app-factory</a></dt>
<dd><p>Factory module</p>
</dd>
</dl>

<a name="module_marchio-core-app"></a>

## marchio-core-app
Module

<a name="module_marchio-core-app-factory"></a>

## marchio-core-app-factory
Factory module

<a name="module_marchio-core-app-factory.create"></a>

### marchio-core-app-factory.create(spec) ⇒ <code>Promise</code>
Factory method 
It takes one spec parameter that must be an object with named parameters

**Kind**: static method of <code>[marchio-core-app-factory](#module_marchio-core-app-factory)</code>  
**Returns**: <code>Promise</code> - that resolves to {module:marchio-core-app}  

| Param | Type | Description |
| --- | --- | --- |
| spec | <code>Object</code> | Named parameters object |
| spec.model | <code>Object</code> | Model definition |
| [spec.use] | <code>Object</code> | Middleware to be passed on to app.use |
| [spec.numeric] | <code>boolean</code> | If true (default), id parameter is converted to a number |

**Example** *(Usage example)*  
```js
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
```

* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/marchio-core-app.git](https://bitbucket.org/mitchallen/marchio-core-app.git)
* [github.com/mitchallen/marchio-core-app.git](https://github.com/mitchallen/marchio-core-app.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.1.4

* Added __numeric__ flag to create method
* If __numeric__ is set to __false__, the id parameter will be treated like a string

#### Version 0.1.3

* Refactored test cases and doc example

#### Version 0.1.2

* Fixed version history

#### Version 0.1.1 

* initial release

* * *
