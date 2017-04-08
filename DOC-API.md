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
