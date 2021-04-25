/**
 * @file Provides the (http) client/connection to the search backend service.
 * @version ${project.version}
 * @author JohT
 */
//TODO JSDoc

"use strict";

var module = datarestructorInternalCreateIfNotExists(module); // Fallback for vanilla js without modules

function datarestructorInternalCreateIfNotExists(objectToCheck) {
  return objectToCheck || {};
}

/**
 * SearchServiceClient.
 * It provides the (http) client/connection to the search backend service.
 * @module searchService
 */
var searchService = (module.exports = {}); // Export module for npm...
searchService.internalCreateIfNotExists = datarestructorInternalCreateIfNotExists;

var xmlHttpRequest = xmlHttpRequest || require("../../src/js/ponyfills/xmlHttpRequestPonyfill"); // supports vanilla js & npm

/**
 * @typedef {Object} HttpSearchConfig Configures the HTTP request for the search.
 * @property {string} searchUrlTemplate url for the HTTP request for the search
 * @property {string} [searchMethod="POST"] HTTP method for the search. Defaults to "POST".
 * @property {string} [searchContentType="application/json"] HTTP content type of the request body. Defaults to "application/json".
 * @property {string} [searchBodyTemplate=null] HTTP request body template that may contain variables (e.g. {{searchParameters}}) in double curly brackets, or null if there is none.
 * @property {boolean} [debugMode=false] debug mode prints some more info to the console.
 */

searchService.HttpSearchConfig = (function () {
  /**
   * Configures and builds the {@link module:searchService.HttpClient}.
   * DescribedDataField is the main element of the restructured data and therefore considered "public".
   * @constructs HttpSearchConfig
   * @alias module:searchService.HttpSearchConfig
   */
  function HttpSearchConfig() {
    this.config = {
      /**
       * URL, that is called for every search request.
       * It may include variables in double curly brackets like {{searchtext}}.
       * @type {String}
       */
      searchUrlTemplate: "",
      /**
       * HTTP Method, that is used for every search request
       * @type {String}
       */
      searchMethod: "POST",
      /**
       * HTTP MIME-Type of the body, that is used for every search request
       * @type {String}
       */
      searchContentType: "application/json",
      /**
       * HTTP body template, that is used for every search request. 
       * It may include variables in double curly brackets like {{jsonSearchParameters}}.
       * @type {String}
       */
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
      /**
       * Contains the XMLHttpRequest that is used to handle HTTP requests and responses.
       * Defaults to XMLHttpRequest.
       * @type {XMLHttpRequest}
       */
      httpRequest: null,
      debugMode: false
    };
    /**
     * Sets the url for the HTTP request for the search.
     * It may include variables in double curly brackets like {{searchtext}}.
     * @param {String} value
     * @return {module:searchService.HttpSearchConfig}
     */
    this.searchUrlTemplate = function (value) {
      this.config.searchUrlTemplate = value;
      return this;
    };
    /**
     * Sets the HTTP method for the search. Defaults to "POST".
     * @param {String} value
     * @return {module:searchService.HttpSearchConfig}
     */
    this.searchMethod = function (value) {
      this.config.searchMethod = value;
      return this;
    };
    /**
     * Sets the HTTP content type of the request body. Defaults to "application/json".
     * @param {String} value
     * @return {module:searchService.HttpSearchConfig}
     */
    this.searchContentType = function (value) {
      this.config.searchContentType = value;
      return this;
    };
    /**
     * Sets the HTTP request body template that may contain variables (e.g. {{searchParameters}}) in double curly brackets, or null if there is none.
     * @param {String} value
     * @return {module:searchService.HttpSearchConfig}
     */
    this.searchBodyTemplate = function (value) {
      this.config.searchBodyTemplate = value;
      return this;
    };
    /**
     * Sets the HTTP-Request-Object. Defaults to XMLHttpRequest if not set.
     * @param {String} value
     * @return {module:searchService.HttpSearchConfig}
     */
    this.httpRequest = function (value) {
      this.config.httpRequest = value;
      return this;
    };
    /**
     * Sets the debug mode, that prints some more info to the console.
     * @param {boolean} value
     * @return {module:searchService.HttpSearchConfig}
     */
     this.debugMode = function (value) {
      this.config.debugMode = value === true;
      return this;
    };
    /**
     * Uses the configuration to build the http client that provides the function "search" (parameters: searchParameters, onSuccess callback).
     * @returns {HttpSearchClient}
     */
    this.build = function () {
      if (!this.config.httpRequest) {
        this.config.httpRequest = xmlHttpRequest.getXMLHttpRequest();
      }
      return new searchService.HttpClient(this.config);
    };
  }

  /**
   * Resolves variables in the template based on the given search parameters object.
   * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
   * @param {String} template contains variables in double curly brackets that should be replaced by the values of the parameterSourceObject.
   * @param {Object} parameterSourceObject object properties will be used to replace the variables of the template
   * @param {boolean} debugMode enables/disables extended logging for debugging
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

searchService.HttpClient = (function () {
  /**
   * HttpClient.
   *
   * Contains the "backend-connection" of the search bar. It submits the search query,
   * parses the results and informs the callback as soon as these results are available.
   * @param {HttpSearchConfig} config
   * @constructs HttpClient
   * @alias module:searchService.HttpClient
   */
  var instance = function (config) {
    /**
     * Configuration for the search HTTP requests.
     * @type {HttpSearchConfig}
     */
    this.config = config;
    /**
     * This function will be called to trigger search (calling the search backend).
     * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
     * @param {SearchServiceResultAvailable} onJsonResultReceived will be called when search results are available.
     */
    this.search = createSearchFunction(this.config, this.config.httpRequest);
  };

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
