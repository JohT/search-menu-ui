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
      searchBarApiUnderTest = searchUnderTest.SearchbarAPI;
      var dummyElement = document.createElement("div");
      document.getElementById = jasmine.createSpy("HTML Element").and.returnValue(dummyElement);
    });

    it("should contain the searchService", function () {
      var expectedParameter = {parameter: "value"};
      var expectedCallback = jasmine.createSpy("searchResultCallback");
      var searchService = jasmine.createSpy("searchServiceSpy");
      
      searchBarApiUnderTest.searchService(searchService);
      var resultingSearchUi = searchBarApiUnderTest.start();
      
      resultingSearchUi.config.triggerSearch(expectedParameter, expectedCallback);
      expect(searchService).toHaveBeenCalledWith(expectedParameter, expectedCallback);
    });


  });
  
});
