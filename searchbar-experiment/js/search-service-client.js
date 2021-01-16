/**
 * @fileOverview Provides the (rest) client/connection to the search backend service.
 * @version ${project.version}
 */

/**
 * SearchServiceClient namespace declaration.
 * It provides the (rest) client/connection to the search backend service.
 * @default {}
 */
var searchService = searchService || {};

/**
 * RestSearchConfig
 * Configures the REST for the search backend service.
 *
 * @namespace
 */
//TODO jsdoc config
searchService.RestSearchConfig = (function () {
  "use strict";

  var config = {
    searchURI: "",
    searchMethod: "POST",
    searchContentType: "application/json",
    searchBodyTemplate: null,
    resolveSearchBody: function (searchParameters) {
      var jsonSearchParameters = (typeof searchParameters === "string")? searchParameters : JSON.stringify(searchParameters);
      return this.searchBodyTemplate.replace(new RegExp("\\{\\{searchParameters\\}\\}", "gm"), jsonSearchParameters);
    }
  };

  /**
   * Public interface
   * @scope searchbar.SearchbarAPI
   */
  return {
    searchURI: function (value) {
      config.searchURI = value;
      return this;
    },
    searchMethod: function (value) {
      config.searchMethod = value;
      return this;
    },
    searchContentType: function (value) {
      config.searchContentType = value;
      return this;
    },
    searchBodyTemplate: function (value) {
      config.searchBodyTemplate = value;
      return this;
    },
    build: function () {
      return new searchService.RestSearchClient(config);
    }
  };
}());

/**
 * RestSearchClient.
 *
 * Contains the "backend-connection" of the search bar. It submits the search query,
 * parses the results and informs the callback as soon as these results are available.
 *
 * @namespace
 */
searchService.RestSearchClient = (function () {
  "use strict";

  /**
   * This (constructor) function is called on "new searchService.RestSearchClient(config)"
   * with the search client configuration as parameter. It contains everything that needs
   * to be initialized and constructed for this specific rest service instance.
   *
   * Functions outside of this object can be considered as static (for every instance).
   * They can also be considered to be "private", since they can not be accessed from outside.
   */
  var instance = function (config) {
    this.config = config;
    this.search = function (searchParameters, onJsonResultReceived) {
      var onFailure = function (resultText, httpStatus) {
        console.error("search failed with status code " + httpStatus + ": " + resultText); //TODO debug mode
      };
      var searchBody = config.resolveSearchBody(searchParameters);
      var request = { url: config.searchURI, method: config.searchMethod, contentType: config.searchContentType, body: searchBody };
      httpRequestJson(request, getHttpRequest(), onJsonResultReceived, onFailure);
    };
  };

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

  // Returns the instance
  return instance;
}());
