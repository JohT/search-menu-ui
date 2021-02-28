"use strict";

describe("search.js SearchBarUI", function () {
  var searchUnderTest;

  beforeEach(function () {
    var require =
      require ||
      function (nameOfModule) {
        console.warn("no module system found to load " + nameOfModule);
      };
    searchUnderTest = searchbar || require("../../src/js/search.js");
  });

  describe("SearchBarUI", function () {
    var searchBarUiUnderTest;
    var config;
    var searchService = jasmine.createSpy("searchServiceSpy");
    var dataConverter = jasmine.createSpy("dataConverterSpy");
    var documentElements = {};
    var eventHandlers = {};
    //id "searchbar"

    beforeEach(function () {
      document.getElementById = jasmine.createSpy("HTML Element").and.callFake(function (id) {
        if (documentElements[id]) {
          return documentElements[id];
        }
        var newElement = document.createElement("div");
        documentElements[id] = newElement;
        newElement.addEventListener = jasmine.createSpy("HTML EventListener of " + id).and.callFake(function (eventName, eventHandler) {
          if (!eventHandlers[id]) {
            eventHandlers[id] = {};
          }
          if (!eventHandlers[id][eventName]) {
            eventHandlers[id][eventName] = eventHandler;
          } else {
            var alreadyExistingHandler = eventHandlers[id][eventName];
            eventHandlers[id][eventName] = function (event) {
              alreadyExistingHandler(event);
              eventHandler(event);
            };
          }
        });

        return documentElements[id];
      });
      searchBarUiUnderTest = new searchUnderTest.SearchbarAPI().searchService(searchService).dataConverter(dataConverter).start();
      config = searchBarUiUnderTest.config;
    });

    it("should add key down event listeners to the input element with default id `searchbar`", function () {
      expect(document.getElementById).toHaveBeenCalledWith("searchbar");
      expect(documentElements.searchbar.addEventListener).toHaveBeenCalledWith("keydown", jasmine.any(Function), false);
      expect(eventHandlers.searchbar.keydown).toBeDefined();
    });


    it("should hide search area when escape key is pressed", function () {
      var escapeKeyEvent = {
        key: "Escape",
        currentTarget: documentElements.searchbar
      };
      eventHandlers.searchbar.keydown(escapeKeyEvent); // simulate pressed escape key
      expect(documentElements.searchbar.value).toEqual("");
      expect(documentElements[config.resultsView.viewElementId].className).not.toContain("show");
    });
  });
});
