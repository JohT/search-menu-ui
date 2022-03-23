// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"708Ii":[function(require,module,exports) {
/**
 * @file Provides the (http) client/connection to the search backend service.
 * @version {@link https://github.com/JohT/search-menu-ui/releases/latest latest version}
 * @author JohT
 * @version ${project.version}
 */ "use strict";
var module = datarestructorInternalCreateIfNotExists(module); // Fallback for vanilla js without modules
function datarestructorInternalCreateIfNotExists(objectToCheck) {
    return objectToCheck || {};
}
/**
 * Search-Menu Service-Client.
 * It provides the (http) client/connection to the search backend service.
 * @module searchMenuServiceClient
 */ var searchMenuServiceClient = module.exports = {}; // Export module for npm...
searchMenuServiceClient.internalCreateIfNotExists = datarestructorInternalCreateIfNotExists;
var xmlHttpRequest = xmlHttpRequest || require("../../src/js/ponyfills/xmlHttpRequestPonyfill"); // supports vanilla js & npm
searchMenuServiceClient.HttpSearchConfig = function() {
    /**
   * Configures and builds the {@link module:searchMenuServiceClient.HttpClient}.
   * DescribedDataField is the main element of the restructured data and therefore considered "public".
   * @constructs HttpSearchConfig
   * @alias module:searchMenuServiceClient.HttpSearchConfig
   */ function HttpSearchConfig() {
        /**
     * HTTP Search Configuration.
     * @property {string} searchUrlTemplate URL that is called for every search request. It may include variables in double curly brackets like `{{searchtext}}`.
     * @property {string} [searchMethod="POST"] HTTP Method, that is used for every search request.
     * @property {string} [searchContentType="application/json"] HTTP MIME-Type of the body, that is used for every search request.
     * @property {string} searchBodyTemplate HTTP body template, that is used for every search request. It may include variables in double curly brackets like `{{jsonSearchParameters}}`.
     * @property {XMLHttpRequest} [httpRequest=new XMLHttpRequest()] Contains the XMLHttpRequest that is used to handle HTTP requests and responses. Defaults to XMLHttpRequest.
     * @property {boolean} [debugMode=false] Adds detailed logging for development and debugging.
     */ this.config = {
            searchUrlTemplate: "",
            searchMethod: "POST",
            searchContentType: "application/json",
            searchBodyTemplate: null,
            /**
       * Resolves variables in the search url template based on the given search parameters object.
       * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
       * @param {Object} searchParameters object properties will be used to replace the variables of the searchUrlTemplate
       */ resolveSearchUrl: function(searchParameters) {
                return resolveTemplate(this.searchUrlTemplate, searchParameters, this.debugMode);
            },
            /**
       * Resolves variables in the search body template based on the given search parameters object.
       * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
       * @param {Object} searchParameters object properties will be used to replace the variables of the searchBodyTemplate
       */ resolveSearchBody: function(searchParameters) {
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
     */ this.searchUrlTemplate = function(value) {
            this.config.searchUrlTemplate = value;
            return this;
        };
        /**
     * Sets the HTTP method for the search. Defaults to "POST".
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */ this.searchMethod = function(value) {
            this.config.searchMethod = value;
            return this;
        };
        /**
     * Sets the HTTP content type of the request body. Defaults to "application/json".
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */ this.searchContentType = function(value) {
            this.config.searchContentType = value;
            return this;
        };
        /**
     * Sets the HTTP request body template that may contain variables (e.g. {{searchParameters}}) in double curly brackets, or null if there is none.
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */ this.searchBodyTemplate = function(value) {
            this.config.searchBodyTemplate = value;
            return this;
        };
        /**
     * Sets the HTTP-Request-Object. Defaults to XMLHttpRequest if not set.
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */ this.httpRequest = function(value) {
            this.config.httpRequest = value;
            return this;
        };
        /**
     * Sets the debug mode, that prints some more info to the console.
     * @param {boolean} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */ this.debugMode = function(value) {
            this.config.debugMode = value === true;
            return this;
        };
        /**
     * Uses the configuration to build the http client that provides the function "search" (parameters: searchParameters, onSuccess callback).
     * @returns {module:searchMenuServiceClient.HttpClient}
     */ this.build = function() {
            if (!this.config.httpRequest) this.config.httpRequest = xmlHttpRequest.getXMLHttpRequest();
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
   */ function resolveTemplate(template, parameterSourceObject, debugMode) {
        if (template == null) return null;
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
        forEachFieldsIn(sourceDataObject, function(fieldName, fieldValue) {
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
        for(index = 0; index < fieldNames.length; index += 1){
            fieldName = fieldNames[index];
            fieldValue = object[fieldName];
            fieldNameAndValueConsumer(fieldName, fieldValue);
        }
    }
    return HttpSearchConfig;
}();
/**
 * This function will be called, when search results are available.
 * @callback module:searchMenuServiceClient.HttpClient.SearchServiceResultAvailable
 * @param {Object} searchResultData already parsed data object containing the result of the search
 */ searchMenuServiceClient.HttpClient = function() {
    /**
   * HttpClient.
   *
   * Contains the "backend-connection" of the search bar. It submits the search query,
   * parses the results and informs the callback as soon as these results are available.
   * @example new searchMenuServiceClient.HttpSearchConfig()....build();
   * @param {module:searchMenuServiceClient.HttpSearchConfig} config 
   * @constructs HttpClient
   * @alias module:searchMenuServiceClient.HttpClient
   */ var instance = function(config) {
        /**
     * Configuration for the search HTTP requests.
     * @type {module:searchMenuServiceClient.HttpSearchConfig}
     */ this.config = config;
        /**
     * This function will be called to trigger search (calling the search backend).
     * @function
     * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
     * @param {module:searchMenuServiceClient.HttpClient.SearchServiceResultAvailable} onSearchResultsAvailable will be called when search results are available.
     */ this.search = createSearchFunction(this.config, this.config.httpRequest);
    };
    /**
   * Creates the search service function that can be bound to the search menu.
   * @param {module:searchMenuServiceClient.HttpSearchConfig} config Configuration for the search HTTP requests.
   * @param {XMLHttpRequest} httpRequest Takes the HTTP-Request-Object.
   * @returns {module:searchMenuServiceClient.SearchService}
   * @memberof module:searchMenuServiceClient.HttpClient
   * @private
   */ function createSearchFunction(config, httpRequest) {
        return function(searchParameters, onJsonResultReceived) {
            var onFailure = function(resultText, httpStatus) {
                console.error("search failed with status code " + httpStatus + ": " + resultText);
            };
            var searchUrl = config.resolveSearchUrl(searchParameters);
            var searchBody = config.resolveSearchBody(searchParameters);
            var request = {
                url: searchUrl,
                method: config.searchMethod,
                contentType: config.searchContentType,
                body: searchBody
            };
            if (config.debugMode) onJsonResultReceived = loggedSuccess(onJsonResultReceived);
            httpRequestJson(request, httpRequest, onJsonResultReceived, onFailure);
        };
    }
    function loggedSuccess(onSuccess) {
        return function(jsonResult, status) {
            console.log("successful search response with code " + status + ": " + JSON.stringify(jsonResult, null, 2));
            onSuccess(jsonResult, status);
        };
    }
    /**
   * This function will be called when a already parsed response of the HTTP request is available.
   * @callback module:searchMenuServiceClient.HttpClient.ParsedHttpResponseAvailable
   * @param {Object} resultData already parsed data object containing the results of the HTTP request
   * @param {number} httpStatus HTTP response status
   */ /**
   * This function will be called when a response of the HTTP request is available as text.
   * @callback module:searchMenuServiceClient.HttpClient.TextHttpResponseAvailable
   * @param {Object} resultText response body as text
   * @param {number} httpStatus HTTP response status
   */ /**
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
   */ function httpRequestJson(request, httpRequest, onSuccess, onFailure) {
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status >= 200 && httpRequest.status <= 299) {
                    var jsonResult = JSON.parse(httpRequest.responseText);
                    onSuccess(jsonResult, httpRequest.status);
                } else onFailure(httpRequest.responseText, httpRequest.status);
            }
        };
        httpRequest.open(request.method, request.url, true);
        httpRequest.setRequestHeader("Content-Type", request.contentType);
        httpRequest.send(request.body);
    }
    return instance;
}();

},{"../../src/js/ponyfills/xmlHttpRequestPonyfill":"1gr42"}],"1gr42":[function(require,module,exports) {
"use strict";
var module = module || {}; // Fallback for vanilla js without modules
/**
 * @namespace xmlHttpRequest
 */ var xmlHttpRequest = module.exports = {}; // Fallback for vanilla js without modules
/**
 * Provide the XMLHttpRequest constructor for Internet Explorer 5.x-6.x:
 * Other browsers (including Internet Explorer 7.x-9.x) do not redefine
 * XMLHttpRequest if it already exists.
 *
 * This example is based on findings at:
 * http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
 * @returns {XMLHttpRequest}
 * @memberof xmlHttpRequest
 */ xmlHttpRequest.getXMLHttpRequest = function() {
    if (typeof XMLHttpRequest !== "undefined") try {
        var request = new XMLHttpRequest();
        request.status; //try, if status is accessible. Fails in IE5.
        return request;
    } catch (e) {
        console.log("XMLHttpRequest not available: " + e);
    }
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e1) {
        console.log("XMLHttpRequest Msxml2.XMLHTTP.6.0 not available: " + e1);
    }
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e2) {
        console.log("XMLHttpRequest Msxml2.XMLHTTP.3.0 not available: " + e2);
    }
    try {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e3) {
        console.log("XMLHttpRequest Microsoft.XMLHTTP not available: " + e3);
    }
    // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
    throw new Error("This browser does not support XMLHttpRequest.");
};

},{}]},["708Ii"], "708Ii", "parcelRequire6f19")

