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

  /**
   * This callback will be called on every document element that is discovered the first time.
   * @callback NewlyDiscoveredElement
   * @param {Element} element 
   */

  /**
   * Collects all elements that are queried by "document.getElementById".
   * @param {Elements} documentElements 
   * @param {NewlyDiscoveredElement} onNewlyDiscoveredElement 
   */
  function collectElementsById(documentElements, onNewlyDiscoveredElement) {
    document.getElementById = jasmine.createSpy("HTML Element").and.callFake(function (id) {
      if (!documentElements[id]) {
        var newElement = document.createElement("div");
        newElement.id = id;
        documentElements[id] = newElement;
        onNewlyDiscoveredElement(newElement);
      }
      return documentElements[id];
    });
  }

  /**
   * Collects all event listeners that are registered with "element.addEventListener".
   * The event listeners can then be accessed by "eventListeners.<id of the element>.<name of the event>".
   * @param {Object} eventListeners - whenever a listener is registered with "element.addEventListener", it will be collected in this object.
   * @param {Element} element 
   */
  function collectEventListeners(eventListeners, element) {
    var id = element.id;
    element.addEventListener = jasmine.createSpy("HTML EventListener of " + id).and.callFake(function (eventName, eventHandler) {
      if (!eventListeners[id]) {
        eventListeners[id] = {};
      }
      if (!eventListeners[id][eventName]) {
        eventListeners[id][eventName] = eventHandler;
      } else {
        var alreadyExistingHandler = eventListeners[id][eventName];
        eventListeners[id][eventName] = function (event) {
          alreadyExistingHandler(event);
          eventHandler(event);
        };
      }
    });
  }

  /**
   * Creates a dummy key event for event handler tests.
   * @param {String} keyName 
   * @param {Element} targetElement 
   */
  function createKeyEvent(keyName, targetElement) {
    return {
      key: keyName,
      currentTarget: targetElement
    };
  }

  describe("SearchBarUI", function () {
    var searchBarUiUnderTest;
    var config;
    var searchService = jasmine.createSpy("searchServiceSpy");
    var dataConverter = jasmine.createSpy("dataConverterSpy");
    var documentElements = {};
    var eventListeners = {};

    beforeEach(function () {
      collectElementsById(documentElements, function (newElement) {
        collectEventListeners(eventListeners, newElement);
      });
      searchBarUiUnderTest = new searchUnderTest.SearchbarAPI().searchService(searchService).dataConverter(dataConverter).start();
      config = searchBarUiUnderTest.config;
    });

    function getResultViewElement() {
      return documentElements[config.resultsView.viewElementId];
    }

    it("should add key down event listeners to the input element", function () {
      expect(document.getElementById).toHaveBeenCalledWith("searchbar");
      expect(documentElements.searchbar.addEventListener).toHaveBeenCalledWith("keydown", jasmine.any(Function), false);
      expect(eventListeners.searchbar.keydown).toBeDefined();
    });

    it("should set search input text to `` when escape key is pressed", function () {
      eventListeners.searchbar.keydown(createKeyEvent("Escape", documentElements.searchbar)); 
      expect(documentElements.searchbar.value).toEqual("");
    });

    it("should hide search area when escape key is pressed", function () {
      eventListeners.searchbar.keydown(createKeyEvent("Escape", documentElements.searchbar));
      expect(getResultViewElement().className).not.toContain("show");
    });
  });
});
