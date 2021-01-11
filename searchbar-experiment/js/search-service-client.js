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
searchService.RestSearchConfig = (function () {
  "use strict";

  var config = {
    searchURI: "",
    searchMethod: "POST",
    searchBodyTemplate: ""
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
      httpGetJson(config.searchURI, getHttpRequest(), onJsonResultReceived);
    };
  };

  function httpGetJson(url, httpRequest, onJsonResultReceived) {
    httpRequest.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var jsonResult = JSON.parse(this.responseText);
        onJsonResultReceived(jsonResult);
      }
    };
    httpRequest.open("GET", url, true);
    httpRequest.send();
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
