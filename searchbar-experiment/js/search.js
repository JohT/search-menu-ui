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
 * @typedef {Object} SearchViewDescription Describes a part of the search view (e.g. search result details).
 * @property {string} viewElementId - id of the element (e.g. "div"), that contains the view with all list elements and their parent.
 * @property {string} listParentElementId - id of the element (e.g. "ul"), that contains all list entries and is located inside the view.
 * @property {string} listEntryElementIdPrefix - id prefix (followed by "-" and the index number) for every list entry
 * @property {string} [listEntryElementTag=li] - element tag for list entries. defaults to "li".
 * @property {string} [listEntryTextTemplate={{displayName}}: {{value}}] - template for the text of each list entry
 * @property {string} [listEntrySummaryTemplate={{displayName}}: {{value}}] - template for the text of each list entry, if the data group "summary" exists. 
 * @property {boolean} [isSelectableFilterOption=false] - Specifies, if the list entry can be selected as filter option
 */

/**
 * SearchViewDescription
 * Describes a part of the search view (e.g. search result details).
 *
 * @namespace
 */
searchbar.SearchViewDescriptionBuilder = (function () {
  "use strict";

  /**
   * Constructor function and container for everything, that needs to exist per instance.
   * @param {SearchViewDescription} template optional parameter that contains a template to clone
   */
  function SearchViewDescription(template) {
    var defaultTemplate = "{{displayName}}: {{value}}";
    var defaultSummaryTemplate = "{{summaries[0].displayName}}: {{summaries[0].value}}";
    var defaultTag = "li";
    this.description = {
      viewElementId: template ? template.viewElementId : "",
      listParentElementId: template ? template.listParentElementId : "",
      listEntryElementIdPrefix: template ? template.listEntryElementIdPrefix : "",
      listEntryElementTag: template ? template.listEntryElementTag : defaultTag,
      listEntryTextTemplate: template ? template.listEntryTextTemplate : defaultTemplate,
      listEntrySummaryTemplate: template ? template.listEntrySummaryTemplate : defaultSummaryTemplate,
      isSelectableFilterOption: template ? template.isSelectableFilterOption : false
    };
    /**
     * ID of the element (e.g. "div"), that contains the view with all list elements and their parent.
     *
     * @param {string} value - view element ID.
     */
    this.viewElementId = function (value) {
      this.description.viewElementId = withDefault(value, "");
      return this;
    };
    /**
     * ID of the element (e.g. "ul"), that contains all list entries and is located inside the view.
     * @param {string} value - parent element ID
     */
    this.listParentElementId = function (value) {
      this.description.listParentElementId = withDefault(value, "");
      return this;
    };
    /**
     * ID prefix (followed by "-" and the index number) for every list entry.
     * @param {string} value - ID prefix for every list entry element
     */
    this.listEntryElementIdPrefix = function (value) {
      this.description.listEntryElementIdPrefix = withDefault(value, "");
      return this;
    };
    /**
     * Element tag for list entries. defaults to "li".
     * Defaults to "li".
     * @param {string} value - tag for every list entry element
     */
    this.listEntryElementTag = function (value) {
      this.description.listEntryElementTag = withDefault(value, defaultTag);
      return this;
    };
    /**
     * Template for the text of each list entry.
     * Defaults to "{{displayName}}: {{value}}".
     * May contain variables in double curly brackets.
     *
     * @param {string} value - list entry text template when there is no summary data group
     */
    this.listEntryTextTemplate = function (value) {
      this.description.listEntryTextTemplate = withDefault(value, defaultTemplate);
      return this;
    };
    /**
     * Template for the text of each list entry, if the data group "summary" exists.
     * Defaults to "{{displayName}}: {{value}}".
     * May contain variables in double curly brackets.
     *
     * @param {string} value - list entry text template when there is a summary data group
     */
    this.listEntrySummaryTemplate = function (value) {
      this.description.listEntrySummaryTemplate = withDefault(value, defaultSummaryTemplate);
      return this;
    };
    /**
     * Specifies, if the list entry can be selected as filter option.
     * Defaults to "false".
     * @param {boolean} value if a list entry is selectable as filter option
     */
    this.isSelectableFilterOption = function (value) {
      this.description.isSelectableFilterOption = value === true;
      return this;
    };
    /**
     * Finishes the build of the description and returns its final (meant to be immutable) object.
     * @returns {SearchViewDescription} 
     */
    this.build = function () {
      return this.description;
    };
  }

  function withDefault(value, defaultValue) {
    return isSpecifiedString(value) ? value : defaultValue;
  }

  function isSpecifiedString(value) {
    return typeof value === "string" && value != null && value != "";
  }

  /**
   * Public interface
   * @scope searchbar.SearchViewDescription
   */
  return SearchViewDescription;
})();

/**
 * @typedef {Object} SearchbarConfig
 * @property {string} searchAreaElementId - id of the whole search area (default="searcharea")
 * @property {string} inputElementId - id of the search input field (default="searchbar")
 * @property {SearchViewDescription} resultsView - describes the main view containing the search results
 * @property {SearchViewDescription} detailView - describes the details view
 * @property {SearchViewDescription} filterOptionsView - describes the filter options view
 * @property {SearchViewDescription} filtersView - describes the filters view
 * @property {string} searchURI - uri of the search query
 * @property {string} waitBeforeClose - timeout in milliseconds when search is closed after blur (loss of focus) (default=700)
 * @property {string} waitBeforeSearch - time in milliseconds to wait until typing is finished and search starts (default=500)
 */

/**
 * Searchbar UI API
 *
 * @namespace
 */
searchbar.SearchbarAPI = (function () {
  "use strict";

  var config = {
    searchURI: "",
    searchAreaElementId: "searcharea",
    inputElementId: "searchbar",
    resultsView: null,
    detailView: null,
    filterOptionsView: null,
    filtersView: null,
    waitBeforeClose: 700,
    waitBeforeSearch: 500
  };

  /**
   * Public interface
   * @scope searchbar.SearchbarAPI
   */
  return {
    searchURI: function (uri) {
      config.searchURI = uri;
      return this;
    },
    searchAreaElementId: function (id) {
      config.searchAreaElementId = id;
      return this;
    },
    inputElementId: function (id) {
      config.inputElementId = id;
      return this;
    },
    resultsView: function (view) {
      config.resultsView = view;
      return this;
    },
    detailView: function (view) {
      config.detailView = view;
      return this;
    },
    filterOptionsView: function (view) {
      config.filterOptionsView = view;
      return this;
    },
    filtersView: function (view) {
      config.filtersView = view;
      return this;
    },
    defaultDetailView: function () {
      return new searchbar.SearchViewDescriptionBuilder()
        .viewElementId("seachdetails")
        .listParentElementId("seachdetailentries")
        .listEntryElementIdPrefix("detail")
        .listEntryTextTemplate("{{displayName}}: {{value}}")
        .build();
    },
    defaultResultsView: function () {
      return new searchbar.SearchViewDescriptionBuilder()
        .viewElementId("searchresults")
        .listParentElementId("searchmatches")
        .listEntryElementIdPrefix("result")
        .listEntryTextTemplate("{{abbreviation}} {{displayName}} ({{value}})")
        .listEntrySummaryTemplate("{{summaries[0].abbreviation}} {{summaries[1].value}}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{summaries[0].value}}")
        .build();
    },
    defaultFilterOptionsView: function () {
      return new searchbar.SearchViewDescriptionBuilder()
        .viewElementId("seachfilteroptions")
        .listParentElementId("seachfilteroptionentries")
        .listEntryElementIdPrefix("filter")
        .listEntryTextTemplate("{{value}}")
        .isSelectableFilterOption(true)
        .build();
    },
    defaultFiltersView: function () {
      return new searchbar.SearchViewDescriptionBuilder()
        .viewElementId("searchresults")
        .listParentElementId("searchfilters")
        .listEntryElementIdPrefix("filter")
        .isSelectableFilterOption(true)
        .build();
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
      if (config.resultsView == null) {
        this.resultsView(this.defaultResultsView());
      }
      if (config.defaultDetailView == null) {
        this.detailView(this.defaultDetailView());
      }
      if (config.filterOptionsView == null) {
        this.filterOptionsView(this.defaultFilterOptionsView());
      }
      if (config.filtersView == null) {
        this.filtersView(this.defaultFiltersView());
      }
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
      hideMenu(config);
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
        show(config.resultsView.viewElementId);
      }
    });
    addEvent("focusout", searchareaElement, function (event) {
      this.focusOutTimer = setTimeout(function () {
        hideMenu(config);
      }, config.waitBeforeClose);
    });
  };

  function updateSearch(searchText, config) {
    var matchlist = document.getElementById(config.resultsView.listParentElementId);
    matchlist.innerHTML = "";
    if (searchText.length === 0) {
      hideMenu(config);
      return;
    }
    show(config.resultsView.viewElementId);
    getSearchResults(searchText, config);
  }

  function getSearchResults(searchText, config) {
    //TODO remove states example
    // httpGetJson(config.searchURI, getHttpRequest(), function (jsonResult) {
    //   displayResults(filterResults(mapStatesDemoStructure(jsonResult), searchText), config);
    // });
    //TODO delete these 3 lines when experiment finished
    httpGetJson("../data/KontenMultiSearchTemplateResponse.json", getHttpRequest(), function (jsonResult) {
      displayResults(restruct.Data.restructJson(jsonResult), config);
    });
  }

  //TODO could be deleted when the demo/mock data of the states is not used any more or changed in structure
  // function mapStatesDemoStructure(entries) {
  //   var index;
  //   var element;
  //   var mappedData = [];
  //   for (index = 0; index < entries.length; index += 1) {
  //     element = entries[index];
  //     mappedData.push({ category: "State", type: "summary", displayName: element.name, fieldName: element.name, value: element.abbr });
  //   }
  //   return mappedData;
  // }

  //TODO to be deleted when backend filters. Beware: search text is unsafely used in this regex
  // function filterResults(jsonResults, searchText) {
  //   var regex = new RegExp("^" + searchText, "gi");
  //   return jsonResults.filter(function (entry) {
  //     return entry.displayName.match(regex) || entry.value.match(regex);
  //   });
  // }

  function displayResults(jsonResults, config) {
    var index = 0;
    for (index = 0; index < jsonResults.length; index++) {
      addResult(jsonResults[index], index + 1, config);
    }
  }

  function addResult(entry, i, config) {
    var listElementId = config.resultsView.listEntryElementIdPrefix + "-" + i;
    var resultElement = createListEntryElement(entry, config.resultsView, listElementId);

    if (isMenuEntryWithFurtherDetails(entry)) {
      addMenuEntrySelectionHandlers(
        resultElement,
        handleEventWithEntriesAndConfig(entry.details, config, selectSearchResultToDisplayDetails)
      );
    }
    if (isMenuEntryWithOptions(entry)) {
      addMenuEntrySelectionHandlers(
        resultElement,
        handleEventWithEntriesAndConfig(entry.options, config, selectSearchResultToDisplayFilterOptions)
      );
      onArrowRightKey(resultElement, handleEventWithEntriesAndConfig(entry.options, config, selectSearchResultToDisplayFilterOptions));
      if (isMenuEntryWithDefault(entry)) {
        createFilterOption(entry.default[0], entry.options, config.filtersView, config);
      }
    }
    addMenuNavigationHandlers(resultElement, config);
  }

  function isMenuEntryWithFurtherDetails(entry) {
    return typeof entry.details !== "undefined";
  }

  function isMenuEntryWithOptions(entry) {
    return typeof entry.options !== "undefined";
  }

  function isMenuEntryWithDefault(entry) {
    return typeof entry.default !== "undefined";
  }

  /**
   * @param {Element} element to add event handlers
   * @param {SearchbarConfig} config search configuration
   */
  function addMenuNavigationHandlers(element, config) {
    onArrowDownKey(element, handleEventWithConfig(config, focusNextSearchResult));
    onArrowUpKey(element, handleEventWithConfig(config, focusPreviousSearchResult));
    onEscapeKey(element, handleEventWithConfig(config, focusSearchInput));
  }

  /**
   * @param {Element} element to add event handlers
   */
  function addSubMenuNavigationHandlers(element) {
    onArrowDownKey(element, focusNextMenuEntry);
    onArrowUpKey(element, focusPreviousMenuEntry);
    onArrowLeftKey(element, returnToMainMenu);
    onEscapeKey(element, returnToMainMenu);
  }

  function addMenuEntrySelectionHandlers(resultElement, handler) {
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

  /**
   * @param {DescribedEntry[]} entries - array of structured raw data of the entry
   * @param {SearchbarConfig} config - search configuration
   * @param {EventListener} eventHandler - event handler
   */
  function handleEventWithEntriesAndConfig(entries, config, eventHandler) {
    return function (event) {
      eventHandler(event, entries, config);
    };
  }

  /**
   * This callback will be called, if there is not next or previous menu entry to navigate to.
   * The implementation can decide, what to do using the given id properties.
   *
   * @callback MenuEntryNotFoundHandler
   * @param {ListElementIdProperties} properties of the element id
   */
  /**
   * This function returns the ID for the first sub menu entry using the given type name (= name of the sub menu).
   *
   * @callback SubMenuId
   * @param {string} type name of the sub menu entries
   */
  /**
   * @typedef {Object} ListElementIdProperties
   * @property {id} id - Original ID
   * @property {string} type - Type of the list element
   * @property {number} index - Index of the list element
   * @property {string} previousId - ID of the previous list element
   * @property {string} nextId - ID of the next list element
   * @property {string} firstId - ID of the first list element
   * @property {string} lastId - ID of the last list element
   * @property {SubMenuId} subMenuId - Returns the ID of the first sub menu entry (with the given type name as parameter)
   * @property {string} mainMenuId - ID of the main menu entry e.g. to leave the sub menu. Equals to the id, if it already is a main menu entry
   * @property {boolean} hiddenFieldsId - ID of the embedded hidden field, that contains all public information of the described entry as JSON.
   * @property {boolean} hiddenFields - Parses the JSON inside the "hiddenFieldsId"-Element and returns the object with the described entry.
   * @property {boolean} isFirstElement - true, if it is the first element in the list
   * @property {boolean} isSubMenu - true, if it is the ID of an sub menu entry
   */
  /**
   * Extracts properties like type and index
   * from the given list element id string.
   *
   * @param {string} id
   * @return {ListElementIdProperties} list element id properties
   */
  function extractListElementIdProperties(id) {
    var splittedId = id.split("-");
    if (splittedId.length < 2) {
      console.log("expected at least one '-' separator inside the id " + id);
    }
    var extractedMainMenuType = splittedId[0];
    var extractedMainMenuIndex = parseInt(splittedId[1]);
    var extractedType = splittedId[splittedId.length - 2];
    var extractedIndex = parseInt(splittedId[splittedId.length - 1]);
    var idWithoutIndex = id.substring(0, id.lastIndexOf(extractedIndex) - 1);
    return {
      id: id,
      type: extractedType,
      index: extractedIndex,
      previousId: idWithoutIndex + "-" + (extractedIndex - 1),
      nextId: idWithoutIndex + "-" + (extractedIndex + 1),
      firstId: idWithoutIndex + "-1",
      lastId: idWithoutIndex + "-" + document.getElementById(id).parentElement.childNodes.length,
      subMenuId: function (typeName) {
        return id + "-" + typeName + "-1";
      },
      mainMenuId: extractedMainMenuType + "-" + extractedMainMenuIndex,
      hiddenFieldsId: id + "-fields",
      hiddenFields: function () {
        return JSON.parse(document.getElementById(id + "-fields").innerText);
      },
      isFirstElement: extractedIndex <= 1,
      isSubMenu: splittedId.length > 3
    };
  }

  function focusSearchInput(event, config) {
    var resultEntry = getEventTarget(event);
    var inputElement = document.getElementById(config.inputElementId);
    resultEntry.blur();
    inputElement.focus();
    moveCursorToEndOf(inputElement);
    preventDefaultEventHandling(inputElement); //skips cursor position change on key up once
    hideSubMenus(config);
    return inputElement;
  }

  /**
   * Prevents the given event inside an event handler to get handled anywhere else.
   * Pressing the arrow key up can lead to scrolling up the view. This is not useful,
   * if the arrow key navigates the focus inside a sub menu, that is fully contained inside the current view.
   */
  function preventDefaultEventHandling(inputevent) {
    inputevent.preventDefault ? inputevent.preventDefault() : (event.returnValue = false);
  }

  function focusFirstResult(event, config) {
    var selectedElement = getEventTarget(event);
    var firstResult = document.getElementById(config.resultsView.listEntryElementIdPrefix + "-1");
    selectedElement.blur();
    firstResult.focus();
  }

  function focusNextSearchResult(event, config) {
    focusNextMenuEntry(event, function (menuEntryIdProperties) {
      var next = null;
      if (menuEntryIdProperties.type === config.resultsView.listEntryElementIdPrefix) {
        //select first filter entry after last result/match entry
        //TODO Better way tp navigate from last search result to first options/filter entry?
        next = document.getElementById(config.filterOptionsView.listEntryElementIdPrefix + "-1");
      }
      if (next === null) {
        //select first result/match entry after last filter entry (or whenever nothing is found)
        next = document.getElementById(config.resultsView.listEntryElementIdPrefix + "-1");
      }
      return next;
    });
    hideSubMenus(config);
  }

  function focusPreviousSearchResult(event, config) {
    focusPreviousMenuEntry(event, function (menuEntryIdProperties) {
      var previous = null;
      if (menuEntryIdProperties.type === config.filterOptionsView.listEntryElementIdPrefix) {
        //select last result entry when arrow up is pressed on first filter entry
        //TODO Better way tp navigate from first options/filter entry to last search result?
        var resultElementsCount = getListElementCountOfType(config.resultsView.listEntryElementIdPrefix);
        previous = document.getElementById(config.resultsView.listEntryElementIdPrefix + "-" + resultElementsCount);
      }
      if (previous === null) {
        //select input, if there is no previous entry.
        return focusSearchInput(event, config);
      }
      return previous;
    });
    hideSubMenus(config);
  }

  /**
   * Selects and focusses the next menu entry.
   *
   * @param {Event} event
   * @param {MenuEntryNotFoundHandler} onMissingNext is called, if no "next" entry could be found.
   */
  function focusNextMenuEntry(event, onMissingNext) {
    var menuEntry = getEventTarget(event);
    var menuEntryIdProperties = extractListElementIdProperties(menuEntry.id);
    if (menuEntryIdProperties.isSubMenu) {
      preventDefaultEventHandling(event); //skips e.g. scrolling whole screen down when focus is inside sub menu
    }
    var next = document.getElementById(menuEntryIdProperties.nextId);
    if (next == null && typeof onMissingNext === "function") {
      next = onMissingNext(menuEntryIdProperties);
    }
    if (next == null) {
      next = document.getElementById(menuEntryIdProperties.firstId);
    }
    if (next != null) {
      menuEntry.blur();
      next.focus();
    }
  }

  /**
   * Selects and focusses the previous menu entry.
   *
   * @param {Event} event
   * @param {MenuEntryNotFoundHandler} onMissingPrevious is called, if no "previous" entry could be found.
   */
  function focusPreviousMenuEntry(event, onMissingPrevious) {
    var menuEntry = getEventTarget(event);
    var menuEntryIdProperties = extractListElementIdProperties(menuEntry.id);
    if (menuEntryIdProperties.isSubMenu) {
      preventDefaultEventHandling(event); //skips e.g. scrolling whole screen up when focus is inside sub menu
    }
    var previous = document.getElementById(menuEntryIdProperties.previousId);
    if (previous == null && typeof onMissingPrevious === "function") {
      previous = onMissingPrevious(menuEntryIdProperties);
    }
    if (previous == null) {
      previous = document.getElementById(menuEntryIdProperties.lastId);
    }
    if (previous != null) {
      menuEntry.blur();
      previous.focus();
    }
  }

  /**
   * Gets called when a filter option is selected and copies it into the filter view, where all selected filters are collected.
   */
  function selectFilterOption(event, entries, config) {
    var selectedEntry = getEventTarget(event);
    var selectedDescribedEntry = findSelectedEntry(selectedEntry.id, entries);
    createFilterOption(selectedDescribedEntry, entries, config.filtersView, config);
    //hideSubMenus(config); //TODO previously opened sub menus like options or details need to be closed on blur
    returnToMainMenu(event);
  }

  function createFilterOption(selectedDescribedEntry, entries, view, config) {
    var filterElements = getListElementCountOfType(view.listEntryElementIdPrefix);
    var filterElementId = view.listEntryElementIdPrefix + "-" + (filterElements + 1);
    var filterElement = getListEntryByFieldName(selectedDescribedEntry.category, selectedDescribedEntry.fieldName, view.listParentElementId);
    if (filterElement == null) {
      filterElement = createListEntryElement(selectedDescribedEntry, view, filterElementId);
    } else {
      filterElement = updateListEntryElement(selectedDescribedEntry, view, filterElement);
    }
    addMenuEntrySelectionHandlers(
      filterElement,
      handleEventWithEntriesAndConfig(entries, config, selectSearchResultToDisplayFilterOptions)
    );
    onArrowRightKey(filterElement, handleEventWithEntriesAndConfig(entries, config, selectSearchResultToDisplayFilterOptions));
    addMenuNavigationHandlers(filterElement, config);
    onSpaceKey(filterElement, toggleFilterEntry);
  }

  /**
   * Searches all child elements of the given parent element 
   * for an entry with the given fieldName contained in the hidden fields structure.
   * 
   * @param {String} category of the element to search for
   * @param {String} fieldName of the element to search for
   * @param {String} listParentElementId id of the parent element that child nodes will be searched
   * @returns {HTMLElement} returns the element that matches the given fieldName or null, if it hadn't been found.
   */
  function getListEntryByFieldName(category, fieldName, listParentElementId) {
    return forEachListEntryElement(listParentElementId, function(element) {
      var listElementHiddenFields = extractListElementIdProperties(element.id).hiddenFields();
      if ((listElementHiddenFields.fieldName === fieldName) && (listElementHiddenFields.category == category)) {
        return element;
      }
    });
  }

  /**
   * Gets the currently selected url template for navigation.
   * 
   * @param {String} listParentElementId id of the parent element that child nodes will be searched
   * @returns {String} returns the url template or null, if nothing could be found
   */
  //TODO should return a list of the selected, the default and a couple of other url templates in this particular order.
  //TODO the detail fields of any search result entry are applicable to replace the url template placeholders.
  //If there is any placeholder, that cannot be replaced, then the url template should be filtered out.
  //This enables context sensitive navigation based one a couple of url templates that can be searched themselves.
  function getSelectedUrlTemplate(listParentElementId) {
    return forEachListEntryElement(listParentElementId, function(element) {
      var listElementHiddenFields = extractListElementIdProperties(element.id).hiddenFields();
      if ((typeof listElementHiddenFields.urltemplate === "object") && !hasClass("inactive", element)) {
        return listElementHiddenFields.urltemplate[0].value;
      }
    });
  }

  /**
   * Iterates through all child nodes of the given parent and calls the given function.
   * If the function returns a value, it will be returned directly.
   * If the function returns nothing, the iteration continues.
   */
  function forEachListEntryElement(listParentElementId, listEntryElementFunction) {
    var listParentElement = document.getElementById(listParentElementId);
    var i, listElement, result;
    for (i = 0; i < listParentElement.childNodes.length; i += 1) {
      listElement = listParentElement.childNodes[i];
      result = listEntryElementFunction(listElement);
      if (result) {
        return result;
      }
    }
    return null;
  }

  /**
   * Extracts the described entry that it referred by the element given by its ID out of the list of described entries.
   * @param {string} element id
   * @param {DescribedEntry[]} array of described entries
   * @returns {DescribedEntry} described entry out of the given entries, that suits the element given by its id.
   */
  function findSelectedEntry(id, entries) {
    var selectedEntryIdProperties = extractListElementIdProperties(id);
    var selectedEntryHiddenFields = selectedEntryIdProperties.hiddenFields();
    var entryIndex;
    var currentlySelected;
    for (entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
      currentlySelected = entries[entryIndex];
      if (
        currentlySelected.fieldName == selectedEntryHiddenFields.fieldName &&
        currentlySelected.value == selectedEntryHiddenFields.value
      ) {
        return currentlySelected;
      }
    }
    console.log("error: no selected entry found for id " + id + " in " + entries);
    return null;
  }

  function selectSearchResultToDisplayDetails(event, entries, config) {
    hideSubMenus(config);
    selectSearchResultToDisplaySubMenu(event, entries, config.detailView, config);
    //TODO remove experiment ---------
    var selectedUrlTemplate = getSelectedUrlTemplate(config.filtersView.listParentElementId);
    console.log("selectedUrlTemplate=" + selectedUrlTemplate);
    //------end of experiment
  }

  function selectSearchResultToDisplayFilterOptions(event, entries, config) {
    hideSubMenus(config);
    selectSearchResultToDisplaySubMenu(event, entries, config.filterOptionsView, config);
  }

  function selectSearchResultToDisplaySubMenu(event, entries, subMenuView, config) {
    clearAllEntriesOfElementWithId(subMenuView.listParentElementId);
    var selectedElement = getEventTarget(event);

    var subMenuEntry = null;
    var subMenuElement = null;
    var subMenuIndex = 0;
    var subMenuEntryId = selectedElement.id + "-" + subMenuView.listEntryElementIdPrefix;
    var subMenuFirstEntry = null;
    for (subMenuIndex = 0; subMenuIndex < entries.length; subMenuIndex += 1) {
      subMenuEntry = entries[subMenuIndex];
      subMenuEntryId = selectedElement.id + "-" + subMenuView.listEntryElementIdPrefix + "-" + (subMenuIndex + 1);
      subMenuElement = createListEntryElement(subMenuEntry, subMenuView, subMenuEntryId);
      if (subMenuView.isSelectableFilterOption) {
        addSubMenuNavigationHandlers(subMenuElement);
        //TODO the only config dependency here
        //TODO should only apply to filter options
        addMenuEntrySelectionHandlers(subMenuElement, handleEventWithEntriesAndConfig(entries, config, selectFilterOption));
      }
      if (subMenuIndex === 0) {
        subMenuFirstEntry = subMenuElement;
      }
    }

    var subMenuViewElement = document.getElementById(subMenuView.viewElementId);
    var alignedSubMenuPosition = getYPositionOfElement(selectedElement) + getScrollY();
    subMenuViewElement.style.top = alignedSubMenuPosition + "px";

    showElement(subMenuViewElement);

    if (subMenuView.isSelectableFilterOption) {
      selectedElement.blur();
      subMenuFirstEntry.focus();
    }
  }

  /**
   * Exit sub menu from event entry and return to main menu.
   */
  function returnToMainMenu(event) {
    var subMenuEntryToExit = getEventTarget(event);
    var subMenuEntryToExitProperties = extractListElementIdProperties(subMenuEntryToExit.id);
    var mainMenuEntryToSelect = document.getElementById(subMenuEntryToExitProperties.mainMenuId);
    subMenuEntryToExit.blur();
    mainMenuEntryToSelect.focus();
    hideViewOf(subMenuEntryToExit);
  }

  /**
   * Browser compatible Y position of the given element.
   */
  function getYPositionOfElement(element) {
    var selectedElementPosition = element.getBoundingClientRect();
    if (typeof selectedElementPosition.y !== "undefined") {
      return selectedElementPosition.y;
    }
    return selectedElementPosition.top;
  }

  /**
   * Browser compatible version of the standard "window.scrollY".
   */
  function getScrollY() {
    var supportPageOffset = typeof window.pageYOffset !== "undefined";
    if (supportPageOffset) {
      return window.pageYOffset;
    }
    var isCSS1Compatible = (document.compatMode || "") === "CSS1Compat";
    if (isCSS1Compatible) {
      return document.documentElement.scrollTop;
    }
    return document.body.scrollTop;
  }

  function clearAllEntriesOfElementWithId(elementId) {
    var node = document.getElementById(elementId);

    if (typeof node.cloneNode === "function" && typeof node.replaceChild === "function") {
      // Fastest way to delete child nodes in Chrome and FireFox according to
      // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
      var cNode = node.cloneNode(false);
      node.parentNode.replaceChild(cNode, node);
    } else {
      // Fastest way in IE and most browser compatible solution according to
      // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
      node.innerHTML = "";
    }
  }

  /**
   * Toggles a filter to inactive and vice versa.
   */
  function toggleFilterEntry(event) {
    var filterElement = getEventTarget(event);
    toggleClass("inactive", filterElement);
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
   * Updates an already existing list entry element to be used for search results, filter options, details and filters.
   *
   * @param {DescribedEntry} entry entry data
   * @param {SearchViewDescription} view description
   * @param {Node} already existing element
   */
  function updateListEntryElement(entry, view, existingElement) {
    var text = createListEntryInnerHtmlText(entry, view, existingElement.id);
    existingElement.innerHTML = text;
    return existingElement;
  }

  /**
   * Creates a new list entry element to be used for search results, filter options, details and filters.
   *
   * @param {DescribedEntry} entry entry data
   * @param {SearchViewDescription} view description
   * @param {number} id id of the list element
   */
  function createListEntryElement(entry, view, id) {
    var text = createListEntryInnerHtmlText(entry, view, id);
    var listElement = createListElement(text, id, view.listEntryElementIdPrefix, view.listEntryElementTag);
    var parentElement = document.getElementById(view.listParentElementId);
    parentElement.appendChild(listElement);
    return listElement;
  }

  /**
   * Creates the inner HTML Text for a list entry to be used for search results, filter options, details and filters.
   *
   * @param {DescribedEntry} entry entry data
   * @param {SearchViewDescription} view description
   * @param {number} id id of the list element
   */
  function createListEntryInnerHtmlText(entry, view, id) {
    //TODO is it safer/faster to manually create child em tag and hidden-p tag instead of "innerHtml"?
    var text = entry.resolveTemplate(view.listEntryTextTemplate);
    if (typeof entry.summaries !== "undefined") {
      text = entry.resolveTemplate(view.listEntrySummaryTemplate);
    }
    text += '<p id="' + id + '-fields" style="display: none">' + entry.publicFieldsJson() + "</p>";
    return text;
  }

  /**
   * Creates a new list element to be used for search results.
   *
   * @param {string} text inside the list element
   * @param {number} id id of the list element
   * @param {string} className type of the list element used as prefix for its id, as class name
   * @param {string} elementTag tag (e.g. "li") for the element
   */
  function createListElement(text, id, className, elementTag) {
    var element = document.createElement(elementTag);
    element.setAttribute("id", id);
    element.setAttribute("tabindex", "0");
    //TODO is it safer/faster to manually create child em tag and hidden-p tag instead of "innerHtml"?
    //element.appendChild(document.createTextNode(text));
    element.innerHTML = text;
    addClass(className, element);
    return element;
  }

  function hideMenu(config) {
    hide(config.resultsView.viewElementId);
    hide(config.detailView.viewElementId);
    hide(config.filterOptionsView.viewElementId);
  }

  function hideSubMenus(config) {
    hide(config.detailView.viewElementId);
    hide(config.filterOptionsView.viewElementId);
  }

  /**
   * Shows the element given by its id.
   * @param elementId - ID of the element that should be shown
   */
  function show(elementId) {
    showElement(document.getElementById(elementId));
  }

  /**
   * Shows the given element.
   * @param element - element that should be shown
   */
  function showElement(element) {
    addClass("show", element);
  }

  /**
   * Hides the element given by its id.
   * @param elementId - ID of the element that should be hidden
   */
  function hide(elementId) {
    hideElement(document.getElementById(elementId));
  }

  /**
   * Hides the view, that contains the given element.
   * The view is identified by the existing style-class "show".
   */
  function hideViewOf(element) {
    var parentElement = element;
    while (parentElement != null) {
      if (hasClass("show", parentElement)) {
        hideElement(parentElement);
        return;
      }
      parentElement = parentElement.parentNode;
    }
  }

  /**
   * Hides the given element.
   * @param element - element that should be hidden
   */
  function hideElement(element) {
    removeClass("show", element);
  }

  function toggleClass(classToToggle, element) {
    if (hasClass(classToToggle, element)) {
      removeClass(classToToggle, element);
    } else {
      addClass(classToToggle, element);
    }
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

  function onFocus(element, eventHandler) {
    addEvent("focus", element, eventHandler);
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
      if (event.key == "ArrowUp" || event.key == "Up" || keyCodeOf(event) == 38) {
        eventHandler(event);
      }
    });
  }

  function onArrowDownKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "ArrowDown" || event.key == "Down" || keyCodeOf(event) == 40) {
        eventHandler(event);
      }
    });
  }

  function onArrowRightKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "ArrowRight" || event.key == "Right" || keyCodeOf(event) == 39) {
        eventHandler(event);
      }
    });
  }

  function onArrowLeftKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "ArrowLeft" || event.key == "Left" || keyCodeOf(event) == 37) {
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
searchbar.SearchbarAPI.searchURI("../data/state_capitals.json").start();
