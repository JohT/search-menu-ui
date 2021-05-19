"use strict";

var searchMenuServiceClient = searchMenuServiceClient || require("../../src/js/search-service-client"); // supports vanilla js & npm

describe("search-service-client HttpSearchConfig", function () {
  var searchServiceUnderTest;

  beforeEach(function () {
    searchServiceUnderTest = searchMenuServiceClient;
  });

  describe("detect empty objects and", function () {
    it("should create a new object if the given one doesn't exist", function () {
      var result = searchMenuServiceClient.internalCreateIfNotExists(null);
      expect(result).toEqual({});
    });
  
    it("should use the given object if it exists", function () {
      var expectedExistingObject = {anytestproperty: 3};
      var result = searchMenuServiceClient.internalCreateIfNotExists(expectedExistingObject);
      expect(result).toEqual(expectedExistingObject);
    });
  });

  describe("HttpSearchConfig", function () {
    var httpSearchConfig;

    beforeEach(function () {
      httpSearchConfig = new searchServiceUnderTest.HttpSearchConfig();
    });

    it("should contain configured debug mode", function () {
      var expectedValue = true;
      httpSearchConfig = httpSearchConfig.debugMode(expectedValue);
      expect(httpSearchConfig.config.debugMode).toEqual(expectedValue);
    });

    it("should contain configured search method", function () {
      var expectedValue = "POST";
      httpSearchConfig = httpSearchConfig.searchMethod(expectedValue);
      expect(httpSearchConfig.config.searchMethod).toEqual(expectedValue);
    });

    it("should contain configured search url template", function () {
      var expectedValue = "http://localhost:9200/_msearch/template";
      httpSearchConfig = httpSearchConfig.searchUrlTemplate(expectedValue);
      expect(httpSearchConfig.config.searchUrlTemplate).toEqual(expectedValue);
    });

    it("should contain configured search content type", function () {
      var expectedValue = "application/json";
      httpSearchConfig = httpSearchConfig.searchContentType(expectedValue);
      expect(httpSearchConfig.config.searchContentType).toEqual(expectedValue);
    });

    it("should contain configured search request body template", function () {
      var expectedValue = '{"index": "customers"}';
      httpSearchConfig = httpSearchConfig.searchBodyTemplate(expectedValue);
      expect(httpSearchConfig.config.searchBodyTemplate).toEqual(expectedValue);
    });

    it("should resolve variables in the search request url template", function () {
      var template = "{{variable1}}-{{variable2}}";
      var variables = { variable1: "WX", variable2: "YZ" };
      httpSearchConfig = httpSearchConfig.searchUrlTemplate(template);
      expect(httpSearchConfig.config.resolveSearchUrl(variables)).toEqual("WX-YZ");
    });

    it("should resolve variables in the search request body template", function () {
      var template = "{{variable1}}-{{variable2}}";
      var variables = { variable1: "AB", variable2: "CD" };
      httpSearchConfig = httpSearchConfig.searchBodyTemplate(template);
      expect(httpSearchConfig.config.resolveSearchBody(variables)).toEqual("AB-CD");
    });

    it("should resolve variables in the search request body template with additional logs in debug mode", function () {
      var template = "{{variable1}}-{{variable2}}";
      var variables = { variable1: "AB", variable2: "CD" };
      httpSearchConfig = httpSearchConfig.searchBodyTemplate(template).debugMode(true);
      expect(httpSearchConfig.config.resolveSearchBody(variables)).toEqual("AB-CD");
    });

    it("should resolve {{jsonSearchParameters}} in the search request body template with all variables as json", function () {
      var template = "{{jsonSearchParameters}}";
      var variables = { variable1: "AB", variable2: "CD" };
      httpSearchConfig = httpSearchConfig.searchBodyTemplate(template);
      expect(httpSearchConfig.config.resolveSearchBody(variables)).toEqual('{"variable1":"AB","variable2":"CD"}');
    });
  });

  describe("HttpClient", function () {
    var httpSearchConfig;
    var searchParameters = { parameter1: "A", parameter2: "B" };
    var httpRequest;
    var httpSearchConfigBuilder;
    var httpClientUnderTest;

    beforeEach(function () {
      httpRequest = {};
      httpRequest.open = function () {};
      httpRequest.setRequestHeader = function () {};
      httpRequest.send = function () {};
      httpRequest.readyState = 4;
      httpRequest.status = 200;
      httpRequest.responseText = "{}";

      httpSearchConfigBuilder = new searchServiceUnderTest.HttpSearchConfig()
      .debugMode(false)
      .searchMethod("POST")
      .searchUrlTemplate("http://localhost:9200/_msearch/template")
      .httpRequest(httpRequest);

      httpClientUnderTest = httpSearchConfigBuilder.build();
      httpSearchConfig = httpClientUnderTest.config;
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
      expect(usedUrl).toEqual(httpSearchConfig.searchUrlTemplate);
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

    it("should write additional information into the log in debug mode", function () {
      var logSpy = spyOn(console, "log");
      httpClientUnderTest = httpSearchConfigBuilder.debugMode(true).build();
      httpSearchConfig = httpClientUnderTest.config;
      var onJsonResultReceived = function () {};
      httpClientUnderTest.search(searchParameters, onJsonResultReceived);
      httpRequest.onreadystatechange();
      expect(logSpy).toHaveBeenCalled();
    });

  });
});
