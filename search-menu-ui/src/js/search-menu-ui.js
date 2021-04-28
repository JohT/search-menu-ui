/**
 * @file Search UI written in vanilla JavaScript. Menu structure for results. Filters are integrated as search results.
 * @version {@link https://github.com/JohT/search-menu-ui/releases/latest latest version}
 * @author JohT
 */

var module = datarestructorInternalCreateIfNotExists(module); // Fallback for vanilla js without modules

function datarestructorInternalCreateIfNotExists(objectToCheck) {
  return objectToCheck || {};
}

/**
 * Contains the main ui component of the search menu ui.
 * @module searchmenu
 */
 var searchmenu = module.exports={}; // Export module for npm...
 searchmenu.internalCreateIfNotExists = datarestructorInternalCreateIfNotExists;

//TODO should find a way to use ie compatible module
var template_resolver = template_resolver || require("data-restructor/devdist/templateResolver"); // supports vanilla js & npm
var described_field = described_field || require("data-restructor/devdist/describedfield"); // supports vanilla js & npm
var eventtarget = eventtarget || require("./ponyfills/eventCurrentTargetPonyfill"); // supports vanilla js & npm
var selectionrange = selectionrange || require("./ponyfills/selectionRangePonyfill"); // supports vanilla js & npm
var eventlistener = eventlistener || require("./ponyfills/addEventListenerPonyfill"); // supports vanilla js & npm

/**
 * @typedef {Object} module:searchmenu.SearchViewDescription Describes a part of the search view (e.g. search result details).
 * @property {string} viewElementId id of the element (e.g. "div"), that contains the view with all list elements and their parent.
 * @property {string} listParentElementId id of the element (e.g. "ul"), that contains all list entries and is located inside the view.
 * @property {string} listEntryElementIdPrefix id prefix (followed by "--" and the index number) for every list entry
 * @property {string} [listEntryElementTag="li"] element tag for list entries. defaults to "li".
 * @property {string} [listEntryTextTemplate="{{displayName}}: {{value}}"] template for the text of each list entry
 * @property {string} [listEntrySummaryTemplate="{{summaries[0].displayName}}: {{summaries[0].value}}"] template for the text of each list entry, if the data group "summary" exists.
 * @property {string} [listEntryStyleClassTemplate="{{view.listEntryElementIdPrefix}} {{category}}"] template for the style class of each list entry.
 * @property {boolean} [isSelectableFilterOption=false] Specifies, if the list entry can be selected as filter option
 */

searchmenu.SearchViewDescriptionBuilder = (function () {
  "use strict";

  /**
   * Builds a {@link module:searchmenu.SearchViewDescription}, which describes a part of the search menu called "view".  
   * Examples for views are: results, details, filters, filter options. There might be more in future.
   * 
   * The description contains the id's of the html elements, that will be used as "binding", to
   * add elements like results. The "viewElementId" is the main parent (may be a "div" tag) of all view elements,
   * that contains the "listParentElementId", which is the parent of the list entries (may be a "ul" tag).
   * 
   * The text content of each entry is described by the text templates. 
   * 
   * Furthermore, the css style class can be given as a template, 
   * so search result field values can be used as a part of the style class.
   * 
   * @param {module:searchmenu.SearchViewDescription} template optional parameter that contains a template to clone
   * @constructs SearchViewDescriptionBuilder
   * @alias module:searchmenu.SearchViewDescriptionBuilder
   */
  function SearchViewDescription(template) {
    var defaultTemplate = "{{displayName}}: {{value}}";
    var defaultSummaryTemplate = "{{summaries[0].displayName}}: {{summaries[0].value}}";
    var defaultStyleClassTemplate = "{{view.listEntryElementIdPrefix}} {{category}}";
    var defaultTag = "li";
    /**
     * @type {module:searchmenu.SearchViewDescription}
     * @protected
     */
    this.description = {
      viewElementId: template ? template.viewElementId : "",
      listParentElementId: template ? template.listParentElementId : "",
      listEntryElementIdPrefix: template ? template.listEntryElementIdPrefix : "",
      listEntryElementTag: template ? template.listEntryElementTag : defaultTag,
      listEntryTextTemplate: template ? template.listEntryTextTemplate : defaultTemplate,
      listEntrySummaryTemplate: template ? template.listEntrySummaryTemplate : defaultSummaryTemplate,
      listEntryStyleClassTemplate: template ? template.listEntryStyleClassTemplate : defaultStyleClassTemplate,
      isSelectableFilterOption: template ? template.isSelectableFilterOption : false
    };
    /**
     * ID of the element (e.g. "div"), that contains the view with all list elements and their parent.
     *
     * @param {string} value view element ID.
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.viewElementId = function (value) {
      this.description.viewElementId = withDefault(value, "");
      return this;
    };
    /**
     * ID of the element (e.g. "ul"), that contains all list entries and is located inside the view.
     * @param {string} value parent element ID
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.listParentElementId = function (value) {
      this.description.listParentElementId = withDefault(value, "");
      return this;
    };
    /**
     * ID prefix (followed by "--" and the index number) for every list entry.
     * @param {string} value ID prefix for every list entry element
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.listEntryElementIdPrefix = function (value) {
      //TODO Should be checked to not contain the index separation chars "--"
      this.description.listEntryElementIdPrefix = withDefault(value, "");
      return this;
    };
    /**
     * Element tag for list entries.
     * @param {string} [value="li"] tag for every list entry element
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.listEntryElementTag = function (value) {
      this.description.listEntryElementTag = withDefault(value, defaultTag);
      return this;
    };
    /**
     * Template for the text of each list entry.
     * May contain variables in double curly brackets.
     *
     * @param {string} [value="{{displayName}}: {{value}}"] list entry text template when there is no summary data group
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.listEntryTextTemplate = function (value) {
      this.description.listEntryTextTemplate = withDefault(value, defaultTemplate);
      return this;
    };
    /**
     * Template for the text of each list entry, if the data group "summary" exists.
     * May contain variables in double curly brackets.
     *
     * @param {string} [value="{{summaries[0].displayName}}: {{summaries[0].value}}"] list entry text template when there is a summary data group
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.listEntrySummaryTemplate = function (value) {
      this.description.listEntrySummaryTemplate = withDefault(value, defaultSummaryTemplate);
      return this;
    };
    /**
     * Template for the style classes of each list entry.
     * May contain variables in double curly brackets.
     * To use the property values of this view, prefix them with "view", e.g.: "{{view.listEntryElementIdPrefix}}".
     *
     * @param {string} [value="{{view.listEntryElementIdPrefix}} {{category}}"] list entry style classes template
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
     this.listEntryStyleClassTemplate = function (value) {
      this.description.listEntryStyleClassTemplate = withDefault(value, defaultStyleClassTemplate);
      return this;
    };
    /**
     * Specifies, if the list entry can be selected as filter option.
     * @param {boolean} [value=false] if a list entry is selectable as filter option
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */
    this.isSelectableFilterOption = function (value) {
      this.description.isSelectableFilterOption = value === true;
      return this;
    };
    /**
     * Finishes the build of the description and returns its final (meant to be immutable) object.
     * @returns {module:searchmenu.SearchViewDescription}
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

  return SearchViewDescription;
})();

//TODO could a separate value object be defined and mapped to get some decoupling to data-reconstructor-js?
/**
 * @typedef {Object} module:searchmenu.SearchUiData 
 * @property {String} [category=""] name of the category. Default = "". Could contain a short domain name. (e.g. "city")
 * @property {String} fieldName field name that will be used e.g. as a search parameter name for filter options.
 * @property {String} [displayName=""] readable display name for e.g. the list of results.
 * @property {String} [abbreviation=""] one optional character, a symbol character or a short abbreviation of the category
 * @property {String} value value of the field
 * @property {module:searchmenu.SearchUiData[]} details if there are further details that will be displayed e.g. on mouse over
 * @property {module:searchmenu.SearchUiData[]} options contains filter options that can be selected as search parameters 
 * @property {module:searchmenu.SearchUiData[]} default array with one element representing the default filter option (selected automatically)
 * @property {module:searchmenu.SearchUiData[]} summaries fields that are used to display the main search entry/result
 */

/**
 * @callback module:searchmenu.ResolveTemplateFunction replaces variables with object properties.
 * @param {String} template may contain variables in double curly brackets. T
 * Typically supported variables would be: {{category}} {{fieldName}}, {{displayName}}, {{abbreviation}}, {{value}}
 * @return {String} string with resolved/replaced variables
 */

/**
 * @callback module:searchmenu.FieldsJson returns the fields as JSON
 * @return {String} JSON of all contained fields
 */

/**
 * This function will be called, when search results are available.
 * @callback SearchServiceResultAvailable
 * @param {Object} searchResultData already parsed data object containing the result of the search
 */

/**
 * This function will be called to trigger search (calling the search backend).
 * @callback module:searchmenu.SearchService
 * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
 * @param {module:searchmenu.SearchServiceResultAvailable} onSearchResultsAvailable will be called when search results are available.
 */

/**
 * This function converts the data from search backend to the structure needed by the search UI.
 * @callback module:searchmenu.DataConverter
 * @param {Object} searchData
 * @returns {module:searchmenu.SearchUiData} converted and structured data for search UI
 */

/**
 * This function adds predefined search parameters before search is triggered, e.g. constants, environment parameters, ...
 * @callback module:searchmenu.SearchParameterAdder
 * @param {Object} searchParametersObject
 */

/**
 * This function will be called when a new HTML is created.
 * @callback module:searchmenu.ElementCreatedListener
 * @param {Element} newlyCreatedElement
 * @param {boolean} isParent true, if it is the created parent. false, if it is a child within the created parent. 
 */

/**
 * This function will be called to navigate to a selected search result url.
 * @callback module:searchmenu.NavigateToFunction
 * @param {String} destinationUrl
 */

/**
 * @typedef {Object} module:searchmenu.SearchMenuConfig
 * @property {module:searchmenu.SearchService} triggerSearch triggers search (backend)
 * @property {module:searchmenu.DataConverter} convertData converts search result data to search ui data
 * @property {module:searchmenu.searchParameterAdder} addPredefinedParametersTo adds custom search parameters 
 * @property {module:searchmenu.ElementCreatedListener} onCreatedElement this function will be called when a new HTML is created.
 * @property {module:searchmenu.NavigateToFunction} navigateTo this function will be called to navigate to a selected search result url.
 * @property {string} searchAreaElementId id of the whole search area (default="searcharea")
 * @property {string} inputElementId id of the search input field (default="searchinputtext")
 * @property {module:searchmenu.SearchViewDescription} resultsView describes the main view containing the search results
 * @property {module:searchmenu.SearchViewDescription} detailView describes the details view
 * @property {module:searchmenu.SearchViewDescription} filterOptionsView describes the filter options view
 * @property {module:searchmenu.SearchViewDescription} filtersView describes the filters view
 * @property {string} [waitBeforeClose=700] timeout in milliseconds when search is closed after blur (loss of focus) (default=700)
 * @property {string} [waitBeforeSearch=500] time in milliseconds to wait until typing is finished and search starts (default=500)
 * @property {string} [waitBeforeMouseOver=700] time in milliseconds to wait until mouse over opens details (default=700)
 */

searchmenu.SearchMenuAPI = (function () {
  "use strict";
  /**
   * Search Menu UI API
   * @constructs SearchMenuAPI
   * @alias module:searchmenu.SearchMenuAPI
   */
  function SearchMenuApiBuilder() {
    this.config = {
      triggerSearch: function (/* searchParameters, onSearchResultsAvailable */) {
        throw new Error("search service needs to be defined.");
      },
      convertData: function (/* sourceData */) {
        throw new Error("data converter needs to be defined.");
      },
      addPredefinedParametersTo: function (/* object */) {
        //does nothing if not specified otherwise
      },
      onCreatedElement: function (/* element, isParent */) {
        //does nothing if not specified otherwise
      },
      navigateTo: function (destinationUrl) {
        window.location.href = destinationUrl;
      },
      createdElementListeners: [],
      searchAreaElementId: "searcharea",
      inputElementId: "searchinputtext",
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
     * @param {module:searchmenu.SearchService} service function that will be called to trigger search (backend).
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.searchService = function (service) {
      this.config.triggerSearch = service;
      return this;
    };
    /**
     * Defines the converter, that converts search result data to search ui data
     * @param {module:searchmenu.DataConverter} converter function that will be called to trigger search (backend).
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.dataConverter = function (converter) {
      this.config.convertData = converter;
      return this;
    };
    /**
     * Defines the function, that adds predefined (fixed, constant, environmental) search parameters
     * to the first parameter object.
     * @param {module:searchmenu.SearchParameterAdder} adder function that will be called to before search is triggered.
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.addPredefinedParametersTo = function (adder) {
      this.config.addPredefinedParametersTo = adder;
      return this;
    };
    /**
     * Sets the listener, that will be called, when a new HTML element was created.
     * @param {module:searchmenu.ElementCreatedListener} listener
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.setElementCreatedHandler = function (listener) {
      this.config.onCreatedElement = listener;
      return this;
    };
    /**
     * Adds another listener, that will be called, when a new HTML element was created.
     * @param {module:searchmenu.ElementCreatedListener} listener
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.addElementCreatedHandler = function (listener) {
      this.config.createdElementListeners.push(listener);
      return this;
    };
    
    /**
     * Adds the given style class when an element receives focus.
     * This is done for every element that is created dynamically (e.g. search results and filters).
     * It is only meant to be used for browsers like old IE5 ones that doesn't support focus pseudo style class. 
     * 
     * @param {String} [focusStyleClassName="focus"]
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.addFocusStyleClassOnEveryCreatedElement = function (focusStyleClassName) {
      var className = withDefault(focusStyleClassName, "focus");
      this.addElementCreatedHandler(function (element, isParent) {
        if (!isParent) {
          return;
        }
        addEvent("focus", element, function (event) {
          addClass(className, getEventTarget(event));
        });
        addEvent("blur", element, function (event) {
          removeClass(className, getEventTarget(event));
        });
      });
      return this;
    };
    /**
     * Sets the element ID of the parent, that represents the whole search menu component.
     * @param {String} [id="searcharea"] id of the parent element, that represents the whole search menu component. 
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.searchAreaElementId = function (id) {
      this.config.searchAreaElementId = withDefault(id, "searcharea");
      return this;
    };
    /**
     * Sets the input search text element ID,. 
     * @param {String} [id="searchinputtext"] id of the input element, that contains the search text. 
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.inputElementId = function (id) {
      this.config.inputElementId = withDefault(id, "searchinputtext");
      return this;
    };
    /**
     * Sets the name of the backend search service parameter, that contains the input search text.
     * @param {String} [value="searchtext"] name of the parameter, that contains the input search text and that can be used as a variable inside the url or body template for the backend service
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.searchTextParameterName = function (value) {
      this.config.searchTextParameterName = withDefault(value, "searchtext");
      return this;
    };
    /**
     * Sets the view, that is used to display all search results.
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays all search results
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.resultsView = function (view) {
      this.config.resultsView = view;
      return this;
    };
    /**
     * Sets the view, that is used to display details of a selected search result.
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays details of a selected search result
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.detailView = function (view) {
      this.config.detailView = view;
      return this;
    };
    /**
     * Sets the view, that is used to display currently selected filter options.
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays currently selected filter options
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.filterOptionsView = function (view) {
      this.config.filterOptionsView = view;
      return this;
    };
    /**
     * Sets the view, that is used to display search results, that represent filter options.
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays search results, that represent filter options
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.filtersView = function (view) {
      this.config.filtersView = view;
      return this;
    };
    /**
     * Sets the time the search menu will remain open, when it has lost focus.  
     * Prevents the menu to disappear while using it.  
     * @param {number} [ms=700] time in milliseconds the search menu will remain open until it is closed after loosing focus.
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.waitBeforeClose = function (ms) {
      this.config.waitBeforeClose = ms;
      return this;
    };
    /**
     * Sets the time to wait before the search service is called.    
     * Prevents calls to the search backend while changing the search input.  
     * @param {number} [ms=500] time in milliseconds to wait before the search service is called
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.waitBeforeSearch = function (ms) {
      this.config.waitBeforeSearch = ms;
      return this;
    };
    /**
     * Sets the time to  wait before search result details are opened on mouse over.  
     * Doesn't affect keyboard selection, which will immediately open the search details.  
     * Prevents details to open on search results, that are only touched by the mouse pointer for a short period of time.
     * @param {number} [ms=700] time in milliseconds to wait before search result details are opened on mouse over.
     * @returns module:searchmenu.SearchMenuApiBuilder
     */
    this.waitBeforeMouseOver = function (ms) {
      this.config.waitBeforeMouseOver = ms;
      return this;
    };
    /**
     * Finishes the configuration and creates the {@link module:searchmenu.SearchMenuUI}.
     * @returns module:searchmenu.SearchMenuUI
     */
    this.start = function () {
      var config = this.config;
      if (config.createdElementListeners.length > 0) {
        this.setElementCreatedHandler(function (element, isParent) {
          var index = 0;
          for (index = 0; index < config.createdElementListeners.length; index += 1) {
            config.createdElementListeners[index](element, isParent);
          }
        });
      }
      return new searchmenu.SearchMenuUI(config);
    };
  }

  /**
   * Contains the default settings for the results view.
   * @returns {module:searchmenu.SearchViewDescription} default settings for the results view
   * @protected
   */
  function defaultResultsView() {
    return new searchmenu.SearchViewDescriptionBuilder()
      .viewElementId("searchresults")
      .listParentElementId("searchmatches")
      .listEntryElementIdPrefix("result")
      .listEntryTextTemplate("{{abbreviation}} {{displayName}}") //TODO could display second line smaller
      .listEntrySummaryTemplate(
        "{{summaries[0].abbreviation}} <b>{{summaries[1].value}}</b><br>{{summaries[2].value}}: {{summaries[0].value}}"
      )
      .build();
  }

  /**
   * Contains the default settings for the details view.
   * @returns {module:searchmenu.SearchViewDescription} default settings for the details view
   * @protected
   */
  function defaultDetailView() {
    return new searchmenu.SearchViewDescriptionBuilder()
      .viewElementId("searchdetails")
      .listParentElementId("searchdetailentries")
      .listEntryElementIdPrefix("detail")
      .listEntryTextTemplate("<b>{{displayName}}:</b> {{value}}") //TODO could display value smaller
      .build();
  }

  /**
   * Contains the default settings for the filter options view.
   * @returns {module:searchmenu.SearchViewDescription} default settings for the filter options view
   * @protected
   */
  function defaultFilterOptionsView() {
    return new searchmenu.SearchViewDescriptionBuilder()
      .viewElementId("searchfilteroptions")
      .listParentElementId("searchfilteroptionentries")
      .listEntryElementIdPrefix("filter")
      .listEntryTextTemplate("{{value}}")
      .listEntrySummaryTemplate("{{summaries[0].value}}")
      .isSelectableFilterOption(true)
      .build();
  }

  /**
   * Contains the default settings for the filters view.
   * @returns {module:searchmenu.SearchViewDescription} default settings for the filters view
   * @protected
   */
  function defaultFiltersView() {
    return new searchmenu.SearchViewDescriptionBuilder()
      .viewElementId("searchresults")
      .listParentElementId("searchfilters")
      .listEntryElementIdPrefix("filter")
      .isSelectableFilterOption(true)
      .build();
  }

  function addEvent(eventName, element, eventHandler) {
    eventlistener.addEventListener(eventName, element, eventHandler);
  }

   function getEventTarget(event) {
    return eventtarget.getEventTarget(event);
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

  function withDefault(value, defaultValue) {
    return isSpecifiedString(value) ? value : defaultValue;
  }

  function isSpecifiedString(value) {
    return typeof value === "string" && value != null && value != "";
  }

  return SearchMenuApiBuilder;
}());

searchmenu.SearchMenuUI = (function () {
  "use strict";

  /**
   * Search Menu UI.
   *
   * Contains the "behavior" of the search bar. It submits the search query,
   * parses the results, displays matches and filters and responds to
   * clicks and key presses.
   * 
   * @constructs SearchMenuUI
   * @alias module:searchmenu.SearchMenuUI
   */
  var instance = function (config) {
    /**
     * Configuration.
     * @type {module:searchmenu.SearchMenuConfig}
     * @protected 
     */
    this.config = config;
    /**
     * Search text that correspondents to the currently shown results.
     * @type {String}
     * @protected 
     */
    this.currentSearchText = "";
    /**
     * Timer that is used to wait before the menu is closed.
     * @type {Timer}
     * @protected 
     */
    this.focusOutTimer = null;
    /**
     * Timer that is used to wait before the search service is called.
     * @type {Timer}
     * @protected 
     */
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
    addEvent("focusin", searchareaElement, function () {
      var searchInputElement = document.getElementById(config.inputElementId);
      if (searchInputElement.value !== "") {
        if (this.focusOutTimer != null) {
          clearTimeout(this.focusOutTimer);
        }
        //TODO should only show results if there are some
        show(config.resultsView.viewElementId);
      }
    });
    addEvent("focusout", searchareaElement, function () {
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
    for (index = 0; index < jsonResults.length; index += 1) {
      addResult(jsonResults[index], index + 1, config);
    }
  }

  function addResult(entry, i, config) {
    var listElementId = config.resultsView.listEntryElementIdPrefix + "--" + i;
    var resultElement = createListEntryElement(entry, config.resultsView, listElementId);
    forEachIdElementIncludingChildren(resultElement, config.onCreatedElement);

    if (isMenuEntryWithFurtherDetails(entry)) {
      onMenuEntrySelected(resultElement, handleEventWithEntriesAndConfig(entry.details, config, selectSearchResultToDisplayDetails));
      onMouseOverDelayed(
        resultElement,
        config.waitBeforeMouseOver,
        handleEventWithEntriesAndConfig(entry.details, config, selectSearchResultToDisplayDetails)
      );
      onMenuEntryChosen(resultElement, function () {
        var selectedUrlTemplate = getSelectedUrlTemplate(config.filtersView.listParentElementId, entry.category);
        if (selectedUrlTemplate) {
          config.navigateTo(new template_resolver.Resolver(entry).resolveTemplate(selectedUrlTemplate));
        }
      });
    }
    if (isMenuEntryWithOptions(entry)) {
      var options = entry.options;
      //TODO could skip sub menu, if there is only one option (with/without being default).
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
   * @param {SearchMenuConfig} config search configuration
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
    //TODO should also be possible with the mouse without using keys
  }

  /**
   * @param {SearchMenuConfig} config search configuration
   * @param {EventListener} eventHandler event handler
   */
  function handleEventWithConfig(config, eventHandler) {
    return function (event) {
      eventHandler(event, config);
    };
  }

  /**
   * @param {Object[]} entries raw data of the entry
   * @param {SearchMenuConfig} config search configuration
   * @param {EventListener} eventHandler event handler
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
   * @property {id} id Original ID
   * @property {string} type Type of the list element
   * @property {number} index Index of the list element
   * @property {string} previousId ID of the previous list element
   * @property {string} nextId ID of the next list element
   * @property {string} firstId ID of the first list element
   * @property {string} lastId ID of the last list element
   * @property {SubMenuId} subMenuId  Returns the ID of the first sub menu entry (with the given type name as parameter)
   * @property {string} mainMenuId ID of the main menu entry e.g. to leave the sub menu. Equals to the id, if it already is a main menu entry
   * @property {boolean} hiddenFieldsId ID of the embedded hidden field, that contains all public information of the described entry as JSON.
   * @property {boolean} hiddenFields Parses the JSON inside the "hiddenFieldsId"-Element and returns the object with the described entry.
   * @property {boolean} isFirstElement true, if it is the first element in the list
   * @property {boolean} isSubMenu true, if it is the ID of an sub menu entry
   */
  /**
   * Extracts properties like type and index
   * from the given list element id string.
   *
   * @param {string} id
   * @return {ListElementIdProperties} list element id properties
   */
  function extractListElementIdProperties(id) {
    var separator = "--";
    var splittedId = id.split(separator);
    if (splittedId.length < 2) {
      console.log("expected at least one '" + separator + "' separator inside the id " + id);
    }
    var extractedMainMenuType = splittedId[0];
    var extractedMainMenuIndex = parseInt(splittedId[1]);
    var extractedType = splittedId[splittedId.length - 2];
    var extractedIndex = parseInt(splittedId[splittedId.length - 1]);
    var idWithoutIndex = id.substring(0, id.lastIndexOf(extractedIndex) - separator.length);
    return {
      id: id,
      type: extractedType,
      index: extractedIndex,
      previousId: idWithoutIndex + separator + (extractedIndex - 1),
      nextId: idWithoutIndex + separator + (extractedIndex + 1),
      firstId: idWithoutIndex + separator + "1",
      lastId: idWithoutIndex + separator + document.getElementById(id).parentElement.childNodes.length,
      mainMenuId: extractedMainMenuType + separator + extractedMainMenuIndex,
      mainMenuIndex: extractedMainMenuIndex,
      hiddenFieldsId: id + separator + "fields",
      isFirstElement: extractedIndex <= 1,
      isSubMenu: splittedId.length > 3,
      subMenuId: function (typeName) {
        return id + separator + typeName + separator + "1";
      },
      replaceMainMenuIndex: function (newIndex) {
        var newMainMenuIndex = extractedMainMenuType + separator + newIndex;
        return newMainMenuIndex + id.substring(this.mainMenuId.length);
      },
      getNewIndexAfterRemovedMainMenuIndex: function (removedIndex) {
        if (extractedMainMenuIndex < removedIndex) {
          return id;
        }
        if (extractedMainMenuIndex == removedIndex) {
          throw new Error("index " + removedIndex + " should had been removed.");
        }
        return this.replaceMainMenuIndex(extractedMainMenuIndex - 1);
      },
      hiddenFields: function () {
        var hiddenFieldsElement = document.getElementById(id + separator + "fields");
        var hiddenFieldsJson =
          typeof hiddenFieldsElement.textContent !== "undefined" ? hiddenFieldsElement.textContent : hiddenFieldsElement.innerText;
        return JSON.parse(hiddenFieldsJson);
      }
    };
  }

  function focusSearchInput(event, config) {
    var resultEntry = getEventTarget(event);
    var inputElement = document.getElementById(config.inputElementId);
    resultEntry.blur();
    inputElement.focus();
    selectionrange.moveCursorToEndOf(inputElement);
    preventDefaultEventHandling(event); //skips cursor position change on key up once
    hideSubMenus(config);
    return inputElement;
  }

  function focusFirstResult(event, config) {
    var selectedElement = getEventTarget(event);
    var firstResult = document.getElementById(config.resultsView.listEntryElementIdPrefix + "--1");
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
        //TODO could find a better way (without config) to navigate from last search result to first options/filter entry
        next = document.getElementById(config.filterOptionsView.listEntryElementIdPrefix + "--1");
      }
      if (next === null) {
        //select first result/match entry after last filter entry (or whenever nothing is found)
        next = document.getElementById(config.resultsView.listEntryElementIdPrefix + "--1");
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
        //TODO could find a better way (without config) to navigate from first options/filter entry to last search result?
        var resultElementsCount = getListElementCountOfType(config.resultsView.listEntryElementIdPrefix);
        previous = document.getElementById(config.resultsView.listEntryElementIdPrefix + "--" + resultElementsCount);
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
    var selectedEntryData = findSelectedEntry(selectedEntry.id, entries, equalProperties(["fieldName", "value"]));
    createFilterOption(selectedEntryData, entries, config.filtersView, config);
    preventDefaultEventHandling(event);
    returnToMainMenu(event);
  }

  function createFilterOption(selectedEntryData, entries, view, config) {
    var filterElements = getListElementCountOfType(view.listEntryElementIdPrefix);
    var filterElementId = view.listEntryElementIdPrefix + "--" + (filterElements + 1);
    var filterElement = getListEntryByFieldName(selectedEntryData.category, selectedEntryData.fieldName, view.listParentElementId);
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
      //TODO could additionally match empty ("global") category
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
      //TODO could also match empty ("global") category.
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
    var subMenuEntryId = selectedElement.id + "--" + subMenuView.listEntryElementIdPrefix;
    var subMenuFirstEntry = null;
    for (subMenuIndex = 0; subMenuIndex < entries.length; subMenuIndex += 1) {
      subMenuEntry = entries[subMenuIndex];
      subMenuEntryId = selectedElement.id + "--" + subMenuView.listEntryElementIdPrefix + "--" + (subMenuIndex + 1);
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

    // Fastest way to delete child nodes in Chrome and FireFox according to
    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    if (typeof node.cloneNode === "function" && typeof node.replaceChild === "function") {
      var cNode = node.cloneNode(false);
      node.parentNode.replaceChild(cNode, node);
    } else {
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
    var element = getEventTarget(event);
    var parentElement = element.parentElement;
    var indexOfRemovedElement = extractListElementIdProperties(element.id).mainMenuIndex;
    parentElement.removeChild(element);
    forEachChildRecursively(parentElement, 0, 5, function (entry) {
      if (entry.id) {
        entry.id = extractListElementIdProperties(entry.id).getNewIndexAfterRemovedMainMenuIndex(indexOfRemovedElement);
      }
    });
  }

  function forEachChildRecursively(element, depth, maxDepth, callback) {
    if (depth > maxDepth || !element.childNodes) {
      return;
    }
    forEachEntryIn(element.childNodes, function (entry) {
      callback(entry);
      forEachChildRecursively(entry, depth + 1, maxDepth, callback);
    });
  }

  /**
   * This function will be called for every found element
   * @callback ElementFoundListener
   * @param {Element} foundElement
   * @param {boolean} isParent true, if it is the created parent. false, if it is a child within the created parent.
   */

  /**
   * The given callback will be called for the given parent and all its direct child nodes, that contain an id property.
   * @param {Element} element parent to be inspected
   * @param {ElementFoundListener} callback will be called for every found child and the given parent itself
   */
  function forEachIdElementIncludingChildren(element, callback) {
    if (element.id) {
      callback(element, true);
    }
    forEachEntryIn(element.childNodes, function (element) {
      if (element.id) {
        callback(element, false);
      }
    });
  }

  function forEachEntryIn(array, callback) {
    var index = 0;
    for (index = 0; index < array.length; index += 1) {
      callback(array[index], index + 1); //index parameter starts with 1 (1 instead of 0 based)
    }
  }

  /**
   * @return {number} list element count of the given type
   */
  function getListElementCountOfType(listelementtype) {
    var firstListEntry = document.getElementById(listelementtype + "--1");
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
    var listElement = createListElement(text, id, view.listEntryElementTag);
    addClass(resolveStyleClasses(entry, view), listElement);
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
    //TODO could support template inside html e.g. referenced by id (with convention over code)
    //TODO should limit length of resolved variables
    var resolver = new template_resolver.Resolver(entry);
    var text = resolver.resolveTemplate(view.listEntryTextTemplate);
    if (typeof entry.summaries !== "undefined") {
      text = resolver.resolveTemplate(view.listEntrySummaryTemplate);
    }
    var json = JSON.stringify(entry); //needs to be without spaces
    text += '<p id="' + id + '--fields" style="display: none">' + json + "</p>";
    return text;
  }

  function resolveStyleClasses(entry, view) {
    var entryResolver = new template_resolver.Resolver(entry);
    var viewResolver = new template_resolver.Resolver({ view: view });
    var resolvedClasses = entryResolver.resolveTemplate(view.listEntryStyleClassTemplate);
    resolvedClasses = viewResolver.resolveTemplate(resolvedClasses);
    return resolvedClasses;
  }

  /**
   * Creates a new list element to be used for search results.
   *
   * @param {string} text inside the list element
   * @param {number} id id of the list element
   * @param {string} elementTag tag (e.g. "li") for the element
   */
  function createListElement(text, id, elementTag) {
    var element = document.createElement(elementTag);
    element.id = id;
    element.tabIndex = "0";
    element.innerHTML = text;
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
   * @param elementId ID of the element that should be shown
   */
  function show(elementId) {
    showElement(document.getElementById(elementId));
  }

  /**
   * Shows the given element.
   * @param element element that should be shown
   */
  function showElement(element) {
    addClass("show", element);
  }

  /**
   * Hides the element given by its id.
   * @param elementId ID of the element that should be hidden
   */
  function hide(elementId) {
    hideElement(document.getElementById(elementId));
  }

  /**
   * Hides the view (by removing the class "show"), that contains the given element.
   * The view is identified by the existing style class "show".
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
   * Hides the given element.
   * @param element element that should be hidden
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
        eventHandler(typeof this.originalEvent !== "undefined" ? this.originalEvent : event);
      }, delayTime);
      this.preventEventHandling = function () {
        if (this.delayedHandlerTimer !== null) {
          clearTimeout(this.delayedHandlerTimer);
        }
      };
      addEvent("mouseout", element, this.preventEventHandling);
      addEvent("mousedown", element, this.preventEventHandling);
      addEvent("keydown", element, this.preventEventHandling);
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
    eventlistener.addEventListener(eventName, element, eventHandler);
  }

  /**
   * @returns {Element} target of the event
   */
  function getEventTarget(event) {
    return eventtarget.getEventTarget(event);
  }

  /**
   * Returns the key code of the event or -1 if it is no available.
   * @param {KeyboardEvent} event
   * @return key code or -1 if not available
   */
  function keyCodeOf(event) {
    return typeof event.keyCode === "undefined" ? -1 : event.keyCode;
  }

  // Returns the instance
  return instance;
})();