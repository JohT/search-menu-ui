if (typeof Object.create != 'function') {
    Object.create = (function(undefined) {
      var Temp = function() {};
      return function (prototype, propertiesObject) {
        if(prototype !== Object(prototype) && prototype !== null) {
          throw TypeError('Argument must be an object, or null');
        }
        Temp.prototype = prototype || {};
        if (propertiesObject !== undefined) {
          Object.defineProperties(Temp.prototype, propertiesObject);
        } 
        var result = new Temp(); 
        Temp.prototype = null;
        // to imitate the case of Object.create(null)
        if(prototype === null) {
           result.__proto__ = null;
        } 
        return result;
      };
    })();
  }