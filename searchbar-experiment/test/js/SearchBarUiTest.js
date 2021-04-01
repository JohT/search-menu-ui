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
   * Creates a key event for event handler tests.
   * @param {String} keyName
   * @param {Element} targetElement
   */
  function createKeyEvent(keyName, targetElement) {
    return {
      key: keyName,
      currentTarget: targetElement
    };
  }

  /**
   * Creates a key code event for event handler tests.
   * @param {number} keyCode
   * @param {Element} targetElement
   */
  function createKeyCodeEvent(keyCode, targetElement) {
    return {
      keyCode: keyCode,
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
    var nonExistingElements; // Array of element id Strings that should return "null" on the first getElementById. e.g. ["searchbar"]
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

      nonExistingElements.push(config.resultsView.listEntryElementIdPrefix + "-0");
      nonExistingElements.push(config.resultsView.listEntryElementIdPrefix + "-1");
      nonExistingElements.push(config.filterOptionsView.listEntryElementIdPrefix + "-0");
      nonExistingElements.push(config.filterOptionsView.listEntryElementIdPrefix + "-1");

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
      searchResultsElement.appendChild(searchMatchesElement);
      var searchFiltersElement = document.getElementById(config.filtersView.listParentElementId);
      searchResultsElement.appendChild(searchFiltersElement);

      var searchDetailsElement = document.getElementById(config.detailView.viewElementId);
      searchAreaElement.appendChild(searchDetailsElement);
      var searchDetailEntriesElement = document.getElementById(config.detailView.listParentElementId);
      searchDetailsElement.appendChild(searchDetailEntriesElement);

      var searchFilterOptionsElement = document.getElementById(config.filterOptionsView.viewElementId);
      searchAreaElement.appendChild(searchFilterOptionsElement);
      var searchFilterOptionsEntriesElement = document.getElementById(config.filterOptionsView.listParentElementId);
      searchFilterOptionsElement.appendChild(searchFilterOptionsEntriesElement);
    }

    function getSearchInputTextElement() {
      return documentElements[config.inputElementId];
    }

    function getResultViewElement() {
      return documentElements[config.resultsView.viewElementId];
    }

    function getDetailsViewElement() {
      return documentElements[config.detailView.viewElementId];
    }

    function getFilterOptionsViewElement() {
      return documentElements[config.filterOptionsView.viewElementId];
    }

    function getFirstResultListElement() {
      return documentElements[config.resultsView.listEntryElementIdPrefix + "-1"];
    }

    function getSecondResultListElement() {
      return documentElements[config.resultsView.listEntryElementIdPrefix + "-2"];
    }

    function getFilterResultListElement() {
      return getSecondResultListElement();
    }

    function getLastElementOfIdPrefix(idPrefix) {
      var index = 0;
      var resultElement = null;
      do {
        index = index + 1;
        resultElement = documentElements[idPrefix + "-" + index];
      } while (typeof resultElement === "object");

      // Register non existing result so it won't be created on "document.getElementById".
      nonExistingElements.push(idPrefix + "-" + index);

      return documentElements[idPrefix + "-" + (index - 1)];
    }

    function getLastResultListElement() {
      return getLastElementOfIdPrefix(config.resultsView.listEntryElementIdPrefix);
    }

    function getLastFilterOptionsElement() {
      return getLastElementOfIdPrefix(config.filterOptionsView.listEntryElementIdPrefix);
    }

    function getFirstFilterOptionElementOfResultId(resultId) {
      return documentElements[resultId + "-" + config.filterOptionsView.listEntryElementIdPrefix + "-1"];
    }

    function getFirstFilterElement() {
      return documentElements[config.filtersView.listEntryElementIdPrefix + "-1"];
    }

    function getResultViewParentElement() {
      return documentElements[config.resultsView.listParentElementId];
    }

    function inputSearchCharacter(searchCharacter) {
      var searchInputTextElement = getSearchInputTextElement();
      searchInputTextElement.value = searchCharacter;
      var keyEvent = createKeyEvent(searchCharacter, searchInputTextElement);
      eventListeners.searchbar.keyup.call(searchBarUiUnderTest, keyEvent);
    }

    function eraseInputSearchText() {
      var searchInputTextElement = getSearchInputTextElement();
      searchInputTextElement.value = "";
      var keyEvent = createKeyEvent("Backspace", searchInputTextElement);
      eventListeners.searchbar.keyup.call(searchBarUiUnderTest, keyEvent);
    }

    function keyDownOnElementId(elementId, keyName) {
      var keyEvent = createKeyEvent(keyName, documentElements[elementId]);
      eventListeners[elementId].keydown.call(searchBarUiUnderTest, keyEvent);
    }

    function keyCodeDownOnElementId(elementId, keyCode) {
      var keyEvent = createKeyCodeEvent(keyCode, documentElements[elementId]);
      eventListeners[elementId].keydown.call(searchBarUiUnderTest, keyEvent);
    }

    function arrowKeyDownOnElementId(elementId) {
      keyDownOnElementId(elementId, "ArrowDown");
    }

    function arrowKeyUpOnElementId(elementId) {
      keyDownOnElementId(elementId, "ArrowUp");
    }

    function arrowKeyRightOnElementId(elementId) {
      keyDownOnElementId(elementId, "ArrowRight");
    }

    function arrowKeyLeftOnElementId(elementId) {
      keyDownOnElementId(elementId, "ArrowLeft");
    }

    describe("should recognize key events on input text element and", function () {
      it("should reset search input text when escape key is pressed there", function () {
        keyDownOnElementId(getSearchInputTextElement().id, "Escape");
        expect(documentElements.searchbar.value).toEqual("");
      });

      it("should reset search input text when escape key event is signaled as 'Esc'", function () {
        keyDownOnElementId(getSearchInputTextElement().id, "Esc");
        expect(documentElements.searchbar.value).toEqual("");
      });

      it("should reset search input text when escape key event is signaled as keyCode 27", function () {
        keyCodeDownOnElementId(getSearchInputTextElement().id, 27);
        expect(documentElements.searchbar.value).toEqual("");
      });

      it("should hide search area when escape key is pressed on input text", function () {
        keyDownOnElementId(getSearchInputTextElement().id, "Escape");
        expect(getResultViewElement().className).not.toContain("show");
      });

      it("shouldn't change focus when arrow key down is pressed without results", function () {
        arrowKeyDownOnElementId(getSearchInputTextElement().id);
        expect(getSearchInputTextElement().blur).not.toHaveBeenCalled();
      });
    });

    describe("should recognize key events on search results main menu elements and", function () {
      it("should focus first search result when arrow key down is pressed after search", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);
        expect(getSearchInputTextElement().blur).toHaveBeenCalled();
        expect(getFirstResultListElement().focus).toHaveBeenCalled();
      });

      it("should focus first search result also when arrow key down event is signaled as 'Down'", function () {
        inputSearchCharacter("X");
        keyDownOnElementId(getSearchInputTextElement().id, "Down");
        expect(getFirstResultListElement().focus).toHaveBeenCalled();
      });

      it("should focus first search result also when arrow key down event is signaled as keyCode 40 ", function () {
        inputSearchCharacter("X");
        keyCodeDownOnElementId(getSearchInputTextElement().id, 40);
        expect(getFirstResultListElement().focus).toHaveBeenCalled();
      });

      it("should focus next search result when arrow key down is pressed on first result", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);

        var firstResultElement = getFirstResultListElement();
        arrowKeyDownOnElementId(firstResultElement.id);

        expect(firstResultElement.blur).toHaveBeenCalled();
        expect(getSecondResultListElement().focus).toHaveBeenCalled();
      });

      it("should focus first filter option when arrow key down is pressed on last search result", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);

        var lastResultElement = getLastResultListElement();

        arrowKeyDownOnElementId(lastResultElement.id);

        expect(lastResultElement.blur).toHaveBeenCalled();
        expect(getFirstFilterElement().focus).toHaveBeenCalled();
      });

      it("should focus first search result when arrow key down is pressed on last filter option", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);

        var lastFilterElement = getLastFilterOptionsElement();

        arrowKeyDownOnElementId(lastFilterElement.id);

        expect(lastFilterElement.blur).toHaveBeenCalled();
        expect(getFirstResultListElement().focus).toHaveBeenCalled();
      });

      it("should focus first search result when arrow key down is pressed after search", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);
        expect(getSearchInputTextElement().blur).toHaveBeenCalled();
        expect(getFirstResultListElement().focus).toHaveBeenCalled();
      });

      it("should focus search text when arrow key up is pressed on first search result", function () {
        inputSearchCharacter("X");

        var searchTextElement = getSearchInputTextElement();
        arrowKeyDownOnElementId(searchTextElement.id);

        var firstResultElement = getFirstResultListElement();
        arrowKeyUpOnElementId(firstResultElement.id);

        expect(firstResultElement.blur).toHaveBeenCalled();
        expect(searchTextElement.focus).toHaveBeenCalled();
      });

      it("should focus last search result when arrow key up is pressed on first filter option", function () {
        nonExistingElements.push(config.filterOptionsView.listEntryElementIdPrefix + "-1");
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);

        var lastResultElement = getLastResultListElement();
        arrowKeyDownOnElementId(lastResultElement.id);

        //TODO first filter option doesn't seem to exist
        var firstFilterElement = getFirstFilterElement();
        arrowKeyUpOnElementId(firstFilterElement.id);

        expect(firstFilterElement.blur).toHaveBeenCalled();
        expect(lastResultElement.focus).toHaveBeenCalled();
      });

      it("should focus previous search result when arrow key up is pressed on second result", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);

        var firstResultElement = getFirstResultListElement();
        arrowKeyDownOnElementId(firstResultElement.id);

        var secondResultElement = getSecondResultListElement();
        arrowKeyUpOnElementId(secondResultElement.id);

        expect(secondResultElement.blur).toHaveBeenCalled();
        expect(firstResultElement.focus).toHaveBeenCalled();
      });

      it("should focus previous search result when arrow key up event is signaled as 'Up'", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);

        var firstResultElement = getFirstResultListElement();
        arrowKeyDownOnElementId(firstResultElement.id);

        var secondResultElement = getSecondResultListElement();
        keyDownOnElementId(secondResultElement.id, "Up");

        expect(firstResultElement.focus).toHaveBeenCalled();
      });

      it("should open details sub menu when right arrow key is pressed on a result", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);
        arrowKeyRightOnElementId(getFirstResultListElement().id);
        expect(getDetailsViewElement().className).toContain("show");
      });

      it("should open filter options sub menu when right arrow key is pressed on a filter options result", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);

        // Enter result that contains a filter options sub menu
        var filterElementResultElement = getFilterResultListElement();
        arrowKeyRightOnElementId(filterElementResultElement.id);
        
        var firstFilterOptionsSubMenuElement = getFirstFilterOptionElementOfResultId(filterElementResultElement.id);
        expect(getFilterOptionsViewElement().className).toContain("show");
        expect(filterElementResultElement.blur).toHaveBeenCalled();
        expect(firstFilterOptionsSubMenuElement.focus).toHaveBeenCalled();
      });

      it("should open details sub menu when right arrow key is signaled as 'Right'", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);
        keyDownOnElementId(getFirstResultListElement().id, "Right");
        expect(getDetailsViewElement().className).toContain("show");
      });

      it("should open details sub menu when right arrow key is signaled as keyCode 39", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);
        keyCodeDownOnElementId(getFirstResultListElement().id, 39);
        expect(getDetailsViewElement().className).toContain("show");
      });

      it("should open details sub menu when space bar is pressed on a result", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);
        keyDownOnElementId(getFirstResultListElement().id, "Spacebar");
        expect(getDetailsViewElement().className).toContain("show");
      });

      it("should open details sub menu when space bar is signaled as ' '", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);
        keyDownOnElementId(getFirstResultListElement().id, " ");
        expect(getDetailsViewElement().className).toContain("show");
      });

      it("should open details sub menu when space bar is signaled as keyCode 32", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);
        keyCodeDownOnElementId(getFirstResultListElement().id, 32);
        expect(getDetailsViewElement().className).toContain("show");
      });

      it("should close details sub menu when escape key is pressed on opened details", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);
        arrowKeyRightOnElementId(getFirstResultListElement().id);
        var detailsViewElement = getDetailsViewElement();
        keyDownOnElementId(getFirstResultListElement().id, "Escape");
        expect(detailsViewElement.className).not.toContain("show");
      });

      it("should focus previous search result when arrow key up event is signaled as keyCode 38", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);

        var firstResultElement = getFirstResultListElement();
        arrowKeyDownOnElementId(firstResultElement.id);
        keyCodeDownOnElementId(getSecondResultListElement().id, 38);

        expect(firstResultElement.focus).toHaveBeenCalled();
      });
    });

    describe("should recognize key events on search results sub menu elements and", function () {
      it("should close filter options sub menu and return to main menu when left arrow key is pressed inside the sub menu", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);

        // Enter result that contains a filter options sub menu
        var filterElementResultElement = getFilterResultListElement();
        arrowKeyRightOnElementId(filterElementResultElement.id);
        
        var firstFilterOptionsSubMenuElement = getFirstFilterOptionElementOfResultId(filterElementResultElement.id);
        arrowKeyLeftOnElementId(firstFilterOptionsSubMenuElement.id);
        
        //TODO should hide filter options by removing "show", work but doesn't work here
        //expect(getFilterOptionsViewElement().className).not.toContain("show");
        expect(filterElementResultElement.focus).toHaveBeenCalled();
        expect(firstFilterOptionsSubMenuElement.blur).toHaveBeenCalled();
      });

      it("should close filter options sub menu and return to main menu when escape arrow key is pressed inside the sub menu", function () {
        inputSearchCharacter("X");
        arrowKeyDownOnElementId(config.inputElementId);

        // Enter result that contains a filter options sub menu
        var filterElementResultElement = getFilterResultListElement();
        arrowKeyRightOnElementId(filterElementResultElement.id);
        
        var firstFilterOptionsSubMenuElement = getFirstFilterOptionElementOfResultId(filterElementResultElement.id);
        keyDownOnElementId(firstFilterOptionsSubMenuElement.id, "Escape");
        
        //TODO should hide filter options by removing "show", work but doesn't work here
        //expect(getFilterOptionsViewElement().className).not.toContain("show");
        expect(filterElementResultElement.focus).toHaveBeenCalled();
        expect(firstFilterOptionsSubMenuElement.blur).toHaveBeenCalled();
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
        inputSearchCharacter("X");
        expect(document.getElementById).toHaveBeenCalledWith(config.resultsView.listParentElementId);
        expect(getResultViewElement().className).toContain("show");
      });

      it("shouldn't update search when input text is cleared", function () {
        searchResultData = [];
        inputSearchCharacter("X");
        eraseInputSearchText();
        expect(getResultViewElement().className).not.toContain("show");
      });

      it("should add search text as search parameters", function () {
        searchResultData = [];
        inputSearchCharacter("X");
        expect(searchService).toHaveBeenCalledWith({ searchtext: "X" }, jasmine.any(Function));
      });

      it("should add predefined parameters of callback as search parameters", function () {
        searchResultData = [];
        predefinedParametersCallback.and.callFake(function (parameters) {
          parameters.constantNumber = 123;
        });
        inputSearchCharacter("X");
        expect(searchService).toHaveBeenCalledWith({ searchtext: "X", constantNumber: 123 }, jasmine.any(Function));
      });

      it("should use filter view elements as search parameters", function () {
        searchResultData = [];
        var expectedParameter = { fieldName: "testFilterParameter", value: "testFilterValue" };
        var child = document.getElementById(config.filtersView.listParentElementId + "-testchild");
        var childFields = document.getElementById(child.id + "-fields");
        childFields.textContent = JSON.stringify(expectedParameter);

        documentElements[config.filtersView.listParentElementId].appendChild(child);

        inputSearchCharacter("X");

        expect(document.getElementById).toHaveBeenCalledWith(config.filtersView.listParentElementId);
        expect(searchService).toHaveBeenCalledWith({ searchtext: "X", testFilterParameter: "testFilterValue" }, jasmine.any(Function));
      });

      it("should wait the configured amount of time (waitBeforeSearch) before search is updated", function () {
        searchResultData = [];
        inputSearchCharacter("X");

        expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), config.waitBeforeSearch);
      });
    });

    it("should add elements for each search result", function () {
      inputSearchCharacter("X");
      expect(getResultViewParentElement().appendChild).toHaveBeenCalled();
    });
    
  });
});
