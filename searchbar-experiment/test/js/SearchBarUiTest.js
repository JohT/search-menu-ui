"use strict";

var searchbar = searchbar || require("../../src/js/search"); // supports vanilla js & npm
var searchresulttestdata = searchresulttestdata || require("../../test/js/SearchBarUiTestJsonData");

describe("search.js", function () {
  var searchUnderTest;
  var searchTestData;

  beforeEach(function () {
    searchUnderTest = searchbar;
    searchTestData = searchresulttestdata;
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
    var functionFake = function (id) {
      if (!documentElements[id]) {
        var newElement = document.createElement("div");
        newElement.id = id;
        documentElements[id] = newElement;
        if (typeof onNewlyDiscoveredElement === "function") {
          return onNewlyDiscoveredElement(newElement);
        }
      }
      return documentElements[id];
    };
    document.getElementById = jasmine.createSpy("getElementById-Spy").and.callFake(functionFake);
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

  describe("detect empty objects and", function () {
    it("should create a new object if the given one doesn't exist", function () {
      var result = searchUnderTest.internalCreateIfNotExists(null);
      expect(result).toEqual({});
    });

    it("should use the given object if it exists", function () {
      var expectedExistingObject = { anytestproperty: 3 };
      var result = searchUnderTest.internalCreateIfNotExists(expectedExistingObject);
      expect(result).toEqual(expectedExistingObject);
    });
  });

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

    var documentElements; // Contains all document elements that are set up, created or read during the test
    var eventListeners; // Contains all event listeners that are involved.
    var nonExistingElements; // Array of element id Strings that should return "null" on getElementById. e.g. ["searchbar"]
    var globalParentElement; // Every test element will be created as child of this parent element if present.

    beforeEach(function () {
      initializeDocumentElements();
      var searchBarApiConfig = new searchUnderTest.SearchbarAPI()
        .searchService(searchService)
        .dataConverter(dataConverter)
        .addPredefinedParametersTo(predefinedParametersCallback)
        .addElementCreatedHandler(function (newElement) {
          spyOnElement(newElement);
          collectEventListeners(eventListeners, newElement);
          documentElements[newElement.id] = newElement;
        });
      config = searchBarApiConfig.config;
      setUpFixture(config);
      searchBarUiUnderTest = searchBarApiConfig.start();
      searchResultData = searchTestData.SearchResult.getJson();
      globalParentElement = document.getElementById(config.searchAreaElementId);
      replaceTimeoutWithin(searchBarUiUnderTest);
    });

    function initializeDocumentElements() {
      documentElements = {};
      eventListeners = {};
      nonExistingElements = [];
      globalParentElement = null;
      predefinedParametersCallback = jasmine.createSpy("predefinedParametersCallbackSpy");

      collectElementsById(documentElements, function (newElement) {
        // This function is called whenever a new test element is created when "document.getElementById" is called.
        if (nonExistingElements.includes(newElement.id)) {
          return null; // "document.getElementById" will return "null".
        }
        if (globalParentElement && !newElement.parentElement) {
          globalParentElement.appendChild(newElement);
        }
        spyOnElement(newElement);
        collectEventListeners(eventListeners, newElement);
        return newElement;
      });
    }

    function spyOnElement(newElement) {
      if (newElement.blur) {
        spyOn(newElement, "blur");
      }
      if (newElement.focus) {
        spyOn(newElement, "focus");
      }
      spyOn(newElement, "appendChild").and.callThrough();
      spyOn(newElement, "parentElement").and.callThrough();
      spyOn(newElement, "childNodes").and.callThrough();
    }

    function setUpFixture(config) {
      var searchAreaElement = document.getElementById(config.searchAreaElementId);
      var searchInputElement = document.getElementById(config.inputElementId);
      searchAreaElement.appendChild(searchInputElement);

      var searchResultsElement = document.getElementById(config.resultsView.viewElementId);
      searchAreaElement.appendChild(searchResultsElement);
      var searchMatchesElement = document.getElementById(config.resultsView.listParentElementId);
      searchMatchesElement.appendChild(searchResultsElement);
      var searchFiltersElement = document.getElementById(config.filtersView.listParentElementId);
      searchFiltersElement.appendChild(searchResultsElement);

      var searchDetailsElement = document.getElementById(config.detailView.viewElementId);
      searchAreaElement.appendChild(searchDetailsElement);
      var searchDetailEntriesElement = document.getElementById(config.detailView.listParentElementId);
      searchDetailEntriesElement.appendChild(searchResultsElement);

      var searchFilterOptionsElement = document.getElementById(config.filterOptionsView.viewElementId);
      searchAreaElement.appendChild(searchFilterOptionsElement);
      var searchFilterOptionsEntriesElement = document.getElementById(config.filterOptionsView.listParentElementId);
      searchFilterOptionsEntriesElement.appendChild(searchResultsElement);
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

    function getResultViewParentElement() {
      return documentElements[config.resultsView.listParentElementId];
    }

    describe("should recognize key events and", function () {
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
    });

    describe("should recognize focus changes and", function () {
      it("should show the results when search area is in focus", function () {
        var searchInputTextElement = getSearchInputTextElement();
        searchInputTextElement.value = "X";

        var searchAreaElementId = config.searchAreaElementId;
        var searchAreaElement = documentElements[searchAreaElementId];

        eventListeners[searchAreaElementId].focusin({ currentTarget: searchAreaElement });

        expect(getResultViewElement().className).toContain("show");
      });

      it("should hide the results when search looses focus", function () {
        var searchInputTextElement = getSearchInputTextElement();
        searchInputTextElement.value = "X";

        var searchAreaElementId = config.searchAreaElementId;
        var searchAreaElement = documentElements[searchAreaElementId];

        eventListeners[searchAreaElementId].focusout({ currentTarget: searchAreaElement });

        expect(getResultViewElement().className).not.toContain("show");
      });
    });

    describe("should trigger search and", function () {
      it("should update search when input text character is entered", function () {
        searchResultData = [];
        var searchInputTextElement = getSearchInputTextElement();
        searchInputTextElement.value = "X";

        var keyEvent = createKeyEvent("X", getSearchInputTextElement());
        eventListeners.searchbar.keyup.call(searchBarUiUnderTest, keyEvent);

        expect(document.getElementById).toHaveBeenCalledWith(config.resultsView.listParentElementId);
        expect(getResultViewElement().className).toContain("show");
      });

      it("shouldn't update search when input text is cleared", function () {
        searchResultData = [];
        var searchInputTextElement = getSearchInputTextElement();

        searchInputTextElement.value = "X";
        var keyEvent = createKeyEvent("X", getSearchInputTextElement());
        eventListeners.searchbar.keyup.call(searchBarUiUnderTest, keyEvent);

        searchInputTextElement.value = "";
        keyEvent = createKeyEvent("Backspace", getSearchInputTextElement());
        eventListeners.searchbar.keyup.call(searchBarUiUnderTest, keyEvent);

        expect(getResultViewElement().className).not.toContain("show");
      });

      it("should add search text as search parameters", function () {
        searchResultData = [];
        var searchInputTextElement = getSearchInputTextElement();
        searchInputTextElement.value = "X";

        var keyEvent = createKeyEvent("X", getSearchInputTextElement());
        eventListeners.searchbar.keyup.call(searchBarUiUnderTest, keyEvent);

        expect(searchService).toHaveBeenCalledWith({ searchtext: "X" }, jasmine.any(Function));
      });

      it("should add predefined parameters of callback as search parameters", function () {
        searchResultData = [];
        var searchInputTextElement = getSearchInputTextElement();
        searchInputTextElement.value = "X";
        predefinedParametersCallback.and.callFake(function (parameters) {
          parameters.constantNumber = 123;
        });

        var keyEvent = createKeyEvent("X", getSearchInputTextElement());
        eventListeners.searchbar.keyup.call(searchBarUiUnderTest, keyEvent);

        expect(searchService).toHaveBeenCalledWith({ searchtext: "X", constantNumber: 123 }, jasmine.any(Function));
      });

      it("should use filter view elements as search parameters", function () {
        searchResultData = [];
        var expectedParameter = { fieldName: "testFilterParameter", value: "testFilterValue" };
        var child = document.getElementById(config.filtersView.listParentElementId + "-testchild");
        var childFields = document.getElementById(child.id + "-fields");
        childFields.textContent = JSON.stringify(expectedParameter);

        documentElements[config.filtersView.listParentElementId].appendChild(child);

        var searchInputTextElement = getSearchInputTextElement();
        searchInputTextElement.value = "X";

        var keyEvent = createKeyEvent("X", getSearchInputTextElement());
        eventListeners.searchbar.keyup.call(searchBarUiUnderTest, keyEvent);

        expect(document.getElementById).toHaveBeenCalledWith(config.filtersView.listParentElementId);
        expect(searchService).toHaveBeenCalledWith({ searchtext: "X", testFilterParameter: "testFilterValue" }, jasmine.any(Function));
      });

      it("should wait the configured amount of time (waitBeforeSearch) before search is updated", function () {
        searchResultData = [];
        var searchInputTextElement = getSearchInputTextElement();
        searchInputTextElement.value = "X";

        var keyEvent = createKeyEvent("X", getSearchInputTextElement());
        eventListeners.searchbar.keyup.call(searchBarUiUnderTest, keyEvent);

        expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), config.waitBeforeSearch);
      });
    });

    it("should add elements for each search result", function () {
      var searchInputTextElement = getSearchInputTextElement();
      searchInputTextElement.value = "X";

      var keyEvent = createKeyEvent("X", getSearchInputTextElement());
      eventListeners.searchbar.keyup.call(searchBarUiUnderTest, keyEvent);

      expect(getResultViewParentElement().appendChild).toHaveBeenCalled();
    });
  });
});
