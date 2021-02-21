/**
 * @fileOverview Provides the (http) client/connection to the search backend service.
 * @version ${project.version}
 */

/**
 * SearchServiceClient namespace declaration.
 * It provides the (http) client/connection to the search backend service.
 * @default {}
 */
var searchService = searchService || {};

/**
 * @typedef {Object} HttpSearchConfig Configures the HTTP request for the search.
 * @property {string} searchUrl url for the HTTP request for the search
 * @property {string} [searchMethod="POST"] HTTP method for the search. Defaults to "POST".
 * @property {string} [searchContentType="application/json"] HTTP content type of the request body. Defaults to "application/json".
 * @property {string} [searchBodyTemplate=null] HTTP request body template that may contain variables (e.g. {{searchParameters}}) in double curly brackets, or null if there is none.
 * @property {boolean} [debugMode=false] debug mode prints some more info to the console.
 */

/**
 * Configures the HTTP search service.
 * @namespace
 */
searchService.HttpSearchConfig = (function () {
  "use strict";

  var config = {
    searchUrl: "",
    searchMethod: "POST",
    searchContentType: "application/json",
    searchBodyTemplate: null,
    /**
     * Resolves variables in the search body template based on the given search parameters object.
     * The variable {{jsonSearchParameters}} will be replaces by the JSON of all search parameters.
     * @param {Object} searchParameters object properties will be used to replace the variables of the searchBodyTemplate
     */
    resolveSearchBody: function (searchParameters) {
      if (!this.searchBodyTemplate) {
        return null;
      }
      var jsonSearchParameters = JSON.stringify(searchParameters);
      var resolvedBody = this.searchBodyTemplate;
      resolvedBody = resolveVariableInTemplate(resolvedBody, "jsonSearchParameters", jsonSearchParameters);
      resolvedBody = resolveVariablesInTemplate(resolvedBody, searchParameters);
      if (this.debugMode) {
        console.log("template search body=" + this.searchBodyTemplate);
        console.log("{{jsonSearchParameters}}=" + jsonSearchParameters);
        console.log("resolved search body=" + resolvedBody);
      }
      return resolvedBody;
    },
    debugMode: false
  };

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

  /**
   * Public interface
   * @scope searchService.HttpSearchConfig
   */
  return {
    /**
     * Sets the url for the HTTP request for the search.
     * @param {String} value
     */
    searchUrl: function (value) {
      config.searchUrl = value;
      return this;
    },
    /**
     * Sets the HTTP method for the search. Defaults to "POST".
     * @param {String} value
     */
    searchMethod: function (value) {
      config.searchMethod = value;
      return this;
    },
    /**
     * Sets the HTTP content type of the request body. Defaults to "application/json".
     * @param {String} value
     */
    searchContentType: function (value) {
      config.searchContentType = value;
      return this;
    },
    /**
     * Sets the HTTP request body template that may contain variables (e.g. {{searchParameters}}) in double curly brackets, or null if there is none.
     * @param {String} value
     */
    searchBodyTemplate: function (value) {
      config.searchBodyTemplate = value;
      return this;
    },
    /**
     * Sets the debug mode, that prints some more info to the console.
     * @param {boolean} value
     */
    debugMode: function (value) {
      config.debugMode = value === true;
      return this;
    },
    /**
     * Uses the configuration to build the http client that provides the function "search" (parameters: searchParameters, onSuccess callback).
     * @returns {HttpSearchClient}
     */
    build: function () {
      return new searchService.HttpClient(config);
    }
  };
}());

/**
 * This function will be called, when search results are available.
 * @callback SearchServiceResultAvailable
 * @param {Object} searchResultData already parsed data object containing the result of the search
 */

/**
 * This function triggers search by calling the search service.
 * @callback SearchService
 * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
 * @param {SearchServiceResultAvailable} onSearchResultsAvailable will be called when search results are available.
 */

/**
 * @typedef {Object} HttpSearchClient
 * @property {HttpSearchConfig} config
 * @property {SearchService} search
 */

/**
 * HttpClient.
 *
 * Contains the "backend-connection" of the search bar. It submits the search query,
 * parses the results and informs the callback as soon as these results are available.
 *
 * @namespace
 */
searchService.HttpClient = (function () {
  "use strict";

  /**
   * This (constructor) function is called on "new searchService.HttpSearchConfig(config)"
   * with the search client configuration as parameter. It contains everything that needs
   * to be initialized and constructed for this specific http service instance.
   *
   * Functions outside of this object can be considered as static (for every instance).
   * They can also be considered to be "private", since they can not be accessed from outside.
   * @param {HttpSearchConfig} config
   */
  var instance = function (config) {
    /**
     * Configuration for the search HTTP requests.
     * @type {HttpSearchConfig}
     */
    this.config = config;
    /**
     * Contains the XMLHttpRequest that is used to handle HTTP requests and responses.
     * @type {XMLHttpRequest}
     */
    this.httpRequest = getHttpRequest();
    /**
     * This function will be called to trigger search (calling the search backend).
     * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
     * @param {SearchServiceResultAvailable} onJsonResultReceived will be called when search results are available.
     */
    this.search = createSearchFunction(this.config, this.httpRequest);

    /**
     * Overrides the XMLHttpRequest that is used to handle HTTP requests and responses.
     * This function is primary meant to be used for testing purposes to mock XMLHttpRequest.
     * @param {XMLHttpRequest} httpRequest 
     */
    this.setHttpRequest = function(httpRequest) {
      this.httpRequest = httpRequest;
      this.search = createSearchFunction(this.config, this.httpRequest);
    }
  };

  function createSearchFunction(config, httpRequest) {
    return function (searchParameters, onJsonResultReceived) {
      var onFailure = function (resultText, httpStatus) {
        console.error("search failed with status code " + httpStatus + ": " + resultText);
      };
      var searchBody = config.resolveSearchBody(searchParameters);
      var request = { url: config.searchUrl, method: config.searchMethod, contentType: config.searchContentType, body: searchBody };
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
   * @callback ParsedHttpResponseAvailable
   * @param {Object} resultData already parsed data object containing the results of the HTTP request
   * @param {number} httpStatus HTTP response status
   */
  /**
   * This function will be called when a response of the HTTP request is available as text.
   * @callback TextHttpResponseAvailable
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
   * @param {ParsedHttpResponseAvailable} onSuccess - will be called when the request was successful.
   * @param {TextHttpResponseAvailable} onFailure - will be called with the error message as text
   */
  function httpRequestJson(request, httpRequest, onSuccess, onFailure) {
    httpRequest.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status <= 299) {
          var jsonResult = JSON.parse(this.responseText);
          onSuccess(jsonResult, this.status);
        } else {
          onFailure(this.responseText, this.status);
        }
      }
    };
    httpRequest.open(request.method, request.url, true);
    httpRequest.setRequestHeader("Content-Type", request.contentType);
    httpRequest.send(request.body);
  }

  function getHttpRequest() {
    if (typeof XMLHttpRequest !== "undefined") {
      return new XMLHttpRequest();
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
    // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
    throw new Error("This browser does not support XMLHttpRequest.");
  }

  return instance;
})();
