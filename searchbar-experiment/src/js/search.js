/**
 * @file "Searchbar" for the web client
 * @version ${project.version}
 * @author JohT
 */
//TODO JSDoc

var module = datarestructorInternalCreateIfNotExists(module); // Fallback for vanilla js without modules

function datarestructorInternalCreateIfNotExists(objectToCheck) {
  return objectToCheck || {};
}

/**
 * Contains all functions for the "search as you type" feature.
 * @module searchbar
 */
 var searchbar = module.exports={}; // Export module for npm...
 searchbar.internalCreateIfNotExists = datarestructorInternalCreateIfNotExists;

//TODO must find a way to use the "dist" module
//TODO must find a way to use ie compatible module
var template_resolver = template_resolver || require("data-restructor/devdist/templateResolver"); // supports vanilla js & npm
var described_field = described_field || require("data-restructor/devdist/describedfield"); // supports vanilla js & npm

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
 * This function will be called, when search results are available.
 * @callback SearchServiceResultAvailable
 * @param {Object} searchResultData already parsed data object containing the result of the search
 */

/**
 * This function will be called to trigger search (calling the search backend).
 * @callback SearchService
 * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
 * @param {SearchServiceResultAvailable} onSearchResultsAvailable will be called when search results are available.
 */

/**
 * @callback ResolveTemplateFunction replaces variables with object properties.
 * @param {String} template may contain variables in double curly brackets. T
 * Typically supported variables would be: {{category}} {{fieldName}}, {{displayName}}, {{abbreviation}}, {{value}}
 * @return {String} string with resolved/replaced variables
 */

/**
 * @callback FieldsJson returns the fields as JSON
 * @return {String} JSON of all contained fields
 */

 //TODO could functions be moved out (for data-only structure)?
 //TODO could a separate value object be defined and mapped to get some decoupling to data-reconstructor-js?
/**
 * @typedef {Object} SearchUiData 
 * @property {String} [category=""] name of the category. Default = "". Could contain a short domain name. (e.g. "city")
 * @property {String} fieldName field name that will be used e.g. as a search parameter name for filter options.
 * @property {String} [displayName=""] readable display name for e.g. the list of results.
 * @property {String} [abbreviation=""] one optional character, a symbol character or a short abbreviation of the category
 * @property {String} value value of the field
 * @property {SearchUiData[]} details if there are further details that will be displayed e.g. on mouse over
 * @property {SearchUiData[]} options contains filter options that can be selected as search parameters 
 * @property {SearchUiData[]} default array with one element representing the default filter option (selected automatically)
 * @property {SearchUiData[]} summaries fields that are used to display the main search entry/result
 */

/**
 * This function converts the data from search backend to the structure needed by the search UI.
 * @callback DataConverter
 * @param {Object} searchData
 * @returns {SearchUiData} converted and structured data for search UI
 */

/**
 * This function adds predefined search parameters before search is triggered, e.g. constants, environment parameters, ...
 * @callback SearchParameterAdder
 * @param {Object} searchParametersObject
 */

/**
 * This function will be called when a new HTML is created.
 * @callback ElementCreatedListener
 * @param {Element} newlyCreatedElement
 */

/**
 * @typedef {Object} SearchbarConfig
 * @property {SearchService} triggerSearch - triggers search (backend)
 * @property {DataConverter} convertData - converts search result data to search ui data
 * @property {SearchParameterAdder} addPredefinedParametersTo - adds custom search parameters 
 * @property {ElementCreatedListener} onCreatedElement - this function will be called when a new HTML is created.
 * @property {string} searchAreaElementId - id of the whole search area (default="searcharea")
 * @property {string} inputElementId - id of the search input field (default="searchbar")
 * @property {SearchViewDescription} resultsView - describes the main view containing the search results
 * @property {SearchViewDescription} detailView - describes the details view
 * @property {SearchViewDescription} filterOptionsView - describes the filter options view
 * @property {SearchViewDescription} filtersView - describes the filters view
 * @property {string} [waitBeforeClose=700] - timeout in milliseconds when search is closed after blur (loss of focus) (default=700)
 * @property {string} [waitBeforeSearch=500] - time in milliseconds to wait until typing is finished and search starts (default=500)
 * @property {string} [waitBeforeMouseOver=700] - time in milliseconds to wait until mouse over opens details (default=700)
 */

/**
 * Searchbar UI API
 *
 * @namespace
 */
searchbar.SearchbarAPI = (function () {
  "use strict";
  /**
   * Constructor function and container for everything, that needs to exist per instance.
   * @param {SearchbarConfig} optional parameter that contains a template to clone
   */
  function SearchbarApiBuilder() {
    this.config = {
      triggerSearch: function (searchParameters, onSearchResultsAvailable) {
        throw new Error("search service needs to be defined.");
      },
      convertData: function (sourceData) {
        throw new Error("data converter needs to be defined.");
      },
      addPredefinedParametersTo: function (object) {
        //does nothing if not specified otherwise
      },
      onCreatedElement: function (element) {
        //does nothing if not specified otherwise
      },
      searchAreaElementId: "searcharea",
      inputElementId: "searchbar",
      searchTextParameterName: "searchtext",
      resultsView: defaultResultsView(),
      detailView: defaultDetailView(),
      filterOptionsView: defaultFilterOptionsView(),
      filtersView: defaultFiltersView(),
      waitBeforeClose: 700,
      waitBeforeSearch: 500,
      waitBeforeMouseOver: 700
    };
    /**
     * Defines the search service function, that will be called whenever search is triggered.
     * @param {SearchService} service - function that will be called to trigger search (backend).
     */
    this.searchService = function (service) {
      this.config.triggerSearch = service;
      return this;
    };
    /**
     * Defines the converter, that converts search result data to search ui data
     * @param {DataConverter} converter - function that will be called to trigger search (backend).
     */
    this.dataConverter = function (converter) {
      this.config.convertData = converter;
      return this;
    };
    /**
     * Defines the function, that adds predefined (fixed, constant, environmental) search parameters
     * to the first parameter object.
     * @param {SearchParameterAdder} adder - function that will be called to before search is triggered.
     */
    this.addPredefinedParametersTo = function (adder) {
      this.config.addPredefinedParametersTo = adder;
      return this;
    };
    /**
     * Sets the listener, that will be called, when a new HTML element was created.
     * @param {ElementCreatedListener} listener 
     */
    this.addElementCreatedHandler = function (listener) {
      this.config.onCreatedElement = listener;
      return this;
    };
    this.searchAreaElementId = function (id) {
      this.config.searchAreaElementId = id;
      return this;
    };
    this.inputElementId = function (id) {
      this.config.inputElementId = id;
      return this;
    };
    this.searchTextParameterName = function (value) {
      this.config.searchTextParameterName = value;
      return this;
    };
    this.resultsView = function (view) {
      this.config.resultsView = view;
      return this;
    };
    this.detailView = function (view) {
      this.config.detailView = view;
      return this;
    };
    this.filterOptionsView = function (view) {
      this.config.filterOptionsView = view;
      return this;
    };
    this.filtersView = function (view) {
      this.config.filtersView = view;
      return this;
    };
    this.waitBeforeClose = function (ms) {
      this.config.waitBeforeClose = ms;
      return this;
    };
    this.waitBeforeSearch = function (ms) {
      this.config.waitBeforeSearch = ms;
      return this;
    };
    this.waitBeforeMouseOver = function (ms) {
      this.config.waitBeforeMouseOver = ms;
      return this;
    };
    this.start = function () {
      return new searchbar.SearchbarUI(this.config);
    };
  }

  function defaultResultsView() {
    return new searchbar.SearchViewDescriptionBuilder()
      .viewElementId("searchresults")
      .listParentElementId("searchmatches")
      .listEntryElementIdPrefix("result")
      .listEntryTextTemplate("{{abbreviation}} {{displayName}}") //TODO could display second line smaller
      .listEntrySummaryTemplate(
        "{{summaries[0].abbreviation}} <b>{{summaries[1].value}}</b><br>{{summaries[2].value}}: {{summaries[0].value}}"
      )
      .build();
  }

  function defaultDetailView() {
    return new searchbar.SearchViewDescriptionBuilder()
      .viewElementId("seachdetails")
      .listParentElementId("seachdetailentries")
      .listEntryElementIdPrefix("detail")
      .listEntryTextTemplate("<b>{{displayName}}:</b> {{value}}") //TODO could display value smaller
      .build();
  }

  function defaultFilterOptionsView() {
    return new searchbar.SearchViewDescriptionBuilder()
      .viewElementId("seachfilteroptions")
      .listParentElementId("seachfilteroptionentries")
      .listEntryElementIdPrefix("filter")
      .listEntryTextTemplate("{{value}}")
      .listEntrySummaryTemplate("{{summaries[0].value}}")
      .isSelectableFilterOption(true)
      .build();
  }

  function defaultFiltersView() {
    return new searchbar.SearchViewDescriptionBuilder()
      .viewElementId("searchresults")
      .listParentElementId("searchfilters")
      .listEntryElementIdPrefix("filter")
      .isSelectableFilterOption(true)
      .build();
  }

  /**
   * Public interface
   * @scope searchbar.SearchbarAPI
   */
  return SearchbarApiBuilder;
}());

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
      this.waitBeforeSearchTimer = window.setTimeout(function () {
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
        //TODO only show results if there are some
        show(config.resultsView.viewElementId);
      }
    });
    addEvent("focusout", searchareaElement, function (event) {
      this.focusOutTimer = window.setTimeout(function () {
        hideMenu(config);
      }, config.waitBeforeClose);
    });
  };

  function updateSearch(searchText, config) {
    var matchList = document.getElementById(config.resultsView.listParentElementId);
    matchList.innerHTML = "";
    if (searchText.length === 0) {
      hideMenu(config);
      return;
    }
    show(config.resultsView.viewElementId);
    getSearchResults(searchText, config);
  }

  function getSearchResults(searchText, config) {
    //TODO should "retrigger" search when new filter options are selected (after each?)
    var searchParameters = getSelectedOptions(config.filtersView.listParentElementId);
    searchParameters[config.searchTextParameterName] = searchText;
    config.addPredefinedParametersTo(searchParameters);
    // TODO could provide optional build in search text highlighting
    config.triggerSearch(searchParameters, function (jsonResult) {
      displayResults(config.convertData(jsonResult), config);
    });
  }

  function displayResults(jsonResults, config) {
    var index = 0;
    for (index = 0; index < jsonResults.length; index+=1) {
      addResult(jsonResults[index], index + 1, config);
    }
  }

  function addResult(entry, i, config) {
    var listElementId = config.resultsView.listEntryElementIdPrefix + "-" + i;
    var resultElement = createListEntryElement(entry, config.resultsView, listElementId);
    forEachIdElementIncludingChildren(resultElement, config.onCreatedElement);

    if (isMenuEntryWithFurtherDetails(entry)) {
      onMenuEntrySelected(resultElement, handleEventWithEntriesAndConfig(entry.details, config, selectSearchResultToDisplayDetails));
      onMouseOverDelayed(
        resultElement,
        config.waitBeforeMouseOver,
        handleEventWithEntriesAndConfig(entry.details, config, selectSearchResultToDisplayDetails)
      );
      onMenuEntryChosen(resultElement, function (event) {
        var selectedUrlTemplate = getSelectedUrlTemplate(config.filtersView.listParentElementId, entry.category);
        if (selectedUrlTemplate) {
          window.location.href = new template_resolver.Resolver(entry).resolveTemplate(selectedUrlTemplate);
        }
      });
    }
    if (isMenuEntryWithOptions(entry)) {
      var options = entry.options;
      //TODO should skip sub menu, if there is only one option (with/without being default).
      //TODO could be used for constants (pre selected single filter options) like "tenant-number", "current-account"
      if (isMenuEntryWithDefault(entry)) {
        options = insertAtBeginningIfMissing(entry.options, entry["default"][0], equalProperties(["value"]));
        createFilterOption(entry["default"][0], options, config.filtersView, config);
      }
      onMenuEntrySelected(resultElement, handleEventWithEntriesAndConfig(entry.options, config, selectSearchResultToDisplayFilterOptions));
      onMenuEntryChosen(resultElement, handleEventWithEntriesAndConfig(entry.options, config, selectSearchResultToDisplayFilterOptions));
    }
    addMainMenuNavigationHandlers(resultElement, config);
  }

  function equalProperties(propertyNames) {
    return function (existingObject, newObject) {
      var index;
      for (index = 0; index < propertyNames.length; index += 1) {
        if (existingObject[propertyNames[index]] != newObject[propertyNames[index]]) {
          return false;
        }
      }
      return true;
    };
  }

  /**
   * Adds the given entry at be beginning of the given array of entries if it's missing.
   * The equalFunction determines, if the new value is missing (returns false) or not (returns true).
   * If the entry to add is null, the entries are returned directly.
   *
   * @param {Object[]} entries
   * @param {Object} entryToAdd
   * @param {boolean} equalMatcher takes the existing and the new entry as parameters and returns true if they are considered "equal".
   * @returns {Object[]}
   */
  function insertAtBeginningIfMissing(entries, entryToAdd, equalMatcher) {
    if (!entryToAdd) {
      return entries;
    }
    var index;
    var alreadyContainsEntryToAdd = false;
    for (index = 0; index < entries.length; index += 1) {
      if (equalMatcher(entries[index], entryToAdd)) {
        alreadyContainsEntryToAdd = true;
        break;
      }
    }
    if (alreadyContainsEntryToAdd) {
      return entries;
    }
    var result = [];
    result.push(entryToAdd);
    for (index = 0; index < entries.length; index += 1) {
      result.push(entries[index]);
    }
    return result;
  }

  function isMenuEntryWithFurtherDetails(entry) {
    return typeof entry.details !== "undefined";
  }

  function isMenuEntryWithOptions(entry) {
    return typeof entry.options !== "undefined";
  }

  function isMenuEntryWithDefault(entry) {
    return typeof entry["default"] !== "undefined";
  }

  /**
   * Reacts to input events (keys, ...) to navigate through main menu entries.
   *
   * @param {Element} element to add event handlers
   * @param {SearchbarConfig} config search configuration
   */
  function addMainMenuNavigationHandlers(element, config) {
    onArrowDownKey(element, handleEventWithConfig(config, focusNextSearchResult));
    onArrowUpKey(element, handleEventWithConfig(config, focusPreviousSearchResult));
    onEscapeKey(element, handleEventWithConfig(config, focusSearchInput));
    onArrowLeftKey(element, handleEventWithConfig(config, closeAssociatedSubMenus));
  }

  /**
   * Reacts to input events (keys, ...) to navigate through sub menu entries.
   *
   * @param {Element} element to add event handlers
   */
  function addSubMenuNavigationHandlers(element) {
    onArrowDownKey(element, focusNextMenuEntry);
    onArrowUpKey(element, focusPreviousMenuEntry);
    onArrowLeftKey(element, returnToMainMenu);
    onEscapeKey(element, returnToMainMenu);
  }

  function onMenuEntrySelected(element, eventHandler) {
    onSpaceKey(element, eventHandler);
    onArrowRightKey(element, eventHandler);
  }

  function onMenuEntryChosen(element, eventHandler) {
    addEvent("mousedown", element, eventHandler);
    onEnterKey(element, eventHandler);
  }

  function onSubMenuEntrySelected(element, eventHandler) {
    addEvent("mousedown", element, eventHandler);
    onEnterKey(element, eventHandler);
    onSpaceKey(element, eventHandler);
  }

  function onFilterMenuEntrySelected(element, eventHandler) {
    addEvent("mousedown", element, eventHandler);
    onEnterKey(element, eventHandler);
    onArrowRightKey(element, eventHandler);
  }

  function onFilterMenuEntryRemoved(element, eventHandler) {
    onDeleteKey(element, eventHandler);
    onBackspaceKey(element, eventHandler);
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
   * @param {Object[]} entries - raw data of the entry
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
      reIndex: function (index) {
        return idWithoutIndex + "-" + index;
      },
      mainMenuId: extractedMainMenuType + "-" + extractedMainMenuIndex,
      hiddenFieldsId: id + "-fields",
      hiddenFields: function () {
        var hiddenFieldsElement = document.getElementById(id + "-fields");
        var hiddenFieldsJson = (typeof hiddenFieldsElement.textContent !== "undefined")? hiddenFieldsElement.textContent : hiddenFieldsElement.innerText;
        return JSON.parse(hiddenFieldsJson);
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

  function focusFirstResult(event, config) {
    var selectedElement = getEventTarget(event);
    var firstResult = document.getElementById(config.resultsView.listEntryElementIdPrefix + "-1");
    if (firstResult) {
      selectedElement.blur();
      firstResult.focus();
    }
  }

  function focusNextSearchResult(event, config) {
    focusNextMenuEntry(event, function (menuEntryIdProperties) {
      var next = null;
      if (menuEntryIdProperties.type === config.resultsView.listEntryElementIdPrefix) {
        //select first filter entry after last result/match entry
        //TODO analyze better way (without config) to navigate from last search result to first options/filter entry?
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
        //TODO analyze better way (without config) to navigate from first options/filter entry to last search result?
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
      scrollToFocus(next, false);
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
      scrollToFocus(previous, true);
    }
  }

  /**
   * Gets called when a filter option is selected and copies it into the filter view, where all selected filters are collected.
   */
  function selectFilterOption(event, entries, config) {
    var selectedEntry = getEventTarget(event);
    var selectedEntryData = findSelectedEntry(selectedEntry.id, entries, equalProperties(["fieldName", "value"]));
    createFilterOption(selectedEntryData, entries, config.filtersView, config);
    preventDefaultEventHandling(event);
    returnToMainMenu(event);
  }

  function createFilterOption(selectedEntryData, entries, view, config) {
    var filterElements = getListElementCountOfType(view.listEntryElementIdPrefix);
    var filterElementId = view.listEntryElementIdPrefix + "-" + (filterElements + 1);
    var filterElement = getListEntryByFieldName(
      selectedEntryData.category,
      selectedEntryData.fieldName,
      view.listParentElementId
    );
    var isAlreadyExistingFilter = filterElement != null;
    if (isAlreadyExistingFilter) {
      filterElement = updateListEntryElement(selectedEntryData, view, filterElement);
      return;
    }
    filterElement = createListEntryElement(selectedEntryData, view, filterElementId);
    forEachIdElementIncludingChildren(filterElement, config.onCreatedElement);

    onFilterMenuEntrySelected(filterElement, handleEventWithEntriesAndConfig(entries, config, selectSearchResultToDisplayFilterOptions));
    addMainMenuNavigationHandlers(filterElement, config);

    var filterElementHiddenFields = extractListElementIdProperties(filterElement.id).hiddenFields();
    var isFilterWithDefaultOption = typeof filterElementHiddenFields["default"] !== "undefined";
    if (isFilterWithDefaultOption) {
      onSpaceKey(filterElement, handleEventWithEntriesAndConfig(entries, config, selectSearchResultToDisplayFilterOptions));
      //TODO could reset elements to their default value upon deletion.
    } else {
      onSpaceKey(filterElement, toggleFilterEntry);
      onFilterMenuEntryRemoved(filterElement, handleEventWithConfig(config, removeFilterElement));
    }
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
    return forEachListEntryElement(listParentElementId, function (element) {
      var listElementHiddenFields = extractListElementIdProperties(element.id).hiddenFields();
      //TODO should additionally match empty category?
      //A global parameter should be found even from an foreign category and shouldn't be selected twice (per category).
      if (listElementHiddenFields.fieldName === fieldName && listElementHiddenFields.category == category) {
        return element;
      }
    });
  }

  /**
   * Gets the currently selected url template for navigation.
   *
   * @param {String} listParentElementId id of the parent element that child nodes will be searched
   * @param {String} category the url template needs to belong to the same category
   * @returns {String} returns the url template or null, if nothing could be found
   */
  function getSelectedUrlTemplate(listParentElementId, category) {
    return forEachListEntryElement(listParentElementId, function (element) {
      var listElementHiddenFields = extractListElementIdProperties(element.id).hiddenFields();
      if (typeof listElementHiddenFields.urltemplate === "undefined") {
        return null; // entry has no url template
      }
      //TODO could always match empty category?
      if (listElementHiddenFields.category != category) {
        return null; // entry belongs to another category
      }
      if (hasClass("inactive", element)) {
        return null; // entry is inactive
      }
      return listElementHiddenFields.urltemplate[0].value;
    });
  }

  function getSelectedOptions(listParentElementId) {
    var result = {};
    forEachListEntryElement(listParentElementId, function (element) {
      var hiddenFields = extractListElementIdProperties(element.id).hiddenFields();
      if (typeof hiddenFields.fieldName === "undefined" || typeof hiddenFields.value === "undefined") {
        return null;
      }
      if (hasClass("inactive", element)) {
        return null; // entry is inactive
      }
      result[hiddenFields.fieldName] = hiddenFields.value;
    });
    return result;
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
   * Extracts the entry data that it referred by the element given by its ID out of the list of data entries.
   * @param {string} element id
   * @param {DescribedEntry[]} array of described entries
   * @param {boolean} equalMatcher takes the existing and the new entry as parameters and returns true if they are considered "equal".
   * @returns {DescribedEntry} described entry out of the given entries, that suits the element given by its id.
   */
  function findSelectedEntry(id, entries, equalsMatcher) {
    var selectedEntryIdProperties = extractListElementIdProperties(id);
    var selectedEntryHiddenFields = selectedEntryIdProperties.hiddenFields();
    var entryIndex;
    var currentlySelected;
    for (entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
      currentlySelected = entries[entryIndex];
      if (equalsMatcher(currentlySelected, selectedEntryHiddenFields)) {
        return currentlySelected;
      }
    }
    console.log("error: no selected entry found for id " + id + " in " + entries);
    return null;
  }

  function selectSearchResultToDisplayDetails(event, entries, config) {
    hideSubMenus(config);
    selectSearchResultToDisplaySubMenu(event, entries, config.detailView, config);
    preventDefaultEventHandling(event);
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
      forEachIdElementIncludingChildren(subMenuElement, config.onCreatedElement);

      if (subMenuView.isSelectableFilterOption) {
        addSubMenuNavigationHandlers(subMenuElement);
        onSubMenuEntrySelected(subMenuElement, handleEventWithEntriesAndConfig(entries, config, selectFilterOption));
      }
      if (subMenuIndex === 0) {
        subMenuFirstEntry = subMenuElement;
      }
    }
    var divParentOfSelectedElement = parentThatMatches(selectedElement, function (element) {
      return element.tagName == "DIV";
    });
    var subMenuViewElement = document.getElementById(subMenuView.viewElementId);
    var alignedSubMenuXPosition = divParentOfSelectedElement.offsetWidth + 15;
    var alignedSubMenuYPosition = getYPositionOfElement(selectedElement) + getScrollY();
    subMenuViewElement.style.left = alignedSubMenuXPosition + "px";
    subMenuViewElement.style.top = alignedSubMenuYPosition + "px";

    showElement(subMenuViewElement);

    if (subMenuView.isSelectableFilterOption) {
      selectedElement.blur();
      subMenuFirstEntry.focus();
    }
  }

  /**
   * Exit sub menu from event entry and return to main menu.
   * @param {InputEvent} event
   */
  function returnToMainMenu(event) {
    var subMenuEntryToExit = getEventTarget(event);
    var subMenuEntryToExitProperties = extractListElementIdProperties(subMenuEntryToExit.id);
    var mainMenuEntryToSelect = document.getElementById(subMenuEntryToExitProperties.mainMenuId);
    subMenuEntryToExit.blur();
    mainMenuEntryToSelect.focus();
    //TODO could hide all neighbor sub menus (elements containing class "show"), not only the current view
    hideViewOf(subMenuEntryToExit);
  }

  function closeAssociatedSubMenus(event, config) {
    hideSubMenus(config);
  }

  /**
   * Prevents the given event inside an event handler to get handled anywhere else.
   * Pressing the arrow key up can lead to scrolling up the view. This is not useful,
   * if the arrow key navigates the focus inside a sub menu, that is fully contained inside the current view.
   * @param {InputEvent}
   */
  function preventDefaultEventHandling(inputevent) {
    if (typeof inputevent.preventDefault !== "undefined") {
      inputevent.preventDefault();
    } else {
      inputevent.returnValue = false;
    }
  }

  /**
   * Scrolls to where the given element is visible.
   * @param {HTMLElement} element
   * @param {boolean} up true if the focus moved up, false otherwise
   */
  //TODO must: does not work as expected an leads to errors in IE
  function scrollToFocus(element, up) {
    /*
    if (up == true) {
      element.scrollIntoView({ block: "start" });
    } else {
      element.scrollIntoView({ block: "end" });
    }
    */
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
   * @param {InputEvent} event
   */
  function toggleFilterEntry(event) {
    preventDefaultEventHandling(event);
    var filterElement = getEventTarget(event);
    toggleClass("inactive", filterElement);
  }

  function removeFilterElement(event, config) {
    preventDefaultEventHandling(event);
    focusPreviousSearchResult(event, config);
    removeChildElement(event);
  }

  /**
   * Removes the event target element from its parent.
   * @param {InputEvent} event
   */
  function removeChildElement(event) {
    //TODO must also reindex sub menus. a changed selection inside the filters should not lead to an error.
    var element = getEventTarget(event);
    var parentElement = element.parentElement;
    parentElement.removeChild(element);
    forEachEntryIn(parentElement.childNodes, function(entry, index) {
      entry.id = extractListElementIdProperties(entry.id).reIndex(index + 1);
    });
  }

  function forEachIdElementIncludingChildren(element, callback) {
    if (element.id) {
      callback(element);
    }
    forEachEntryIn(element.childNodes, function(element) {
      if (element.id) {
        callback(element);
      }
    });
  }

  function forEachEntryIn(array, callback) {
    var index = 0;
    for (index = 0; index < array.length; index += 1) {
      callback(array[index], index);
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
    //TODO should support template inside html e.g. referenced by id (with convention over code)
    //TODO should limit length of resolved variables
    var resolver = new template_resolver.Resolver(entry);
    var text = resolver.resolveTemplate(view.listEntryTextTemplate);
    if (typeof entry.summaries !== "undefined") {
      text = resolver.resolveTemplate(view.listEntrySummaryTemplate);
    }
    var json = JSON.stringify(entry); //TODO must be without spaces
    text += '<p id="' + id + '-fields" style="display: none">' + json + "</p>";
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
    element.id = id;
    element.tabIndex = "0";
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
   * Hides the view (by removing the class "show"), that contains the given element.
   * The view is identified by the existing style-class "show".
   * @param {Element} element
   */
  function hideViewOf(element) {
    var parentWithShowClass = parentThatMatches(element, function (parent) {
      return hasClass("show", parent);
    });
    if (parentWithShowClass != null) {
      hideElement(parentWithShowClass);
      return;
    }
  }

  /**
   * @callback ElementPredicate
   * @param {Element} element
   * @returns {boolean} true, when the predicate matches the given element, false otherwise.
   */

  /**
   * Returns the parent of the element (or the element itself), that matches the given predicate.
   * Returns null, if no element had been found.
   *
   * @param {Element} element
   * @param {ElementPredicate} predicate
   */
  function parentThatMatches(element, predicate) {
    var parentNode = element;
    while (parentNode != null) {
      if (predicate(parentNode)) {
        return parentNode;
      }
      parentNode = parentNode.parentNode;
    }
    return null;
  }

  /**
   * Returns the child of the element (or the element itself), that matches the given predicate.
   * Returns null, if no element had been found.
   * @param {Element} element
   * @param {ElementPredicate} predicate
   */
  function childThatMatches(element, predicate) {
    var node = element;
    if (predicate(node)) {
      return node;
    }
    var i, childElement, matchingChild;
    for (i = 0; i < node.childNodes.length; i += 1) {
      childElement = node.childNodes[i];
      matchingChild = childThatMatches(childElement, predicate);
      if (matchingChild != null) {
        return matchingChild;
      }
    }
    return null;
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
    return element.className != null && element.className.indexOf(classToLookFor) >= 0;
  }

  function onMouseOverDelayed(element, delayTime, eventHandler) {
    addEvent("mouseover", element, function (event) {
      this.originalEvent = cloneObject(event);
      this.delayedHandlerTimer = window.setTimeout(function () {
        eventHandler(typeof this.originalEvent !== "undefined"? this.originalEvent : event);
      }, delayTime); 
      addEvent("mouseout", element, function () {
        if (this.delayedHandlerTimer !== null) {
          clearTimeout(this.delayedHandlerTimer);
        }
      });
      addEvent("mousedown", element, function () {
        if (this.delayedHandlerTimer !== null) {
          clearTimeout(this.delayedHandlerTimer);
        }
      });
      addEvent("keydown", element, function () {
        if (this.delayedHandlerTimer !== null) {
          clearTimeout(this.delayedHandlerTimer);
        }
      });
    });
  }

  function cloneObject(source) {
    var result = {};
    var propertyNames = Object.keys(source);
    for (var propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex++) {
      var propertyName = propertyNames[propertyIndex];
      var propertyValue = source[propertyName];
      result[propertyName] = propertyValue;
    }
    return result;
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

  function onDeleteKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "Del" || event.key == "Delete" || keyCodeOf(event) == 46) {
        eventHandler(event);
      }
    });
  }

  function onBackspaceKey(element, eventHandler) {
    addEvent("keydown", element, function (event) {
      if (event.key == "Backspace" || keyCodeOf(event) == 8) {
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
    if (element.addEventListener) { 
      element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + eventName, eventHandler);
    } else {
      element["on" + eventName] = eventHandler;
    }
  }

  /**
   * @returns {Element} target of the event
   */
  function getEventTarget(event) {
    if (typeof event.currentTarget !== "undefined" && event.currentTarget != null) {
      return event.currentTarget;
    } if (typeof event.srcElement !== "undefined" && event.srcElement != null) {
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
    } else if (typeof element.createTextRange === "function") {
      var range = element.createTextRange();
      range.collapse(true);
      range.moveEnd("character", element.value.length);
      range.moveStart("character", element.value.length);
      range.select();
    }
  }

  // Returns the instance
  return instance;
})();