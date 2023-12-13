var e=globalThis,t={},n={},i=e.parcelRequire6f19;null==i&&((i=function(e){if(e in t)return t[e].exports;if(e in n){var i=n[e];delete n[e];var r={id:e,exports:{}};return t[e]=r,i.call(r.exports,r,r.exports),r.exports}var l=Error("Cannot find module '"+e+"'");throw l.code="MODULE_NOT_FOUND",l}).register=function(e,t){n[e]=t},e.parcelRequire6f19=i);var r=i.register;r("6Zl5q",function(e,t){/**
 * @returns {Element} target of the event
 * @memberof eventtarget
 */(($5168cbe7a8f000bf$var$module||{}).exports={}).getEventTarget=function(e){if(void 0!==e.currentTarget&&null!=e.currentTarget)return e.currentTarget;if(void 0!==e.srcElement&&null!=e.srcElement)return e.srcElement;throw Error("Event doesn't contain bounded element: "+e)}}),r("e8zLT",function(e,t){(($a4ad8f7f94ee3163$var$module||{}).exports={}).moveCursorToEndOf=function(e){if("function"==typeof e.setSelectionRange)e.setSelectionRange(e.value.length,e.value.length);else if("number"==typeof e.selectionStart&&"number"==typeof e.selectionEnd)e.selectionStart=e.selectionEnd=e.value.length;else if("function"==typeof e.createTextRange){var t=e.createTextRange();t.collapse(!0),t.moveEnd("character",e.value.length),t.moveStart("character",e.value.length),t.select()}}}),r("lTEEA",function(e,t){/**
 * Adds an event listener/hander using "addEventListener" or whatever method the browser supports.
 * @param {String} eventName
 * @param {Element} element
 * @param {*} eventHandler
 * @memberof addeventlistener
 */(($ff0e44fa82d1ec2e$var$module||{}).exports={}).addEventListener=function(e,t,n){t.addEventListener?t.addEventListener(e,n,!1):t.attachEvent?t.attachEvent("on"+e,n):t["on"+e]=n}});/**
 * @file Search UI written in vanilla JavaScript. Menu structure for results. Filters are integrated as search results.
 * @version {@link https://github.com/JohT/search-menu-ui/releases/latest latest version}
 * @author JohT
 */var l=o(l);// Fallback for vanilla js without modules
function o(e){return e||{}}/**
 * Contains the main ui component of the search menu ui.
 * @module searchmenu
 */var s=l.exports={};// Export module for npm...
s.internalCreateIfNotExists=o;var u=u||i("6Zl5q"),a=a||i("e8zLT"),c=c||i("lTEEA");// supports vanilla js & npm
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
 */s.SearchViewDescriptionBuilder=function(){function e(e){return"string"==typeof e&&null!=e&&""!=e}return(/**
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
   */function(t){var n="{{displayName}}: {{value}}",i="{{summaries[0].displayName}}: {{summaries[0].value}}",r="{{view.listEntryElementIdPrefix}} {{category}}";/**
     * @type {module:searchmenu.SearchViewDescription}
     * @protected
     */this.description={viewElementId:t?t.viewElementId:"",listParentElementId:t?t.listParentElementId:"",listEntryElementIdPrefix:t?t.listEntryElementIdPrefix:"",listEntryElementTag:t?t.listEntryElementTag:"li",listEntryTextTemplate:t?t.listEntryTextTemplate:n,listEntrySummaryTemplate:t?t.listEntrySummaryTemplate:i,listEntryStyleClassTemplate:t?t.listEntryStyleClassTemplate:r,isSelectableFilterOption:!!t&&t.isSelectableFilterOption},/**
     * ID of the element (e.g. "div"), that contains the view with all list elements and their parent.
     *
     * @param {string} value view element ID.
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */this.viewElementId=function(t){return this.description.viewElementId=e(t)?t:"",this},/**
     * ID of the element (e.g. "ul"), that contains all list entries and is located inside the view.
     * @param {string} value parent element ID
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */this.listParentElementId=function(t){return this.description.listParentElementId=e(t)?t:"",this},/**
     * ID prefix (followed by "--" and the index number) for every list entry.
     * @param {string} value ID prefix for every list entry element
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */this.listEntryElementIdPrefix=function(t){return(//TODO could be checked to not contain the index separation chars "--"
this.description.listEntryElementIdPrefix=e(t)?t:"",this)},/**
     * Element tag for list entries.
     * @param {string} [value="li"] tag for every list entry element
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */this.listEntryElementTag=function(t){return this.description.listEntryElementTag=e(t)?t:"li",this},/**
     * Template for the text of each list entry.
     * May contain variables in double curly brackets.
     *
     * @param {string} [value="{{displayName}}: {{value}}"] list entry text template when there is no summary data group
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */this.listEntryTextTemplate=function(t){return this.description.listEntryTextTemplate=e(t)?t:n,this},/**
     * Template for the text of each list entry, if the data group "summary" exists.
     * May contain variables in double curly brackets.
     *
     * @param {string} [value="{{summaries[0].displayName}}: {{summaries[0].value}}"] list entry text template when there is a summary data group
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */this.listEntrySummaryTemplate=function(t){return this.description.listEntrySummaryTemplate=e(t)?t:i,this},/**
     * Template for the style classes of each list entry.
     * May contain variables in double curly brackets.
     * To use the property values of this view, prefix them with "view", e.g.: "{{view.listEntryElementIdPrefix}}".
     *
     * @param {string} [value="{{view.listEntryElementIdPrefix}} {{category}}"] list entry style classes template
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */this.listEntryStyleClassTemplate=function(t){return this.description.listEntryStyleClassTemplate=e(t)?t:r,this},/**
     * Specifies, if the list entry can be selected as filter option.
     * @param {boolean} [value=false] if a list entry is selectable as filter option
     * @returns {module:searchmenu.SearchViewDescriptionBuilder}
     */this.isSelectableFilterOption=function(e){return this.description.isSelectableFilterOption=!0===e,this},/**
     * Finishes the build of the description and returns its final (meant to be immutable) object.
     * @returns {module:searchmenu.SearchViewDescription}
     */this.build=function(){return this.description}})}(),//TODO could provide the currently only described SearchUiData as own data structure in its own module.
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
 * @property {module:searchmenu.SearchUiData[]} urltemplate contains a single field with the value of the url template. Marks the entry as navigation target.
 *//**
 * @callback module:searchmenu.ResolveTemplateFunction replaces variables with object properties.
 * @param {String} template may contain variables in double curly brackets. T
 * Typically supported variables would be: {{category}} {{fieldName}}, {{displayName}}, {{abbreviation}}, {{value}}
 * @return {String} string with resolved/replaced variables
 *//**
 * @callback module:searchmenu.FieldsJson returns the fields as JSON
 * @return {String} JSON of all contained fields
 *//**
 * This function will be called, when search results are available.
 * @callback SearchServiceResultAvailable
 * @param {Object} searchResultData already parsed data object containing the result of the search
 *//**
 * This function will be called to trigger search (calling the search backend).
 * @callback module:searchmenu.SearchService
 * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
 * @param {module:searchmenu.SearchServiceResultAvailable} onSearchResultsAvailable will be called when search results are available.
 *//**
 * This function converts the data from search backend to the structure needed by the search UI.
 * @callback module:searchmenu.DataConverter
 * @param {Object} searchData
 * @returns {module:searchmenu.SearchUiData} converted and structured data for search UI
 *//**
 * This function replaces variables in double curly brackets with the property values of the given object.
 * @callback module:searchmenu.TemplateResolver
 * @param {String} templateToResolve may contain variables in double curly brackets e.g. like `"{{searchtext}}"`.
 * @param {Object} sourceObject the fields of this object are used to replace the variables in the template
 * @returns {module:searchmenu.SearchUiData} converted and structured data for search UI
 *//**
 * This function adds predefined search parameters before search is triggered, e.g. constants, environment parameters, ...
 * @callback module:searchmenu.SearchParameterAdder
 * @param {Object} searchParametersObject
 *//**
 * This function will be called when a new HTML is created.
 * @callback module:searchmenu.ElementCreatedListener
 * @param {Element} newlyCreatedElement
 * @param {boolean} isParent true, if it is the created parent. false, if it is a child within the created parent. 
 *//**
 * This function will be called to navigate to a selected search result url.
 * @callback module:searchmenu.NavigateToFunction
 * @param {String} destinationUrl
 *//**
 * @typedef {Object} module:searchmenu.SearchMenuConfig
 * @property {module:searchmenu.SearchService} triggerSearch triggers search (backend)
 * @property {module:searchmenu.DataConverter} convertData converts search result data to search ui data. Lets data through unchanged by default.
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
 */s.SearchMenuAPI=function(){function e(e,t,n){c.addEventListener(e,t,n)}function t(e){return u.getEventTarget(e)}function n(e,t){var n=RegExp("\\s?\\b"+e+"\\b","gi");t.className=t.className.replace(n,"")}function i(e){return"string"==typeof e&&null!=e&&""!=e}return(/**
   * Search Menu UI API
   * @constructs SearchMenuAPI
   * @alias module:searchmenu.SearchMenuAPI
   */function(){this.config={triggerSearch:function(){throw Error("search service needs to be defined.")},convertData:function(e){return e},resolveTemplate:function(){throw Error("template resolver needs to be defined.")},addPredefinedParametersTo:function(){//does nothing if not specified otherwise
},onCreatedElement:function(){//does nothing if not specified otherwise
},navigateTo:function(e){window.location.href=e},createdElementListeners:[],searchAreaElementId:"searcharea",inputElementId:"searchinputtext",searchTextParameterName:"searchtext",resultsView:new s.SearchViewDescriptionBuilder().viewElementId("searchresults").listParentElementId("searchmatches").listEntryElementIdPrefix("result").listEntryTextTemplate("{{abbreviation}} {{displayName}}").listEntrySummaryTemplate("{{summaries[0].abbreviation}} <b>{{summaries[1].value}}</b><br>{{summaries[2].value}}: {{summaries[0].value}}").build(),detailView:new s.SearchViewDescriptionBuilder().viewElementId("searchdetails").listParentElementId("searchdetailentries").listEntryElementIdPrefix("detail").listEntryTextTemplate("<b>{{displayName}}:</b> {{value}}").build(),filterOptionsView:new s.SearchViewDescriptionBuilder().viewElementId("searchfilteroptions").listParentElementId("searchfilteroptionentries").listEntryElementIdPrefix("filter").listEntryTextTemplate("{{value}}").listEntrySummaryTemplate("{{summaries[0].value}}").isSelectableFilterOption(!0).build(),filtersView:new s.SearchViewDescriptionBuilder().viewElementId("searchresults").listParentElementId("searchfilters").listEntryElementIdPrefix("filter").isSelectableFilterOption(!0).build(),waitBeforeClose:700,waitBeforeSearch:500,waitBeforeMouseOver:700},/**
     * Defines the search service function, that will be called whenever search is triggered.
     * @param {module:searchmenu.SearchService} service function that will be called to trigger search (backend).
     * @returns module:searchmenu.SearchMenuAPI
     */this.searchService=function(e){return this.config.triggerSearch=e,this},/**
     * Defines the converter, that converts search result data to search ui data.
     * Without setting a data converter, data is taken directly from the backend service,
     * that needs to provide the results in the search menu data structure.
     * @param {module:searchmenu.DataConverter} converter function that will be called to create the search menu data structure
     * @returns module:searchmenu.SearchMenuAPI
     */this.dataConverter=function(e){return this.config.convertData=e,this},/**
     * Defines the template resolver, that replaces variables in double curly brackets with the property values of the given object.
     * @param {module:searchmenu.TemplateResolver} resolver function that will be called to resolve strings with variables.
     * @returns module:searchmenu.SearchMenuAPI
     */this.templateResolver=function(e){return this.config.resolveTemplate=e,this},/**
     * Defines the function, that adds predefined (fixed, constant, environmental) search parameters
     * to the first parameter object.
     * @param {module:searchmenu.SearchParameterAdder} adder function that will be called to before search is triggered.
     * @returns module:searchmenu.SearchMenuAPI
     */this.addPredefinedParametersTo=function(e){return this.config.addPredefinedParametersTo=e,this},/**
     * Sets the listener, that will be called, when a new HTML element was created.
     * @param {module:searchmenu.ElementCreatedListener} listener
     * @returns module:searchmenu.SearchMenuAPI
     */this.setElementCreatedHandler=function(e){return this.config.onCreatedElement=e,this},/**
     * Adds another listener, that will be called, when a new HTML element was created.
     * @param {module:searchmenu.ElementCreatedListener} listener
     * @returns module:searchmenu.SearchMenuAPI
     */this.addElementCreatedHandler=function(e){return this.config.createdElementListeners.push(e),this},/**
     * Adds the given style class when an element receives focus.
     * This is done for every element that is created dynamically (e.g. search results and filters).
     * It is only meant to be used for browsers like old IE5 ones that doesn't support focus pseudo style class.
     *
     * @param {String} [focusStyleClassName="focus"]
     * @returns module:searchmenu.SearchMenuAPI
     */this.addFocusStyleClassOnEveryCreatedElement=function(r){var l=i(r)?r:"focus";return this.addElementCreatedHandler(function(i,r){r&&(e("focus",i,function(e){var i,r;n(l,i=t(e)),r=i.className.length>0?" ":"",i.className+=r+l}),e("blur",i,function(e){n(l,t(e))}))}),this},/**
     * Sets the element ID of the parent, that represents the whole search menu component.
     * @param {String} [id="searcharea"] id of the parent element, that represents the whole search menu component.
     * @returns module:searchmenu.SearchMenuAPI
     */this.searchAreaElementId=function(e){return this.config.searchAreaElementId=i(e)?e:"searcharea",this},/**
     * Sets the input search text element ID,.
     * @param {String} [id="searchinputtext"] id of the input element, that contains the search text.
     * @returns module:searchmenu.SearchMenuAPI
     */this.inputElementId=function(e){return this.config.inputElementId=i(e)?e:"searchinputtext",this},/**
     * Sets the name of the backend search service parameter, that contains the input search text.
     * @param {String} [value="searchtext"] name of the parameter, that contains the input search text and that can be used as a variable inside the url or body template for the backend service
     * @returns module:searchmenu.SearchMenuAPI
     */this.searchTextParameterName=function(e){return this.config.searchTextParameterName=i(e)?e:"searchtext",this},/**
     * Sets the view, that is used to display all search results.  
     * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultResultsView}.
     *
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays all search results
     * @returns module:searchmenu.SearchMenuAPI
     * @see {@link module:searchmenu.SearchMenuAPI.defaultResultsView}
     */this.resultsView=function(e){return this.config.resultsView=e,this},/**
     * Sets the view, that is used to display details of a selected search result.  
     * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultDetailView}.
     *
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays details of a selected search result
     * @returns module:searchmenu.SearchMenuAPI
     * @see {@link module:searchmenu.SearchMenuAPI.defaultDetailView}
     */this.detailView=function(e){return this.config.detailView=e,this},/**
     * Sets the view, that is used to display currently selected filter options.   
     * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultFilterOptionsView}.
     *
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays currently selected filter options
     * @returns module:searchmenu.SearchMenuAPI
     * @see {@link module:searchmenu.SearchMenuAPI.defaultFilterOptionsView}
     */this.filterOptionsView=function(e){return this.config.filterOptionsView=e,this},/**
     * Sets the view, that is used to display search results, that represent filter options.   
     * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultFiltersView}.
     *
     * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays search results, that represent filter options
     * @returns module:searchmenu.SearchMenuAPI
     * @see {@link module:searchmenu.SearchMenuAPI.defaultFiltersView}
     */this.filtersView=function(e){return this.config.filtersView=e,this},/**
     * Sets the time the search menu will remain open, when it has lost focus.
     * Prevents the menu to disappear while using it.
     * @param {number} [ms=700] time in milliseconds the search menu will remain open until it is closed after loosing focus.
     * @returns module:searchmenu.SearchMenuAPI
     */this.waitBeforeClose=function(e){return this.config.waitBeforeClose=e,this},/**
     * Sets the time to wait before the search service is called.
     * Prevents calls to the search backend while changing the search input.
     * @param {number} [ms=500] time in milliseconds to wait before the search service is called
     * @returns module:searchmenu.SearchMenuAPI
     */this.waitBeforeSearch=function(e){return this.config.waitBeforeSearch=e,this},/**
     * Sets the time to  wait before search result details are opened on mouse over.
     * Doesn't affect keyboard selection, which will immediately open the search details.
     * Prevents details to open on search results, that are only touched by the mouse pointer for a short period of time.
     * @param {number} [ms=700] time in milliseconds to wait before search result details are opened on mouse over.
     * @returns module:searchmenu.SearchMenuAPI
     */this.waitBeforeMouseOver=function(e){return this.config.waitBeforeMouseOver=e,this},/**
     * Finishes the configuration and creates the {@link module:searchmenu.SearchMenuUI}.
     * @returns module:searchmenu.SearchMenuUI
     */this.start=function(){var e=this.config;return e.createdElementListeners.length>0&&this.setElementCreatedHandler(function(t,n){var i=0;for(i=0;i<e.createdElementListeners.length;i+=1)e.createdElementListeners[i](t,n)}),new s.SearchMenuUI(e)}})}(),s.SearchMenuUI=function(){function e(e){return function(t,n){var i;for(i=0;i<e.length;i+=1)if(t[e[i]]!=n[e[i]])return!1;return!0}}/**
   * Reacts to input events (keys, ...) to navigate through main menu entries.
   *
   * @param {Element} element to add event handlers
   * @param {SearchMenuConfig} config search configuration
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function t(e,t){Z(e,i(t,d)),Y(e,i(t,f)),q(e,i(t,o)),j(e,i(t,x))}function n(e,t){W("mousedown",e,t),z(e,t)}/**
   * @param {SearchMenuConfig} config search configuration
   * @param {EventListener} eventHandler event handler
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function i(e,t){return function(n){t(n,e)}}/**
   * @param {Object[]} entries raw data of the entry
   * @param {module:searchmenu.SearchMenuConfig} config search configuration
   * @param {EventListener} eventHandler event handler
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function r(e,t,n){return function(i){n(i,e,t)}}/**
   * This callback will be called, if there is not next or previous menu entry to navigate to.
   * The implementation can decide, what to do using the given id properties.
   *
   * @callback module:searchmenu.MenuEntryNotFoundHandler
   * @param {module:searchmenu.ListElementIdProperties} properties of the element id
   *//**
   * This function returns the ID for the first sub menu entry using the given type name (= name of the sub menu).
   *
   * @callback module:searchmenu.SubMenuId
   * @param {string} type name of the sub menu entries
   *//**
   * @typedef {Object} module:searchmenu.ListElementIdProperties
   * @property {id} id Original ID
   * @property {string} type Type of the list element
   * @property {number} index Index of the list element
   * @property {string} previousId ID of the previous list element
   * @property {string} nextId ID of the next list element
   * @property {string} firstId ID of the first list element
   * @property {string} lastId ID of the last list element
   * @property {module:searchmenu.SubMenuId} subMenuId  Returns the ID of the first sub menu entry (with the given type name as parameter)
   * @property {string} mainMenuId ID of the main menu entry e.g. to leave the sub menu. Equals to the id, if it already is a main menu entry
   * @property {boolean} hiddenFieldsId ID of the embedded hidden field, that contains all public information of the described entry as JSON.
   * @property {boolean} hiddenFields Parses the JSON inside the "hiddenFieldsId"-Element and returns the object with the described entry.
   * @property {boolean} isFirstElement true, if it is the first element in the list
   * @property {boolean} isSubMenu true, if it is the ID of an sub menu entry
   *//**
   * Extracts properties like type and index
   * from the given list element id string.
   *
   * @param {string} id
   * @return {module:searchmenu.ListElementIdProperties} list element id properties
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function l(e){var t=e.split("--");t.length<2&&console.log("expected at least one '--' separator inside the id "+e);var n=t[0],i=parseInt(t[1]),r=t[t.length-2],l=parseInt(t[t.length-1]),o=e.substring(0,e.lastIndexOf(l)-2);return{id:e,type:r,index:l,previousId:o+"--"+(l-1),nextId:o+"--"+(l+1),firstId:o+"--1",lastId:o+"--"+document.getElementById(e).parentElement.childNodes.length,mainMenuId:n+"--"+i,mainMenuIndex:i,hiddenFieldsId:e+"--fields",isFirstElement:l<=1,isSubMenu:t.length>3,subMenuId:function(t){return e+"--"+t+"--1"},replaceMainMenuIndex:function(t){return n+"--"+t+e.substring(this.mainMenuId.length)},getNewIndexAfterRemovedMainMenuIndex:function(t){if(i<t)return e;if(i==t)throw Error("index "+t+" should had been removed.");return this.replaceMainMenuIndex(i-1)},hiddenFields:function(){var t=document.getElementById(e+"--fields");return JSON.parse(p(t,"textContent",t.innerText))}}}function o(e,t){var n=G(e),i=document.getElementById(t.inputElementId);return n.blur(),i.focus(),a.moveCursorToEndOf(i),S(e),L(t),i}function s(e,t){var n=G(e),i=document.getElementById(t.resultsView.listEntryElementIdPrefix+"--1");i&&(n.blur(),i.focus())}function d(e,t){m(e,function(e){var n=null;return e.type===t.resultsView.listEntryElementIdPrefix&&//TODO could find a better way (without config?) to navigate from last search result to first options/filter entry
(n=document.getElementById(t.filterOptionsView.listEntryElementIdPrefix+"--1")),null===n&&(n=document.getElementById(t.resultsView.listEntryElementIdPrefix+"--1")),n}),L(t)}function f(e,t){h(e,function(n){var i=null;if(n.type===t.filterOptionsView.listEntryElementIdPrefix){//select last result entry when arrow up is pressed on first filter entry
//TODO could find a better way (without config?) to navigate from first options/filter entry to last search result?
var r=N(t.resultsView.listEntryElementIdPrefix);i=document.getElementById(t.resultsView.listEntryElementIdPrefix+"--"+r)}return null===i?o(e,t):i}),L(t)}/**
   * Selects and focusses the next menu entry.
   *
   * @param {Event} event
   * @param {module:searchmenu.MenuEntryNotFoundHandler} onMissingNext is called, if no "next" entry could be found.
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function m(e,t){var n=G(e),i=l(n.id);i.isSubMenu&&S(e);var r=document.getElementById(i.nextId);null==r&&"function"==typeof t&&(r=t(i)),null==r&&(r=document.getElementById(i.firstId)),null!=r&&(n.blur(),r.focus())}/**
   * Selects and focusses the previous menu entry.
   *
   * @param {Event} event
   * @param {module:searchmenu.MenuEntryNotFoundHandler} onMissingPrevious is called, if no "previous" entry could be found.
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function h(e,t){var n=G(e),i=l(n.id);i.isSubMenu&&S(e);var r=document.getElementById(i.previousId);null==r&&"function"==typeof t&&(r=t(i)),null==r&&(r=document.getElementById(i.lastId)),null!=r&&(n.blur(),r.focus())}/**
   * Gets called when a filter option is selected and copies it into the filter view, where all selected filters are collected.
   * @param {Event} event 
   * @param {DescribedEntry} entries 
   * @param {module:searchmenu.SearchMenuConfig} config 
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function E(t,n,r){//TODO could detect default entry if necessary and call "addDefaultFilterOptionModificationHandler" instead
(function(e,t,n){var r,l;J(e,b),l=r=i(n,P),W("keydown",e,function(e){("Del"==e.key||"Delete"==e.key||46==K(e))&&l(e)}),W("keydown",e,function(e){("Backspace"==e.key||8==K(e))&&r(e)})})(v(/**
   * Extracts the entry data that it referred by the element given by its ID out of the list of data entries.
   * @param {string} element id
   * @param {DescribedEntry[]} array of described entries
   * @param {boolean} equalMatcher takes the existing and the new entry as parameters and returns true if they are considered "equal".
   * @returns {DescribedEntry} described entry out of the given entries, that suits the element given by its id.
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function(e,t,n){var i,r,o=l(e).hiddenFields();for(i=0;i<t.length;i+=1)if(n(r=t[i],o))return r;return console.log("error: no selected entry found for id "+e+" in "+t),null}(G(t).id,n,e(["fieldName","value"])),n,r.filtersView,r),0,r),S(t),T(t)}function v(e,n,i,o){var s,u,a,c,d,f,m,h=N(i.listEntryElementIdPrefix),E=i.listEntryElementIdPrefix+"--"+(h+1),v=(s=p(e,"category",""),u=e.fieldName,a=i.listParentElementId,c=null,null!=(d=y(a,function(e){var t=l(e.id).hiddenFields();if(t.fieldName===u){var n=p(t,"category","");if(""===n)c=e;else if(n===s)return e}}))?d:c);if(null!=v){var g,I=C(e,i,v.id,o.resolveTemplate);return(g=v).innerHTML=I,v=g}var T=C(e,i,E,o.resolveTemplate);return v=O(e,i,E,T),R(k(e,i,o.resolveTemplate),v),B(v,o.onCreatedElement),W("mousedown",f=v,m=r(n,o,w)),z(f,m),_(f,m),t(v,o),v}/**
   * Returns the property value of the object or - if undefined - the default value.
   * @param {Object} object 
   * @param {String} propertyName 
   * @param {Object} defaultValue 
   * @returns the property value of the object or - if not set - the default value.
   */function p(e,t,n){return void 0===e[t]?n:e[t]}/**
   * This function is called for every html element of a given parent.
   *
   * @callback module:searchmenu.ListElementFunction
   * @param {Element} listElement name of the sub menu entries
   * @return {Object} optional result to exit the loop or null otherwise.
   *//**
   * Iterates through all child nodes of the given parent and calls the given function.
   * If the function returns a value, it will be returned directly.
   * If the function returns nothing, the iteration continues.
   * @param {String} listParentElementId 
   * @param {module:searchmenu.ListElementFunction} listEntryElementFunction 
   * @returns {Object} result of the first entry element function, that had returned one, or null.
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function y(e,t){var n,i,r=document.getElementById(e);for(n=0;n<r.childNodes.length;n+=1)if(i=t(r.childNodes[n]))return i;return null}function g(e,t,n){L(n),I(e,t,n.detailView,n),S(e)}function w(e,t,n){L(n),I(e,t,n.filterOptionsView,n)}function I(e,t,n,i){(function(e){var t=document.getElementById(e);// Fastest way to delete child nodes in Chrome and FireFox according to
// https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
if("function"==typeof t.cloneNode&&"function"==typeof t.replaceChild){var n=t.cloneNode(!1);t.parentNode.replaceChild(n,t)}else t.innerHTML=""})(n.listParentElementId);var l,o,s,u,a,c=G(e),d=null,f=null,v=0,p=c.id+"--"+n.listEntryElementIdPrefix,y=null;for(v=0;v<t.length;v+=1)d=t[v],p=c.id+"--"+n.listEntryElementIdPrefix+"--"+(v+1),a=C(d,n,p,i.resolveTemplate),f=O(d,n,p,a),R(k(d,n,i.resolveTemplate),f),B(f,i.onCreatedElement),n.isSelectableFilterOption&&(Z(o=f,m),Y(o,h),j(o,T),q(o,T),W("mousedown",s=f,u=r(t,i,E)),z(s,u),J(s,u)),0===v&&(y=f);var g=H(c,function(e){return"DIV"==e.tagName}),w=document.getElementById(n.viewElementId),I=g.offsetWidth+15,x=(void 0!==(l=c.getBoundingClientRect()).y?l.y:l.top)+(void 0!==window.pageYOffset?window.pageYOffset:"CSS1Compat"===(document.compatMode||"")?document.documentElement.scrollTop:document.body.scrollTop);w.style.left=I+"px",w.style.top=x+"px",R("show",w),n.isSelectableFilterOption&&(c.blur(),y.focus())}/**
   * Exit sub menu from event entry and return to main menu.
   * @param {InputEvent} event
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function T(e){var t,n=G(e),i=l(n.id),r=document.getElementById(i.mainMenuId);n.blur(),r.focus(),null!=(t=H(n,function(e){return U("show",e)}))&&A("show",t)}function x(e,t){L(t)}/**
   * Prevents the given event inside an event handler to get handled anywhere else.
   * Pressing the arrow key up can lead to scrolling up the view. This is not useful,
   * if the arrow key navigates the focus inside a sub menu, that is fully contained inside the current view.
   * @param {InputEvent} inputevent
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function S(e){void 0!==e.preventDefault?e.preventDefault():e.returnValue=!1}/**
   * Toggles a filter to inactive and vice versa.
   * @param {InputEvent} event
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function b(e){var t,n;S(e),U(t="inactive",n=G(e))?A(t,n):R(t,n)}function P(e,t){var n,i,r;S(e),f(e,t),i=(n=G(e)).parentElement,r=l(n.id).mainMenuIndex,i.removeChild(n),function e(t,n,i,r){!(n>i)&&t.childNodes&&V(t.childNodes,function(t){r(t),e(t,n+1,i,r)})}(i,0,5,function(e){e.id&&(e.id=l(e.id).getNewIndexAfterRemovedMainMenuIndex(r))})}/**
   * This function will be called for every found element
   * @callback module:searchmenu.ElementFoundListener
   * @param {Element} foundElement
   * @param {boolean} isParent true, if it is the created parent. false, if it is a child within the created parent.
   *//**
   * The given callback will be called for the given parent and all its direct child nodes, that contain an id property.
   * @param {Element} element parent to be inspected
   * @param {module:searchmenu.ElementFoundListener} callback will be called for every found child and the given parent itself
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function B(e,t){e.id&&t(e,!0),V(e.childNodes,function(e){e.id&&t(e,!1)})}function V(e,t){var n=0;for(n=0;n<e.length;n+=1)t(e[n],n+1);//index parameter starts with 1 (1 instead of 0 based)
}/**
   * @param {String} list element type name e.g. "li".
   * @return {number} list element count of the given type
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function N(e){var t=document.getElementById(e+"--1");return null===t?0:t.parentElement.childNodes.length}/**
   * Creates a new list entry element to be used for search results, filter options, details and filters.
   *
   * @param {DescribedEntry} entry entry data
   * @param {module:searchmenu.SearchViewDescription} view description
   * @param {number} id id of the list element
   * @param {String} text text of the list element
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function O(e,t,n,i){var r,l,o=(r=t.listEntryElementTag,(l=document.createElement(r)).id=n,l.tabIndex="0",l.innerHTML=i,l);return document.getElementById(t.listParentElementId).appendChild(o),o}/**
   * Creates the inner HTML Text for a list entry to be used for search results, filter options, details and filters.
   *
   * @param {DescribedEntry} entry entry data
   * @param {module:searchmenu.SearchViewDescription} view description
   * @param {number} id id of the list element
   * @param {module:searchmenu.TemplateResolver} resolveTemplate function that resolves variables inside a template with contents of a source object
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function C(e,t,n,i){//TODO could support template inside html e.g. referenced by id (with convention over code)
//TODO should limit length of resolved variables
var r=i(t.listEntryTextTemplate,e);return void 0!==e.summaries&&(r=i(t.listEntrySummaryTemplate,e)),r+='<p id="'+n+'--fields" style="display: none">'+JSON.stringify(e)+"</p>"}function k(e,t,n){var i=n(t.listEntryStyleClassTemplate,e);return n(i,{view:t})}function M(e){F(e.resultsView.viewElementId),F(e.detailView.viewElementId),F(e.filterOptionsView.viewElementId)}function L(e){F(e.detailView.viewElementId),F(e.filterOptionsView.viewElementId)}/**
   * Shows the element given by its id.
   * @param {Element}  elementId ID of the element that should be shown
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function D(e){var t;R("show",document.getElementById(e))}/**
   * Hides the element given by its id.
   * @param elementId ID of the element that should be hidden
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function F(e){var t;A("show",document.getElementById(e))}/**
   * @callback module:searchmenu.ElementPredicate
   * @param {Element} element
   * @returns {boolean} true, when the predicate matches the given element, false otherwise.
   *//**
   * Returns the parent of the element (or the element itself), that matches the given predicate.
   * Returns null, if no element had been found.
   *
   * @param {Element} element
   * @param {module:searchmenu.ElementPredicate} predicate
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function H(e,t){for(var n=e;null!=n;){if(t(n))return n;n=n.parentNode}return null}function R(e,t){A(e,t);var n=t.className.length>0?" ":"";t.className+=n+e}function A(e,t){var n=RegExp("\\s?\\b"+e+"\\b","gi");t.className=t.className.replace(n,"")}function U(e,t){return null!=t.className&&t.className.indexOf(e)>=0}function q(e,t){W("keydown",e,function(e){("Escape"==e.key||"Esc"==e.key||27==K(e))&&t(e)})}function z(e,t){W("keydown",e,function(e){("Enter"==e.key||13==K(e))&&t(e)})}function J(e,t){W("keydown",e,function(e){(" "==e.key||"Spacebar"==e.key||32==K(e))&&t(e)})}function Y(e,t){W("keydown",e,function(e){("ArrowUp"==e.key||"Up"==e.key||38==K(e))&&t(e)})}function Z(e,t){W("keydown",e,function(e){("ArrowDown"==e.key||"Down"==e.key||40==K(e))&&t(e)})}function _(e,t){W("keydown",e,function(e){("ArrowRight"==e.key||"Right"==e.key||39==K(e))&&t(e)})}function j(e,t){W("keydown",e,function(e){("ArrowLeft"==e.key||"Left"==e.key||37==K(e))&&t(e)})}function W(e,t,n){c.addEventListener(e,t,n)}/**
   * @returns {Element} target of the event
   */function G(e){return u.getEventTarget(e)}/**
   * Returns the key code of the event or -1 if it is no available.
   * @param {KeyboardEvent} event
   * @return key code or -1 if not available
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function K(e){return void 0===e.keyCode?-1:e.keyCode}return function(o){/**
     * Configuration.
     * @type {module:searchmenu.SearchMenuConfig}
     * @protected 
     */this.config=o,/**
     * Search text that correspondents to the currently shown results.
     * @type {String}
     * @protected 
     */this.currentSearchText="",/**
     * Timer that is used to wait before the menu is closed.
     * @type {Timer}
     * @protected 
     */this.focusOutTimer=null,/**
     * Timer that is used to wait before the search service is called.
     * @type {Timer}
     * @protected 
     */this.waitBeforeSearchTimer=null;var u=document.getElementById(o.inputElementId);q(u,function(e){G(e).value="",M(o)}),Z(u,i(o,s)),W("keyup",u,function(i){null!==this.waitBeforeSearchTimer&&clearTimeout(this.waitBeforeSearchTimer);var s=G(i).value;this.waitBeforeSearchTimer=window.setTimeout(function(){(s!==this.currentSearchText||""===this.currentSearchText)&&(function(i,o){var s,u,a;if(document.getElementById(o.resultsView.listParentElementId).innerHTML="",0===i.length){M(o);return}D(o.resultsView.viewElementId),(s=o.filtersView.listParentElementId,u={},y(s,function(e){var t=l(e.id).hiddenFields();if(void 0===t.fieldName||void 0===t.value||U("inactive",e))return null;u[t.fieldName]=t.value}),a=u)[o.searchTextParameterName]=i,o.addPredefinedParametersTo(a),//TODO could provide optional build in search text highlighting
o.triggerSearch(a,function(i){(function(i,o){var s=0;for(s=0;s<i.length;s+=1)(function(i,o,s){var u=s.resultsView.listEntryElementIdPrefix+"--"+o,a=C(i,s.resultsView,u,s.resolveTemplate),c=O(i,s.resultsView,u,a);if(R(k(i,s.resultsView,s.resolveTemplate),c),B(c,s.onCreatedElement),void 0!==i.details&&(J(c,d=r(i.details,s,g)),_(c,d),function(e,t,n){W("mouseover",e,function(i){this.originalEvent=function(e){for(var t={},n=Object.keys(e),i=0;i<n.length;i++){var r=n[i],l=e[r];t[r]=l}return t}(i),this.delayedHandlerTimer=window.setTimeout(function(){n(void 0!==this.originalEvent?this.originalEvent:i)},t),this.preventEventHandling=function(){null!==this.delayedHandlerTimer&&clearTimeout(this.delayedHandlerTimer)},W("mouseout",e,this.preventEventHandling),W("mousedown",e,this.preventEventHandling),W("keydown",e,this.preventEventHandling)})}(c,s.waitBeforeMouseOver,r(i.details,s,g)),n(c,function(){var e=/**
   * Gets the currently selected url template for navigation.
   *
   * @param {String} listParentElementId id of the parent element that child nodes will be searched
   * @param {String} category the url template needs to belong to the same category
   * @returns {String} returns the url template or null, if nothing could be found
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function(e,t){return y(e,function(e){var n=l(e.id).hiddenFields(),i=p(n,"urltemplate",[""])[0];if(""===i)return null;// entry has no url template
var r=p(n,t,"");return r!=t&&""!==r||U("inactive",e)?null:i.value// entry belongs to another category
})}(s.filtersView.listParentElementId,p(i,"category",""));if(e){//TODO should add domain, baseurl, ... as data sources for variables to use inside the template
var t=s.resolveTemplate(e,i);s.navigateTo(t)}})),void 0!==i.options){var d,f,m=i.options;void 0!==i.default&&(m=/**
   * Adds the given entry at be beginning of the given array of entries if it's missing.
   * The equalFunction determines, if the new value is missing (returns false) or not (returns true).
   * If the entry to add is null, the entries are returned directly.
   *
   * @param {Object[]} entries
   * @param {Object} entryToAdd
   * @param {boolean} equalMatcher takes the existing and the new entry as parameters and returns true if they are considered "equal".
   * @returns {Object[]}
   * @protected
   * @memberof module:searchmenu.SearchMenuUI
   */function(e,t,n){if(!t)return e;var i,r=!1;for(i=0;i<e.length;i+=1)if(n(e[i],t)){r=!0;break}if(r)return e;var l=[];for(l.push(t),i=0;i<e.length;i+=1)l.push(e[i]);return l}(i.options,i.default[0],e(["value"])),J(v(i.default[0],m,s.filtersView,s),r(m,s,w))),J(c,f=r(i.options,s,w)),_(c,f),n(c,r(i.options,s,w))}t(c,s)})(i[s],s+1,o)})(o.convertData(i),o)})}(s,o),this.currentSearchText=s)},o.waitBeforeSearch)});var a=document.getElementById(o.searchAreaElementId);W("focusin",a,function(){""!==document.getElementById(o.inputElementId).value&&(null!=this.focusOutTimer&&clearTimeout(this.focusOutTimer),//TODO should only show results if there are some
//TODO could add a "spinner" when search is running
D(o.resultsView.viewElementId))}),W("focusout",a,function(){this.focusOutTimer=window.setTimeout(function(){M(o)},o.waitBeforeClose)})}}();//# sourceMappingURL=search-menu-ui.js.map

//# sourceMappingURL=search-menu-ui.js.map
