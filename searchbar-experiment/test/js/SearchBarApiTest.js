"use strict";

describe("search.js ", function () {
  var searchUnderTest;

  beforeEach(function () {
    var require =
      require ||
      function (nameOfModule) {
        console.warn("no module system found to load " + nameOfModule);
      };
    searchUnderTest = searchbar || require("../../src/js/search.js");
  });

  describe("SearchBarApi", function () {
    var searchBarApiUnderTest;

    beforeEach(function () {
      searchBarApiUnderTest = new searchUnderTest.SearchbarAPI();
      var dummyElement = document.createElement("div");
      document.getElementById = jasmine.createSpy("HTML Element").and.returnValue(dummyElement);
    });

    it("should throw an exception if no search service had been set", function () {
      var resultingSearchUi = searchBarApiUnderTest.start();
      expect(resultingSearchUi.config.triggerSearch).toThrow(new Error("search service needs to be defined."));
    });

    it("should use the specified search service", function () {
      var expectedParameter = {parameter: "value"};
      var expectedCallback = jasmine.createSpy("searchResultCallback");
      var searchService = jasmine.createSpy("searchServiceSpy");
      
      searchBarApiUnderTest.searchService(searchService);
      var resultingSearchUi = searchBarApiUnderTest.start();

      resultingSearchUi.config.triggerSearch(expectedParameter, expectedCallback);
      expect(searchService).toHaveBeenCalledWith(expectedParameter, expectedCallback);
    });

    it("should throw an exception if no data converter had been set", function () {
      var resultingSearchUi = searchBarApiUnderTest.start();
      expect(resultingSearchUi.config.convertData).toThrow(new Error("data converter needs to be defined."));
    });

  });
  
});
