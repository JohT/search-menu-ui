/*
 * Merged using [merger-js](https://www.npmjs.com/package/merger-js).
 */
// @import './../../src/js/polyfills/moduledummy'
// @import './../../src/js/polyfills/createPolyfill'
// @import './../../src/js/polyfills/arrayForEachPolyfill'
// @import './../../src/js/polyfills/jsonParsePolyfill'
// @import<<dir ./../../src/js/ponyfills/'
// @import './../../src/js/search-service-client'
// @import './../../src/js/search-menu-ui'
// Fallback for vanilla js without modules
var module = module || {}; 
var require = require || function() {};
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
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback, thisArg) {
  
      var T, k;
  
      if (this === null) {
        throw new TypeError(' this is null or not defined');
      }
  
      // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
      var O = Object(this);
  
      // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0;
  
      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function');
      }
  
      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (arguments.length > 1) {
        T = thisArg;
      }
  
      // 6. Let k be 0
      k = 0;
  
      // 7. Repeat, while k < len
      while (k < len) {
  
        var kValue;
  
        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {
  
          // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[k];
  
          // ii. Call the Call internal method of callback with T as the this value and
          // argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }
// From https://github.com/douglascrockford/JSON-js/blob/master/json2.js
//  json2.js
//  2017-06-12
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(
//                         +a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]
//                      ));
//                  }
//                  return value;
//              }
//          });

//          myData = JSON.parse(
//              "[\"Date(09/09/2001)\"]",
//              function (key, value) {
//                  var d;
//                  if (
//                      typeof value === "string"
//                      && value.slice(0, 5) === "Date("
//                      && value.slice(-1) === ")"
//                  ) {
//                      d = new Date(value.slice(5, -1));
//                      if (d) {
//                          return d;
//                      }
//                  }
//                  return value;
//              }
//          );

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return (n < 10)
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? (
                    this.getUTCFullYear()
                    + "-"
                    + f(this.getUTCMonth() + 1)
                    + "-"
                    + f(this.getUTCDate())
                    + "T"
                    + f(this.getUTCHours())
                    + ":"
                    + f(this.getUTCMinutes())
                    + ":"
                    + f(this.getUTCSeconds())
                    + "Z"
                )
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (
            value
            && typeof value === "object"
            && typeof value.toJSON === "function"
        ) {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

            return (isFinite(value))
                ? String(value)
                : "null";

        case "boolean":
        case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

        case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

            if (!value) {
                return "null";
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? (
                            "[\n"
                            + gap
                            + partial.join(",\n" + gap)
                            + "\n"
                            + mind
                            + "]"
                        )
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                (gap)
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                (gap)
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" && (
                typeof replacer !== "object"
                || typeof replacer.length !== "number"
            )) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return (
                        "\\u"
                        + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    );
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());
"use strict";

var module = module || {}; // Fallback for vanilla js without modules
/**
 * @@namespace eventlistener
 */
var eventlistener = (module.exports = {}); // Fallback for vanilla js without modules

/**
 * Adds an event listener/hander using "addEventListener" or whatever method the browser supports.
 * @param {String} eventName
 * @param {Element} element
 * @param {*} eventHandler
 * @memberof addeventlistener
 */
 eventlistener.addEventListener = function (eventName, element, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, eventHandler);
  } else {
    element["on" + eventName] = eventHandler;
  }
};

"use strict";

var module = module || {}; // Fallback for vanilla js without modules
/**
 * @@namespace eventtarget
 */
var eventtarget = (module.exports = {}); // Fallback for vanilla js without modules

/**
 * @returns {Element} target of the event
 * @memberof eventtarget
 */
eventtarget.getEventTarget = function (event) {
  if (typeof event.currentTarget !== "undefined" && event.currentTarget != null) {
    return event.currentTarget;
  }
  if (typeof event.srcElement !== "undefined" && event.srcElement != null) {
    return event.srcElement;
  } else {
    throw new Error("Event doesn't contain bounded element: " + event);
  }
};
"use strict";

var module = module || {}; // Fallback for vanilla js without modules
/**
 * @namespace selectionrange
 */
var selectionrange = (module.exports = {}); // Fallback for vanilla js without modules

selectionrange.moveCursorToEndOf = function (element) {
  if (typeof element.setSelectionRange === "function") {
    element.setSelectionRange(element.value.length, element.value.length);
  } else if (typeof element.selectionStart === "number" && typeof element.selectionEnd === "number") {
    element.selectionStart = element.selectionEnd = element.value.length;
  } else if (typeof element.createTextRange === "function") {
    var range = element.createTextRange();
    range.collapse(true);
    range.moveEnd("character", element.value.length);
    range.moveStart("character", element.value.length);
    range.select();
  }
};
"use strict";

var module = module || {}; // Fallback for vanilla js without modules
/**
 * @namespace xmlHttpRequest
 */
var xmlHttpRequest = module.exports={}; // Fallback for vanilla js without modules

/**
 * Provide the XMLHttpRequest constructor for Internet Explorer 5.x-6.x:
 * Other browsers (including Internet Explorer 7.x-9.x) do not redefine
 * XMLHttpRequest if it already exists.
 *
 * This example is based on findings at:
 * http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
 * @returns {XMLHttpRequest}
 * @memberof xmlHttpRequest
 */
 xmlHttpRequest.getXMLHttpRequest = function () {
  if (typeof XMLHttpRequest !== "undefined") {
    try {
      var request = new XMLHttpRequest();
      request.status; //try, if status is accessible. Fails in IE5.
      return request;
    } catch (e) {
      console.log("XMLHttpRequest not available: " + e);
    }
  }
  try {
    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
  } catch (e) {
    console.log("XMLHttpRequest Msxml2.XMLHTTP.6.0 not available: " + e);
  }
  try {
    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
  } catch (e) {
    console.log("XMLHttpRequest Msxml2.XMLHTTP.3.0 not available: " + e);
  }
  try {
    return new ActiveXObject("Microsoft.XMLHTTP");
  } catch (e) {
    console.log("XMLHttpRequest Microsoft.XMLHTTP not available: " + e);
  }
  // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
  throw new Error("This browser does not support XMLHttpRequest.");
};

/**
 * @file Provides the (http) client/connection to the search backend service.
 * @version {@link https://github.com/JohT/search-menu-ui/releases/latest latest version}
 * @author JohT
 * @version ${project.version}
 */

"use strict";

var module = datarestructorInternalCreateIfNotExists(module); // Fallback for vanilla js without modules

function datarestructorInternalCreateIfNotExists(objectToCheck) {
  return objectToCheck || {};
}

/**
 * Search-Menu Service-Client.
 * It provides the (http) client/connection to the search backend service.
 * @module searchMenuServiceClient
 */
var searchMenuServiceClient = (module.exports = {}); // Export module for npm...
searchMenuServiceClient.internalCreateIfNotExists = datarestructorInternalCreateIfNotExists;

var xmlHttpRequest = xmlHttpRequest || require("../../src/js/ponyfills/xmlHttpRequestPonyfill"); // supports vanilla js & npm

 searchMenuServiceClient.HttpSearchConfig = (function () {
  /**
   * Configures and builds the {@link module:searchMenuServiceClient.HttpClient}.
   * DescribedDataField is the main element of the restructured data and therefore considered "public".
   * @constructs HttpSearchConfig
   * @alias module:searchMenuServiceClient.HttpSearchConfig
   */
  function HttpSearchConfig() {
    /**
     * HTTP Search Configuration.
     * @property {string} searchUrlTemplate URL that is called for every search request. It may include variables in double curly brackets like `{{searchtext}}`.
     * @property {string} [searchMethod="POST"] HTTP Method, that is used for every search request.
     * @property {string} [searchContentType="application/json"] HTTP MIME-Type of the body, that is used for every search request.
     * @property {string} searchBodyTemplate HTTP body template, that is used for every search request. It may include variables in double curly brackets like `{{jsonSearchParameters}}`.
     * @property {XMLHttpRequest} [httpRequest=new XMLHttpRequest()] Contains the XMLHttpRequest that is used to handle HTTP requests and responses. Defaults to XMLHttpRequest.
     * @property {boolean} [debugMode=false] Adds detailed logging for development and debugging.
     */
    this.config = {
      searchUrlTemplate: "",
      searchMethod: "POST",
      searchContentType: "application/json",
      searchBodyTemplate: null,
      /**
       * Resolves variables in the search url template based on the given search parameters object.
       * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
       * @param {Object} searchParameters object properties will be used to replace the variables of the searchUrlTemplate
       */
      resolveSearchUrl: function (searchParameters) {
        return resolveTemplate(this.searchUrlTemplate, searchParameters, this.debugMode);
      },
      /**
       * Resolves variables in the search body template based on the given search parameters object.
       * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
       * @param {Object} searchParameters object properties will be used to replace the variables of the searchBodyTemplate
       */
      resolveSearchBody: function (searchParameters) {
        return resolveTemplate(this.searchBodyTemplate, searchParameters, this.debugMode);
      },
      httpRequest: null,
      debugMode: false
    };
    /**
     * Sets the url for the HTTP request for the search.
     * It may include variables in double curly brackets like {{searchtext}}.
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */
    this.searchUrlTemplate = function (value) {
      this.config.searchUrlTemplate = value;
      return this;
    };
    /**
     * Sets the HTTP method for the search. Defaults to "POST".
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */
    this.searchMethod = function (value) {
      this.config.searchMethod = value;
      return this;
    };
    /**
     * Sets the HTTP content type of the request body. Defaults to "application/json".
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */
    this.searchContentType = function (value) {
      this.config.searchContentType = value;
      return this;
    };
    /**
     * Sets the HTTP request body template that may contain variables (e.g. {{searchParameters}}) in double curly brackets, or null if there is none.
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */
    this.searchBodyTemplate = function (value) {
      this.config.searchBodyTemplate = value;
      return this;
    };
    /**
     * Sets the HTTP-Request-Object. Defaults to XMLHttpRequest if not set.
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */
    this.httpRequest = function (value) {
      this.config.httpRequest = value;
      return this;
    };
    /**
     * Sets the debug mode, that prints some more info to the console.
     * @param {boolean} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */
    this.debugMode = function (value) {
      this.config.debugMode = value === true;
      return this;
    };
    /**
     * Uses the configuration to build the http client that provides the function "search" (parameters: searchParameters, onSuccess callback).
     * @returns {module:searchMenuServiceClient.HttpClient}
     */
    this.build = function () {
      if (!this.config.httpRequest) {
        this.config.httpRequest = xmlHttpRequest.getXMLHttpRequest();
      }
      return new searchMenuServiceClient.HttpClient(this.config);
    };
  }

  /**
   * Resolves variables in the template based on the given search parameters object.
   * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
   * @param {String} template contains variables in double curly brackets that should be replaced by the values of the parameterSourceObject.
   * @param {Object} parameterSourceObject object properties will be used to replace the variables of the template
   * @param {boolean} debugMode enables/disables extended logging for debugging
   * @memberof module:searchMenuServiceClient.HttpSearchConfig
   * @protected
   */
  function resolveTemplate(template, parameterSourceObject, debugMode) {
    if (template == null) {
      return null;
    }
    var jsonSearchParameters = JSON.stringify(parameterSourceObject);
    var resolvedBody = template;
    resolvedBody = resolveVariableInTemplate(resolvedBody, "jsonSearchParameters", jsonSearchParameters);
    resolvedBody = resolveVariablesInTemplate(resolvedBody, parameterSourceObject);
    if (debugMode) {
      console.log("template=" + template);
      console.log("{{jsonSearchParameters}}=" + jsonSearchParameters);
      console.log("resolved template=" + resolvedBody);
    }
    return resolvedBody;
  }

  function resolveVariablesInTemplate(templateString, sourceDataObject) {
    var resolvedString = templateString;
    forEachFieldsIn(sourceDataObject, function (fieldName, fieldValue) {
      resolvedString = resolveVariableInTemplate(resolvedString, fieldName, fieldValue);
    });
    return resolvedString;
  }

  function resolveVariableInTemplate(templateString, fieldName, fieldValue) {
    //TODO could there be a better compatible solution to replace ALL occurrences instead of creating regular expressions?
    var variableReplaceRegExp = new RegExp("\\{\\{" + escapeCharsForRegEx(fieldName) + "\\}\\}", "gm");
    return templateString.replace(variableReplaceRegExp, fieldValue);
  }

  function escapeCharsForRegEx(characters) {
    var nonWordCharactersRegEx = new RegExp("([^-\\w])", "gi");
    return characters.replace(nonWordCharactersRegEx, "\\$1");
  }

  function forEachFieldsIn(object, fieldNameAndValueConsumer) {
    var fieldNames = Object.keys(object);
    var index, fieldName, fieldValue;
    for (index = 0; index < fieldNames.length; index += 1) {
      fieldName = fieldNames[index];
      fieldValue = object[fieldName];
      fieldNameAndValueConsumer(fieldName, fieldValue);
    }
  }

  return HttpSearchConfig;
}());

/**
 * This function will be called, when search results are available.
 * @callback module:searchMenuServiceClient.HttpClient.SearchServiceResultAvailable
 * @param {Object} searchResultData already parsed data object containing the result of the search
 */

searchMenuServiceClient.HttpClient = (function () {
  /**
   * HttpClient.
   *
   * Contains the "backend-connection" of the search bar. It submits the search query,
   * parses the results and informs the callback as soon as these results are available.
   * @example new searchMenuServiceClient.HttpSearchConfig()....build();
   * @param {module:searchMenuServiceClient.HttpSearchConfig} config 
   * @constructs HttpClient
   * @alias module:searchMenuServiceClient.HttpClient
   */
  var instance = function (config) {
    /**
     * Configuration for the search HTTP requests.
     * @type {module:searchMenuServiceClient.HttpSearchConfig}
     */
    this.config = config;
    /**
     * This function will be called to trigger search (calling the search backend).
     * @function
     * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
     * @param {module:searchMenuServiceClient.HttpClient.SearchServiceResultAvailable} onSearchResultsAvailable will be called when search results are available.
     */
    this.search = createSearchFunction(this.config, this.config.httpRequest);
  };

  /**
   * Creates the search service function that can be bound to the search menu.
   * @param {module:searchMenuServiceClient.HttpSearchConfig} config Configuration for the search HTTP requests.
   * @param {XMLHttpRequest} httpRequest Takes the HTTP-Request-Object.
   * @returns {module:searchMenuServiceClient.SearchService}
   * @memberof module:searchMenuServiceClient.HttpClient
   * @private
   */
  function createSearchFunction(config, httpRequest) {
    return function (searchParameters, onJsonResultReceived) {
      var onFailure = function (resultText, httpStatus) {
        console.error("search failed with status code " + httpStatus + ": " + resultText);
      };
      var searchUrl = config.resolveSearchUrl(searchParameters);
      var searchBody = config.resolveSearchBody(searchParameters);
      var request = { url: searchUrl, method: config.searchMethod, contentType: config.searchContentType, body: searchBody };
      if (config.debugMode) {
        onJsonResultReceived = loggedSuccess(onJsonResultReceived);
      }
      httpRequestJson(request, httpRequest, onJsonResultReceived, onFailure);
    };
  }

  function loggedSuccess(onSuccess) {
    return function (jsonResult, status) {
      console.log("successful search response with code " + status + ": " + JSON.stringify(jsonResult, null, 2));
      onSuccess(jsonResult, status);
    };
  }

  /**
   * This function will be called when a already parsed response of the HTTP request is available.
   * @callback module:searchMenuServiceClient.HttpClient.ParsedHttpResponseAvailable
   * @param {Object} resultData already parsed data object containing the results of the HTTP request
   * @param {number} httpStatus HTTP response status
   */
  /**
   * This function will be called when a response of the HTTP request is available as text.
   * @callback module:searchMenuServiceClient.HttpClient.TextHttpResponseAvailable
   * @param {Object} resultText response body as text
   * @param {number} httpStatus HTTP response status
   */
  /**
   * Executes an HTTP "AJAX" request.
   *
   * @param {Object} request - flattened json from search query result
   * @param {string} request.url - name of the property in hierarchical order separated by points
   * @param {string} request.method - value of the property as string
   * @param {string} request.contentType - value of the property as string
   * @param {string} request.body - value of the property as string
   * @param {Object} httpRequest - Browser provided object to use for the HTTP request.
   * @param {module:searchMenuServiceClient.HttpClient.ParsedHttpResponseAvailable} onSuccess - will be called when the request was successful.
   * @param {module:searchMenuServiceClient.HttpClient.TextHttpResponseAvailable} onFailure - will be called with the error message as text
   * @memberof module:searchMenuServiceClient.HttpClient
   * @private
   */
  function httpRequestJson(request, httpRequest, onSuccess, onFailure) {
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status >= 200 && httpRequest.status <= 299) {
          var jsonResult = JSON.parse(httpRequest.responseText);
          onSuccess(jsonResult, httpRequest.status);
        } else {
          onFailure(httpRequest.responseText, httpRequest.status);
        }
      }
    };
    httpRequest.open(request.method, request.url, true);
    httpRequest.setRequestHeader("Content-Type", request.contentType);
    httpRequest.send(request.body);
  }

  return instance;
}());

/**
 * @file Search UI written in vanilla JavaScript. Menu structure for results. Filters are integrated as search results.
 * @version {@link https://github.com/JohT/search-menu-ui/releases/latest latest version}
 * @author JohT
 */

var module = datarestructorInternalCreateIfNotExists(module); // Fallback for vanilla js without modules

function datarestructorInternalCreateIfNotExists(objectToCheck) {
  return objectToCheck || {};
}

/**
 * Contains the main ui component of the search menu ui.
 * @module searchmenu
 */
 var searchmenu = module.exports={}; // Export module for npm...
 searchmenu.internalCreateIfNotExists = datarestructorInternalCreateIfNotExists;

var eventtarget = eventtarget || require("./ponyfills/eventCurrentTargetPonyfill"); // supports vanilla js & npm
var selectionrange = selectionrange || require("./ponyfills/selectionRangePonyfill"); // supports vanilla js & npm
var eventlistener = eventlistener || require("./ponyfills/addEventListenerPonyfill"); // supports vanilla js & npm

/**
 * @typedef {Object} module:searchmenu.SearchViewDescription Describes a part of the search view (e.g. search result details).
 * @property {string} viewElementId id of the element (e.g. "div"), that contains the view with all list elements and their parent.
 * @property {string} listParentElementId id of the element (e.g. "ul"), that contains all list entries and is located inside the view.
 * @property {string} listEntryElementIdPrefix id prefix (followed by "--" and the index number) for every list entry
 * @property {string} [listEntryElementTag="li"] element tag for list entries. defaults to "li".
 * @property {string} [listEntryTextTemplate="{{displayName}}: {{value}}"] template for the text of each list entry
 * @property {string} [listEntrySummaryTemplate="{{summaries[0].displayName}}: {{summaries[0].value}}"] template for the text of each list entry, if the data group "summary" exists.
 * @property {string} [listEntryStyleClassTemplate="{{view.listEntryElementIdPrefix}} {{category}}"] template for the style class of each list entry.
 * @property {boolean} [isSelectableFilterOption=false] Specifies, if the list entry can be selected as filter option
 */

searchmenu.SearchViewDescriptionBuilder = (function () {
  "use strict";

  /**
   * Builds a {@link module:searchmenu.SearchViewDescription}, which describes a part of the search menu called "view".  
   * Examples for views are: results, details, filters, filter options. There might be more in future.
   * 
   * The description contains the id's of the html elements, that will be used as "binding", to
   * add elements like results. The "viewElementId" is the main parent (may be a "div" tag) of all view elements,
   * that contains the "listParentElementId", which is the parent of the list entries (may be a "ul" tag).
   * 
   * The text content of each entry is described by the text templates. 
   * 
   * Furthermore, the css style class can be given as a template, 
   * so search result field values can be used as a part of the style class.
   * 
   * @param {module:searchmenu.SearchViewDescription} template optional parameter that contains a template to clone
   * @constructs SearchViewDescriptionBuilder
   * @alias module:searchmenu.SearchViewDescriptionBuilder
   */
  function SearchViewDescription(template) {
    var defaultTemplate = "{{displayName}}: {{value}}";
    var defaultSummaryTemplate = "{{summaries[0].displayName}}: {{summaries[0].value}}";
    var defaultStyleClassTemplate = "{{view.listEntryElementIdPrefix}} {{category}}";
    var defaultTag = "li";
    /**
     * @type {module:searchmenu.SearchViewDescription}
     * @protected
     */
    this.description = {
      viewElementId: template ? template.viewElementId : "",
      listParentElementId: template ? template.listParentElementId : "",
      listEntryElementIdPrefix: template ? template.listEntryElementIdPrefix : "",
      listEntryElementTag: template ? template.listEntryElementTag : defaultTag,
      listEntryTextTemplate: template ? template.listEntryTextTemplate : defaultTemplate,
      listEntrySummaryTemplate: template ? template.listEntrySummaryTemplate : defaultSummaryTemplate,
      listEntryStyleClassTemplate: template ? template.listEntryStyleClassTemplate : defaultStyleClassTemplate,
      isSelectableFilterOption: template ? template.isSelectableFilterOption : false
    };
    /**
     * ID of the element (e.g. "div"), that contains the view with all list elements and their parent.
     *
     * @param {string} value view element ID.
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.viewElementId = function (value) {
      this.description.viewElementId = withDefault(value, "");
      return this;
    };
    /**
     * ID of the element (e.g. "ul"), that contains all list entries and is located inside the view.
     * @param {string} value parent element ID
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.listParentElementId = function (value) {
      this.description.listParentElementId = withDefault(value, "");
      return this;
    };
    /**
     * ID prefix (followed by "--" and the index number) for every list entry.
     * @param {string} value ID prefix for every list entry element
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.listEntryElementIdPrefix = function (value) {
      //TODO could be checked to not contain the index separation chars "--"
      this.description.listEntryElementIdPrefix = withDefault(value, "");
      return this;
    };
    /**
     * Element tag for list entries.
     * @param {string} [value="li"] tag for every list entry element
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.listEntryElementTag = function (value) {
      this.description.listEntryElementTag = withDefault(value, defaultTag);
      return this;
    };
    /**
     * Template for the text of each list entry.
     * May contain variables in double curly brackets.
     *
     * @param {string} [value="{{displayName}}: {{value}}"] list entry text template when there is no summary data group
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.listEntryTextTemplate = function (value) {
      this.description.listEntryTextTemplate = withDefault(value, defaultTemplate);
      return this;
    };
    /**
     * Template for the text of each list entry, if the data group "summary" exists.
     * May contain variables in double curly brackets.
     *
     * @param {string} [value="{{summaries[0].displayName}}: {{summaries[0].value}}"] list entry text template when there is a summary data group
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.listEntrySummaryTemplate = function (value) {
      this.description.listEntrySummaryTemplate = withDefault(value, defaultSummaryTemplate);
      return this;
    };
    /**
     * Template for the style classes of each list entry.
     * May contain variables in double curly brackets.
     * To use the property values of this view, prefix them with "view", e.g.: "{{view.listEntryElementIdPrefix}}".
     *
     * @param {string} [value="{{view.listEntryElementIdPrefix}} {{category}}"] list entry style classes template
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
     this.listEntryStyleClassTemplate = function (value) {
      this.description.listEntryStyleClassTemplate = withDefault(value, defaultStyleClassTemplate);
      return this;
    };
    /**
     * Specifies, if the list entry can be selected as filter option.
     * @param {boolean} [value=false] if a list entry is selectable as filter option
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.isSelectableFilterOption = function (value) {
      this.description.isSelectableFilterOption = value === true;
      return this;
    };
    /**
     * Finishes the build of the description and returns its final (meant to be immutable) object.
     * @returns {module:searchmenu.SearchViewDescription}
     */
    this.build = function () {
      return this.description;
    };
  }

  function withDefault(value, defaultValue) {
    return isSpecifiedString(value) ? value : defaultValue;
  }

  function isSpecifiedString(value) {
    return typeof value === "string" && value != null && value != "";
  }

  return SearchViewDescription;
})();

//TODO could provide the currently only described SearchUiData as own data structure in its own module.
/**
 * @typedef {Object} module:searchmenu.SearchUiData 
 * @property {String} [category=""] name of the category. Default = "". Could contain a short domain name. (e.g. "city")
 * @property {String} fieldName field name that will be used e.g. as a search parameter name for filter options.
 * @property {String} [displayName=""] readable display name for e.g. the list of results.
 * @property {String} [abbreviation=""] one optional character, a symbol character or a short abbreviation of the category
 * @property {String} value value of the field
 * @property {module:searchmenu.SearchUiData[]} details if there are further details that will be displayed e.g. on mouse over
 * @property {module:searchmenu.SearchUiData[]} options contains filter options that can be selected as search parameters 
 * @property {module:searchmenu.SearchUiData[]} default array with one element representing the default filter option (selected automatically)
 * @property {module:searchmenu.SearchUiData[]} summaries fields that are used to display the main search entry/result
 * @property {module:searchmenu.SearchUiData[]} urltemplate contains a single field with the value of the url template. Marks the entry as navigation target.
 */

/**
 * @callback module:searchmenu.ResolveTemplateFunction replaces variables with object properties.
 * @param {String} template may contain variables in double curly brackets. T
 * Typically supported variables would be: {{category}} {{fieldName}}, {{displayName}}, {{abbreviation}}, {{value}}
 * @return {String} string with resolved/replaced variables
 */

/**
 * @callback module:searchmenu.FieldsJson returns the fields as JSON
 * @return {String} JSON of all contained fields
 */

/**
 * This function will be called, when search results are available.
 * @callback SearchServiceResultAvailable
 * @param {Object} searchResultData already parsed data object containing the result of the search
 */

/**
 * This function will be called to trigger search (calling the search backend).
 * @callback module:searchmenu.SearchService
 * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
 * @param {module:searchmenu.SearchServiceResultAvailable} onSearchResultsAvailable will be called when search results are available.
 */

/**
 * This function converts the data from search backend to the structure needed by the search UI.
 * @callback module:searchmenu.DataConverter
 * @param {Object} searchData
 * @returns {module:searchmenu.SearchUiData} converted and structured data for search UI
 */

/**
 * This function replaces variables in double curly brackets with the property values of the given object.
 * @callback module:searchmenu.TemplateResolver
 * @param {String} templateToResolve may contain variables in double curly brackets e.g. like `"{{searchtext}}"`.
 * @param {Object} sourceObject the fields of this object are used to replace the variables in the template
 * @returns {module:searchmenu.SearchUiData} converted and structured data for search UI
 */

/**
 * This function adds predefined search parameters before search is triggered, e.g. constants, environment parameters, ...
 * @callback module:searchmenu.SearchParameterAdder
 * @param {Object} searchParametersObject
 */

/**
 * This function will be called when a new HTML is created.
 * @callback module:searchmenu.ElementCreatedListener
 * @param {Element} newlyCreatedElement
 * @param {boolean} isParent true, if it is the created parent. false, if it is a child within the created parent. 
 */

/**
 * This function will be called to navigate to a selected search result url.
 * @callback module:searchmenu.NavigateToFunction
 * @param {String} destinationUrl
 */

/**
 * @typedef {Object} module:searchmenu.SearchMenuConfig
 * @property {module:searchmenu.SearchService} triggerSearch triggers search (backend)
 * @property {module:searchmenu.DataConverter} convertData converts search result data to search ui data. Lets data through unchanged by default.
 * @property {module:searchmenu.searchParameterAdder} addPredefinedParametersTo adds custom search parameters 
 * @property {module:searchmenu.ElementCreatedListener} onCreatedElement this function will be called when a new HTML is created.
 * @property {module:searchmenu.NavigateToFunction} navigateTo this function will be called to navigate to a selected search result url.
 * @property {string} searchAreaElementId id of the whole search area (default="searcharea")
 * @property {string} inputElementId id of the search input field (default="searchinputtext")
 * @property {module:searchmenu.SearchViewDescription} resultsView describes the main view containing the search results
 * @property {module:searchmenu.SearchViewDescription} detailView describes the details view
 * @property {module:searchmenu.SearchViewDescription} filterOptionsView describes the filter options view
 * @property {module:searchmenu.SearchViewDescription} filtersView describes the filters view
 * @property {string} [waitBeforeClose=700] timeout in milliseconds when search is closed after blur (loss of focus) (default=700)
 * @property {string} [waitBeforeSearch=500] time in milliseconds to wait until typing is finished and search starts (default=500)
 * @property {string} [waitBeforeMouseOver=700] time in milliseconds to wait until mouse over opens details (default=700)
 */

searchmenu.SearchMenuAPI = (function () {
  "use strict";
  /**
   * Search Menu UI API
   * @constructs SearchMenuAPI
   * @alias module:searchmenu.SearchMenuAPI
   */
  function SearchMenuApiBuilder() {
    this.config = {
      triggerSearch: function (/* searchParameters, onSearchResultsAvailable */) {
        throw new Error("search service needs to be defined.");
      },
      convertData: function (sourceData) {
        return sourceData;
      },
      resolveTemplate: function (/* sourceData */) {
        throw new Error("template resolver needs to be defined.");
      },
      addPredefinedParametersTo: function (/* object */) {
        //does nothing if not specified otherwise
      },
      onCreatedElement: function (/* element, isParent */) {
        //does nothing if not specified otherwise
      },
      navigateTo: function (destinationUrl) {
        window.location.href = destinationUrl;
      },
      createdElementListeners: [],
      searchAreaElementId: "searcharea",
      inputElementId: "searchinputtext",
      searchTextParameterName: "searchtext",
      resultsView: defaultResultsView(),
      detailView: defaultDetailView(),
      filterOptionsView: defaultFilterOptionsView(),
      filtersView: defaultFiltersView(),
      waitBeforeClose: 700,
      waitBeforeSearch: 500,
      waitBeforeMouseOver: 700
    };
    /**
     * Defines the search service function, that will be called whenever search is triggered.
     * @param {module:searchmenu.SearchService} service function that will be called to trigger search (backend).
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.searchService = function (service) {
      this.config.triggerSearch = service;
      return this;
    };
    /**
     * Defines the converter, that converts search result data to search ui data.
     * Without setting a data converter, data is taken directly from the backend service,
     * that needs to provide the results in the search menu data structure.
     * @param {module:searchmenu.DataConverter} converter function that will be called to create the search menu data structure
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.dataConverter = function (converter) {
      this.config.convertData = converter;
      return this;
    };
    /**
     * Defines the template resolver, that replaces variables in double curly brackets with the property values of the given object.
     * @param {module:searchmenu.TemplateResolver} resolver function that will be called to resolve strings with variables.
     * @returns module:searchmenu.SearchMenuAPI
     */
     this.templateResolver = function (resolver) {
      this.config.resolveTemplate = resolver;
      return this;
    };
    /**
     * Defines the function, that adds predefined (fixed, constant, environmental) search parameters
     * to the first parameter object.
     * @param {module:searchmenu.SearchParameterAdder} adder function that will be called to before search is triggered.
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.addPredefinedParametersTo = function (adder) {
      this.config.addPredefinedParametersTo = adder;
      return this;
    };
    /**
     * Sets the listener, that will be called, when a new HTML element was created.
     * @param {module:searchmenu.ElementCreatedListener} listener
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.setElementCreatedHandler = function (listener) {
      this.config.onCreatedElement = listener;
      return this;
    };
    /**
     * Adds another listener, that will be called, when a new HTML element was created.
     * @param {module:searchmenu.ElementCreatedListener} listener
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.addElementCreatedHandler = function (listener) {
      this.config.createdElementListeners.push(listener);
      return this;
    };

    /**
     * Adds the given style class when an element receives focus.
     * This is done for every element that is created dynamically (e.g. search results and filters).
     * It is only meant to be used for browsers like old IE5 ones that doesn't support focus pseudo style class.
     *
     * @param {String} [focusStyleClassName="focus"]
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.addFocusStyleClassOnEveryCreatedElement = function (focusStyleClassName) {
      var className = withDefault(focusStyleClassName, "focus");
      this.addElementCreatedHandler(function (element, isParent) {
        if (!isParent) {
          return;
        }
        addEvent("focus", element, function (event) {
          addClass(className, getEventTarget(event));
        });
        addEvent("blur", element, function (event) {
          removeClass(className, getEventTarget(event));
        });
      });
      return this;
    };
    /**
     * Sets the element ID of the parent, that represents the whole search menu component.
     * @param {String} [id="searcharea"] id of the parent element, that represents the whole search menu component.
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.searchAreaElementId = function (id) {
      this.config.searchAreaElementId = withDefault(id, "searcharea");
      return this;
    };
    /**
     * Sets the input search text element ID,.
     * @param {String} [id="searchinputtext"] id of the input element, that contains the search text.
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.inputElementId = function (id) {
      this.config.inputElementId = withDefault(id, "searchinputtext");
      return this;
    };
    /**
     * Sets the name of the backend search service parameter, that contains the input search text.
     * @param {String} [value="searchtext"] name of the parameter, that contains the input search text and that can be used as a variable inside the url or body template for the backend service
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.searchTextParameterName = function (value) {
      this.config.searchTextParameterName = withDefault(value, "searchtext");
      return this;
    };
    /**
     * Sets the view, that is used to display all search results.  
     * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultResultsView}.
     *
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays all search results
     * @returns module:searchmenu.SearchMenuAPI
     * @see {@link module:searchmenu.SearchMenuAPI.defaultResultsView}
     */
    this.resultsView = function (view) {
      this.config.resultsView = view;
      return this;
    };
    /**
     * Sets the view, that is used to display details of a selected search result.  
     * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultDetailView}.
     *
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays details of a selected search result
     * @returns module:searchmenu.SearchMenuAPI
     * @see {@link module:searchmenu.SearchMenuAPI.defaultDetailView}
     */
    this.detailView = function (view) {
      this.config.detailView = view;
      return this;
    };
    /**
     * Sets the view, that is used to display currently selected filter options.   
     * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultFilterOptionsView}.
     *
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays currently selected filter options
     * @returns module:searchmenu.SearchMenuAPI
     * @see {@link module:searchmenu.SearchMenuAPI.defaultFilterOptionsView}
     */
    this.filterOptionsView = function (view) {
      this.config.filterOptionsView = view;
      return this;
    };
    /**
     * Sets the view, that is used to display search results, that represent filter options.   
     * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultFiltersView}.
     *
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays search results, that represent filter options
     * @returns module:searchmenu.SearchMenuAPI
     * @see {@link module:searchmenu.SearchMenuAPI.defaultFiltersView}
     */
    this.filtersView = function (view) {
      this.config.filtersView = view;
      return this;
    };
    /**
     * Sets the time the search menu will remain open, when it has lost focus.
     * Prevents the menu to disappear while using it.
     * @param {number} [ms=700] time in milliseconds the search menu will remain open until it is closed after loosing focus.
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.waitBeforeClose = function (ms) {
      this.config.waitBeforeClose = ms;
      return this;
    };
    /**
     * Sets the time to wait before the search service is called.
     * Prevents calls to the search backend while changing the search input.
     * @param {number} [ms=500] time in milliseconds to wait before the search service is called
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.waitBeforeSearch = function (ms) {
      this.config.waitBeforeSearch = ms;
      return this;
    };
    /**
     * Sets the time to  wait before search result details are opened on mouse over.
     * Doesn't affect keyboard selection, which will immediately open the search details.
     * Prevents details to open on search results, that are only touched by the mouse pointer for a short period of time.
     * @param {number} [ms=700] time in milliseconds to wait before search result details are opened on mouse over.
     * @returns module:searchmenu.SearchMenuAPI
     */
    this.waitBeforeMouseOver = function (ms) {
      this.config.waitBeforeMouseOver = ms;
      return this;
    };
    /**
     * Finishes the configuration and creates the {@link module:searchmenu.SearchMenuUI}.
     * @returns module:searchmenu.SearchMenuUI
     */
    this.start = function () {
      var config = this.config;
      if (config.createdElementListeners.length > 0) {
        this.setElementCreatedHandler(function (element, isParent) {
          var index = 0;
          for (index = 0; index < config.createdElementListeners.length; index += 1) {
            config.createdElementListeners[index](element, isParent);
          }
        });
      }
      return new searchmenu.SearchMenuUI(config);
    };
  }

  /**
   * Contains the default settings for the results view.
   * - viewElementId = "`searchresults`"
   * - listParentElementId = "`searchmatches`"
   * - listEntryElementIdPrefix = "`result`"
   * - listEntryTextTemplate = "`{{abbreviation}} {{displayName}}`"
   * - listEntrySummaryTemplate = "`{{summaries[0].abbreviation}} <b>{{summaries[1].value}}</b><br>{{summaries[2].value}}: {{summaries[0].value}}`"
   *
   * @returns {module:searchmenu.SearchViewDescription} default settings for the results view
   * @protected
   * @memberof module:searchmenu.SearchMenuAPI
   */
  function defaultResultsView() {
    return new searchmenu.SearchViewDescriptionBuilder()
      .viewElementId("searchresults")
      .listParentElementId("searchmatches")
      .listEntryElementIdPrefix("result")
      .listEntryTextTemplate("{{abbreviation}} {{displayName}}") 
      .listEntrySummaryTemplate(
        "{{summaries[0].abbreviation}} <b>{{summaries[1].value}}</b><br>{{summaries[2].value}}: {{summaries[0].value}}"
      )
      .build();
  }

  /**
   * Contains the default settings for the details view.
   * - viewElementId = "`searchdetails`"
   * - listParentElementId = "`searchdetailentries`"
   * - listEntryElementIdPrefix = "`detail`"
   * - listEntryTextTemplate = "`<b>{{displayName}}:</b> {{value}}`"
   *
   * @returns {module:searchmenu.SearchViewDescription} default settings for the details view
   * @protected
   * @memberof module:searchmenu.SearchMenuAPI
   */
  function defaultDetailView() {
    return new searchmenu.SearchViewDescriptionBuilder()
      .viewElementId("searchdetails")
      .listParentElementId("searchdetailentries")
      .listEntryElementIdPrefix("detail")
      .listEntryTextTemplate("<b>{{displayName}}:</b> {{value}}")
      .build();
  }

  /**
   * Contains the default settings for the filter options view.
   * - viewElementId = "`searchfilteroptions`"
   * - listParentElementId = "`searchfilteroptionentries`"
   * - listEntryElementIdPrefix = "`filter`"
   * - listEntryTextTemplate = "`{{value}}`"
   * - listEntrySummaryTemplate = "`{{summaries[0].value}}`"
   * - isSelectableFilterOption = `true`
   *
   * @returns {module:searchmenu.SearchViewDescription} default settings for the filter options view
   * @protected
   * @memberof module:searchmenu.SearchMenuAPI
   */
  function defaultFilterOptionsView() {
    return new searchmenu.SearchViewDescriptionBuilder()
      .viewElementId("searchfilteroptions")
      .listParentElementId("searchfilteroptionentries")
      .listEntryElementIdPrefix("filter")
      .listEntryTextTemplate("{{value}}")
      .listEntrySummaryTemplate("{{summaries[0].value}}")
      .isSelectableFilterOption(true)
      .build();
  }

  /**
   * Contains the default settings for the filters view.
   * - viewElementId = "`searchresults`"
   * - listParentElementId = "`searchfilters`"
   * - listEntryElementIdPrefix = "`filter`"
   * - isSelectableFilterOption = `true`
   * @returns {module:searchmenu.SearchViewDescription} default settings for the filters view
   * @protected
   * @memberof module:searchmenu.SearchMenuAPI
   */
  function defaultFiltersView() {
    return new searchmenu.SearchViewDescriptionBuilder()
      .viewElementId("searchresults")
      .listParentElementId("searchfilters")
      .listEntryElementIdPrefix("filter")
      .isSelectableFilterOption(true)
      .build();
  }

  function addEvent(eventName, element, eventHandler) {
    eventlistener.addEventListener(eventName, element, eventHandler);
  }

  function getEventTarget(event) {
    return eventtarget.getEventTarget(event);
  }

  function addClass(classToAdd, element) {
    removeClass(classToAdd, element);
    var separator = element.className.length > 0 ? " " : "";
    element.className += separator + classToAdd;
  }

  function removeClass(classToRemove, element) {
    var regex = new RegExp("\\s?\\b" + classToRemove + "\\b", "gi");
    element.className = element.className.replace(regex, "");
  }

  function withDefault(value, defaultValue) {
    return isSpecifiedString(value) ? value : defaultValue;
  }

  function isSpecifiedString(value) {
    return typeof value === "string" && value != null && value != "";
  }

  return SearchMenuApiBuilder;
}());

searchmenu.SearchMenuUI = (function () {
  "use strict";

  /**
   * Search Menu UI.
   *
   * Contains the "behavior" of the search bar. It submits the search query,
   * parses the results, displays matches and filters and responds to
   * clicks and key presses.
   * Further resources:
   * - [API]{@link module:searchmenu.SearchMenuAPI}
   * - [Configuration]{@link module:searchmenu.SearchMenuConfig}
   * 
   * @constructs SearchMenuUI
   * @alias module:searchmenu.SearchMenuUI
   * @see {@link module:searchmenu.SearchMenuAPI}
   * @see {@link module:searchmenu.SearchMenuConfig}
   */
  var instance = function (config) {
    /**
     * Configuration.
     * @type {module:searchmenu.SearchMenuConfig}
     * @protected 
     */
    this.config = config;
    /**
     * Search text that correspondents to the currently shown results.
     * @type {String}
     * @protected 
     */
    this.currentSearchText = "";
    /**
     * Timer that is used to wait before the menu is closed.
     * @type {Timer}
     * @protected 
     */
    this.focusOutTimer = null;
    /**
     * Timer that is used to wait before the search service is called.
     * @type {Timer}
     * @protected 
     */
    this.waitBeforeSearchTimer = null;

    var search = document.getElementById(config.inputElementId);
    onEscapeKey(search, function (event) {
      getEventTarget(event).value = "";
      hideMenu(config);
    });
    onArrowDownKey(search, handleEventWithConfig(config, focusFirstResult));
    addEvent("keyup", search, function (event) {
      if (this.waitBeforeSearchTimer !== null) {
        clearTimeout(this.waitBeforeSearchTimer);
      }
      var newSearchText = getEventTarget(event).value;
      this.waitBeforeSearchTimer = window.setTimeout(function () {
        if (newSearchText !== this.currentSearchText || this.currentSearchText === "") {
          updateSearch(newSearchText, config);
          this.currentSearchText = newSearchText;
        }
      }, config.waitBeforeSearch);
    });

    var searchareaElement = document.getElementById(config.searchAreaElementId);
    addEvent("focusin", searchareaElement, function () {
      var searchInputElement = document.getElementById(config.inputElementId);
      if (searchInputElement.value !== "") {
        if (this.focusOutTimer != null) {
          clearTimeout(this.focusOutTimer);
        }
        //TODO should only show results if there are some
        //TODO could add a "spinner" when search is running
        show(config.resultsView.viewElementId);
      }
    });
    addEvent("focusout", searchareaElement, function () {
      this.focusOutTimer = window.setTimeout(function () {
        hideMenu(config);
      }, config.waitBeforeClose);
    });
  };

  function updateSearch(searchText, config) {
    var matchList = document.getElementById(config.resultsView.listParentElementId);
    matchList.innerHTML = "";
    if (searchText.length === 0) {
      hideMenu(config);
      return;
    }
    show(config.resultsView.viewElementId);
    getSearchResults(searchText, config);
  }

  function getSearchResults(searchText, config) {
    //TODO should "retrigger" search when new filter options are selected (after each?)
    var searchParameters = getSelectedOptions(config.filtersView.listParentElementId);
    searchParameters[config.searchTextParameterName] = searchText;
    config.addPredefinedParametersTo(searchParameters);
    //TODO could provide optional build in search text highlighting
    config.triggerSearch(searchParameters, function (jsonResult) {
      displayResults(config.convertData(jsonResult), config);
    });
    //TODO should provide some info if search fails (service temporary unavailable, ...)
  }

  function displayResults(jsonResults, config) {
    var index = 0;
    for (index = 0; index < jsonResults.length; index += 1) {
      addResult(jsonResults[index], index + 1, config);
    }
  }

  function addResult(entry, i, config) {
    var listElementId = config.resultsView.listEntryElementIdPrefix + "--" + i;
    var resultElementText = createListEntryInnerHtmlText(entry, config.resultsView, listElementId, config.resolveTemplate);
    var resultElement = createListEntryElement(entry, config.resultsView, listElementId, resultElementText);
    addClass(resolveStyleClasses(entry, config.resultsView, config.resolveTemplate), resultElement);
    forEachIdElementIncludingChildren(resultElement, config.onCreatedElement);

    if (isMenuEntryWithFurtherDetails(entry)) {
      onMenuEntrySelected(resultElement, handleEventWithEntriesAndConfig(entry.details, config, selectSearchResultToDisplayDetails));
      onMouseOverDelayed(
        resultElement,
        config.waitBeforeMouseOver,
        handleEventWithEntriesAndConfig(entry.details, config, selectSearchResultToDisplayDetails)
      );
      onMenuEntryChosen(resultElement, function () {
        var selectedUrlTemplate = getSelectedUrlTemplate(config.filtersView.listParentElementId, getPropertyValueWithUndefinedDefault(entry, "category", ""));
        if (selectedUrlTemplate) {
          //TODO should add domain, baseurl, ... as data sources for variables to use inside the template
          var targetURL = config.resolveTemplate(selectedUrlTemplate, entry);
          config.navigateTo(targetURL);
        }
      });
    }
    if (isMenuEntryWithOptions(entry)) {
      var options = entry.options;
      //TODO should support details for filter options.
      //TODO could skip sub menu, if there is only one option (with/without being default).
      //TODO could be used for constants (pre selected single filter options) like "tenant-number", "current-account"
      //TODO could remove the original search result filter when the default option is pre selected (and its options are copied).
      if (isMenuEntryWithDefault(entry)) {
        options = insertAtBeginningIfMissing(entry.options, entry["default"][0], equalProperties(["value"]));
        var filterOptionsElement = createFilterOption(entry["default"][0], options, config.filtersView, config);
        addDefaultFilterOptionModificationHandler(filterOptionsElement, options, config);
      }
      onMenuEntrySelected(resultElement, handleEventWithEntriesAndConfig(entry.options, config, selectSearchResultToDisplayFilterOptions));
      onMenuEntryChosen(resultElement, handleEventWithEntriesAndConfig(entry.options, config, selectSearchResultToDisplayFilterOptions));
    }
    addMainMenuNavigationHandlers(resultElement, config);
  }

  function equalProperties(propertyNames) {
    return function (existingObject, newObject) {
      var index;
      for (index = 0; index < propertyNames.length; index += 1) {
        if (existingObject[propertyNames[index]] != newObject[propertyNames[index]]) {
          return false;
        }
      }
      return true;
    };
  }

  /**
   * Adds the given entry at be beginning of the given array of entries if it's missing.
   * The equalFunction determines, if the new value is missing (returns false) or not (returns true).
   * If the entry to add is null, the entries are returned directly.
   *
   * @param {Object[]} entries
   * @param {Object} entryToAdd
   * @param {boolean} equalMatcher takes the existing and the new entry as parameters and returns true if they are considered "equal".
   * @returns {Object[]}
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function insertAtBeginningIfMissing(entries, entryToAdd, equalMatcher) {
    if (!entryToAdd) {
      return entries;
    }
    var index;
    var alreadyContainsEntryToAdd = false;
    for (index = 0; index < entries.length; index += 1) {
      if (equalMatcher(entries[index], entryToAdd)) {
        alreadyContainsEntryToAdd = true;
        break;
      }
    }
    if (alreadyContainsEntryToAdd) {
      return entries;
    }
    var result = [];
    result.push(entryToAdd);
    for (index = 0; index < entries.length; index += 1) {
      result.push(entries[index]);
    }
    return result;
  }

  function isMenuEntryWithFurtherDetails(entry) {
    return typeof entry.details !== "undefined";
  }

  function isMenuEntryWithOptions(entry) {
    return typeof entry.options !== "undefined";
  }

  function isMenuEntryWithDefault(entry) {
    return typeof entry["default"] !== "undefined";
  }

  /**
   * Reacts to input events (keys, ...) to navigate through main menu entries.
   *
   * @param {Element} element to add event handlers
   * @param {SearchMenuConfig} config search configuration
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function addMainMenuNavigationHandlers(element, config) {
    onArrowDownKey(element, handleEventWithConfig(config, focusNextSearchResult));
    onArrowUpKey(element, handleEventWithConfig(config, focusPreviousSearchResult));
    onEscapeKey(element, handleEventWithConfig(config, focusSearchInput));
    onArrowLeftKey(element, handleEventWithConfig(config, closeAssociatedSubMenus));
  }

  /**
   * Reacts to input events (keys, ...) to navigate through sub menu entries.
   *
   * @param {Element} element to add event handlers
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function addSubMenuNavigationHandlers(element) {
    onArrowDownKey(element, focusNextMenuEntry);
    onArrowUpKey(element, focusPreviousMenuEntry);
    onArrowLeftKey(element, returnToMainMenu);
    onEscapeKey(element, returnToMainMenu);
  }

  function onMenuEntrySelected(element, eventHandler) {
    onSpaceKey(element, eventHandler);
    onArrowRightKey(element, eventHandler);
  }

  function onMenuEntryChosen(element, eventHandler) {
    addEvent("mousedown", element, eventHandler);
    onEnterKey(element, eventHandler);
  }

  function onSubMenuEntrySelected(element, eventHandler) {
    addEvent("mousedown", element, eventHandler);
    onEnterKey(element, eventHandler);
    onSpaceKey(element, eventHandler);
  }

  function onFilterMenuEntrySelected(element, eventHandler) {
    addEvent("mousedown", element, eventHandler);
    onEnterKey(element, eventHandler);
    onArrowRightKey(element, eventHandler);
  }

  function onFilterMenuEntryRemoved(element, eventHandler) {
    onDeleteKey(element, eventHandler);
    onBackspaceKey(element, eventHandler);
    //TODO should also be possible with mouse (without using keys)
  }

  /**
   * @param {SearchMenuConfig} config search configuration
   * @param {EventListener} eventHandler event handler
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function handleEventWithConfig(config, eventHandler) {
    return function (event) {
      eventHandler(event, config);
    };
  }

  /**
   * @param {Object[]} entries raw data of the entry
   * @param {module:searchmenu.SearchMenuConfig} config search configuration
   * @param {EventListener} eventHandler event handler
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function handleEventWithEntriesAndConfig(entries, config, eventHandler) {
    return function (event) {
      eventHandler(event, entries, config);
    };
  }

  /**
   * This callback will be called, if there is not next or previous menu entry to navigate to.
   * The implementation can decide, what to do using the given id properties.
   *
   * @callback module:searchmenu.MenuEntryNotFoundHandler
   * @param {module:searchmenu.ListElementIdProperties} properties of the element id
   */
  /**
   * This function returns the ID for the first sub menu entry using the given type name (= name of the sub menu).
   *
   * @callback module:searchmenu.SubMenuId
   * @param {string} type name of the sub menu entries
   */
  /**
   * @typedef {Object} module:searchmenu.ListElementIdProperties
   * @property {id} id Original ID
   * @property {string} type Type of the list element
   * @property {number} index Index of the list element
   * @property {string} previousId ID of the previous list element
   * @property {string} nextId ID of the next list element
   * @property {string} firstId ID of the first list element
   * @property {string} lastId ID of the last list element
   * @property {module:searchmenu.SubMenuId} subMenuId  Returns the ID of the first sub menu entry (with the given type name as parameter)
   * @property {string} mainMenuId ID of the main menu entry e.g. to leave the sub menu. Equals to the id, if it already is a main menu entry
   * @property {boolean} hiddenFieldsId ID of the embedded hidden field, that contains all public information of the described entry as JSON.
   * @property {boolean} hiddenFields Parses the JSON inside the "hiddenFieldsId"-Element and returns the object with the described entry.
   * @property {boolean} isFirstElement true, if it is the first element in the list
   * @property {boolean} isSubMenu true, if it is the ID of an sub menu entry
   */
  /**
   * Extracts properties like type and index
   * from the given list element id string.
   *
   * @param {string} id
   * @return {module:searchmenu.ListElementIdProperties} list element id properties
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function extractListElementIdProperties(id) {
    var separator = "--";
    var splittedId = id.split(separator);
    if (splittedId.length < 2) {
      console.log("expected at least one '" + separator + "' separator inside the id " + id);
    }
    var extractedMainMenuType = splittedId[0];
    var extractedMainMenuIndex = parseInt(splittedId[1]);
    var extractedType = splittedId[splittedId.length - 2];
    var extractedIndex = parseInt(splittedId[splittedId.length - 1]);
    var idWithoutIndex = id.substring(0, id.lastIndexOf(extractedIndex) - separator.length);
    return {
      id: id,
      type: extractedType,
      index: extractedIndex,
      previousId: idWithoutIndex + separator + (extractedIndex - 1),
      nextId: idWithoutIndex + separator + (extractedIndex + 1),
      firstId: idWithoutIndex + separator + "1",
      lastId: idWithoutIndex + separator + document.getElementById(id).parentElement.childNodes.length,
      mainMenuId: extractedMainMenuType + separator + extractedMainMenuIndex,
      mainMenuIndex: extractedMainMenuIndex,
      hiddenFieldsId: id + separator + "fields",
      isFirstElement: extractedIndex <= 1,
      isSubMenu: splittedId.length > 3,
      subMenuId: function (typeName) {
        return id + separator + typeName + separator + "1";
      },
      replaceMainMenuIndex: function (newIndex) {
        var newMainMenuIndex = extractedMainMenuType + separator + newIndex;
        return newMainMenuIndex + id.substring(this.mainMenuId.length);
      },
      getNewIndexAfterRemovedMainMenuIndex: function (removedIndex) {
        if (extractedMainMenuIndex < removedIndex) {
          return id;
        }
        if (extractedMainMenuIndex == removedIndex) {
          throw new Error("index " + removedIndex + " should had been removed.");
        }
        return this.replaceMainMenuIndex(extractedMainMenuIndex - 1);
      },
      hiddenFields: function () {
        var hiddenFieldsElement = document.getElementById(id + separator + "fields");
        var hiddenFieldsJson = getPropertyValueWithUndefinedDefault(hiddenFieldsElement, "textContent", hiddenFieldsElement.innerText);
        return JSON.parse(hiddenFieldsJson);
      }
    };
  }

  function focusSearchInput(event, config) {
    var resultEntry = getEventTarget(event);
    var inputElement = document.getElementById(config.inputElementId);
    resultEntry.blur();
    inputElement.focus();
    selectionrange.moveCursorToEndOf(inputElement);
    preventDefaultEventHandling(event); //skips cursor position change on key up once
    hideSubMenus(config);
    return inputElement;
  }

  function focusFirstResult(event, config) {
    var selectedElement = getEventTarget(event);
    var firstResult = document.getElementById(config.resultsView.listEntryElementIdPrefix + "--1");
    if (firstResult) {
      selectedElement.blur();
      firstResult.focus();
    }
  }

  function focusNextSearchResult(event, config) {
    focusNextMenuEntry(event, function (menuEntryIdProperties) {
      var next = null;
      if (menuEntryIdProperties.type === config.resultsView.listEntryElementIdPrefix) {
        //select first filter entry after last result/match entry
        //TODO could find a better way (without config?) to navigate from last search result to first options/filter entry
        next = document.getElementById(config.filterOptionsView.listEntryElementIdPrefix + "--1");
      }
      if (next === null) {
        //select first result/match entry after last filter entry (or whenever nothing is found)
        next = document.getElementById(config.resultsView.listEntryElementIdPrefix + "--1");
      }
      return next;
    });
    hideSubMenus(config);
  }

  function focusPreviousSearchResult(event, config) {
    focusPreviousMenuEntry(event, function (menuEntryIdProperties) {
      var previous = null;
      if (menuEntryIdProperties.type === config.filterOptionsView.listEntryElementIdPrefix) {
        //select last result entry when arrow up is pressed on first filter entry
        //TODO could find a better way (without config?) to navigate from first options/filter entry to last search result?
        var resultElementsCount = getListElementCountOfType(config.resultsView.listEntryElementIdPrefix);
        previous = document.getElementById(config.resultsView.listEntryElementIdPrefix + "--" + resultElementsCount);
      }
      if (previous === null) {
        //select input, if there is no previous entry.
        return focusSearchInput(event, config);
      }
      return previous;
    });
    hideSubMenus(config);
  }

  /**
   * Selects and focusses the next menu entry.
   *
   * @param {Event} event
   * @param {module:searchmenu.MenuEntryNotFoundHandler} onMissingNext is called, if no "next" entry could be found.
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function focusNextMenuEntry(event, onMissingNext) {
    var menuEntry = getEventTarget(event);
    var menuEntryIdProperties = extractListElementIdProperties(menuEntry.id);
    if (menuEntryIdProperties.isSubMenu) {
      preventDefaultEventHandling(event); //skips e.g. scrolling whole screen down when focus is inside sub menu
    }
    var next = document.getElementById(menuEntryIdProperties.nextId);
    if (next == null && typeof onMissingNext === "function") {
      next = onMissingNext(menuEntryIdProperties);
    }
    if (next == null) {
      next = document.getElementById(menuEntryIdProperties.firstId);
    }
    if (next != null) {
      menuEntry.blur();
      next.focus();
    }
  }

  /**
   * Selects and focusses the previous menu entry.
   *
   * @param {Event} event
   * @param {module:searchmenu.MenuEntryNotFoundHandler} onMissingPrevious is called, if no "previous" entry could be found.
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function focusPreviousMenuEntry(event, onMissingPrevious) {
    var menuEntry = getEventTarget(event);
    var menuEntryIdProperties = extractListElementIdProperties(menuEntry.id);
    if (menuEntryIdProperties.isSubMenu) {
      preventDefaultEventHandling(event); //skips e.g. scrolling whole screen up when focus is inside sub menu
    }
    var previous = document.getElementById(menuEntryIdProperties.previousId);
    if (previous == null && typeof onMissingPrevious === "function") {
      previous = onMissingPrevious(menuEntryIdProperties);
    }
    if (previous == null) {
      previous = document.getElementById(menuEntryIdProperties.lastId);
    }
    if (previous != null) {
      menuEntry.blur();
      previous.focus();
    }
  }

  /**
   * Gets called when a filter option is selected and copies it into the filter view, where all selected filters are collected.
   * @param {Event} event 
   * @param {DescribedEntry} entries 
   * @param {module:searchmenu.SearchMenuConfig} config 
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function selectFilterOption(event, entries, config) {
    var selectedEntry = getEventTarget(event);
    var selectedEntryData = findSelectedEntry(selectedEntry.id, entries, equalProperties(["fieldName", "value"]));
    var filterOptionsElement = createFilterOption(selectedEntryData, entries, config.filtersView, config);
    //TODO could detect default entry if necessary and call "addDefaultFilterOptionModificationHandler" instead
    addFilterOptionModificationHandler(filterOptionsElement, entries, config);
    preventDefaultEventHandling(event);
    returnToMainMenu(event);
  }

  function createFilterOption(selectedEntryData, entries, view, config) {
    var filterElements = getListElementCountOfType(view.listEntryElementIdPrefix);
    var filterElementId = view.listEntryElementIdPrefix + "--" + (filterElements + 1);
    var filterCategory = getPropertyValueWithUndefinedDefault(selectedEntryData, "category", "");
    var filterElement = getListEntryByFieldName(filterCategory, selectedEntryData.fieldName, view.listParentElementId);
    var isAlreadyExistingFilter = filterElement != null;
    if (isAlreadyExistingFilter) {
      var updatedText = createListEntryInnerHtmlText(selectedEntryData, view, filterElement.id, config.resolveTemplate);
      filterElement = updateListEntryElement(filterElement, updatedText);
      return filterElement;
    }
    var filterElementText = createListEntryInnerHtmlText(selectedEntryData, view, filterElementId, config.resolveTemplate);
    filterElement = createListEntryElement(selectedEntryData, view, filterElementId, filterElementText);
    addClass(resolveStyleClasses(selectedEntryData, view, config.resolveTemplate), filterElement);
    forEachIdElementIncludingChildren(filterElement, config.onCreatedElement);

    onFilterMenuEntrySelected(filterElement, handleEventWithEntriesAndConfig(entries, config, selectSearchResultToDisplayFilterOptions));
    addMainMenuNavigationHandlers(filterElement, config);

    return filterElement;
  }

  function addFilterOptionModificationHandler(filterElement, entries, config) {
    onSpaceKey(filterElement, toggleFilterEntry);
    onFilterMenuEntryRemoved(filterElement, handleEventWithConfig(config, removeFilterElement));
  }

  function addDefaultFilterOptionModificationHandler(filterElement, entries, config) {
    onSpaceKey(filterElement, handleEventWithEntriesAndConfig(entries, config, selectSearchResultToDisplayFilterOptions));
    //TODO could reset elements to their default value upon deletion.
  }

  /**
   * Searches all child elements of the given parent element
   * for an entry with the given fieldName contained in the hidden fields structure.
   *
   * @param {String} category of the element to search for
   * @param {String} fieldName of the element to search for
   * @param {String} listParentElementId id of the parent element that child nodes will be searched
   * @returns {HTMLElement} returns the element that matches the given fieldName or null, if it hadn't been found.
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function getListEntryByFieldName(category, fieldName, listParentElementId) {
    var globalCategoryResult = null;
    var result = forEachListEntryElement(listParentElementId, function (element) {
      var listElementHiddenFields = extractListElementIdProperties(element.id).hiddenFields();
      if (listElementHiddenFields.fieldName === fieldName) {
        var elementCategory = getPropertyValueWithUndefinedDefault(listElementHiddenFields, "category", "");
        if (elementCategory === "") {
          globalCategoryResult = element;
        } else if (elementCategory === category) {
          return element;
        }
      }
    });
    return (result != null)? result : globalCategoryResult;
  }

  /**
   * Returns the property value of the object or - if undefined - the default value.
   * @param {Object} object 
   * @param {String} propertyName 
   * @param {Object} defaultValue 
   * @returns the property value of the object or - if not set - the default value.
   */
  function getPropertyValueWithUndefinedDefault(object, propertyName, defaultValue) {
    if (typeof object[propertyName] === "undefined") {
      return defaultValue;
    } 
    return object[propertyName];
  }

  /**
   * Gets the currently selected url template for navigation.
   *
   * @param {String} listParentElementId id of the parent element that child nodes will be searched
   * @param {String} category the url template needs to belong to the same category
   * @returns {String} returns the url template or null, if nothing could be found
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function getSelectedUrlTemplate(listParentElementId, category) {
    return forEachListEntryElement(listParentElementId, function (element) {
      var listElementHiddenFields = extractListElementIdProperties(element.id).hiddenFields();
      var urlTemplate = getPropertyValueWithUndefinedDefault(listElementHiddenFields, "urltemplate", [""])[0];
      if (urlTemplate === "") {
        return null; // entry has no url template
      }
      var elementCategory = getPropertyValueWithUndefinedDefault(listElementHiddenFields, category, "");
      if ((elementCategory != category) && (elementCategory !== "")) {
        return null; // entry belongs to another category
      }
      if (hasClass("inactive", element)) {
        return null; // entry is inactive
      }
      return urlTemplate.value;
    });
  }

  function getSelectedOptions(listParentElementId) {
    var result = {};
    forEachListEntryElement(listParentElementId, function (element) {
      var hiddenFields = extractListElementIdProperties(element.id).hiddenFields();
      if (typeof hiddenFields.fieldName === "undefined" || typeof hiddenFields.value === "undefined") {
        return null;
      }
      if (hasClass("inactive", element)) {
        return null; // entry is inactive
      }
      result[hiddenFields.fieldName] = hiddenFields.value;
    });
    return result;
  }

  /**
   * This function is called for every html element of a given parent.
   *
   * @callback module:searchmenu.ListElementFunction
   * @param {Element} listElement name of the sub menu entries
   * @return {Object} optional result to exit the loop or null otherwise.
   */

  /**
   * Iterates through all child nodes of the given parent and calls the given function.
   * If the function returns a value, it will be returned directly.
   * If the function returns nothing, the iteration continues.
   * @param {String} listParentElementId 
   * @param {module:searchmenu.ListElementFunction} listEntryElementFunction 
   * @returns {Object} result of the first entry element function, that had returned one, or null.
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function forEachListEntryElement(listParentElementId, listEntryElementFunction) {
    var listParentElement = document.getElementById(listParentElementId);
    var i, listElement, result;
    for (i = 0; i < listParentElement.childNodes.length; i += 1) {
      listElement = listParentElement.childNodes[i];
      result = listEntryElementFunction(listElement);
      if (result) {
        return result;
      }
    }
    return null;
  }

  /**
   * Extracts the entry data that it referred by the element given by its ID out of the list of data entries.
   * @param {string} element id
   * @param {DescribedEntry[]} array of described entries
   * @param {boolean} equalMatcher takes the existing and the new entry as parameters and returns true if they are considered "equal".
   * @returns {DescribedEntry} described entry out of the given entries, that suits the element given by its id.
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function findSelectedEntry(id, entries, equalsMatcher) {
    var selectedEntryIdProperties = extractListElementIdProperties(id);
    var selectedEntryHiddenFields = selectedEntryIdProperties.hiddenFields();
    var entryIndex;
    var currentlySelected;
    for (entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
      currentlySelected = entries[entryIndex];
      if (equalsMatcher(currentlySelected, selectedEntryHiddenFields)) {
        return currentlySelected;
      }
    }
    console.log("error: no selected entry found for id " + id + " in " + entries);
    return null;
  }

  function selectSearchResultToDisplayDetails(event, entries, config) {
    hideSubMenus(config);
    selectSearchResultToDisplaySubMenu(event, entries, config.detailView, config);
    preventDefaultEventHandling(event);
  }

  function selectSearchResultToDisplayFilterOptions(event, entries, config) {
    hideSubMenus(config);
    selectSearchResultToDisplaySubMenu(event, entries, config.filterOptionsView, config);
  }

  function selectSearchResultToDisplaySubMenu(event, entries, subMenuView, config) {
    clearAllEntriesOfElementWithId(subMenuView.listParentElementId);
    var selectedElement = getEventTarget(event);

    var subMenuEntry = null;
    var subMenuElement = null;
    var subMenuIndex = 0;
    var subMenuEntryId = selectedElement.id + "--" + subMenuView.listEntryElementIdPrefix;
    var subMenuFirstEntry = null;
    var subMenuElementText;
    for (subMenuIndex = 0; subMenuIndex < entries.length; subMenuIndex += 1) {
      subMenuEntry = entries[subMenuIndex];
      subMenuEntryId = selectedElement.id + "--" + subMenuView.listEntryElementIdPrefix + "--" + (subMenuIndex + 1);
      subMenuElementText = createListEntryInnerHtmlText(subMenuEntry, subMenuView, subMenuEntryId, config.resolveTemplate);
      subMenuElement = createListEntryElement(subMenuEntry, subMenuView, subMenuEntryId, subMenuElementText);
      addClass(resolveStyleClasses(subMenuEntry, subMenuView, config.resolveTemplate), subMenuElement);
      forEachIdElementIncludingChildren(subMenuElement, config.onCreatedElement);

      if (subMenuView.isSelectableFilterOption) {
        addSubMenuNavigationHandlers(subMenuElement);
        onSubMenuEntrySelected(subMenuElement, handleEventWithEntriesAndConfig(entries, config, selectFilterOption));
      }
      if (subMenuIndex === 0) {
        subMenuFirstEntry = subMenuElement;
      }
    }
    var divParentOfSelectedElement = parentThatMatches(selectedElement, function (element) {
      return element.tagName == "DIV";
    });
    var subMenuViewElement = document.getElementById(subMenuView.viewElementId);
    var alignedSubMenuXPosition = divParentOfSelectedElement.offsetWidth + 15;
    var alignedSubMenuYPosition = getYPositionOfElement(selectedElement) + getScrollY();
    subMenuViewElement.style.left = alignedSubMenuXPosition + "px";
    subMenuViewElement.style.top = alignedSubMenuYPosition + "px";

    showElement(subMenuViewElement);

    if (subMenuView.isSelectableFilterOption) {
      selectedElement.blur();
      subMenuFirstEntry.focus();
    }
  }

  /**
   * Exit sub menu from event entry and return to main menu.
   * @param {InputEvent} event
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function returnToMainMenu(event) {
    var subMenuEntryToExit = getEventTarget(event);
    var subMenuEntryToExitProperties = extractListElementIdProperties(subMenuEntryToExit.id);
    var mainMenuEntryToSelect = document.getElementById(subMenuEntryToExitProperties.mainMenuId);
    subMenuEntryToExit.blur();
    mainMenuEntryToSelect.focus();
    hideViewOf(subMenuEntryToExit);
  }

  function closeAssociatedSubMenus(event, config) {
    hideSubMenus(config);
  }

  /**
   * Prevents the given event inside an event handler to get handled anywhere else.
   * Pressing the arrow key up can lead to scrolling up the view. This is not useful,
   * if the arrow key navigates the focus inside a sub menu, that is fully contained inside the current view.
   * @param {InputEvent} inputevent
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function preventDefaultEventHandling(inputevent) {
    if (typeof inputevent.preventDefault !== "undefined") {
      inputevent.preventDefault();
    } else {
      inputevent.returnValue = false;
    }
  }

  //TODO could be extracted as ponyfill
  /**
   * Browser compatible Y position of the given element.
   * @returns {number} y position in pixel
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
   function getYPositionOfElement(element) {
    var selectedElementPosition = element.getBoundingClientRect();
    if (typeof selectedElementPosition.y !== "undefined") {
      return selectedElementPosition.y;
    }
    return selectedElementPosition.top;
  }

  //TODO could be extracted as ponyfill
  /**
   * Browser compatible version of the standard "window.scrollY".
   * @returns {number} y scroll position in pixel
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function getScrollY() {
    var supportPageOffset = typeof window.pageYOffset !== "undefined";
    if (supportPageOffset) {
      return window.pageYOffset;
    }
    var isCSS1Compatible = (document.compatMode || "") === "CSS1Compat";
    if (isCSS1Compatible) {
      return document.documentElement.scrollTop;
    }
    return document.body.scrollTop;
  }

  function clearAllEntriesOfElementWithId(elementId) {
    var node = document.getElementById(elementId);

    // Fastest way to delete child nodes in Chrome and FireFox according to
    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    if (typeof node.cloneNode === "function" && typeof node.replaceChild === "function") {
      var cNode = node.cloneNode(false);
      node.parentNode.replaceChild(cNode, node);
    } else {
      node.innerHTML = "";
    }
  }

  /**
   * Toggles a filter to inactive and vice versa.
   * @param {InputEvent} event
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function toggleFilterEntry(event) {
    preventDefaultEventHandling(event);
    var filterElement = getEventTarget(event);
    toggleClass("inactive", filterElement);
  }

  function removeFilterElement(event, config) {
    preventDefaultEventHandling(event);
    focusPreviousSearchResult(event, config);
    removeChildElement(event);
  }

  /**
   * Removes the event target element from its parent.
   * @param {InputEvent} event
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function removeChildElement(event) {
    var element = getEventTarget(event);
    var parentElement = element.parentElement;
    var indexOfRemovedElement = extractListElementIdProperties(element.id).mainMenuIndex;
    parentElement.removeChild(element);
    forEachChildRecursively(parentElement, 0, 5, function (entry) {
      if (entry.id) {
        entry.id = extractListElementIdProperties(entry.id).getNewIndexAfterRemovedMainMenuIndex(indexOfRemovedElement);
      }
    });
  }

  function forEachChildRecursively(element, depth, maxDepth, callback) {
    if (depth > maxDepth || !element.childNodes) {
      return;
    }
    forEachEntryIn(element.childNodes, function (entry) {
      callback(entry);
      forEachChildRecursively(entry, depth + 1, maxDepth, callback);
    });
  }

  /**
   * This function will be called for every found element
   * @callback module:searchmenu.ElementFoundListener
   * @param {Element} foundElement
   * @param {boolean} isParent true, if it is the created parent. false, if it is a child within the created parent.
   */

  /**
   * The given callback will be called for the given parent and all its direct child nodes, that contain an id property.
   * @param {Element} element parent to be inspected
   * @param {module:searchmenu.ElementFoundListener} callback will be called for every found child and the given parent itself
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function forEachIdElementIncludingChildren(element, callback) {
    if (element.id) {
      callback(element, true);
    }
    forEachEntryIn(element.childNodes, function (element) {
      if (element.id) {
        callback(element, false);
      }
    });
  }

  function forEachEntryIn(array, callback) {
    var index = 0;
    for (index = 0; index < array.length; index += 1) {
      callback(array[index], index + 1); //index parameter starts with 1 (1 instead of 0 based)
    }
  }

  /**
   * @param {String} list element type name e.g. "li".
   * @return {number} list element count of the given type
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function getListElementCountOfType(listelementtype) {
    var firstListEntry = document.getElementById(listelementtype + "--1");
    if (firstListEntry === null) {
      return 0;
    }
    return firstListEntry.parentElement.childNodes.length;
  }

  /**
   * Updates an already existing list entry element to be used for search results, filter options, details and filters.
   *
   * @param {Node} already existing element
   * @param {String} text updated element text
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function updateListEntryElement(existingElement, text) {
    existingElement.innerHTML = text;
    return existingElement;
  }

  /**
   * Creates a new list entry element to be used for search results, filter options, details and filters.
   *
   * @param {DescribedEntry} entry entry data
   * @param {module:searchmenu.SearchViewDescription} view description
   * @param {number} id id of the list element
   * @param {String} text text of the list element
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function createListEntryElement(entry, view, id, text) {
    var listElement = createListElement(text, id, view.listEntryElementTag);
    var parentElement = document.getElementById(view.listParentElementId);
    parentElement.appendChild(listElement);
    return listElement;
  }

  /**
   * Creates the inner HTML Text for a list entry to be used for search results, filter options, details and filters.
   *
   * @param {DescribedEntry} entry entry data
   * @param {module:searchmenu.SearchViewDescription} view description
   * @param {number} id id of the list element
   * @param {module:searchmenu.TemplateResolver} resolveTemplate function that resolves variables inside a template with contents of a source object
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function createListEntryInnerHtmlText(entry, view, id, resolveTemplate) {
    //TODO could support template inside html e.g. referenced by id (with convention over code)
    //TODO should limit length of resolved variables
    var text = resolveTemplate(view.listEntryTextTemplate, entry);
    if (typeof entry.summaries !== "undefined") {
      text = resolveTemplate(view.listEntrySummaryTemplate, entry);
    }
    var json = JSON.stringify(entry); //needs to be without spaces
    text += '<p id="' + id + '--fields" style="display: none">' + json + "</p>";
    return text;
  }

  function resolveStyleClasses(entry, view, resolveTemplate) {
    var resolvedClasses = resolveTemplate(view.listEntryStyleClassTemplate, entry);
    resolvedClasses = resolveTemplate(resolvedClasses, { view: view });
    return resolvedClasses;
  }

  /**
   * Creates a new list element to be used for search results.
   *
   * @param {string} text inside the list element
   * @param {number} id id of the list element
   * @param {string} elementTag tag (e.g. "li") for the element
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function createListElement(text, id, elementTag) {
    var element = document.createElement(elementTag);
    element.id = id;
    element.tabIndex = "0";
    element.innerHTML = text;
    return element;
  }

  function hideMenu(config) {
    hide(config.resultsView.viewElementId);
    hide(config.detailView.viewElementId);
    hide(config.filterOptionsView.viewElementId);
  }

  function hideSubMenus(config) {
    hide(config.detailView.viewElementId);
    hide(config.filterOptionsView.viewElementId);
  }

  /**
   * Shows the element given by its id.
   * @param {Element}  elementId ID of the element that should be shown
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function show(elementId) {
    showElement(document.getElementById(elementId));
  }

  /**
   * Shows the given element.
   * @param {Element} element element that should be shown
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function showElement(element) {
    addClass("show", element);
  }

  /**
   * Hides the element given by its id.
   * @param elementId ID of the element that should be hidden
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function hide(elementId) {
    hideElement(document.getElementById(elementId));
  }

  /**
   * Hides the view (by removing the class "show"), that contains the given element.
   * The view is identified by the existing style class "show".
   * @param {Element} element
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function hideViewOf(element) {
    var parentWithShowClass = parentThatMatches(element, function (parent) {
      return hasClass("show", parent);
    });
    if (parentWithShowClass != null) {
      hideElement(parentWithShowClass);
      return;
    }
  }

  /**
   * @callback module:searchmenu.ElementPredicate
   * @param {Element} element
   * @returns {boolean} true, when the predicate matches the given element, false otherwise.
   */

  /**
   * Returns the parent of the element (or the element itself), that matches the given predicate.
   * Returns null, if no element had been found.
   *
   * @param {Element} element
   * @param {module:searchmenu.ElementPredicate} predicate
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function parentThatMatches(element, predicate) {
    var parentNode = element;
    while (parentNode != null) {
      if (predicate(parentNode)) {
        return parentNode;
      }
      parentNode = parentNode.parentNode;
    }
    return null;
  }

  /**
   * Hides the given element.
   * @param element element that should be hidden
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function hideElement(element) {
    removeClass("show", element);
  }

  function toggleClass(classToToggle, element) {
    if (hasClass(classToToggle, element)) {
      removeClass(classToToggle, element);
    } else {
      addClass(classToToggle, element);
    }
  }

  function addClass(classToAdd, element) {
    removeClass(classToAdd, element);
    var separator = element.className.length > 0 ? " " : "";
    element.className += separator + classToAdd;
  }

  function removeClass(classToRemove, element) {
    var regex = new RegExp("\\s?\\b" + classToRemove + "\\b", "gi");
    element.className = element.className.replace(regex, "");
  }

  function hasClass(classToLookFor, element) {
    return element.className != null && element.className.indexOf(classToLookFor) >= 0;
  }

  function onMouseOverDelayed(element, delayTime, eventHandler) {
    addEvent("mouseover", element, function (event) {
      this.originalEvent = cloneObject(event);
      this.delayedHandlerTimer = window.setTimeout(function () {
        eventHandler(typeof this.originalEvent !== "undefined" ? this.originalEvent : event);
      }, delayTime);
      this.preventEventHandling = function () {
        if (this.delayedHandlerTimer !== null) {
          clearTimeout(this.delayedHandlerTimer);
        }
      };
      addEvent("mouseout", element, this.preventEventHandling);
      addEvent("mousedown", element, this.preventEventHandling);
      addEvent("keydown", element, this.preventEventHandling);
    });
  }

  function cloneObject(source) {
    var result = {};
    var propertyNames = Object.keys(source);
    for (var propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex++) {
      var propertyName = propertyNames[propertyIndex];
      var propertyValue = source[propertyName];
      result[propertyName] = propertyValue;
    }
    return result;
  }

  function onEscapeKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "Escape" || event.key == "Esc" || keyCodeOf(event) == 27) {
        eventHandler(event);
      }
    });
  }

  function onEnterKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "Enter" || keyCodeOf(event) == 13) {
        eventHandler(event);
      }
    });
  }

  function onSpaceKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == " " || event.key == "Spacebar" || keyCodeOf(event) == 32) {
        eventHandler(event);
      }
    });
  }

  function onDeleteKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "Del" || event.key == "Delete" || keyCodeOf(event) == 46) {
        eventHandler(event);
      }
    });
  }

  function onBackspaceKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "Backspace" || keyCodeOf(event) == 8) {
        eventHandler(event);
      }
    });
  }

  function onArrowUpKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "ArrowUp" || event.key == "Up" || keyCodeOf(event) == 38) {
        eventHandler(event);
      }
    });
  }

  function onArrowDownKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "ArrowDown" || event.key == "Down" || keyCodeOf(event) == 40) {
        eventHandler(event);
      }
    });
  }
  function onArrowRightKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "ArrowRight" || event.key == "Right" || keyCodeOf(event) == 39) {
        eventHandler(event);
      }
    });
  }

  function onArrowLeftKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "ArrowLeft" || event.key == "Left" || keyCodeOf(event) == 37) {
        eventHandler(event);
      }
    });
  }

  function addEvent(eventName, element, eventHandler) {
    eventlistener.addEventListener(eventName, element, eventHandler);
  }

  /**
   * @returns {Element} target of the event
   */
  function getEventTarget(event) {
    return eventtarget.getEventTarget(event);
  }

  /**
   * Returns the key code of the event or -1 if it is no available.
   * @param {KeyboardEvent} event
   * @return key code or -1 if not available
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */
  function keyCodeOf(event) {
    return typeof event.keyCode === "undefined" ? -1 : event.keyCode;
  }

  return instance;
})();
