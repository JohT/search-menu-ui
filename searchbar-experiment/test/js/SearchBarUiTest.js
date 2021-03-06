"use strict";

describe("search.js SearchBarUI", function () {
  var searchUnderTest;
  var searchTestData;

  beforeEach(function () {
    var require =
      require ||
      function (nameOfModule) {
        console.warn("no module system found to load " + nameOfModule);
      };
    searchUnderTest = searchbar || require("../../src/js/search.js");
    searchTestData = searchresulttestdata || require("../../test/js/SearchBarUiTestJsonData.js");
  });

  /**
   * This callback will be called on every document element that is addressed by "document.getElementById" the first time.
   * @callback NewlyDiscoveredElement
   * @param {Element} element
   * @return {Element} element that should be returned when "document.getElementById" is called.
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
        if (typeof onNewlyDiscoveredElement === "function") {
          return onNewlyDiscoveredElement(newElement);
        }
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
   * Replaces "setTimeout" with a spy that calls the otherwise delayed function immediately.
   * The spy can then also be used to assert the wait time that was set.
   * @param {Object} callOriginObject Object to use when the callback refers to "this". 
   */
  function replaceTimeoutWithin(callOriginObject) {
    spyOn(window, "setTimeout").and.callFake(function (timedFunction, timer) {
      timedFunction.call(callOriginObject);
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
    var searchResultData;
    var searchService = jasmine.createSpy("searchServiceSpy").and.callFake(function (searchParameters, callback) {
      callback(searchResultData);
    });
    var dataConverter = jasmine.createSpy("dataConverterSpy").and.callFake(function (data) {
      return data;
    });
    var predefinedParametersCallback;

    var documentElements;
    var eventListeners;
    var nonExistingElements; // Array of element id Strings that should return "null" on getElementById. e.g. ["searchbar"]
    var childNodeElements; // Array of element id Strings that should return an element when "childNodes" is called.

    beforeEach(function () {
      initializeDocumentElements();
      searchBarUiUnderTest = new searchUnderTest.SearchbarAPI()
        .searchService(searchService)
        .dataConverter(dataConverter)
        .addPredefinedParametersTo(predefinedParametersCallback)
        .start();
      config = searchBarUiUnderTest.config;
      searchResultData = searchTestData.SearchResult.getJson();
      replaceTimeoutWithin(searchBarUiUnderTest);
    });

    function initializeDocumentElements() {
      documentElements = {};
      eventListeners = {};
      nonExistingElements = [];
      childNodeElements = {};
      predefinedParametersCallback = jasmine.createSpy("predefinedParametersCallbackSpy");

      collectElementsById(documentElements, function (newElement) {
        if (nonExistingElements.includes(newElement.id)) {
          return null;
        }
        spyOn(newElement, "blur");
        spyOn(newElement, "focus");
        if (typeof childNodeElements[newElement.id] === "object") {
          newElement.appendChild(childNodeElements[newElement.id]);
        }
        spyOn(newElement, "childNodes").and.callThrough();
        collectEventListeners(eventListeners, newElement);
        return newElement;
      });
    }

    function getSearchInputTextElement() {
      return documentElements[config.inputElementId];
    }

    function getResultViewElement() {
      return documentElements[config.resultsView.viewElementId];
    }

    function getFirstResultListElement() {
      return documentElements[config.resultsView.listEntryElementIdPrefix + "-1"];
    }

    it("should add key down event listeners to the input element", function () {
      expect(document.getElementById).toHaveBeenCalledWith("searchbar");
      expect(getSearchInputTextElement().addEventListener).toHaveBeenCalledWith("keydown", jasmine.any(Function), false);
      expect(eventListeners.searchbar.keydown).toBeDefined();
    });

    it("should reset search input text when escape key is pressed there", function () {
      eventListeners.searchbar.keydown(createKeyEvent("Escape", getSearchInputTextElement()));
      expect(documentElements.searchbar.value).toEqual("");
    });

    it("should hide search area when escape key is pressed on input text", function () {
      eventListeners.searchbar.keydown(createKeyEvent("Escape", getSearchInputTextElement()));
      expect(getResultViewElement().className).not.toContain("show");
    });

    it("should focus the first result when arrow key down is pressed on the input text", function () {
      eventListeners.searchbar.keydown(createKeyEvent("ArrowDown", getSearchInputTextElement()));
      expect(getSearchInputTextElement().blur).toHaveBeenCalled();
      expect(getFirstResultListElement().focus).toHaveBeenCalled();
    });

    it("should focus the first result when arrow key down is pressed on the input text", function () {
      nonExistingElements.push(config.resultsView.listEntryElementIdPrefix + "-1");
      eventListeners.searchbar.keydown(createKeyEvent("ArrowDown", getSearchInputTextElement()));
      expect(getSearchInputTextElement().blur).not.toHaveBeenCalled();
    });

    it("should update search when input text character is entered", function () {
      searchResultData = [];
      var searchInputTextElement = getSearchInputTextElement();
      searchInputTextElement.value = "X";

      eventListeners.searchbar.keyup(createKeyEvent("X", getSearchInputTextElement()));

      expect(document.getElementById).toHaveBeenCalledWith(config.resultsView.listParentElementId);
      expect(getResultViewElement().className).toContain("show");
    });

    it("shouldn't update search when input text is cleared", function () {
      searchResultData = [];
      var searchInputTextElement = getSearchInputTextElement();
      searchInputTextElement.value = "X";

      eventListeners.searchbar.keyup(createKeyEvent("X", getSearchInputTextElement()));

      searchInputTextElement.value = "";
      eventListeners.searchbar.keyup(createKeyEvent("Backspace", getSearchInputTextElement()));

      expect(getResultViewElement().className).not.toContain("show");
    });

    it("should add search text as search parameters", function () {
      searchResultData = [];
      var searchInputTextElement = getSearchInputTextElement();
      searchInputTextElement.value = "X";

      eventListeners.searchbar.keyup(createKeyEvent("X", getSearchInputTextElement()));

      expect(searchService).toHaveBeenCalledWith({ searchtext: "X" }, jasmine.any(Function));
    });

    it("should add predefined parameters of callback as search parameters", function () {
      searchResultData = [];
      var searchInputTextElement = getSearchInputTextElement();
      searchInputTextElement.value = "X";
      predefinedParametersCallback.and.callFake(function (parameters) {
        parameters.constantNumber = 123;
      });

      eventListeners.searchbar.keyup(createKeyEvent("X", getSearchInputTextElement()));

      expect(searchService).toHaveBeenCalledWith({ searchtext: "X", constantNumber: 123 }, jasmine.any(Function));
    });

    it("should use filter view elements as search parameters", function () {
      searchResultData = [];
      var expectedParameter = {fieldName: "testFilterParameter", value: "testFilterValue"};
      var child = document.getElementById(config.filtersView.listParentElementId + "-testchild");
      var childFields = document.getElementById(child.id + "-fields");
      childFields.innerText = JSON.stringify(expectedParameter);
      childNodeElements[config.filtersView.listParentElementId] = child;

      var searchInputTextElement = getSearchInputTextElement();
      searchInputTextElement.value = "X";

      eventListeners.searchbar.keyup(createKeyEvent("X", getSearchInputTextElement()));

      expect(document.getElementById).toHaveBeenCalledWith(config.filtersView.listParentElementId);
      expect(searchService).toHaveBeenCalledWith({ searchtext: "X", testFilterParameter: "testFilterValue"}, jasmine.any(Function));
    });

    it("should wait the configured amount of time (waitBeforeSearch) before search is updated", function () {
      searchResultData = [];
      var searchInputTextElement = getSearchInputTextElement();
      searchInputTextElement.value = "X";

      eventListeners.searchbar.keyup(createKeyEvent("X", getSearchInputTextElement()));

      expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), config.waitBeforeSearch);
    });

    it("should show the results when search area is in focus", function () {
      var searchInputTextElement = getSearchInputTextElement();
      searchInputTextElement.value = "X";

      var searchAreaElementId = config.searchAreaElementId;
      var searchAreaElement = documentElements[searchAreaElementId];

      eventListeners[searchAreaElementId].focusin({ currentTarget: searchAreaElement });

      expect(getResultViewElement().className).toContain("show");
    });
  });

});
