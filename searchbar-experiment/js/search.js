/**
 * @fileOverview "Searchbar" for the web client
 * @version ${project.version}
 */

/**
 * searchbar namespace declaration.
 * It contains all functions for the "search as you type" feature.
 * @default {}
 */
var searchbar = searchbar || {};

/**
 * @typedef {Object} SearchbarConfig
 * @property {string} searchAreaElementId - id of the whole search area (default="searcharea")
 * @property {string} inputElementId - id of the search input field (default="searchbar")
 * @property {string} resultsElementId - id of the element (div) that contains matches and filters (default="searchresults")
 * @property {string} matchesElementId - id of the element (ul) that contains the matches/suggestions (default="searchmatches")
 * @property {string} filtersElementId - id of the element (ul) that contains the selected filters (default="searchfilters")
 * @property {string} searchURI - uri of the search query
 * @property {string} resultTypeIdPrefix - id prefix for result/match entries (followed by "-" and their index) (default="result")
 * @property {string} filterTypeIdPrefix - id prefix for filter entries (followed by "-" and their index) (default="filter")
 * @property {string} resultElementTag - tag of the result/filter entries (default="li")
 * @property {string} inactiveFilterClass - css class name for an inactive filter entry (default="inactivefilter")
 * @property {string} waitBeforeClose - timeout in milliseconds when search is closed after blur (loss of focus) (default=700)
 * @property {string} waitBeforeSearch - time in milliseconds to wait until typing is finisdhed and search starts (default=500)
 */

/**
 * Searchbar UI API
 *
 * @namespace
 */
searchbar.SearchbarAPI = (function () {
  "use strict";

  var config = {
    searchAreaElementId: "searcharea",
    inputElementId: "searchbar",
    resultsElementId: "searchresults",
    matchesElementId: "searchmatches",
    filtersElementId: "searchfilters",
    searchURI: "../data/state_capitals.json",
    resultTypeIdPrefix: "result",
    filterTypeIdPrefix: "filter",
    resultElementTag: "li",
    inactiveFilterClass: "inactivefilter",
    waitBeforeClose: 700,
    waitBeforeSearch: 500
  };

  /**
   * Public interface
   * @scope searchbar.SearchbarAPI
   */
  return {
    searchAreaElementId: function (id) {
      config.searchAreaElementId = id;
      return this;
    },
    inputElementId: function (id) {
      config.inputElementId = id;
      return this;
    },
    resultsElementId: function (id) {
      config.resultsElementId = id;
      return this;
    },
    matchesElementId: function (id) {
      config.matchesElementId = id;
      return this;
    },
    filtersElementId: function (id) {
      config.filtersElementId = id;
      return this;
    },
    searchURI: function (uri) {
      config.searchURI = uri;
      return this;
    },
    resultTypeIdPrefix: function (prefix) {
      config.resultTypeIdPrefix = prefix;
      return this;
    },
    filterTypeIdPrefix: function (prefix) {
      config.filterTypeIdPrefix = prefix;
      return this;
    },
    resultElementTag: function (elementTag) {
      config.resultElementTag = elementTag;
      return this;
    },
    inactiveFilterClass: function (classname) {
      config.inactiveFilterClass = classname;
      return this;
    },
    waitBeforeClose: function (ms) {
      config.waitBeforeClose = ms;
      return this;
    },
    waitBeforeSearch: function (ms) {
      config.waitBeforeSearch = ms;
      return this;
    },
    start: function () {
      return new searchbar.SearchbarUI(config);
    }
  };
})();

/**
 * Searchbar UI.
 *
 * Contains the "behavior" of the search bar. It submits the search query,
 * parses the results, displays matches and filters and responds to
 * clicks and key presses.
 *
 * @namespace
 */
searchbar.SearchbarUI = (function () {
  "use strict";

  /**
   * This (constructor) function is called on "new searchbar.SearchbarUI(config)"
   * with the search configuration as parameter. It contains everything that needs
   * to be initialized and constructed for this specific searchbar instance.
   *
   * Functions outside of this object can be considered as static (for every instance).
   * They can also be considered to be "private", since they can not be accessed from outside.
   */
  var instance = function (config) {
    this.config = config;
    this.currentSearchText = "";
    this.focusOutTimer = null;
    this.waitBeforeSearchTimer = null;

    var search = document.getElementById(config.inputElementId);
    onEscapeKey(search, function (event) {
      getEventTarget(event).value = "";
      hideResults(config);
    });
    onArrowDownKey(search, handleEventWithConfig(config, focusFirstResult));
    addEvent("keyup", search, function (event) {
      if (this.waitBeforeSearchTimer !== null) {
        clearTimeout(this.waitBeforeSearchTimer);
      }
      var newSearchText = getEventTarget(event).value;
      this.waitBeforeSearchTimer = setTimeout(function () {
        if (newSearchText !== this.currentSearchText || this.currentSearchText === "") {
          updateSearch(newSearchText, config);
          this.currentSearchText = newSearchText;
        }
      }, config.waitBeforeSearch);
    });

    var searchareaElement = document.getElementById(config.searchAreaElementId);
    addEvent("focusin", searchareaElement, function (event) {
      var searchInputElement = document.getElementById(config.inputElementId);
      if (searchInputElement.value !== "") {
        if (this.focusOutTimer != null) {
          clearTimeout(this.focusOutTimer);
        }
        showResults(config);
      }
    });
    addEvent("focusout", searchareaElement, function (event) {
      this.focusOutTimer = setTimeout(function () {
        hideResults(config);
      }, config.waitBeforeClose);
    });
  };

  function updateSearch(searchText, config) {
    var matchlist = document.getElementById(config.matchesElementId);
    matchlist.innerHTML = "";
    if (searchText.length === 0) {
      hideResults(config);
      return;
    }
    showResults(config);
    getSearchResults(searchText, config);
  }

  function getSearchResults(searchText, config) {
    httpGetJson(config.searchURI, getHttpRequest(), function (jsonResult) {
      displayResults(filterResults(jsonResult, searchText), config);
    });
    //TODO delete these 3 lines when experiment finished
    httpGetJson("../data/KontenMultiSearchTemplateResponse.json", getHttpRequest(), function (jsonResult) {
      resultparser.Tools.introspectJson(jsonResult);
    });
  }

  function filterResults(jsonResults, searchText) {
    //TODO FIXME secure searchText input
    var regex = new RegExp("^" + searchText, "gi");
    return jsonResults.filter(function (entry) {
      return entry.name.match(regex) || entry.abbr.match(regex);
    });
  }

  function displayResults(jsonResults, config) {
    var i = 0;
    jsonResults.forEach(function (entry) {
      i++;
      addResult(entry, i, config);
    });
  }

  function addResult(entry, i, config) {
    var matchlist = document.getElementById(config.matchesElementId);
    var resultElement = addListElement(entry.name + " (" + entry.abbr + ")", i, config.resultTypeIdPrefix);
    matchlist.appendChild(resultElement);

    onResultEntrySelected(resultElement, handleEventWithConfig(config, selectSearchResultAsFilter));
    addResultEntryEventHandlers(resultElement, config);
  }

  /**
   * @param {Element} element to add event handlers
   * @param {SearchbarConfig} config search configuration
   */
  function addResultEntryEventHandlers(element, config) {
    onArrowDownKey(element, handleEventWithConfig(config, focusNextSearchResult));
    onArrowUpKey(element, handleEventWithConfig(config, focusPreviousSearchResult));
    onEscapeKey(element, handleEventWithConfig(config, focusSearchInput));
  }

  function onResultEntrySelected(resultElement, handler) {
    addEvent("mousedown", resultElement, handler);
    onEnterKey(resultElement, handler);
    onSpaceKey(resultElement, handler);
  }

  /**
   * @param {SearchbarConfig} config - search configuration
   * @param {EventListener} eventHandler - event handler
   */
  function handleEventWithConfig(config, eventHandler) {
    return function (event) {
      eventHandler(event, config);
    };
  }

  function focusSearchInput(event, config) {
    var resultEntry = getEventTarget(event);
    var inputElement = document.getElementById(config.inputElementId);
    resultEntry.blur();
    inputElement.focus();
    moveCursorToEndOf(inputElement);
    preventDefaultEventHandling(inputElement); //skips cursor position change on key up once
  }

  function preventDefaultEventHandling(inputevent) {
    inputevent.preventDefault ? inputevent.preventDefault() : (event.returnValue = false);
  }

  function focusFirstResult(event, config) {
    var selectedElement = getEventTarget(event);
    var firstResult = document.getElementById(config.resultTypeIdPrefix + "-1");
    selectedElement.blur();
    firstResult.focus();
  }

  function focusNextSearchResult(event, config) {
    var resultEntry = getEventTarget(event);
    var resultEntryIdProperties = extractResultElementIdProperties(resultEntry.id);
    var next = document.getElementById(resultEntryIdProperties.nextId);
    if (next === null && resultEntryIdProperties.type === config.resultTypeIdPrefix) {
      //select first filter entry after last result/match entry
      next = document.getElementById(config.filterTypeIdPrefix + "-1");
    }
    if (next === null) {
      //select first result/match entry after last filter entry (or whenever nothing is found)
      next = document.getElementById(config.resultTypeIdPrefix + "-1");
    }
    resultEntry.blur();
    next.focus();
  }

  function focusPreviousSearchResult(event, config) {
    var resultEntry = getEventTarget(event);
    var resultEntryIdProperties = extractResultElementIdProperties(resultEntry.id);
    var previous = document.getElementById(resultEntryIdProperties.previousId);
    if (previous === null && resultEntryIdProperties.type === config.filterTypeIdPrefix) {
      //select last result entry when arrow up is pressed on first filter entry
      var resultElementsCount = getListElementCountOfType(config.resultTypeIdPrefix);
      previous = document.getElementById(config.resultTypeIdPrefix + "-" + resultElementsCount);
    }
    if (previous === null) {
      //select input, if there is no previous entry.
      focusSearchInput(event, config);
      return;
    }
    resultEntry.blur();
    previous.focus();
  }

  function selectSearchResultAsFilter(event, config) {
    var filterElements = getListElementCountOfType(config.filterTypeIdPrefix);
    var filterElement = addListElement(event.currentTarget.innerText, filterElements + 1, config.filterTypeIdPrefix);
    addResultEntryEventHandlers(filterElement, config);
    onResultEntrySelected(filterElement, handleEventWithConfig(config, toggleFilterEntry));

    var searchfilters = document.getElementById(config.filtersElementId);
    searchfilters.appendChild(filterElement);
  }

  /**
   * Toggles a filter to inactive and vice versa.
   */
  function toggleFilterEntry(event, config) {
    var filterElement = getEventTarget(event);
    if (hasClass(config.inactiveFilterClass, filterElement)) {
      removeClass(config.inactiveFilterClass, filterElement);
    } else {
      addClass(config.inactiveFilterClass, filterElement);
    }
  }

  /**
   * @return {number} list element count of the given type
   */
  function getListElementCountOfType(listelementtype) {
    var firstListEntry = document.getElementById(listelementtype + "-1");
    if (firstListEntry === null) {
      return 0;
    }
    return firstListEntry.parentElement.childNodes.length;
  }

  /**
   * @typedef {Object} ListElementIdProperties
   * @property {id} id - Original ID
   * @property {string} type - Type of the list element
   * @property {number} index - Index of the list element
   * @property {string} previousId - ID of the previous list element
   * @property {string} nextId - ID of the next list element
   * @property {boolean} isFirstElement - true, if it is the first element in the list
   */
  /**
   * Extracts properties like type and index
   * from the given list element id string.
   *
   * @param {string} id
   * @return {ListElementIdProperties} list element id properties
   */
  function extractResultElementIdProperties(id) {
    var extractedType = id.split("-")[0];
    var extractedIndex = parseInt(id.split("-")[1]);
    return {
      id: id,
      type: extractedType,
      index: extractedIndex,
      previousId: extractedType + "-" + (extractedIndex - 1),
      nextId: extractedType + "-" + (extractedIndex + 1),
      isFirstElement: extractedIndex <= 1
    };
  }

  /**
   * Creates a new list element to be used for search results.
   *
   * @param {string} text inside the list element
   * @param {number} index index of the list element used for its id
   * @param {string} type type of the list element used as prefix for its id, as classname
   */
  function addListElement(text, index, type) {
    var element = document.createElement("li");
    element.setAttribute("id", type + "-" + index);
    element.setAttribute("tabindex", "0");
    element.appendChild(document.createTextNode(text));
    addClass(type, element);
    return element;
  }

  function showResults(config) {
    addClass("show", document.getElementById(config.resultsElementId));
  }

  function hideResults(config) {
    removeClass("show", document.getElementById(config.resultsElementId));
  }

  function addClass(classToAdd, element) {
    removeClass(classToAdd, element);
    var separator = element.className.length > 0 ? " " : "";
    element.className += separator + classToAdd;
  }

  function removeClass(classToRemove, element) {
    var regex = new RegExp("\\s?\\b" + classToRemove + "\\b", "gi");
    element.className = element.className.replace(regex, "");
  }

  function hasClass(classToLookFor, element) {
    return element.className.indexOf(classToLookFor) >= 0;
  }

  function onEscapeKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "Escape" || event.key == "Esc" || keyCodeOf(event) == 27) {
        eventHandler(event);
      }
    });
  }

  function onEnterKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "Enter" || keyCodeOf(event) == 13) {
        eventHandler(event);
      }
    });
  }

  function onSpaceKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == " " || event.key == "Spacebar" || keyCodeOf(event) == 32) {
        eventHandler(event);
      }
    });
  }

  function onArrowUpKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "ArrowUp" || keyCodeOf(event) == 38) {
        eventHandler(event);
      }
    });
  }

  function onArrowDownKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "ArrowDown" || keyCodeOf(event) == 40) {
        eventHandler(event);
      }
    });
  }

  function addEvent(eventName, element, eventHandler) {
    if (element.addEventListener) element.addEventListener(eventName, eventHandler, false);
    else if (element.attachEvent) {
      element.attachEvent("on" + eventName, eventHandler);
    } else {
      element["on" + eventName] = eventHandler;
    }
  }

  /**
   * @returns {Element} target of the event
   */
  function getEventTarget(event) {
    if (typeof event.currentTarget !== "undefined") {
      return event.currentTarget;
    } else if (typeof event.srcElement !== "undefined") {
      return event.srcElement;
    } else {
      throw new Error("Event doesn't contain bounded element: " + event);
    }
  }

  /**
   * Returns the key code of the event or -1 if it is no available.
   * @param {KeyboardEvent} event
   * @return key code or -1 if not available
   */
  function keyCodeOf(event) {
    return typeof event.keyCode === "undefined" ? -1 : event.keyCode;
  }

  function moveCursorToEndOf(element) {
    if (typeof element.setSelectionRange === "function") {
      element.setSelectionRange(element.value.length, element.value.length);
    } else if (typeof element.selectionStart === "number" && typeof element.selectionEnd === "number") {
      element.selectionStart = element.selectionEnd = element.value.length;
    } else if (typeof e.createTextRange === "function") {
      var range = element.createTextRange();
      range.collapse(true);
      range.moveEnd("character", element.value.length);
      range.moveStart("character", element.value.length);
      range.select();
    }
  }

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
})();

// Configure and start the search bar functionality.
searchbar.SearchbarAPI.start();
