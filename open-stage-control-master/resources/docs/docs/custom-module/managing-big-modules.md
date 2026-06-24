Starting with `v1.6.0`, custom modules can load submodules with the `require()` function.

**1**. define some variable in `number.js`

```javascript
module.exports = 42
```

**2**. retrieve it in your main module file (`main.js`):

```javascript
var num = require('./number.js')

module.exports = {
    init: function(){
        console.log(num) // 42
    },
    oscInFilter: function(data){
        // etc
    }
}
```
