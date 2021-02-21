"use strict";

describe("search-service-client HttpSearchConfig", function () {
  var searchServiceUnderTest;

  beforeEach(function () {
    var require =
      require ||
      function (nameOfModule) {
        console.warn("no module system found to load " + nameOfModule);
      };
    searchServiceUnderTest = searchService || require("../../src/js/search-service-client");
  });

  describe("HttpSearchConfig", function () {
    var httpSearchConfig;

    beforeEach(function () {
      httpSearchConfig = searchServiceUnderTest.HttpSearchConfig;
    });

    it("should contain configured debug mode", function () {
      var expectedValue = true;
      var httpClient = httpSearchConfig.debugMode(expectedValue).build();
      expect(httpClient.config.debugMode).toEqual(expectedValue);
    });

    it("should contain configured search method", function () {
      var expectedValue = "POST";
      var httpClient = httpSearchConfig.searchMethod(expectedValue).build();
      expect(httpClient.config.searchMethod).toEqual(expectedValue);
    });

    it("should contain configured search url", function () {
      var expectedValue = "http://localhost:9200/_msearch/template";
      var httpClient = httpSearchConfig.searchUrl(expectedValue).build();
      expect(httpClient.config.searchUrl).toEqual(expectedValue);
    });

    it("should contain configured search content type", function () {
      var expectedValue = "application/json";
      var httpClient = httpSearchConfig.searchContentType(expectedValue).build();
      expect(httpClient.config.searchContentType).toEqual(expectedValue);
    });

    it("should contain configured search request body template", function () {
      var expectedValue = '{"index": "customers"}';
      var httpClient = httpSearchConfig.searchBodyTemplate(expectedValue).build();
      expect(httpClient.config.searchBodyTemplate).toEqual(expectedValue);
    });

    it("should resolve variables in the search request body template", function () {
      var template = "{{variable1}}-{{variable2}}";
      var variables = { variable1: "AB", variable2: "CD" };
      var httpClient = httpSearchConfig.searchBodyTemplate(template).build();
      expect(httpClient.config.resolveSearchBody(variables)).toEqual("AB-CD");
    });

    it("should resolve variables in the search request body template with additional logs in debug mode", function () {
      var template = "{{variable1}}-{{variable2}}";
      var variables = { variable1: "AB", variable2: "CD" };
      var httpClient = httpSearchConfig.searchBodyTemplate(template).debugMode(true).build();
      expect(httpClient.config.resolveSearchBody(variables)).toEqual("AB-CD");
    });

    it("should resolve {{jsonSearchParameters}} in the search request body template with all variables as json", function () {
      var template = "{{jsonSearchParameters}}";
      var variables = { variable1: "AB", variable2: "CD" };
      var httpClient = httpSearchConfig.searchBodyTemplate(template).build();
      expect(httpClient.config.resolveSearchBody(variables)).toEqual('{"variable1":"AB","variable2":"CD"}');
    });
  });

  describe("HttpClient", function () {
    var httpSearchConfig;
    var searchParameters = { parameter1: "A", parameter2: "B" };
    var httpRequest;
    var httpClientUnderTest;

    beforeEach(function () {
      httpClientUnderTest = searchServiceUnderTest.HttpSearchConfig.debugMode(false)
        .searchMethod("POST")
        .searchUrl("http://localhost:9200/_msearch/template")
        .build();
      httpSearchConfig = httpClientUnderTest.config;

      httpRequest = {};
      httpRequest.open = function () {};
      httpRequest.setRequestHeader = function () {};
      httpRequest.send = function () {};
      httpRequest.readyState = 4;
      httpRequest.status = 200;
      httpRequest.responseText = "{}";

      httpClientUnderTest.setHttpRequest(httpRequest);
    });

    it("should take successfully received data", function () {
      var receivedJson = null;
      var receivedStatus = null;
      var onJsonResultReceived = function (jsonResult, status) {
        receivedJson = jsonResult;
        receivedStatus = status;
      };
      httpClientUnderTest.search(searchParameters, onJsonResultReceived);
      httpRequest.onreadystatechange();
      expect(receivedJson).toEqual({});
      expect(receivedStatus).toEqual(200);
    });

    it("should use configured search method", function () {
      var usedMethod = null;
      httpRequest.open = function (method, url) {
        usedMethod = method;
      };
      var onJsonResultReceived = function () {};
      httpClientUnderTest.search(searchParameters, onJsonResultReceived);
      httpRequest.onreadystatechange();
      expect(usedMethod).toEqual(httpSearchConfig.searchMethod);
    });

    it("should use configured url", function () {
      var usedUrl = null;
      httpRequest.open = function (method, url) {
        usedUrl = url;
      };
      var onJsonResultReceived = function () {};
      httpClientUnderTest.search(searchParameters, onJsonResultReceived);
      httpRequest.onreadystatechange();
      expect(usedUrl).toEqual(httpSearchConfig.searchUrl);
    });

    it("should report failed communication", function () {
      httpRequest.status = 503;
      var successful = false;
      var onJsonResultReceived = function () {
        successful = true;
      };
      httpClientUnderTest.search(searchParameters, onJsonResultReceived);
      httpRequest.onreadystatechange();
      expect(successful).toBeFalsy();
    });
  });
});
