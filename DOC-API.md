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

**Example** *(Usage example)*  
```js
    var factory = require("marchio-core-app");
 
    factory.create({})
    .then(function(obj) {
        return obj.health();
    })
    .catch( function(err) { 
        console.error(err); 
    });
```
