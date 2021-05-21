(function () {
  /**
  * @file Configures the search service client, assembles all parts and attaches it to the ui (start()).
  * @version {@link https://github.com/JohT/search-menu-ui/releases/latest latest version}
  * @author JohT
  */
  var $e24d7b60828abdbaee8b1b607b83c7e3$var$httpSearchClient;
  // ASSET: ../src/js/ponyfills/xmlHttpRequestPonyfill.js
  var $aff7e289376add1e06142f35db75bdd3$exports, $aff7e289376add1e06142f35db75bdd3$var$module, $aff7e289376add1e06142f35db75bdd3$var$xmlHttpRequest, $aff7e289376add1e06142f35db75bdd3$executed = false;
  function $aff7e289376add1e06142f35db75bdd3$exec() {
    $aff7e289376add1e06142f35db75bdd3$exports = {};
    $aff7e289376add1e06142f35db75bdd3$var$module = $aff7e289376add1e06142f35db75bdd3$var$module || ({});
    $aff7e289376add1e06142f35db75bdd3$var$xmlHttpRequest = $aff7e289376add1e06142f35db75bdd3$var$module.exports = {};
    // Fallback for vanilla js without modules
    /**
    * Provide the XMLHttpRequest constructor for Internet Explorer 5.x-6.x:
    * Other browsers (including Internet Explorer 7.x-9.x) do not redefine
    * XMLHttpRequest if it already exists.
    *
    * This example is based on findings at:
    * http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
    * @returns {XMLHttpRequest}
    * @memberof xmlHttpRequest
    */
    $aff7e289376add1e06142f35db75bdd3$var$xmlHttpRequest.getXMLHttpRequest = function () {
      if (typeof XMLHttpRequest !== "undefined") {
        try {
          var request = new XMLHttpRequest();
          request.status;
          // try, if status is accessible. Fails in IE5.
          return request;
        } catch (e) {
          console.log("XMLHttpRequest not available: " + e);
        }
      }
      try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
      } catch (e) {
        console.log("XMLHttpRequest Msxml2.XMLHTTP.6.0 not available: " + e);
      }
      try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
      } catch (e) {
        console.log("XMLHttpRequest Msxml2.XMLHTTP.3.0 not available: " + e);
      }
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        console.log("XMLHttpRequest Microsoft.XMLHTTP not available: " + e);
      }
      // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
      throw new Error("This browser does not support XMLHttpRequest.");
    };
  }
  function $aff7e289376add1e06142f35db75bdd3$init() {
    if (!$aff7e289376add1e06142f35db75bdd3$executed) {
      $aff7e289376add1e06142f35db75bdd3$executed = true;
      $aff7e289376add1e06142f35db75bdd3$exec();
    }
    return $aff7e289376add1e06142f35db75bdd3$exports;
  }
  // ASSET: ../src/js/search-service-client.js
  var $a4642e25ca07425f9349bdd0d4f27f81$exports, $a4642e25ca07425f9349bdd0d4f27f81$var$module, $a4642e25ca07425f9349bdd0d4f27f81$var$searchMenuServiceClient, $a4642e25ca07425f9349bdd0d4f27f81$var$xmlHttpRequest, $a4642e25ca07425f9349bdd0d4f27f81$executed = false;
  // Fallback for vanilla js without modules
  function $a4642e25ca07425f9349bdd0d4f27f81$var$datarestructorInternalCreateIfNotExists(objectToCheck) {
    return objectToCheck || ({});
  }
  function $a4642e25ca07425f9349bdd0d4f27f81$exec() {
    $a4642e25ca07425f9349bdd0d4f27f81$exports = {};
    $a4642e25ca07425f9349bdd0d4f27f81$var$module = $a4642e25ca07425f9349bdd0d4f27f81$var$datarestructorInternalCreateIfNotExists($a4642e25ca07425f9349bdd0d4f27f81$var$module);
    $a4642e25ca07425f9349bdd0d4f27f81$var$searchMenuServiceClient = $a4642e25ca07425f9349bdd0d4f27f81$var$module.exports = {};
    // Export module for npm...
    $a4642e25ca07425f9349bdd0d4f27f81$var$searchMenuServiceClient.internalCreateIfNotExists = $a4642e25ca07425f9349bdd0d4f27f81$var$datarestructorInternalCreateIfNotExists;
    $a4642e25ca07425f9349bdd0d4f27f81$var$xmlHttpRequest = $a4642e25ca07425f9349bdd0d4f27f81$var$xmlHttpRequest || $aff7e289376add1e06142f35db75bdd3$init();
    // supports vanilla js & npm
    $a4642e25ca07425f9349bdd0d4f27f81$var$searchMenuServiceClient.HttpSearchConfig = (function () {
      /**
      * Configures and builds the {@link module:searchMenuServiceClient.HttpClient}.
      * DescribedDataField is the main element of the restructured data and therefore considered "public".
      * @constructs HttpSearchConfig
      * @alias module:searchMenuServiceClient.HttpSearchConfig
      */
      function HttpSearchConfig() {
        /**
        * HTTP Search Configuration.
        * @property {string} searchUrlTemplate URL that is called for every search request. It may include variables in double curly brackets like `{{searchtext}}`.
        * @property {string} [searchMethod="POST"] HTTP Method, that is used for every search request.
        * @property {string} [searchContentType="application/json"] HTTP MIME-Type of the body, that is used for every search request.
        * @property {string} searchBodyTemplate HTTP body template, that is used for every search request. It may include variables in double curly brackets like `{{jsonSearchParameters}}`.
        * @property {XMLHttpRequest} [httpRequest=new XMLHttpRequest()] Contains the XMLHttpRequest that is used to handle HTTP requests and responses. Defaults to XMLHttpRequest.
        * @property {boolean} [debugMode=false] Adds detailed logging for development and debugging.
        */
        this.config = {
          searchUrlTemplate: "",
          searchMethod: "POST",
          searchContentType: "application/json",
          searchBodyTemplate: null,
          /**
          * Resolves variables in the search url template based on the given search parameters object.
          * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
          * @param {Object} searchParameters object properties will be used to replace the variables of the searchUrlTemplate
          */
          resolveSearchUrl: function (searchParameters) {
            return resolveTemplate(this.searchUrlTemplate, searchParameters, this.debugMode);
          },
          /**
          * Resolves variables in the search body template based on the given search parameters object.
          * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
          * @param {Object} searchParameters object properties will be used to replace the variables of the searchBodyTemplate
          */
          resolveSearchBody: function (searchParameters) {
            return resolveTemplate(this.searchBodyTemplate, searchParameters, this.debugMode);
          },
          httpRequest: null,
          debugMode: false
        };
        /**
        * Sets the url for the HTTP request for the search.
        * It may include variables in double curly brackets like {{searchtext}}.
        * @param {String} value
        * @return {module:searchMenuServiceClient.HttpSearchConfig}
        */
        this.searchUrlTemplate = function (value) {
          this.config.searchUrlTemplate = value;
          return this;
        };
        /**
        * Sets the HTTP method for the search. Defaults to "POST".
        * @param {String} value
        * @return {module:searchMenuServiceClient.HttpSearchConfig}
        */
        this.searchMethod = function (value) {
          this.config.searchMethod = value;
          return this;
        };
        /**
        * Sets the HTTP content type of the request body. Defaults to "application/json".
        * @param {String} value
        * @return {module:searchMenuServiceClient.HttpSearchConfig}
        */
        this.searchContentType = function (value) {
          this.config.searchContentType = value;
          return this;
        };
        /**
        * Sets the HTTP request body template that may contain variables (e.g. {{searchParameters}}) in double curly brackets, or null if there is none.
        * @param {String} value
        * @return {module:searchMenuServiceClient.HttpSearchConfig}
        */
        this.searchBodyTemplate = function (value) {
          this.config.searchBodyTemplate = value;
          return this;
        };
        /**
        * Sets the HTTP-Request-Object. Defaults to XMLHttpRequest if not set.
        * @param {String} value
        * @return {module:searchMenuServiceClient.HttpSearchConfig}
        */
        this.httpRequest = function (value) {
          this.config.httpRequest = value;
          return this;
        };
        /**
        * Sets the debug mode, that prints some more info to the console.
        * @param {boolean} value
        * @return {module:searchMenuServiceClient.HttpSearchConfig}
        */
        this.debugMode = function (value) {
          this.config.debugMode = value === true;
          return this;
        };
        /**
        * Uses the configuration to build the http client that provides the function "search" (parameters: searchParameters, onSuccess callback).
        * @returns {module:searchMenuServiceClient.HttpClient}
        */
        this.build = function () {
          if (!this.config.httpRequest) {
            this.config.httpRequest = $a4642e25ca07425f9349bdd0d4f27f81$var$xmlHttpRequest.getXMLHttpRequest();
          }
          return new $a4642e25ca07425f9349bdd0d4f27f81$var$searchMenuServiceClient.HttpClient(this.config);
        };
      }
      /**
      * Resolves variables in the template based on the given search parameters object.
      * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
      * @param {String} template contains variables in double curly brackets that should be replaced by the values of the parameterSourceObject.
      * @param {Object} parameterSourceObject object properties will be used to replace the variables of the template
      * @param {boolean} debugMode enables/disables extended logging for debugging
      * @memberof module:searchMenuServiceClient.HttpSearchConfig
      * @protected
      */
      function resolveTemplate(template, parameterSourceObject, debugMode) {
        if (template == null) {
          return null;
        }
        var jsonSearchParameters = JSON.stringify(parameterSourceObject);
        var resolvedBody = template;
        resolvedBody = resolveVariableInTemplate(resolvedBody, "jsonSearchParameters", jsonSearchParameters);
        resolvedBody = resolveVariablesInTemplate(resolvedBody, parameterSourceObject);
        if (debugMode) {
          console.log("template=" + template);
          console.log("{{jsonSearchParameters}}=" + jsonSearchParameters);
          console.log("resolved template=" + resolvedBody);
        }
        return resolvedBody;
      }
      function resolveVariablesInTemplate(templateString, sourceDataObject) {
        var resolvedString = templateString;
        forEachFieldsIn(sourceDataObject, function (fieldName, fieldValue) {
          resolvedString = resolveVariableInTemplate(resolvedString, fieldName, fieldValue);
        });
        return resolvedString;
      }
      function resolveVariableInTemplate(templateString, fieldName, fieldValue) {
        // TODO could there be a better compatible solution to replace ALL occurrences instead of creating regular expressions?
        var variableReplaceRegExp = new RegExp("\\{\\{" + escapeCharsForRegEx(fieldName) + "\\}\\}", "gm");
        return templateString.replace(variableReplaceRegExp, fieldValue);
      }
      function escapeCharsForRegEx(characters) {
        var nonWordCharactersRegEx = new RegExp("([^-\\w])", "gi");
        return characters.replace(nonWordCharactersRegEx, "\\$1");
      }
      function forEachFieldsIn(object, fieldNameAndValueConsumer) {
        var fieldNames = Object.keys(object);
        var index, fieldName, fieldValue;
        for (index = 0; index < fieldNames.length; index += 1) {
          fieldName = fieldNames[index];
          fieldValue = object[fieldName];
          fieldNameAndValueConsumer(fieldName, fieldValue);
        }
      }
      return HttpSearchConfig;
    })();
    /**
    * This function will be called, when search results are available.
    * @callback module:searchMenuServiceClient.HttpClient.SearchServiceResultAvailable
    * @param {Object} searchResultData already parsed data object containing the result of the search
    */
    $a4642e25ca07425f9349bdd0d4f27f81$var$searchMenuServiceClient.HttpClient = (function () {
      /**
      * HttpClient.
      *
      * Contains the "backend-connection" of the search bar. It submits the search query,
      * parses the results and informs the callback as soon as these results are available.
      * @example new searchMenuServiceClient.HttpSearchConfig()....build();
      * @param {module:searchMenuServiceClient.HttpSearchConfig} config
      * @constructs HttpClient
      * @alias module:searchMenuServiceClient.HttpClient
      */
      var instance = function (config) {
        /**
        * Configuration for the search HTTP requests.
        * @type {module:searchMenuServiceClient.HttpSearchConfig}
        */
        this.config = config;
        /**
        * This function will be called to trigger search (calling the search backend).
        * @function
        * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
        * @param {module:searchMenuServiceClient.HttpClient.SearchServiceResultAvailable} onSearchResultsAvailable will be called when search results are available.
        */
        this.search = createSearchFunction(this.config, this.config.httpRequest);
      };
      /**
      * Creates the search service function that can be bound to the search menu.
      * @param {module:searchMenuServiceClient.HttpSearchConfig} config Configuration for the search HTTP requests.
      * @param {XMLHttpRequest} httpRequest Takes the HTTP-Request-Object.
      * @returns {module:searchMenuServiceClient.SearchService}
      * @memberof module:searchMenuServiceClient.HttpClient
      * @private
      */
      function createSearchFunction(config, httpRequest) {
        return function (searchParameters, onJsonResultReceived) {
          var onFailure = function (resultText, httpStatus) {
            console.error("search failed with status code " + httpStatus + ": " + resultText);
          };
          var searchUrl = config.resolveSearchUrl(searchParameters);
          var searchBody = config.resolveSearchBody(searchParameters);
          var request = {
            url: searchUrl,
            method: config.searchMethod,
            contentType: config.searchContentType,
            body: searchBody
          };
          if (config.debugMode) {
            onJsonResultReceived = loggedSuccess(onJsonResultReceived);
          }
          httpRequestJson(request, httpRequest, onJsonResultReceived, onFailure);
        };
      }
      function loggedSuccess(onSuccess) {
        return function (jsonResult, status) {
          console.log("successful search response with code " + status + ": " + JSON.stringify(jsonResult, null, 2));
          onSuccess(jsonResult, status);
        };
      }
      /**
      * This function will be called when a already parsed response of the HTTP request is available.
      * @callback module:searchMenuServiceClient.HttpClient.ParsedHttpResponseAvailable
      * @param {Object} resultData already parsed data object containing the results of the HTTP request
      * @param {number} httpStatus HTTP response status
      */
      /**
      * This function will be called when a response of the HTTP request is available as text.
      * @callback module:searchMenuServiceClient.HttpClient.TextHttpResponseAvailable
      * @param {Object} resultText response body as text
      * @param {number} httpStatus HTTP response status
      */
      /**
      * Executes an HTTP "AJAX" request.
      *
      * @param {Object} request - flattened json from search query result
      * @param {string} request.url - name of the property in hierarchical order separated by points
      * @param {string} request.method - value of the property as string
      * @param {string} request.contentType - value of the property as string
      * @param {string} request.body - value of the property as string
      * @param {Object} httpRequest - Browser provided object to use for the HTTP request.
      * @param {module:searchMenuServiceClient.HttpClient.ParsedHttpResponseAvailable} onSuccess - will be called when the request was successful.
      * @param {module:searchMenuServiceClient.HttpClient.TextHttpResponseAvailable} onFailure - will be called with the error message as text
      * @memberof module:searchMenuServiceClient.HttpClient
      * @private
      */
      function httpRequestJson(request, httpRequest, onSuccess, onFailure) {
        httpRequest.onreadystatechange = function () {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status >= 200 && httpRequest.status <= 299) {
              var jsonResult = JSON.parse(httpRequest.responseText);
              onSuccess(jsonResult, httpRequest.status);
            } else {
              onFailure(httpRequest.responseText, httpRequest.status);
            }
          }
        };
        httpRequest.open(request.method, request.url, true);
        httpRequest.setRequestHeader("Content-Type", request.contentType);
        httpRequest.send(request.body);
      }
      return instance;
    })();
  }
  function $a4642e25ca07425f9349bdd0d4f27f81$init() {
    if (!$a4642e25ca07425f9349bdd0d4f27f81$executed) {
      $a4642e25ca07425f9349bdd0d4f27f81$executed = true;
      $a4642e25ca07425f9349bdd0d4f27f81$exec();
    }
    return $a4642e25ca07425f9349bdd0d4f27f81$exports;
  }
  // The modules "search-menu-ui" and "search-service-client" are included directly,
  // because this example is also used during development.
  // When used as a starting point, change these imports to use the node package manager e.g. like the "template_resolver".
  var $e24d7b60828abdbaee8b1b607b83c7e3$var$searchMenuServiceClient = $e24d7b60828abdbaee8b1b607b83c7e3$var$searchMenuServiceClient || $a4642e25ca07425f9349bdd0d4f27f81$init();
  // ASSET: ../src/js/ponyfills/eventCurrentTargetPonyfill.js
  var $b4d6cccc664d531c9f82cd1bef91ded8$exports, $b4d6cccc664d531c9f82cd1bef91ded8$var$module, $b4d6cccc664d531c9f82cd1bef91ded8$var$eventtarget, $b4d6cccc664d531c9f82cd1bef91ded8$executed = false;
  function $b4d6cccc664d531c9f82cd1bef91ded8$exec() {
    $b4d6cccc664d531c9f82cd1bef91ded8$exports = {};
    $b4d6cccc664d531c9f82cd1bef91ded8$var$module = $b4d6cccc664d531c9f82cd1bef91ded8$var$module || ({});
    $b4d6cccc664d531c9f82cd1bef91ded8$var$eventtarget = $b4d6cccc664d531c9f82cd1bef91ded8$var$module.exports = {};
    // Fallback for vanilla js without modules
    /**
    * @returns {Element} target of the event
    * @memberof eventtarget
    */
    $b4d6cccc664d531c9f82cd1bef91ded8$var$eventtarget.getEventTarget = function (event) {
      if (typeof event.currentTarget !== "undefined" && event.currentTarget != null) {
        return event.currentTarget;
      }
      if (typeof event.srcElement !== "undefined" && event.srcElement != null) {
        return event.srcElement;
      } else {
        throw new Error("Event doesn't contain bounded element: " + event);
      }
    };
  }
  function $b4d6cccc664d531c9f82cd1bef91ded8$init() {
    if (!$b4d6cccc664d531c9f82cd1bef91ded8$executed) {
      $b4d6cccc664d531c9f82cd1bef91ded8$executed = true;
      $b4d6cccc664d531c9f82cd1bef91ded8$exec();
    }
    return $b4d6cccc664d531c9f82cd1bef91ded8$exports;
  }
  // ASSET: ../src/js/ponyfills/selectionRangePonyfill.js
  var $9df0344f4c911aa81503a89a9ae63f3e$exports, $9df0344f4c911aa81503a89a9ae63f3e$var$module, $9df0344f4c911aa81503a89a9ae63f3e$var$selectionrange, $9df0344f4c911aa81503a89a9ae63f3e$executed = false;
  function $9df0344f4c911aa81503a89a9ae63f3e$exec() {
    $9df0344f4c911aa81503a89a9ae63f3e$exports = {};
    $9df0344f4c911aa81503a89a9ae63f3e$var$module = $9df0344f4c911aa81503a89a9ae63f3e$var$module || ({});
    $9df0344f4c911aa81503a89a9ae63f3e$var$selectionrange = $9df0344f4c911aa81503a89a9ae63f3e$var$module.exports = {};
    // Fallback for vanilla js without modules
    $9df0344f4c911aa81503a89a9ae63f3e$var$selectionrange.moveCursorToEndOf = function (element) {
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
    };
  }
  function $9df0344f4c911aa81503a89a9ae63f3e$init() {
    if (!$9df0344f4c911aa81503a89a9ae63f3e$executed) {
      $9df0344f4c911aa81503a89a9ae63f3e$executed = true;
      $9df0344f4c911aa81503a89a9ae63f3e$exec();
    }
    return $9df0344f4c911aa81503a89a9ae63f3e$exports;
  }
  // ASSET: ../src/js/ponyfills/addEventListenerPonyfill.js
  var $5cc854876970482b06f94832c6e64904$exports, $5cc854876970482b06f94832c6e64904$var$module, $5cc854876970482b06f94832c6e64904$var$eventlistener, $5cc854876970482b06f94832c6e64904$executed = false;
  function $5cc854876970482b06f94832c6e64904$exec() {
    $5cc854876970482b06f94832c6e64904$exports = {};
    $5cc854876970482b06f94832c6e64904$var$module = $5cc854876970482b06f94832c6e64904$var$module || ({});
    $5cc854876970482b06f94832c6e64904$var$eventlistener = $5cc854876970482b06f94832c6e64904$var$module.exports = {};
    // Fallback for vanilla js without modules
    /**
    * Adds an event listener/hander using "addEventListener" or whatever method the browser supports.
    * @param {String} eventName
    * @param {Element} element
    * @param {*} eventHandler
    * @memberof addeventlistener
    */
    $5cc854876970482b06f94832c6e64904$var$eventlistener.addEventListener = function (eventName, element, eventHandler) {
      if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, eventHandler);
      } else {
        element["on" + eventName] = eventHandler;
      }
    };
  }
  function $5cc854876970482b06f94832c6e64904$init() {
    if (!$5cc854876970482b06f94832c6e64904$executed) {
      $5cc854876970482b06f94832c6e64904$executed = true;
      $5cc854876970482b06f94832c6e64904$exec();
    }
    return $5cc854876970482b06f94832c6e64904$exports;
  }
  // ASSET: ../src/js/search-menu-ui.js
  var $bec6d6f54a95fd095f20409f868bb0b0$exports, $bec6d6f54a95fd095f20409f868bb0b0$var$module, $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu, $bec6d6f54a95fd095f20409f868bb0b0$var$eventtarget, $bec6d6f54a95fd095f20409f868bb0b0$var$selectionrange, $bec6d6f54a95fd095f20409f868bb0b0$var$eventlistener, $bec6d6f54a95fd095f20409f868bb0b0$executed = false;
  // Fallback for vanilla js without modules
  function $bec6d6f54a95fd095f20409f868bb0b0$var$datarestructorInternalCreateIfNotExists(objectToCheck) {
    return objectToCheck || ({});
  }
  function $bec6d6f54a95fd095f20409f868bb0b0$exec() {
    $bec6d6f54a95fd095f20409f868bb0b0$exports = {};
    $bec6d6f54a95fd095f20409f868bb0b0$var$module = $bec6d6f54a95fd095f20409f868bb0b0$var$datarestructorInternalCreateIfNotExists($bec6d6f54a95fd095f20409f868bb0b0$var$module);
    $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu = $bec6d6f54a95fd095f20409f868bb0b0$var$module.exports = {};
    // Export module for npm...
    $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu.internalCreateIfNotExists = $bec6d6f54a95fd095f20409f868bb0b0$var$datarestructorInternalCreateIfNotExists;
    $bec6d6f54a95fd095f20409f868bb0b0$var$eventtarget = $bec6d6f54a95fd095f20409f868bb0b0$var$eventtarget || $b4d6cccc664d531c9f82cd1bef91ded8$init();
    $bec6d6f54a95fd095f20409f868bb0b0$var$selectionrange = $bec6d6f54a95fd095f20409f868bb0b0$var$selectionrange || $9df0344f4c911aa81503a89a9ae63f3e$init();
    $bec6d6f54a95fd095f20409f868bb0b0$var$eventlistener = $bec6d6f54a95fd095f20409f868bb0b0$var$eventlistener || $5cc854876970482b06f94832c6e64904$init();
    // supports vanilla js & npm
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
    $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu.SearchViewDescriptionBuilder = (function () {
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
          // TODO could be checked to not contain the index separation chars "--"
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
    // TODO could provide the currently only described SearchUiData as own data structure in its own module.
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
    * This function replaces variables in double curly brackets with the property values of the given object.
    * @callback module:searchmenu.TemplateResolver
    * @param {String} templateToResolve may contain variables in double curly brackets e.g. like `"{{searchtext}}"`.
    * @param {Object} sourceObject the fields of this object are used to replace the variables in the template
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
    */
    $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu.SearchMenuAPI = (function () {
      /**
      * Search Menu UI API
      * @constructs SearchMenuAPI
      * @alias module:searchmenu.SearchMenuAPI
      */
      function SearchMenuApiBuilder() {
        this.config = {
          triggerSearch: function () /*searchParameters, onSearchResultsAvailable*/
          {
            throw new Error("search service needs to be defined.");
          },
          convertData: function (sourceData) {
            return sourceData;
          },
          resolveTemplate: function () /*sourceData*/
          {
            throw new Error("template resolver needs to be defined.");
          },
          addPredefinedParametersTo: function () /*object*/
          {},
          onCreatedElement: function () /*element, isParent*/
          {},
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
        * @returns module:searchmenu.SearchMenuAPI
        */
        this.searchService = function (service) {
          this.config.triggerSearch = service;
          return this;
        };
        /**
        * Defines the converter, that converts search result data to search ui data.
        * Without setting a data converter, data is taken directly from the backend service,
        * that needs to provide the results in the search menu data structure.
        * @param {module:searchmenu.DataConverter} converter function that will be called to create the search menu data structure
        * @returns module:searchmenu.SearchMenuAPI
        */
        this.dataConverter = function (converter) {
          this.config.convertData = converter;
          return this;
        };
        /**
        * Defines the template resolver, that replaces variables in double curly brackets with the property values of the given object.
        * @param {module:searchmenu.TemplateResolver} resolver function that will be called to resolve strings with variables.
        * @returns module:searchmenu.SearchMenuAPI
        */
        this.templateResolver = function (resolver) {
          this.config.resolveTemplate = resolver;
          return this;
        };
        /**
        * Defines the function, that adds predefined (fixed, constant, environmental) search parameters
        * to the first parameter object.
        * @param {module:searchmenu.SearchParameterAdder} adder function that will be called to before search is triggered.
        * @returns module:searchmenu.SearchMenuAPI
        */
        this.addPredefinedParametersTo = function (adder) {
          this.config.addPredefinedParametersTo = adder;
          return this;
        };
        /**
        * Sets the listener, that will be called, when a new HTML element was created.
        * @param {module:searchmenu.ElementCreatedListener} listener
        * @returns module:searchmenu.SearchMenuAPI
        */
        this.setElementCreatedHandler = function (listener) {
          this.config.onCreatedElement = listener;
          return this;
        };
        /**
        * Adds another listener, that will be called, when a new HTML element was created.
        * @param {module:searchmenu.ElementCreatedListener} listener
        * @returns module:searchmenu.SearchMenuAPI
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
        * @returns module:searchmenu.SearchMenuAPI
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
        * @returns module:searchmenu.SearchMenuAPI
        */
        this.searchAreaElementId = function (id) {
          this.config.searchAreaElementId = withDefault(id, "searcharea");
          return this;
        };
        /**
        * Sets the input search text element ID,.
        * @param {String} [id="searchinputtext"] id of the input element, that contains the search text.
        * @returns module:searchmenu.SearchMenuAPI
        */
        this.inputElementId = function (id) {
          this.config.inputElementId = withDefault(id, "searchinputtext");
          return this;
        };
        /**
        * Sets the name of the backend search service parameter, that contains the input search text.
        * @param {String} [value="searchtext"] name of the parameter, that contains the input search text and that can be used as a variable inside the url or body template for the backend service
        * @returns module:searchmenu.SearchMenuAPI
        */
        this.searchTextParameterName = function (value) {
          this.config.searchTextParameterName = withDefault(value, "searchtext");
          return this;
        };
        /**
        * Sets the view, that is used to display all search results.
        * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultResultsView}.
        *
        * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays all search results
        * @returns module:searchmenu.SearchMenuAPI
        * @see {@link module:searchmenu.SearchMenuAPI.defaultResultsView}
        */
        this.resultsView = function (view) {
          this.config.resultsView = view;
          return this;
        };
        /**
        * Sets the view, that is used to display details of a selected search result.
        * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultDetailView}.
        *
        * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays details of a selected search result
        * @returns module:searchmenu.SearchMenuAPI
        * @see {@link module:searchmenu.SearchMenuAPI.defaultDetailView}
        */
        this.detailView = function (view) {
          this.config.detailView = view;
          return this;
        };
        /**
        * Sets the view, that is used to display currently selected filter options.
        * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultFilterOptionsView}.
        *
        * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays currently selected filter options
        * @returns module:searchmenu.SearchMenuAPI
        * @see {@link module:searchmenu.SearchMenuAPI.defaultFilterOptionsView}
        */
        this.filterOptionsView = function (view) {
          this.config.filterOptionsView = view;
          return this;
        };
        /**
        * Sets the view, that is used to display search results, that represent filter options.
        * The default view settings can be found [here]{@link module:searchmenu.SearchMenuAPI.defaultFiltersView}.
        *
        * @param {module:searchmenu.SearchViewDescription} view connects the part of the search menu, that displays search results, that represent filter options
        * @returns module:searchmenu.SearchMenuAPI
        * @see {@link module:searchmenu.SearchMenuAPI.defaultFiltersView}
        */
        this.filtersView = function (view) {
          this.config.filtersView = view;
          return this;
        };
        /**
        * Sets the time the search menu will remain open, when it has lost focus.
        * Prevents the menu to disappear while using it.
        * @param {number} [ms=700] time in milliseconds the search menu will remain open until it is closed after loosing focus.
        * @returns module:searchmenu.SearchMenuAPI
        */
        this.waitBeforeClose = function (ms) {
          this.config.waitBeforeClose = ms;
          return this;
        };
        /**
        * Sets the time to wait before the search service is called.
        * Prevents calls to the search backend while changing the search input.
        * @param {number} [ms=500] time in milliseconds to wait before the search service is called
        * @returns module:searchmenu.SearchMenuAPI
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
        * @returns module:searchmenu.SearchMenuAPI
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
          return new $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu.SearchMenuUI(config);
        };
      }
      /**
      * Contains the default settings for the results view.
      * - viewElementId = "`searchresults`"
      * - listParentElementId = "`searchmatches`"
      * - listEntryElementIdPrefix = "`result`"
      * - listEntryTextTemplate = "`{{abbreviation}} {{displayName}}`"
      * - listEntrySummaryTemplate = "`{{summaries[0].abbreviation}} <b>{{summaries[1].value}}</b><br>{{summaries[2].value}}: {{summaries[0].value}}`"
      *
      * @returns {module:searchmenu.SearchViewDescription} default settings for the results view
      * @protected
      * @memberof module:searchmenu.SearchMenuAPI
      */
      function defaultResultsView() {
        return new $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu.SearchViewDescriptionBuilder().viewElementId("searchresults").listParentElementId("searchmatches").listEntryElementIdPrefix("result").listEntryTextTemplate("{{abbreviation}} {{displayName}}").listEntrySummaryTemplate("{{summaries[0].abbreviation}} <b>{{summaries[1].value}}</b><br>{{summaries[2].value}}: {{summaries[0].value}}").build();
      }
      /**
      * Contains the default settings for the details view.
      * - viewElementId = "`searchdetails`"
      * - listParentElementId = "`searchdetailentries`"
      * - listEntryElementIdPrefix = "`detail`"
      * - listEntryTextTemplate = "`<b>{{displayName}}:</b> {{value}}`"
      *
      * @returns {module:searchmenu.SearchViewDescription} default settings for the details view
      * @protected
      * @memberof module:searchmenu.SearchMenuAPI
      */
      function defaultDetailView() {
        return new $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu.SearchViewDescriptionBuilder().viewElementId("searchdetails").listParentElementId("searchdetailentries").listEntryElementIdPrefix("detail").listEntryTextTemplate("<b>{{displayName}}:</b> {{value}}").build();
      }
      /**
      * Contains the default settings for the filter options view.
      * - viewElementId = "`searchfilteroptions`"
      * - listParentElementId = "`searchfilteroptionentries`"
      * - listEntryElementIdPrefix = "`filter`"
      * - listEntryTextTemplate = "`{{value}}`"
      * - listEntrySummaryTemplate = "`{{summaries[0].value}}`"
      * - isSelectableFilterOption = `true`
      *
      * @returns {module:searchmenu.SearchViewDescription} default settings for the filter options view
      * @protected
      * @memberof module:searchmenu.SearchMenuAPI
      */
      function defaultFilterOptionsView() {
        return new $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu.SearchViewDescriptionBuilder().viewElementId("searchfilteroptions").listParentElementId("searchfilteroptionentries").listEntryElementIdPrefix("filter").listEntryTextTemplate("{{value}}").listEntrySummaryTemplate("{{summaries[0].value}}").isSelectableFilterOption(true).build();
      }
      /**
      * Contains the default settings for the filters view.
      * - viewElementId = "`searchresults`"
      * - listParentElementId = "`searchfilters`"
      * - listEntryElementIdPrefix = "`filter`"
      * - isSelectableFilterOption = `true`
      * @returns {module:searchmenu.SearchViewDescription} default settings for the filters view
      * @protected
      * @memberof module:searchmenu.SearchMenuAPI
      */
      function defaultFiltersView() {
        return new $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu.SearchViewDescriptionBuilder().viewElementId("searchresults").listParentElementId("searchfilters").listEntryElementIdPrefix("filter").isSelectableFilterOption(true).build();
      }
      function addEvent(eventName, element, eventHandler) {
        $bec6d6f54a95fd095f20409f868bb0b0$var$eventlistener.addEventListener(eventName, element, eventHandler);
      }
      function getEventTarget(event) {
        return $bec6d6f54a95fd095f20409f868bb0b0$var$eventtarget.getEventTarget(event);
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
    })();
    $bec6d6f54a95fd095f20409f868bb0b0$var$searchmenu.SearchMenuUI = (function () {
      /**
      * Search Menu UI.
      *
      * Contains the "behavior" of the search bar. It submits the search query,
      * parses the results, displays matches and filters and responds to
      * clicks and key presses.
      * Further resources:
      * - [API]{@link module:searchmenu.SearchMenuAPI}
      * - [Configuration]{@link module:searchmenu.SearchMenuConfig}
      *
      * @constructs SearchMenuUI
      * @alias module:searchmenu.SearchMenuUI
      * @see {@link module:searchmenu.SearchMenuAPI}
      * @see {@link module:searchmenu.SearchMenuConfig}
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
            // TODO should only show results if there are some
            // TODO could add a "spinner" when search is running
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
        // TODO should "retrigger" search when new filter options are selected (after each?)
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
        var resultElementText = createListEntryInnerHtmlText(entry, config.resultsView, listElementId, config.resolveTemplate);
        var resultElement = createListEntryElement(entry, config.resultsView, listElementId, resultElementText);
        addClass(resolveStyleClasses(entry, config.resultsView, config.resolveTemplate), resultElement);
        forEachIdElementIncludingChildren(resultElement, config.onCreatedElement);
        if (isMenuEntryWithFurtherDetails(entry)) {
          onMenuEntrySelected(resultElement, handleEventWithEntriesAndConfig(entry.details, config, selectSearchResultToDisplayDetails));
          onMouseOverDelayed(resultElement, config.waitBeforeMouseOver, handleEventWithEntriesAndConfig(entry.details, config, selectSearchResultToDisplayDetails));
          onMenuEntryChosen(resultElement, function () {
            var selectedUrlTemplate = getSelectedUrlTemplate(config.filtersView.listParentElementId, getPropertyValueWithUndefinedDefault(entry, "category", ""));
            if (selectedUrlTemplate) {
              // TODO should add domain, baseurl, ... as data sources for variables to use inside the template
              var targetURL = config.resolveTemplate(selectedUrlTemplate, entry);
              config.navigateTo(targetURL);
            }
          });
        }
        if (isMenuEntryWithOptions(entry)) {
          var options = entry.options;
          // TODO should support details for filter options.
          // TODO could skip sub menu, if there is only one option (with/without being default).
          // TODO could be used for constants (pre selected single filter options) like "tenant-number", "current-account"
          // TODO could remove the original search result filter when the default option is pre selected (and its options are copied).
          if (isMenuEntryWithDefault(entry)) {
            options = insertAtBeginningIfMissing(entry.options, entry["default"][0], equalProperties(["value"]));
            var filterOptionsElement = createFilterOption(entry["default"][0], options, config.filtersView, config);
            addDefaultFilterOptionModificationHandler(filterOptionsElement, options, config);
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
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @param {SearchMenuConfig} config search configuration
      * @param {EventListener} eventHandler event handler
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function handleEventWithConfig(config, eventHandler) {
        return function (event) {
          eventHandler(event, config);
        };
      }
      /**
      * @param {Object[]} entries raw data of the entry
      * @param {module:searchmenu.SearchMenuConfig} config search configuration
      * @param {EventListener} eventHandler event handler
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @callback module:searchmenu.MenuEntryNotFoundHandler
      * @param {module:searchmenu.ListElementIdProperties} properties of the element id
      */
      /**
      * This function returns the ID for the first sub menu entry using the given type name (= name of the sub menu).
      *
      * @callback module:searchmenu.SubMenuId
      * @param {string} type name of the sub menu entries
      */
      /**
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
      */
      /**
      * Extracts properties like type and index
      * from the given list element id string.
      *
      * @param {string} id
      * @return {module:searchmenu.ListElementIdProperties} list element id properties
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
            var hiddenFieldsJson = getPropertyValueWithUndefinedDefault(hiddenFieldsElement, "textContent", hiddenFieldsElement.innerText);
            return JSON.parse(hiddenFieldsJson);
          }
        };
      }
      function focusSearchInput(event, config) {
        var resultEntry = getEventTarget(event);
        var inputElement = document.getElementById(config.inputElementId);
        resultEntry.blur();
        inputElement.focus();
        $bec6d6f54a95fd095f20409f868bb0b0$var$selectionrange.moveCursorToEndOf(inputElement);
        preventDefaultEventHandling(event);
        // skips cursor position change on key up once
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
            // select first filter entry after last result/match entry
            // TODO could find a better way (without config?) to navigate from last search result to first options/filter entry
            next = document.getElementById(config.filterOptionsView.listEntryElementIdPrefix + "--1");
          }
          if (next === null) {
            // select first result/match entry after last filter entry (or whenever nothing is found)
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
            // select last result entry when arrow up is pressed on first filter entry
            // TODO could find a better way (without config?) to navigate from first options/filter entry to last search result?
            var resultElementsCount = getListElementCountOfType(config.resultsView.listEntryElementIdPrefix);
            previous = document.getElementById(config.resultsView.listEntryElementIdPrefix + "--" + resultElementsCount);
          }
          if (previous === null) {
            // select input, if there is no previous entry.
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
      * @param {module:searchmenu.MenuEntryNotFoundHandler} onMissingNext is called, if no "next" entry could be found.
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function focusNextMenuEntry(event, onMissingNext) {
        var menuEntry = getEventTarget(event);
        var menuEntryIdProperties = extractListElementIdProperties(menuEntry.id);
        if (menuEntryIdProperties.isSubMenu) {
          preventDefaultEventHandling(event);
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
      * @param {module:searchmenu.MenuEntryNotFoundHandler} onMissingPrevious is called, if no "previous" entry could be found.
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function focusPreviousMenuEntry(event, onMissingPrevious) {
        var menuEntry = getEventTarget(event);
        var menuEntryIdProperties = extractListElementIdProperties(menuEntry.id);
        if (menuEntryIdProperties.isSubMenu) {
          preventDefaultEventHandling(event);
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
      * @param {Event} event
      * @param {DescribedEntry} entries
      * @param {module:searchmenu.SearchMenuConfig} config
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function selectFilterOption(event, entries, config) {
        var selectedEntry = getEventTarget(event);
        var selectedEntryData = findSelectedEntry(selectedEntry.id, entries, equalProperties(["fieldName", "value"]));
        var filterOptionsElement = createFilterOption(selectedEntryData, entries, config.filtersView, config);
        // TODO could detect default entry if necessary and call "addDefaultFilterOptionModificationHandler" instead
        addFilterOptionModificationHandler(filterOptionsElement, entries, config);
        preventDefaultEventHandling(event);
        returnToMainMenu(event);
      }
      function createFilterOption(selectedEntryData, entries, view, config) {
        var filterElements = getListElementCountOfType(view.listEntryElementIdPrefix);
        var filterElementId = view.listEntryElementIdPrefix + "--" + (filterElements + 1);
        var filterCategory = getPropertyValueWithUndefinedDefault(selectedEntryData, "category", "");
        var filterElement = getListEntryByFieldName(filterCategory, selectedEntryData.fieldName, view.listParentElementId);
        var isAlreadyExistingFilter = filterElement != null;
        if (isAlreadyExistingFilter) {
          var updatedText = createListEntryInnerHtmlText(selectedEntryData, view, filterElement.id, config.resolveTemplate);
          filterElement = updateListEntryElement(filterElement, updatedText);
          return filterElement;
        }
        var filterElementText = createListEntryInnerHtmlText(selectedEntryData, view, filterElementId, config.resolveTemplate);
        filterElement = createListEntryElement(selectedEntryData, view, filterElementId, filterElementText);
        addClass(resolveStyleClasses(selectedEntryData, view, config.resolveTemplate), filterElement);
        forEachIdElementIncludingChildren(filterElement, config.onCreatedElement);
        onFilterMenuEntrySelected(filterElement, handleEventWithEntriesAndConfig(entries, config, selectSearchResultToDisplayFilterOptions));
        addMainMenuNavigationHandlers(filterElement, config);
        return filterElement;
      }
      function addFilterOptionModificationHandler(filterElement, entries, config) {
        onSpaceKey(filterElement, toggleFilterEntry);
        onFilterMenuEntryRemoved(filterElement, handleEventWithConfig(config, removeFilterElement));
      }
      function addDefaultFilterOptionModificationHandler(filterElement, entries, config) {
        onSpaceKey(filterElement, handleEventWithEntriesAndConfig(entries, config, selectSearchResultToDisplayFilterOptions));
      }
      /**
      * Searches all child elements of the given parent element
      * for an entry with the given fieldName contained in the hidden fields structure.
      *
      * @param {String} category of the element to search for
      * @param {String} fieldName of the element to search for
      * @param {String} listParentElementId id of the parent element that child nodes will be searched
      * @returns {HTMLElement} returns the element that matches the given fieldName or null, if it hadn't been found.
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function getListEntryByFieldName(category, fieldName, listParentElementId) {
        var globalCategoryResult = null;
        var result = forEachListEntryElement(listParentElementId, function (element) {
          var listElementHiddenFields = extractListElementIdProperties(element.id).hiddenFields();
          if (listElementHiddenFields.fieldName === fieldName) {
            var elementCategory = getPropertyValueWithUndefinedDefault(listElementHiddenFields, "category", "");
            if (elementCategory === "") {
              globalCategoryResult = element;
            } else if (elementCategory === category) {
              return element;
            }
          }
        });
        return result != null ? result : globalCategoryResult;
      }
      /**
      * Returns the property value of the object or - if undefined - the default value.
      * @param {Object} object
      * @param {String} propertyName
      * @param {Object} defaultValue
      * @returns the property value of the object or - if not set - the default value.
      */
      function getPropertyValueWithUndefinedDefault(object, propertyName, defaultValue) {
        if (typeof object[propertyName] === "undefined") {
          return defaultValue;
        }
        return object[propertyName];
      }
      /**
      * Gets the currently selected url template for navigation.
      *
      * @param {String} listParentElementId id of the parent element that child nodes will be searched
      * @param {String} category the url template needs to belong to the same category
      * @returns {String} returns the url template or null, if nothing could be found
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function getSelectedUrlTemplate(listParentElementId, category) {
        return forEachListEntryElement(listParentElementId, function (element) {
          var listElementHiddenFields = extractListElementIdProperties(element.id).hiddenFields();
          var urlTemplate = getPropertyValueWithUndefinedDefault(listElementHiddenFields, "urltemplate", [""])[0];
          if (urlTemplate === "") {
            return null;
          }
          var elementCategory = getPropertyValueWithUndefinedDefault(listElementHiddenFields, category, "");
          if (elementCategory != category && elementCategory !== "") {
            return null;
          }
          if (hasClass("inactive", element)) {
            return null;
          }
          return urlTemplate.value;
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
            return null;
          }
          result[hiddenFields.fieldName] = hiddenFields.value;
        });
        return result;
      }
      /**
      * This function is called for every html element of a given parent.
      *
      * @callback module:searchmenu.ListElementFunction
      * @param {Element} listElement name of the sub menu entries
      * @return {Object} optional result to exit the loop or null otherwise.
      */
      /**
      * Iterates through all child nodes of the given parent and calls the given function.
      * If the function returns a value, it will be returned directly.
      * If the function returns nothing, the iteration continues.
      * @param {String} listParentElementId
      * @param {module:searchmenu.ListElementFunction} listEntryElementFunction
      * @returns {Object} result of the first entry element function, that had returned one, or null.
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
        var subMenuElementText;
        for (subMenuIndex = 0; subMenuIndex < entries.length; subMenuIndex += 1) {
          subMenuEntry = entries[subMenuIndex];
          subMenuEntryId = selectedElement.id + "--" + subMenuView.listEntryElementIdPrefix + "--" + (subMenuIndex + 1);
          subMenuElementText = createListEntryInnerHtmlText(subMenuEntry, subMenuView, subMenuEntryId, config.resolveTemplate);
          subMenuElement = createListEntryElement(subMenuEntry, subMenuView, subMenuEntryId, subMenuElementText);
          addClass(resolveStyleClasses(subMenuEntry, subMenuView, config.resolveTemplate), subMenuElement);
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
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function returnToMainMenu(event) {
        var subMenuEntryToExit = getEventTarget(event);
        var subMenuEntryToExitProperties = extractListElementIdProperties(subMenuEntryToExit.id);
        var mainMenuEntryToSelect = document.getElementById(subMenuEntryToExitProperties.mainMenuId);
        subMenuEntryToExit.blur();
        mainMenuEntryToSelect.focus();
        hideViewOf(subMenuEntryToExit);
      }
      function closeAssociatedSubMenus(event, config) {
        hideSubMenus(config);
      }
      /**
      * Prevents the given event inside an event handler to get handled anywhere else.
      * Pressing the arrow key up can lead to scrolling up the view. This is not useful,
      * if the arrow key navigates the focus inside a sub menu, that is fully contained inside the current view.
      * @param {InputEvent} inputevent
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function preventDefaultEventHandling(inputevent) {
        if (typeof inputevent.preventDefault !== "undefined") {
          inputevent.preventDefault();
        } else {
          inputevent.returnValue = false;
        }
      }
      // TODO could be extracted as ponyfill
      /**
      * Browser compatible Y position of the given element.
      * @returns {number} y position in pixel
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function getYPositionOfElement(element) {
        var selectedElementPosition = element.getBoundingClientRect();
        if (typeof selectedElementPosition.y !== "undefined") {
          return selectedElementPosition.y;
        }
        return selectedElementPosition.top;
      }
      // TODO could be extracted as ponyfill
      /**
      * Browser compatible version of the standard "window.scrollY".
      * @returns {number} y scroll position in pixel
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @callback module:searchmenu.ElementFoundListener
      * @param {Element} foundElement
      * @param {boolean} isParent true, if it is the created parent. false, if it is a child within the created parent.
      */
      /**
      * The given callback will be called for the given parent and all its direct child nodes, that contain an id property.
      * @param {Element} element parent to be inspected
      * @param {module:searchmenu.ElementFoundListener} callback will be called for every found child and the given parent itself
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
          callback(array[index], index + 1);
        }
      }
      /**
      * @param {String} list element type name e.g. "li".
      * @return {number} list element count of the given type
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @param {Node} already existing element
      * @param {String} text updated element text
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function updateListEntryElement(existingElement, text) {
        existingElement.innerHTML = text;
        return existingElement;
      }
      /**
      * Creates a new list entry element to be used for search results, filter options, details and filters.
      *
      * @param {DescribedEntry} entry entry data
      * @param {module:searchmenu.SearchViewDescription} view description
      * @param {number} id id of the list element
      * @param {String} text text of the list element
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function createListEntryElement(entry, view, id, text) {
        var listElement = createListElement(text, id, view.listEntryElementTag);
        var parentElement = document.getElementById(view.listParentElementId);
        parentElement.appendChild(listElement);
        return listElement;
      }
      /**
      * Creates the inner HTML Text for a list entry to be used for search results, filter options, details and filters.
      *
      * @param {DescribedEntry} entry entry data
      * @param {module:searchmenu.SearchViewDescription} view description
      * @param {number} id id of the list element
      * @param {module:searchmenu.TemplateResolver} resolveTemplate function that resolves variables inside a template with contents of a source object
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function createListEntryInnerHtmlText(entry, view, id, resolveTemplate) {
        // TODO could support template inside html e.g. referenced by id (with convention over code)
        // TODO should limit length of resolved variables
        var text = resolveTemplate(view.listEntryTextTemplate, entry);
        if (typeof entry.summaries !== "undefined") {
          text = resolveTemplate(view.listEntrySummaryTemplate, entry);
        }
        var json = JSON.stringify(entry);
        // needs to be without spaces
        text += '<p id="' + id + '--fields" style="display: none">' + json + "</p>";
        return text;
      }
      function resolveStyleClasses(entry, view, resolveTemplate) {
        var resolvedClasses = resolveTemplate(view.listEntryStyleClassTemplate, entry);
        resolvedClasses = resolveTemplate(resolvedClasses, {
          view: view
        });
        return resolvedClasses;
      }
      /**
      * Creates a new list element to be used for search results.
      *
      * @param {string} text inside the list element
      * @param {number} id id of the list element
      * @param {string} elementTag tag (e.g. "li") for the element
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @param {Element}  elementId ID of the element that should be shown
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function show(elementId) {
        showElement(document.getElementById(elementId));
      }
      /**
      * Shows the given element.
      * @param {Element} element element that should be shown
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function showElement(element) {
        addClass("show", element);
      }
      /**
      * Hides the element given by its id.
      * @param elementId ID of the element that should be hidden
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function hide(elementId) {
        hideElement(document.getElementById(elementId));
      }
      /**
      * Hides the view (by removing the class "show"), that contains the given element.
      * The view is identified by the existing style class "show".
      * @param {Element} element
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @callback module:searchmenu.ElementPredicate
      * @param {Element} element
      * @returns {boolean} true, when the predicate matches the given element, false otherwise.
      */
      /**
      * Returns the parent of the element (or the element itself), that matches the given predicate.
      * Returns null, if no element had been found.
      *
      * @param {Element} element
      * @param {module:searchmenu.ElementPredicate} predicate
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
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
        $bec6d6f54a95fd095f20409f868bb0b0$var$eventlistener.addEventListener(eventName, element, eventHandler);
      }
      /**
      * @returns {Element} target of the event
      */
      function getEventTarget(event) {
        return $bec6d6f54a95fd095f20409f868bb0b0$var$eventtarget.getEventTarget(event);
      }
      /**
      * Returns the key code of the event or -1 if it is no available.
      * @param {KeyboardEvent} event
      * @return key code or -1 if not available
      * @protected
      * @memberof module:searchmenu.SearchMenuUI
      */
      function keyCodeOf(event) {
        return typeof event.keyCode === "undefined" ? -1 : event.keyCode;
      }
      return instance;
    })();
  }
  function $bec6d6f54a95fd095f20409f868bb0b0$init() {
    if (!$bec6d6f54a95fd095f20409f868bb0b0$executed) {
      $bec6d6f54a95fd095f20409f868bb0b0$executed = true;
      $bec6d6f54a95fd095f20409f868bb0b0$exec();
    }
    return $bec6d6f54a95fd095f20409f868bb0b0$exports;
  }
  // supports vanilla js & npm
  var $e24d7b60828abdbaee8b1b607b83c7e3$var$searchmenu = $e24d7b60828abdbaee8b1b607b83c7e3$var$searchmenu || $bec6d6f54a95fd095f20409f868bb0b0$init();
  // ASSET: node_modules/data-restructor/devdist/templateResolver.js
  var $7bf3434c7df8cd87500844e87c18147d$exports, $7bf3434c7df8cd87500844e87c18147d$var$define, $7bf3434c7df8cd87500844e87c18147d$executed = false;
  function $7bf3434c7df8cd87500844e87c18147d$exec() {
    $7bf3434c7df8cd87500844e87c18147d$exports = {};
    // modules are defined as an array
    // [ module function, map of requires ]
    // 
    // map of requires is short require name -> numeric require
    // 
    // anything defined in a previous bundle is accessed via the
    // orig method which is the require for previous bundles
    parcelRequire = (function (modules, cache, entry, globalName) {
      // Save the require from previous bundle to this closure if any
      var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
      var nodeRequire = "function" === 'function' && require;
      function newRequire(name, jumped) {
        if (!cache[name]) {
          if (!modules[name]) {
            // if we cannot find the module within our internal map or
            // cache jump to the current global require ie. the last bundle
            // that was added to the page.
            var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
            if (!jumped && currentRequire) {
              return currentRequire(name, true);
            }
            // If there are other bundles on this page the require from the
            // previous one is saved to 'previousRequire'. Repeat this as
            // many times as there are bundles until the module is found or
            // we exhaust the require chain.
            if (previousRequire) {
              return previousRequire(name, true);
            }
            // Try the node require function if it exists.
            if (nodeRequire && typeof name === 'string') {
              return nodeRequire(name);
            }
            var err = new Error('Cannot find module \'' + name + '\'');
            err.code = 'MODULE_NOT_FOUND';
            throw err;
          }
          localRequire.resolve = resolve;
          localRequire.cache = {};
          var module = cache[name] = new newRequire.Module(name);
          modules[name][0].call(module.exports, localRequire, module, module.exports, this);
        }
        return cache[name].exports;
        function localRequire(x) {
          return newRequire(localRequire.resolve(x));
        }
        function resolve(x) {
          return modules[name][1][x] || x;
        }
      }
      function Module(moduleName) {
        this.id = moduleName;
        this.bundle = newRequire;
        this.exports = {};
      }
      newRequire.isParcelRequire = true;
      newRequire.Module = Module;
      newRequire.modules = modules;
      newRequire.cache = cache;
      newRequire.parent = previousRequire;
      newRequire.register = function (id, exports) {
        modules[id] = [function (require, module) {
          module.exports = exports;
        }, {}];
      };
      var error;
      for (var i = 0; i < entry.length; i++) {
        try {
          newRequire(entry[i]);
        } catch (e) {
          // Save first error but execute all entries
          if (!error) {
            error = e;
          }
        }
      }
      if (entry.length) {
        // Expose entry point to Node, AMD or browser globals
        // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
        var mainExports = newRequire(entry[entry.length - 1]);
        // CommonJS
        if (typeof $7bf3434c7df8cd87500844e87c18147d$exports === "object" && "object" !== "undefined") {
          $7bf3434c7df8cd87500844e87c18147d$exports = mainExports;
        } else if (typeof $7bf3434c7df8cd87500844e87c18147d$var$define === "function" && $7bf3434c7df8cd87500844e87c18147d$var$define.amd) {
          $7bf3434c7df8cd87500844e87c18147d$var$define(function () {
            return mainExports;
          });
        } else if (globalName) {
          this[globalName] = mainExports;
        }
      }
      // Override the current require with this new one
      parcelRequire = newRequire;
      if (error) {
        // throw error from earlier, _after updating parcelRequire_
        throw error;
      }
      return newRequire;
    })({
      "kBit": [function (require, module, exports) {
        /**
        * @fileOverview Modded (compatibility, recursion depth) version of: https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objectss
        * @version ${project.version}
        * @see {@link https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objectss|stackoverflow flatten nested json objects}
        */
        var module = module || ({});
        // Fallback for vanilla js without modules
        /**
        * internal_object_tools. Not meant to be used outside this repository.
        * @default {}
        */
        var internal_object_tools = module.exports = {};
        // Export module for npm...
        /**
        * @typedef {Object} NameValuePair
        * @property {string} name - point separated names of the flattened main and sub properties, e.g. "responses[2].hits.hits[4]._source.name".
        * @property {string} value - value of the property
        */
        /**
        * @param {object} data hierarchical object that may consist fo fields, subfields and arrays.
        * @param {number} maxRecursionDepth
        * @returns {NameValuePair[]} array of property name and value pairs
        */
        internal_object_tools.flattenToArray = function (data, maxRecursionDepth) {
          var result = [];
          if (typeof maxRecursionDepth !== "number" || maxRecursionDepth < 1) {
            maxRecursionDepth = 20;
          }
          function recurse(cur, prop, depth) {
            if (depth > maxRecursionDepth || typeof cur === "function") {
              return;
            }
            if (Object(cur) !== cur) {
              result.push({
                name: prop,
                value: cur
              });
            } else if (Array.isArray(cur)) {
              var i;
              var l = cur.length;
              for (i = 0; i < l; i += 1) {
                recurse(cur[i], prop + "[" + i + "]", depth + 1);
              }
              if (l === 0) {
                result[prop] = [];
                result.push({
                  name: prop,
                  value: ""
                });
              }
            } else {
              var isEmpty = true;
              var p;
              for (p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "." + p : p, depth + 1);
              }
              if (isEmpty && prop) {
                result.push({
                  name: prop,
                  value: ""
                });
              }
            }
          }
          recurse(data, "", 0);
          return result;
        };
      }, {}],
      "gEHB": [function (require, module, exports) {
        var module = templateResolverInternalCreateIfNotExists(module);
        // Fallback for vanilla js without modules
        function templateResolverInternalCreateIfNotExists(objectToCheck) {
          return objectToCheck || ({});
        }
        /**
        * Provides a simple template resolver, that replaces variables in double curly brackets with the values of a given object.
        * @module template_resolver
        */
        var template_resolver = module.exports = {};
        // Export module for npm...
        template_resolver.internalCreateIfNotExists = templateResolverInternalCreateIfNotExists;
        var internal_object_tools = internal_object_tools || require("../../lib/js/flattenToArray");
        // supports vanilla js & npm
        template_resolver.Resolver = (function () {
          var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");
          /**
          * Resolver. Is used inside this repository. It could also be used outside.
          * @param {*} sourceDataObject The properties of this object will be used to replace the placeholders in the template.
          * @constructs Resolver
          * @alias module:template_resolver.Resolver
          */
          function Resolver(sourceDataObject) {
            /**
            * The properties of this source data object will be used to replace the placeholders in the template.
            */
            this.sourceDataObject = sourceDataObject;
            /**
            * Resolves the given template.
            *
            * The template may contain variables in double curly brackets.
            * Supported variables are all properties of this object, e.g. "{{fieldName}}", "{{displayName}}", "{{value}}".
            * Since this object may also contains (described) groups of sub objects, they can also be used, e.g. "{{summaries[0].value}}"
            * Parts of the index can be inserted by using e.g. "{{index[1]}}".
            *
            * @param {string} template
            * @returns {string} resolved template
            */
            this.resolveTemplate = function (template) {
              return this.replaceResolvableFields(template, addFieldsPerGroup(this.resolvableFieldsOfAll(this.sourceDataObject)));
            };
            /**
            * Returns a map like object, that contains all resolvable fields and their values as properties.
            * This function takes a variable count of input parameters,
            * each containing an object that contains resolvable fields to extract from.
            *
            * The recursion depth is limited to 3, so that an object,
            * that contains an object can contain another object (but not further).
            *
            * Properties beginning with an underscore in their name will be filtered out, since they are considered as internal fields.
            *
            * @param {...object} varArgs variable count of parameters. Each parameter contains an object that fields should be resolvable for variables.
            * @returns {object} object with resolvable field names and their values.
            * @public
            */
            this.resolvableFieldsOfAll = function () {
              var map = {};
              var ignoreInternalFields = function (propertyName) {
                return propertyName.indexOf("_") !== 0 && propertyName.indexOf("._") < 0;
              };
              var index;
              for (index = 0; index < arguments.length; index += 1) {
                addToFilteredMapObject(internal_object_tools.flattenToArray(arguments[index], 3), map, ignoreInternalFields);
              }
              return map;
            };
            /**
            * Replaces all variables in double curly brackets, e.g. {{property}},
            * with the value of that property from the resolvableProperties.
            *
            * Supported property types: string, number, boolean
            * @param {string} stringContainingVariables
            * @param {object[]} resolvableFields (name=value)
            */
            this.replaceResolvableFields = function (stringContainingVariables, resolvableFields) {
              var replaced = stringContainingVariables;
              var propertyNames = Object.keys(resolvableFields);
              var propertyIndex = 0;
              var propertyName = "";
              var propertyValue = "";
              for (propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex += 1) {
                propertyName = propertyNames[propertyIndex];
                propertyValue = resolvableFields[propertyName];
                replaced = replaced.replace("{{" + propertyName + "}}", propertyValue);
              }
              return replaced;
            };
          }
          /**
          * Adds the value of the "fieldName" property (including its group prefix) and its associated "value" property content.
          * For example: detail[2].fieldName="name", detail[2].value="Smith" lead to the additional property detail.name="Smith".
          * @param {object} object with resolvable field names and their values.
          * @returns {object} object with resolvable field names and their values.
          * @protected
          * @memberof module:template_resolver.Resolver
          */
          function addFieldsPerGroup(map) {
            var propertyNames = Object.keys(map);
            var i, fullPropertyName, propertyInfo, propertyValue;
            for (i = 0; i < propertyNames.length; i += 1) {
              fullPropertyName = propertyNames[i];
              propertyValue = map[fullPropertyName];
              propertyInfo = getPropertyNameInfos(fullPropertyName);
              // Supports fields that are defined by a property named "fieldName" (containing the name)
              // and a property named "value" inside the same sub object (containing its value).
              // Ignore custom fields that are named "fieldName"(propertyValue), since this would lead to an unpredictable behavior.
              // TODO could make "fieldName" and "value" configurable
              if (propertyInfo.name === "fieldName" && propertyValue !== "fieldName") {
                map[propertyInfo.groupWithoutArrayIndices + propertyValue] = map[propertyInfo.group + "value"];
              }
            }
            return map;
          }
          /**
          * Infos about the full property name including the name of the group (followed by the separator) and the name of the property itself.
          * @param {String} fullPropertyName
          * @returns {Object} Contains "group" (empty or group name including trailing separator "."), "groupWithoutArrayIndices" and "name" (property name).
          * @protected
          * @memberof module:template_resolver.Resolver
          */
          function getPropertyNameInfos(fullPropertyName) {
            var positionOfRightMostSeparator = fullPropertyName.lastIndexOf(".");
            var propertyName = fullPropertyName;
            if (positionOfRightMostSeparator > 0) {
              propertyName = fullPropertyName.substr(positionOfRightMostSeparator + 1);
            }
            var propertyGroup = "";
            if (positionOfRightMostSeparator > 0) {
              propertyGroup = fullPropertyName.substr(0, positionOfRightMostSeparator + 1);
            }
            var propertyGroupWithoutArrayIndices = propertyGroup.replace(removeArrayBracketsRegEx, "");
            return {
              group: propertyGroup,
              groupWithoutArrayIndices: propertyGroupWithoutArrayIndices,
              name: propertyName
            };
          }
          /**
          * Collects all flattened name-value-pairs into one object using the property names as keys and their values as values (map-like).
          * Example: `{name: "accountNumber", value: "12345"}` becomes `mapObject["accountNumber"]="12345"`.
          *
          * @param {NameValuePair[]} elements flattened array of name-value-pairs
          * @param {object} mapObject container to collect the results. Needs to be created before e.g. using `{}`.
          * @param {function} filterMatchesFunction takes the property name as string argument and returns true (include) or false (exclude).
          * @protected
          * @memberof module:template_resolver.Resolver
          */
          function addToFilteredMapObject(elements, mapObject, filterMatchesFunction) {
            var index, element;
            for (index = 0; index < elements.length; index += 1) {
              element = elements[index];
              if (typeof filterMatchesFunction === "function" && filterMatchesFunction(element.name)) {
                mapObject[element.name] = element.value;
              }
            }
            return mapObject;
          }
          return Resolver;
        })();
      }, {
        "../../lib/js/flattenToArray": "kBit"
      }]
    }, {}, ["gEHB"], "data_restructor_js");
  }
  function $7bf3434c7df8cd87500844e87c18147d$init() {
    if (!$7bf3434c7df8cd87500844e87c18147d$executed) {
      $7bf3434c7df8cd87500844e87c18147d$executed = true;
      $7bf3434c7df8cd87500844e87c18147d$exec();
    }
    return $7bf3434c7df8cd87500844e87c18147d$exports;
  }
  // supports vanilla js & npm
  var $e24d7b60828abdbaee8b1b607b83c7e3$var$template_resolver = $e24d7b60828abdbaee8b1b607b83c7e3$var$template_resolver || $7bf3434c7df8cd87500844e87c18147d$init();
  // ASSET: node_modules/data-restructor/devdist/datarestructor.js
  var $4b4ac60d2c65cf4f1893cebd12938841$exports, $4b4ac60d2c65cf4f1893cebd12938841$var$define, $4b4ac60d2c65cf4f1893cebd12938841$executed = false;
  function $4b4ac60d2c65cf4f1893cebd12938841$exec() {
    $4b4ac60d2c65cf4f1893cebd12938841$exports = {};
    // modules are defined as an array
    // [ module function, map of requires ]
    // 
    // map of requires is short require name -> numeric require
    // 
    // anything defined in a previous bundle is accessed via the
    // orig method which is the require for previous bundles
    parcelRequire = (function (modules, cache, entry, globalName) {
      // Save the require from previous bundle to this closure if any
      var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
      var nodeRequire = "function" === 'function' && require;
      function newRequire(name, jumped) {
        if (!cache[name]) {
          if (!modules[name]) {
            // if we cannot find the module within our internal map or
            // cache jump to the current global require ie. the last bundle
            // that was added to the page.
            var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
            if (!jumped && currentRequire) {
              return currentRequire(name, true);
            }
            // If there are other bundles on this page the require from the
            // previous one is saved to 'previousRequire'. Repeat this as
            // many times as there are bundles until the module is found or
            // we exhaust the require chain.
            if (previousRequire) {
              return previousRequire(name, true);
            }
            // Try the node require function if it exists.
            if (nodeRequire && typeof name === 'string') {
              return nodeRequire(name);
            }
            var err = new Error('Cannot find module \'' + name + '\'');
            err.code = 'MODULE_NOT_FOUND';
            throw err;
          }
          localRequire.resolve = resolve;
          localRequire.cache = {};
          var module = cache[name] = new newRequire.Module(name);
          modules[name][0].call(module.exports, localRequire, module, module.exports, this);
        }
        return cache[name].exports;
        function localRequire(x) {
          return newRequire(localRequire.resolve(x));
        }
        function resolve(x) {
          return modules[name][1][x] || x;
        }
      }
      function Module(moduleName) {
        this.id = moduleName;
        this.bundle = newRequire;
        this.exports = {};
      }
      newRequire.isParcelRequire = true;
      newRequire.Module = Module;
      newRequire.modules = modules;
      newRequire.cache = cache;
      newRequire.parent = previousRequire;
      newRequire.register = function (id, exports) {
        modules[id] = [function (require, module) {
          module.exports = exports;
        }, {}];
      };
      var error;
      for (var i = 0; i < entry.length; i++) {
        try {
          newRequire(entry[i]);
        } catch (e) {
          // Save first error but execute all entries
          if (!error) {
            error = e;
          }
        }
      }
      if (entry.length) {
        // Expose entry point to Node, AMD or browser globals
        // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
        var mainExports = newRequire(entry[entry.length - 1]);
        // CommonJS
        if (typeof $4b4ac60d2c65cf4f1893cebd12938841$exports === "object" && "object" !== "undefined") {
          $4b4ac60d2c65cf4f1893cebd12938841$exports = mainExports;
        } else if (typeof $4b4ac60d2c65cf4f1893cebd12938841$var$define === "function" && $4b4ac60d2c65cf4f1893cebd12938841$var$define.amd) {
          $4b4ac60d2c65cf4f1893cebd12938841$var$define(function () {
            return mainExports;
          });
        } else if (globalName) {
          this[globalName] = mainExports;
        }
      }
      // Override the current require with this new one
      parcelRequire = newRequire;
      if (error) {
        // throw error from earlier, _after updating parcelRequire_
        throw error;
      }
      return newRequire;
    })({
      "kBit": [function (require, module, exports) {
        /**
        * @fileOverview Modded (compatibility, recursion depth) version of: https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objectss
        * @version ${project.version}
        * @see {@link https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objectss|stackoverflow flatten nested json objects}
        */
        var module = module || ({});
        // Fallback for vanilla js without modules
        /**
        * internal_object_tools. Not meant to be used outside this repository.
        * @default {}
        */
        var internal_object_tools = module.exports = {};
        // Export module for npm...
        /**
        * @typedef {Object} NameValuePair
        * @property {string} name - point separated names of the flattened main and sub properties, e.g. "responses[2].hits.hits[4]._source.name".
        * @property {string} value - value of the property
        */
        /**
        * @param {object} data hierarchical object that may consist fo fields, subfields and arrays.
        * @param {number} maxRecursionDepth
        * @returns {NameValuePair[]} array of property name and value pairs
        */
        internal_object_tools.flattenToArray = function (data, maxRecursionDepth) {
          var result = [];
          if (typeof maxRecursionDepth !== "number" || maxRecursionDepth < 1) {
            maxRecursionDepth = 20;
          }
          function recurse(cur, prop, depth) {
            if (depth > maxRecursionDepth || typeof cur === "function") {
              return;
            }
            if (Object(cur) !== cur) {
              result.push({
                name: prop,
                value: cur
              });
            } else if (Array.isArray(cur)) {
              var i;
              var l = cur.length;
              for (i = 0; i < l; i += 1) {
                recurse(cur[i], prop + "[" + i + "]", depth + 1);
              }
              if (l === 0) {
                result[prop] = [];
                result.push({
                  name: prop,
                  value: ""
                });
              }
            } else {
              var isEmpty = true;
              var p;
              for (p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "." + p : p, depth + 1);
              }
              if (isEmpty && prop) {
                result.push({
                  name: prop,
                  value: ""
                });
              }
            }
          }
          recurse(data, "", 0);
          return result;
        };
      }, {}],
      "gEHB": [function (require, module, exports) {
        var module = templateResolverInternalCreateIfNotExists(module);
        // Fallback for vanilla js without modules
        function templateResolverInternalCreateIfNotExists(objectToCheck) {
          return objectToCheck || ({});
        }
        /**
        * Provides a simple template resolver, that replaces variables in double curly brackets with the values of a given object.
        * @module template_resolver
        */
        var template_resolver = module.exports = {};
        // Export module for npm...
        template_resolver.internalCreateIfNotExists = templateResolverInternalCreateIfNotExists;
        var internal_object_tools = internal_object_tools || require("../../lib/js/flattenToArray");
        // supports vanilla js & npm
        template_resolver.Resolver = (function () {
          var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");
          /**
          * Resolver. Is used inside this repository. It could also be used outside.
          * @param {*} sourceDataObject The properties of this object will be used to replace the placeholders in the template.
          * @constructs Resolver
          * @alias module:template_resolver.Resolver
          */
          function Resolver(sourceDataObject) {
            /**
            * The properties of this source data object will be used to replace the placeholders in the template.
            */
            this.sourceDataObject = sourceDataObject;
            /**
            * Resolves the given template.
            *
            * The template may contain variables in double curly brackets.
            * Supported variables are all properties of this object, e.g. "{{fieldName}}", "{{displayName}}", "{{value}}".
            * Since this object may also contains (described) groups of sub objects, they can also be used, e.g. "{{summaries[0].value}}"
            * Parts of the index can be inserted by using e.g. "{{index[1]}}".
            *
            * @param {string} template
            * @returns {string} resolved template
            */
            this.resolveTemplate = function (template) {
              return this.replaceResolvableFields(template, addFieldsPerGroup(this.resolvableFieldsOfAll(this.sourceDataObject)));
            };
            /**
            * Returns a map like object, that contains all resolvable fields and their values as properties.
            * This function takes a variable count of input parameters,
            * each containing an object that contains resolvable fields to extract from.
            *
            * The recursion depth is limited to 3, so that an object,
            * that contains an object can contain another object (but not further).
            *
            * Properties beginning with an underscore in their name will be filtered out, since they are considered as internal fields.
            *
            * @param {...object} varArgs variable count of parameters. Each parameter contains an object that fields should be resolvable for variables.
            * @returns {object} object with resolvable field names and their values.
            * @public
            */
            this.resolvableFieldsOfAll = function () {
              var map = {};
              var ignoreInternalFields = function (propertyName) {
                return propertyName.indexOf("_") !== 0 && propertyName.indexOf("._") < 0;
              };
              var index;
              for (index = 0; index < arguments.length; index += 1) {
                addToFilteredMapObject(internal_object_tools.flattenToArray(arguments[index], 3), map, ignoreInternalFields);
              }
              return map;
            };
            /**
            * Replaces all variables in double curly brackets, e.g. {{property}},
            * with the value of that property from the resolvableProperties.
            *
            * Supported property types: string, number, boolean
            * @param {string} stringContainingVariables
            * @param {object[]} resolvableFields (name=value)
            */
            this.replaceResolvableFields = function (stringContainingVariables, resolvableFields) {
              var replaced = stringContainingVariables;
              var propertyNames = Object.keys(resolvableFields);
              var propertyIndex = 0;
              var propertyName = "";
              var propertyValue = "";
              for (propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex += 1) {
                propertyName = propertyNames[propertyIndex];
                propertyValue = resolvableFields[propertyName];
                replaced = replaced.replace("{{" + propertyName + "}}", propertyValue);
              }
              return replaced;
            };
          }
          /**
          * Adds the value of the "fieldName" property (including its group prefix) and its associated "value" property content.
          * For example: detail[2].fieldName="name", detail[2].value="Smith" lead to the additional property detail.name="Smith".
          * @param {object} object with resolvable field names and their values.
          * @returns {object} object with resolvable field names and their values.
          * @protected
          * @memberof module:template_resolver.Resolver
          */
          function addFieldsPerGroup(map) {
            var propertyNames = Object.keys(map);
            var i, fullPropertyName, propertyInfo, propertyValue;
            for (i = 0; i < propertyNames.length; i += 1) {
              fullPropertyName = propertyNames[i];
              propertyValue = map[fullPropertyName];
              propertyInfo = getPropertyNameInfos(fullPropertyName);
              // Supports fields that are defined by a property named "fieldName" (containing the name)
              // and a property named "value" inside the same sub object (containing its value).
              // Ignore custom fields that are named "fieldName"(propertyValue), since this would lead to an unpredictable behavior.
              // TODO could make "fieldName" and "value" configurable
              if (propertyInfo.name === "fieldName" && propertyValue !== "fieldName") {
                map[propertyInfo.groupWithoutArrayIndices + propertyValue] = map[propertyInfo.group + "value"];
              }
            }
            return map;
          }
          /**
          * Infos about the full property name including the name of the group (followed by the separator) and the name of the property itself.
          * @param {String} fullPropertyName
          * @returns {Object} Contains "group" (empty or group name including trailing separator "."), "groupWithoutArrayIndices" and "name" (property name).
          * @protected
          * @memberof module:template_resolver.Resolver
          */
          function getPropertyNameInfos(fullPropertyName) {
            var positionOfRightMostSeparator = fullPropertyName.lastIndexOf(".");
            var propertyName = fullPropertyName;
            if (positionOfRightMostSeparator > 0) {
              propertyName = fullPropertyName.substr(positionOfRightMostSeparator + 1);
            }
            var propertyGroup = "";
            if (positionOfRightMostSeparator > 0) {
              propertyGroup = fullPropertyName.substr(0, positionOfRightMostSeparator + 1);
            }
            var propertyGroupWithoutArrayIndices = propertyGroup.replace(removeArrayBracketsRegEx, "");
            return {
              group: propertyGroup,
              groupWithoutArrayIndices: propertyGroupWithoutArrayIndices,
              name: propertyName
            };
          }
          /**
          * Collects all flattened name-value-pairs into one object using the property names as keys and their values as values (map-like).
          * Example: `{name: "accountNumber", value: "12345"}` becomes `mapObject["accountNumber"]="12345"`.
          *
          * @param {NameValuePair[]} elements flattened array of name-value-pairs
          * @param {object} mapObject container to collect the results. Needs to be created before e.g. using `{}`.
          * @param {function} filterMatchesFunction takes the property name as string argument and returns true (include) or false (exclude).
          * @protected
          * @memberof module:template_resolver.Resolver
          */
          function addToFilteredMapObject(elements, mapObject, filterMatchesFunction) {
            var index, element;
            for (index = 0; index < elements.length; index += 1) {
              element = elements[index];
              if (typeof filterMatchesFunction === "function" && filterMatchesFunction(element.name)) {
                mapObject[element.name] = element.value;
              }
            }
            return mapObject;
          }
          return Resolver;
        })();
      }, {
        "../../lib/js/flattenToArray": "kBit"
      }],
      "NvOR": [function (require, module, exports) {
        var module = describedFieldInternalCreateIfNotExists(module);
        // Fallback for vanilla js without modules
        function describedFieldInternalCreateIfNotExists(objectToCheck) {
          return objectToCheck || ({});
        }
        /**
        * Describes a data field of the restructured data.
        * @module described_field
        */
        var described_field = module.exports = {};
        // Export module for npm...
        described_field.internalCreateIfNotExists = describedFieldInternalCreateIfNotExists;
        /**
        * Describes a field of the restructured data.
        * Dynamically added properties represent custom named groups containing DescribedDataField-Arrays.
        *
        * @typedef {Object} module:described_field.DescribedDataField
        * @property {string} [category=""] - name of the category. Could contain a short domain name like "product" or "vendor".
        * @property {string} [type=""] - type of the data element. Examples: "summary" for e.g. a list overview. "detail" e.g. when a summary is selected. "filter" e.g. for field/value pair results that can be selected as data filters.
        * @property {string} [abbreviation=""] - one optional character, a symbol character or a short abbreviation of the category
        * @property {string} [image=""] - one optional path to an image resource
        * @property {string} index - array of numbers containing the splitted index. Example: "responses[2].hits.hits[4]._source.name" will have an index of [2,4]
        * @property {string[]} groupNames - array of names of all dynamically added properties representing groups
        * @property {string} displayName - display name of the field
        * @property {string} fieldName - field name
        * @property {{*}} value - content of the field
        * @property {module:described_field.DescribedDataField[]} [couldBeAnyCustomGroupName] any number of groups attached to the field each containing multiple fields
        */
        described_field.DescribedDataFieldBuilder = (function () {
          /**
          * Builds a {@link module:described_field.DescribedDataField}.
          * DescribedDataField is the main element of the restructured data and therefore considered "public".
          * @constructs DescribedDataFieldBuilder
          * @alias module:described_field.DescribedDataFieldBuilder
          */
          function DescribedDataFieldBuilder() {
            /**
            * @type {module:described_field.DescribedDataField}
            */
            this.describedField = {
              category: "",
              type: "",
              abbreviation: "",
              image: "",
              index: [],
              groupNames: [],
              displayName: "",
              fieldName: "",
              value: ""
            };
            /**
            * Takes over all values of the template {@link module:described_field.DescribedDataField}.
            * @function
            * @param {module:described_field.DescribedDataField} template
            * @returns {DescribedDataFieldBuilder}
            * @example fromDescribedDataField(sourceField)
            */
            this.fromDescribedDataField = function (template) {
              this.category(template.category);
              this.type(template.type);
              this.abbreviation(template.abbreviation);
              this.image(template.image);
              this.index(template.index);
              this.groupNames(template.groupNames);
              this.displayName(template.displayName);
              this.fieldName(template.fieldName);
              this.value(template.value);
              return this;
            };
            /**
            * Sets the category.
            *
            * Contains a short domain nam, for example:
            * - "product" for products
            * - "vendor" for vendors
            *
            * @function
            * @param {String} [value=""]
            * @returns {DescribedDataFieldBuilder}
            * @example category("Product")
            */
            this.category = function (value) {
              this.describedField.category = withDefaultString(value, "");
              return this;
            };
            /**
            * Sets the type.
            *
            * Contains the type of the entry, for example:
            * - "summary" for e.g. a list overview.
            * - "detail" e.g. when a summary is selected.
            * - "filter" e.g. for field/value pair results that can be selected as search parameters.
            *
            * @function
            * @param {String} [value=""]
            * @returns {DescribedDataFieldBuilder}
            * @example type("summary")
            */
            this.type = function (value) {
              this.describedField.type = withDefaultString(value, "");
              return this;
            };
            /**
            * Sets the optional abbreviation.
            *
            * Contains a symbol character or a very short abbreviation of the category.
            * - "P" for products
            * - "V" for vendors
            *
            * @function
            * @param {String} [value=""]
            * @returns {DescribedDataFieldBuilder}
            * @example abbreviation("P")
            */
            this.abbreviation = function (value) {
              this.describedField.abbreviation = withDefaultString(value, "");
              return this;
            };
            /**
            * Sets the optional path to an image resource.
            *
            * @function
            * @param {String} [value=""]
            * @returns {DescribedDataFieldBuilder}
            * @example image("img/product.png")
            */
            this.image = function (value) {
              this.describedField.image = withDefaultString(value, "");
              return this;
            };
            /**
            * Sets the index as an array of numbers containing the splitted array indexes of the source field.
            * Example: "responses[2].hits.hits[4]._source.name" will have an index of [2,4].
            *
            * @function
            * @param {number[]} [value=[]]
            * @returns {DescribedDataFieldBuilder}
            * @example index([2,4])
            */
            this.index = function (value) {
              this.describedField.index = withDefaultArray(value, []);
              return this;
            };
            /**
            * Sets the group names as an array of strings containing the names of the dynamically added properties,
            * that contain an array of {@link module:described_field.DescribedDataField}-Objects.
            *
            * @function
            * @param {string[]} [value=[]]
            * @returns {DescribedDataFieldBuilder}
            * @example groupNames(["summaries","details","options"])
            */
            this.groupNames = function (value) {
              this.describedField.groupNames = withDefaultArray(value, []);
              return this;
            };
            /**
            * Sets the display name.
            *
            * @function
            * @param {String} [value=""]
            * @returns {DescribedDataFieldBuilder}
            * @example displayName("Color")
            */
            this.displayName = function (value) {
              this.describedField.displayName = withDefaultString(value, "");
              return this;
            };
            /**
            * Sets the (technical) field name.
            *
            * @function
            * @param {String} [value=""]
            * @returns {DescribedDataFieldBuilder}
            * @example fieldName("color")
            */
            this.fieldName = function (value) {
              this.describedField.fieldName = withDefaultString(value, "");
              return this;
            };
            /**
            * Sets the value/content of the field.
            *
            * @function
            * @param {*} value
            * @returns {DescribedDataFieldBuilder}
            * @example value("darkblue")
            */
            this.value = function (value) {
              this.describedField.value = value;
              return this;
            };
            /**
            * Finalizes the settings and builds the {@link module:described_field.DescribedDataField}.
            * @function
            * @returns {module:described_field.DescribedDataField}
            */
            this.build = function () {
              return this.describedField;
            };
          }
          function isSpecifiedString(value) {
            return typeof value === "string" && value !== null && value !== "";
          }
          function withDefaultString(value, defaultValue) {
            return isSpecifiedString(value) ? value : defaultValue;
          }
          function withDefaultArray(value, defaultValue) {
            return value === undefined || value === null ? defaultValue : value;
          }
          return DescribedDataFieldBuilder;
        })();
        /**
        * Creates a new described data field with all properties of the original one except for dynamically added groups.
        * @param {module:described_field.DescribedDataField} describedDataField
        * @returns {module:described_field.DescribedDataField}
        * @memberof module:described_field
        */
        described_field.copyWithoutGroups = function (describedDataField) {
          return new described_field.DescribedDataFieldBuilder().fromDescribedDataField(describedDataField).groupNames([]).build();
        };
        described_field.DescribedDataFieldGroup = (function () {
          /**
          * Adds groups to {@link module:described_field.DescribedDataField}s. These groups are dynamically added properties
          * that contain an array of sub fields of the same type {@link module:described_field.DescribedDataField}s.
          *
          * @param {module:described_field.DescribedDataField} dataField
          * @constructs DescribedDataFieldGroup
          * @alias module:described_field.DescribedDataFieldGroup
          * @example new described_field.DescribedDataFieldGroup(field).addGroupEntry("details", detailField);
          */
          function DescribedDataFieldGroup(dataField) {
            this.dataField = dataField;
            /**
            * Adds an entry to the given group. If the group does not exist, it will be created.
            * @function
            * @param {String} groupName name of the group to which the entry will be added
            * @param {module:described_field.DescribedDataField} describedField sub field that is added to the group
            * @returns {DescribedDataFieldGroup}
            */
            this.addGroupEntry = function (groupName, describedField) {
              this.addGroupEntries(groupName, [describedField]);
              return this;
            };
            /**
            * Adds entries to the given group. If the group does not exist, it will be created.
            * @function
            * @param {String} groupName name of the group to which the entries will be added
            * @param {module:described_field.DescribedDataField[]} describedFields sub fields that are added to the group
            * @returns {DescribedDataFieldGroup}
            */
            this.addGroupEntries = function (groupName, describedFields) {
              if (!groupName || groupName.length === 0) {
                return this;
              }
              if (!describedFields || describedFields.length === 0) {
                return this;
              }
              if (this.dataField[groupName] === undefined) {
                this.dataField.groupNames.push(groupName);
                this.dataField[groupName] = [];
              }
              var index;
              var describedField;
              for (index = 0; index < describedFields.length; index += 1) {
                describedField = describedFields[index];
                this.dataField[groupName].push(describedField);
              }
              return this;
            };
          }
          return DescribedDataFieldGroup;
        })();
      }, {}],
      "hflC": [function (require, module, exports) {
        var module = datarestructorInternalCreateIfNotExists(module);
        // Fallback for vanilla js without modules
        function datarestructorInternalCreateIfNotExists(objectToCheck) {
          return objectToCheck || ({});
        }
        /**
        * datarestructor namespace and module declaration.
        * It contains all functions to convert an object (e.g. parsed JSON) into uniform enumerated list of described field entries.
        *
        * <b>Transformation steps:</b>
        * - JSON
        * - flatten
        * - mark and identify
        * - add array fields
        * - deduplicate
        * - group
        * - flatten again
        * @module datarestructor
        */
        var datarestructor = module.exports = {};
        // Export module for npm...
        datarestructor.internalCreateIfNotExists = datarestructorInternalCreateIfNotExists;
        var internal_object_tools = internal_object_tools || require("../../lib/js/flattenToArray");
        // supports vanilla js & npm
        var template_resolver = template_resolver || require("../../src/js/templateResolver");
        // supports vanilla js & npm
        var described_field = described_field || require("../../src/js/describedfield");
        // supports vanilla js & npm
        /**
        * Takes the full qualified original property name and extracts a simple name out of it.
        *
        * @callback module:datarestructor.propertyNameFunction
        * @param {string} propertyName full qualified, point separated property name
        * @return {String} extracted, simple name
        */
        /**
        * Describes a selected part of the incoming data structure and defines,
        * how the data should be transformed.
        *
        * @typedef {Object} module:datarestructor.PropertyStructureDescription
        * @property {string} type - ""(default). Some examples: "summary" for e.g. a list overview. "detail" e.g. when a summary is selected. "filter" e.g. for field/value pair results that can be selected as search parameters.
        * @property {string} category - name of the category. Default = "". Could contain a short domain name like "product" or "vendor".
        * @property {string} [abbreviation=""] - one optional character, a symbol character or a short abbreviation of the category
        * @property {string} [image=""] - one optional path to an image resource
        * @property {boolean} propertyPatternTemplateMode - "false"(default): property name needs to be equal to the pattern. "true" allows variables like "{{fieldName}}" inside the pattern.
        * @property {string} propertyPattern - property name pattern (without array indices) to match
        * @property {string} indexStartsWith - ""(default) matches all ids. String that needs to match the beginning of the id. E.g. "1." will match id="1.3.4" but not "0.1.2".
        * @property {module:datarestructor.propertyNameFunction} getDisplayNameForPropertyName - display name for the property. ""(default) last property name element with upper case first letter.
        * @property {module:datarestructor.propertyNameFunction} getFieldNameForPropertyName - field name for the property. "" (default) last property name element.
        * @property {string} groupName - name of the property, that contains grouped entries. Default="group".
        * @property {string} groupPattern - Pattern that describes how to group entries. "groupName" defines the name of this group. A pattern may contain variables in double curly brackets {{variable}}.
        * @property {string} groupDestinationPattern - Pattern that describes where the group should be moved to. Default=""=Group will not be moved. A pattern may contain variables in double curly brackets {{variable}}.
        * @property {string} groupDestinationName - (default=groupName) Name of the group when it had been moved to the destination.
        * @property {string} deduplicationPattern - Pattern to use to remove duplicate entries. A pattern may contain variables in double curly brackets {{variable}}.
        */
        datarestructor.PropertyStructureDescriptionBuilder = (function () {
          /**
          * Builder for a {@link PropertyStructureDescription}.
          * @constructs PropertyStructureDescriptionBuilder
          * @alias module:datarestructor.PropertyStructureDescriptionBuilder
          */
          function PropertyStructureDescription() {
            /**
            * @type {module:datarestructor.PropertyStructureDescription}
            */
            this.description = {
              type: "",
              category: "",
              abbreviation: "",
              image: "",
              propertyPatternTemplateMode: false,
              propertyPattern: "",
              indexStartsWith: "",
              groupName: "group",
              groupPattern: "",
              groupDestinationPattern: "",
              groupDestinationName: null,
              deduplicationPattern: "",
              getDisplayNameForPropertyName: null,
              getFieldNameForPropertyName: null,
              matchesPropertyName: null
            };
            /**
            * Sets the type.
            *
            * Contains the type of the entry, for example:
            * - "summary" for e.g. a list overview.
            * - "detail" e.g. when a summary is selected.
            * - "filter" e.g. for field/value pair results that can be selected as search parameters.
            *
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example type("summary")
            */
            this.type = function (value) {
              this.description.type = withDefault(value, "");
              return this;
            };
            /**
            * Sets the category.
            *
            * Contains a short domain nam, for example:
            * - "product" for products
            * - "vendor" for vendors
            *
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example category("Product")
            */
            this.category = function (value) {
              this.description.category = withDefault(value, "");
              return this;
            };
            /**
            * Sets the optional abbreviation.
            *
            * Contains a symbol character or a very short abbreviation of the category.
            * - "P" for products
            * - "V" for vendors
            *
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example abbreviation("P")
            */
            this.abbreviation = function (value) {
              this.description.abbreviation = withDefault(value, "");
              return this;
            };
            /**
            * Sets the optional path to an image resource.
            *
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example image("img/product.png")
            */
            this.image = function (value) {
              this.description.image = withDefault(value, "");
              return this;
            };
            /**
            * Sets "equal mode" for the property pattern.
            *
            * "propertyPattern" need to match exactly if this mode is activated.
            *  It clears propertyPatternTemplateMode which means "equal" mode.
            * @function
            * @returns {module:datarestructor.PropertyStructureDescription}
            */
            this.propertyPatternEqualMode = function () {
              this.description.propertyPatternTemplateMode = false;
              return this;
            };
            /**
            * Sets "template mode" for the property pattern.
            *
            * "propertyPattern" can contain variables like {{fieldName}} and
            * doesn't need to match the property name exactly. If the "propertyPattern"
            * is shorter than the property name, it also matches when the property name
            * starts with the "propertyPattern".
            *
            * @function
            * @returns {module:datarestructor.PropertyStructureDescription}
            */
            this.propertyPatternTemplateMode = function () {
              this.description.propertyPatternTemplateMode = true;
              return this;
            };
            /**
            * Sets the property name pattern.
            *
            * Contains single property names with sub types separated by "." without array indices.
            * May contain variables in double curly brackets.
            *
            * Example:
            * - responses.hits.hits._source.{{fieldName}}
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example propertyPattern("responses.hits.hits._source.{{fieldName}}")
            */
            this.propertyPattern = function (value) {
              this.description.propertyPattern = withDefault(value, "");
              return this;
            };
            /**
            * Sets the optional beginning of the id that needs to match.
            * Matches all indices if set to "" (or not called).
            *
            * For example:
            * - "1." will match id="1.3.4" but not "0.1.2".
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example indexStartsWith("1.")
            */
            this.indexStartsWith = function (value) {
              this.description.indexStartsWith = withDefault(value, "");
              return this;
            };
            /**
            * Overrides the display name of the property.
            *
            * If it is not set or set to "" then it will be derived from the
            * last part of original property name starting with an upper case character.
            *
            * For example:
            * - "Product"
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example displayPropertyName("Product")
            */
            this.displayPropertyName = function (value) {
              this.description.getDisplayNameForPropertyName = createNameExtractFunction(value, this.description);
              if (isSpecifiedString(value)) {
                return this;
              }
              this.description.getDisplayNameForPropertyName = removeArrayValuePropertyPostfixFunction(this.description.getDisplayNameForPropertyName);
              this.description.getDisplayNameForPropertyName = upperCaseFirstLetterForFunction(this.description.getDisplayNameForPropertyName);
              return this;
            };
            /**
            * Overrides the (technical) field name of the property.
            *
            * If it is not set or set to "" then it will be derived from the
            * last part of original property name.
            *
            * For example:
            * - "product"
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example fieldName("product")
            */
            this.fieldName = function (value) {
              this.description.getFieldNameForPropertyName = createNameExtractFunction(value, this.description);
              return this;
            };
            /**
            * Sets the name of the property, that contains grouped entries.
            *
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example groupName("details")
            */
            this.groupName = function (value) {
              this.description.groupName = withDefault(value, "");
              return this;
            };
            /**
            * Sets the pattern that describes how to group entries.
            *
            * "groupName" defines the name of this group.
            * A pattern may contain variables in double curly brackets {{variable}}.
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example groupPattern("{{type}}-{{category}}")
            */
            this.groupPattern = function (value) {
              this.description.groupPattern = withDefault(value, "");
              return this;
            };
            /**
            * Sets the pattern that describes where the group should be moved to.
            *
            * Default=""=Group will not be moved.
            * A pattern may contain variables in double curly brackets {{variable}}.
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example groupDestinationPattern("main-{{category}}")
            */
            this.groupDestinationPattern = function (value) {
              this.description.groupDestinationPattern = withDefault(value, "");
              return this;
            };
            /**
            * Sets the name of the group when it had been moved to the destination.
            *
            * The default value is the groupName, which will be used when the value is not valid (null or empty)
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example groupDestinationPattern("options")
            */
            this.groupDestinationName = function (value) {
              this.description.groupDestinationName = withDefault(value, this.description.groupName);
              return this;
            };
            /**
            * Sets the pattern to be used to remove duplicate entries.
            *
            * A pattern may contain variables in double curly brackets {{variable}}.
            * A pattern may contain variables in double curly brackets {{variable}}.
            * @function
            * @param {String} [value=""]
            * @returns {module:datarestructor.PropertyStructureDescription}
            * @example deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
            */
            this.deduplicationPattern = function (value) {
              this.description.deduplicationPattern = withDefault(value, "");
              return this;
            };
            /**
            * Finalizes the settings and builds the  PropertyStructureDescription.
            * @function
            * @returns {module:datarestructor.PropertyStructureDescription}
            */
            this.build = function () {
              this.description.matchesPropertyName = createFunctionMatchesPropertyName(this.description);
              if (this.description.getDisplayNameForPropertyName == null) {
                this.displayPropertyName("");
              }
              if (this.description.getFieldNameForPropertyName == null) {
                this.fieldName("");
              }
              if (this.description.groupDestinationName == null) {
                this.groupDestinationName("");
              }
              return this.description;
            };
          }
          function createNameExtractFunction(value, description) {
            if (isSpecifiedString(value)) {
              return function () {
                return value;
              };
            }
            if (description.propertyPatternTemplateMode) {
              var patternToMatch = description.propertyPattern;
              // closure (closed over) parameter
              return extractNameUsingTemplatePattern(patternToMatch);
            }
            return extractNameUsingRightMostPropertyNameElement();
          }
          function createFunctionMatchesPropertyName(description) {
            var propertyPatternToMatch = description.propertyPattern;
            // closure (closed over) parameter
            if (!isSpecifiedString(propertyPatternToMatch)) {
              return function () {
                return false;
              };
            }
            if (description.propertyPatternTemplateMode) {
              return function (propertyNameWithoutArrayIndices) {
                return templateModePatternRegexForPattern(propertyPatternToMatch).exec(propertyNameWithoutArrayIndices) != null;
              };
            }
            return function (propertyNameWithoutArrayIndices) {
              return propertyNameWithoutArrayIndices === propertyPatternToMatch;
            };
          }
          function rightMostPropertyNameElement(propertyName) {
            var regularExpression = new RegExp("(\\w+)$", "gi");
            var match = propertyName.match(regularExpression);
            if (match != null) {
              return match[0];
            }
            return propertyName;
          }
          function upperCaseFirstLetter(value) {
            if (value.length > 1) {
              return value.charAt(0).toUpperCase() + value.slice(1);
            }
            return value;
          }
          function upperCaseFirstLetterForFunction(nameExtractFunction) {
            return function (propertyName) {
              return upperCaseFirstLetter(nameExtractFunction(propertyName));
            };
          }
          function removeArrayValuePropertyPostfixFunction(nameExtractFunction) {
            return function (propertyName) {
              var name = nameExtractFunction(propertyName);
              name = name != null ? name : "";
              return name.replace("_comma_separated_values", "");
            };
          }
          function extractNameUsingTemplatePattern(propertyPattern) {
            return function (propertyName) {
              var regex = templateModePatternRegexForPatternAndVariable(propertyPattern, "{{fieldName}}");
              var match = regex.exec(propertyName);
              if (match && match[1] != "") {
                return match[1];
              }
              return rightMostPropertyNameElement(propertyName);
            };
          }
          function extractNameUsingRightMostPropertyNameElement() {
            return function (propertyName) {
              return rightMostPropertyNameElement(propertyName);
            };
          }
          function templateModePatternRegexForPattern(propertyPatternToUse) {
            var placeholderInDoubleCurlyBracketsRegEx = new RegExp("\\\\\\{\\\\\\{[-\\w]+\\\\\\}\\\\\\}", "gi");
            return templateModePatternRegexForPatternAndVariable(propertyPatternToUse, placeholderInDoubleCurlyBracketsRegEx);
          }
          function templateModePatternRegexForPatternAndVariable(propertyPatternToUse, variablePattern) {
            var pattern = escapeCharsForRegEx(propertyPatternToUse);
            if (typeof variablePattern === "string") {
              variablePattern = escapeCharsForRegEx(variablePattern);
            }
            pattern = pattern.replace(variablePattern, "([-\\w]+)");
            pattern = "^" + pattern;
            return new RegExp(pattern, "i");
          }
          function escapeCharsForRegEx(characters) {
            var nonWordCharactersRegEx = new RegExp("([^-\\w])", "gi");
            return characters.replace(nonWordCharactersRegEx, "\\$1");
          }
          function withDefault(value, defaultValue) {
            return isSpecifiedString(value) ? value : defaultValue;
          }
          function isSpecifiedString(value) {
            return typeof value === "string" && value != null && value != "";
          }
          return PropertyStructureDescription;
        })();
        /**
        * Adds a group item/entry to the {@link module:datarestructor.DescribedEntry}.
        *
        * @callback module:datarestructor.addGroupEntryFunction
        * @param {String} groupName name of the group that should be added
        * @param {module:datarestructor.DescribedEntry} describedEntry entry that should be added to the group
        */
        /**
        * Adds some group items/entries to the {@link module:datarestructor.DescribedEntry}.
        *
        * @callback module:datarestructor.addGroupEntriesFunction
        * @param {String} groupName name of the group that should be added
        * @param {module:datarestructor.DescribedEntry[]} describedEntry entries that should be added to the group
        */
        /**
        * @typedef {Object} module:datarestructor.DescribedEntry
        * @property {string} category - category of the result from the PropertyStructureDescription using a short name or e.g. a symbol character
        * @property {string} type - type of the result from PropertyStructureDescription
        * @property {string} [abbreviation=""] - one optional character, a symbol character or a short abbreviation of the category
        * @property {string} [image=""] - one optional path to an image resource
        * @property {string} index - array of numbers containing the split index. Example: "responses[2].hits.hits[4]._source.name" leads to an array with the two elements: [2,4]
        * @property {string} displayName - display name extracted from the point separated hierarchical property name, e.g. "Name"
        * @property {string} fieldName - field name extracted from the point separated hierarchical property name, e.g. "name"
        * @property {string} value - content of the field
        * @property {string[]} groupNames - array of names of all dynamically added properties representing groups
        * @property {module:datarestructor.addGroupEntryFunction} addGroupEntry - function, that adds an entry to the given group. If the group does not exist, it will be created.
        * @property {module:datarestructor.addGroupEntriesFunction} addGroupEntries - function, that adds entries to the given group. If the group does not exist, it will be created.
        * @property {boolean} _isMatchingIndex - true, when _identifier.index matches the described "indexStartsWith"
        * @property {Object} _identifier - internal structure for identifier. Avoid using it outside since it may change.
        * @property {string} _identifier.index - array indices in hierarchical order separated by points, e.g. "0.0"
        * @property {string} _identifier.value - the (single) value of the "flattened" property, e.g. "Smith"
        * @property {string} _identifier.propertyNameWithArrayIndices - the "original" flattened property name in hierarchical order separated by points, e.g. "responses[0].hits.hits[0]._source.name"
        * @property {string} _identifier.propertyNameWithoutArrayIndices - same as propertyNamesWithArrayIndices but without array indices, e.g. "responses.hits.hits._source.name"
        * @property {string} _identifier.groupId - Contains the resolved groupPattern from the PropertyStructureDescription. Entries with the same id will be grouped into the "groupName" of the PropertyStructureDescription.
        * @property {string} _identifier.groupDestinationId - Contains the resolved groupDestinationPattern from the PropertyStructureDescription. Entries with this id will be moved to the given destination group.
        * @property {string} _identifier.deduplicationId - Contains the resolved deduplicationPattern from the PropertyStructureDescription. Entries with the same id will be considered to be a duplicate and hence removed.
        * @property {Object} _description - PropertyStructureDescription for internal use. Avoid using it outside since it may change.
        */
        /**
        * Returns a field value of the given {@link module:datarestructor.DescribedEntry}.
        *
        * @callback module:datarestructor.stringFieldOfDescribedEntryFunction
        * @param {module:datarestructor.DescribedEntry} entry described entry that contains the field that should be returned
        * @returns {String} field value
        */
        datarestructor.DescribedEntryCreator = (function () {
          var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");
          /**
          * Creates a {@link module:datarestructor.DescribedEntry}.
          * @constructs DescribedEntryCreator
          * @alias module:datarestructor.DescribedEntryCreator
          */
          function DescribedEntry(entry, description) {
            var indices = indicesOf(entry.name);
            var propertyNameWithoutArrayIndices = entry.name.replace(removeArrayBracketsRegEx, "");
            var templateResolver = new template_resolver.Resolver(this);
            this.category = description.category;
            this.type = description.type;
            this.abbreviation = description.abbreviation;
            this.image = description.image;
            /**
            * Array of numbers containing the split index.
            * Example: "responses[2].hits.hits[4]._source.name" leads to an array with two elements: [2,4]
            * This is the public version of the internal variable _identifier.index, which contains in contrast all index elements in one point separated string (e.g. "2.4").
            * @type {number[]}
            */
            this.index = indices.numberArray;
            this.displayName = description.getDisplayNameForPropertyName(propertyNameWithoutArrayIndices);
            this.fieldName = description.getFieldNameForPropertyName(propertyNameWithoutArrayIndices);
            this.value = entry.value;
            this.groupNames = [];
            this._isMatchingIndex = indices.pointDelimited.indexOf(description.indexStartsWith) == 0;
            this._description = description;
            this._identifier = {
              index: indices.pointDelimited,
              propertyNameWithArrayIndices: entry.name,
              propertyNameWithoutArrayIndices: propertyNameWithoutArrayIndices,
              groupId: "",
              groupDestinationId: "",
              deduplicationId: ""
            };
            this._identifier.groupId = templateResolver.replaceResolvableFields(description.groupPattern, templateResolver.resolvableFieldsOfAll(this, this._description, this._identifier));
            this._identifier.groupDestinationId = templateResolver.replaceResolvableFields(description.groupDestinationPattern, templateResolver.resolvableFieldsOfAll(this, this._description, this._identifier));
            this._identifier.deduplicationId = templateResolver.replaceResolvableFields(description.deduplicationPattern, templateResolver.resolvableFieldsOfAll(this, this._description, this._identifier));
            /**
            * Adds an entry to the given group. If the group does not exist, it will be created.
            * @param {String} groupName name of the group that should be added
            * @param {module:datarestructor.DescribedEntry} describedEntry entry that should be added to the group
            */
            this.addGroupEntry = function (groupName, describedEntry) {
              this.addGroupEntries(groupName, [describedEntry]);
            };
            /**
            * Adds entries to the given group. If the group does not exist, it will be created.
            * @param {String} groupName
            * @param {module:datarestructor.DescribedEntry[]} describedEntries
            */
            this.addGroupEntries = function (groupName, describedEntries) {
              if (!this[groupName]) {
                this.groupNames.push(groupName);
                this[groupName] = [];
              }
              var index;
              var describedEntry;
              for (index = 0; index < describedEntries.length; index += 1) {
                describedEntry = describedEntries[index];
                this[groupName].push(describedEntry);
              }
            };
          }
          /**
          * @typedef {Object} module:datarestructor.ExtractedIndices
          * @property {string} pointDelimited - bracket indices separated by points
          * @property {number[]} numberArray as array of numbers
          */
          /**
          * Returns "1.12.123" and [1,12,123] for "results[1].hits.hits[12].aggregates[123]".
          *
          * @param {String} fullPropertyName
          * @return {module:datarestructor.ExtractedIndices} extracted indices in different representations
          * @protected
          * @memberof module:datarestructor.DescribedEntryCreator
          */
          function indicesOf(fullPropertyName) {
            var arrayBracketsRegEx = new RegExp("\\[(\\d+)\\]", "gi");
            return indicesOfWithRegex(fullPropertyName, arrayBracketsRegEx);
          }
          /**
          * Returns "1.12.123" and [1,12,123] for "results[1].hits.hits[12].aggregates[123]".
          *
          * @param {string} fullPropertyName
          * @param {RegExp} regexWithOneNumberGroup
          * @return {module:datarestructor.ExtractedIndices} extracted indices in different representations
          * @protected
          * @memberof module:datarestructor.DescribedEntryCreator
          */
          function indicesOfWithRegex(fullPropertyName, regexWithOneNumberGroup) {
            var pointDelimited = "";
            var numberArray = [];
            var match;
            do {
              match = regexWithOneNumberGroup.exec(fullPropertyName);
              if (match) {
                if (pointDelimited.length > 0) {
                  pointDelimited += ".";
                }
                pointDelimited += match[1];
                numberArray.push(parseInt(match[1]));
              }
            } while (match);
            return {
              pointDelimited: pointDelimited,
              numberArray: numberArray
            };
          }
          return DescribedEntry;
        })();
        /**
        * @typedef {Object} module:datarestructor.TransformConfig
        * @property {boolean} debugMode enables/disables detailed logging
        * @property {number} [maxRecursionDepth=8] Maximum recursion depth
        * @property {number} [removeDuplicationAboveRecursionDepth=1]  Duplications will be removed above the given recursion depth value and remain unchanged below it.
        */
        datarestructor.Transform = (function () {
          /**
          * Main class for the data transformation.
          * @param {module:datarestructor.PropertyStructureDescription[]} descriptions
          * @constructs Transform
          * @alias module:datarestructor.Transform
          */
          function Transform(descriptions) {
            /**
            * Descriptions of the input data that define the behaviour of the transformation.
            * @type {module:datarestructor.DescribedEntry[]}
            */
            this.descriptions = descriptions;
            /**
            * Configuration for the transformation.
            * @protected
            * @type {module:datarestructor.TransformConfig}
            */
            this.config = {
              /**
              * Debug mode switch, that enables/disables detailed logging.
              * @protected
              * @type {boolean}
              */
              debugMode: false,
              /**
              * Maximum recursion depth. Defaults to 8.
              * @protected
              * @type {number}
              */
              maxRecursionDepth: 8,
              /**
              * Duplications will be removed above the given recursion depth and remain below it.
              * Defaults to 1.
              *
              * Since fields can contain groups of fields that can contain groups of fields..., cyclic
              * data structures are possible by nature and will lead to duplications. Some of them
              * might be intended e.g. to take one (sub-)field with all (duplicated) groups.
              * To restrict duplications and improve performance it is beneficial to define a
              * recursion depth, above which further duplication won't be used and should be removed/avoided.
              *
              * @protected
              * @type {number}
              */
              removeDuplicationAboveRecursionDepth: 1
            };
            /**
            * Enables debug mode. Logs additional information.
            * @returns {module:datarestructor.Transform}
            */
            this.enableDebugMode = function () {
              this.config.debugMode = true;
              return this;
            };
            /**
            * Sets the maximum recursion depth. Defaults to 8 if not set.
            * @param {number} value non negative number.
            * @returns {module:datarestructor.Transform}
            */
            this.setMaxRecursionDepth = function (value) {
              if (typeof value !== "number" || value < 0) {
                throw "Invalid max recursion depth value: " + value;
              }
              this.config.maxRecursionDepth = value;
              return this;
            };
            /**
            * Sets the recursion depth above which duplication will be removed. Duplications below it remain unchanged.
            * Defaults to 1.
            *
            * Since fields can contain groups of fields that can contain groups of fields..., cyclic
            * data structures are possible by nature and will lead to duplications. Some of them
            * might be intended e.g. to take one (sub-)field with all (duplicated) groups.
            * To restrict duplications and improve performance it is beneficial to define a
            * recursion depth, above which further duplication won't be used and should be removed/avoided.
            *
            * @param {number} value non negative number.
            * @returns {module:datarestructor.Transform}
            */
            this.setRemoveDuplicationAboveRecursionDepth = function (value) {
              if (typeof value !== "number" || value < 0) {
                throw "Invalid remove duplications above recursion depth value: " + value;
              }
              this.config.removeDuplicationAboveRecursionDepth = value;
              return this;
            };
            /**
            * "Assembly line", that takes the (pared JSON) data and processes it using all given descriptions in their given order.
            * @param {object} data - parsed JSON data or any other data object
            * @returns {module:datarestructor.DescribedEntry[]}
            * @example
            * var allDescriptions = [];
            * allDescriptions.push(summariesDescription());
            * allDescriptions.push(detailsDescription());
            * var result = new datarestructor.Transform(allDescriptions).processJson(jsonData);
            */
            this.processJson = function (data) {
              return processJsonUsingDescriptions(data, this.descriptions, this.config);
            };
          }
          /**
          * "Assembly line", that takes the jsonData and processes it using all given descriptions in their given order.
          * @param {object} jsonData parsed JSON data or any other data object
          * @param {module:datarestructor.PropertyStructureDescription[]} descriptions - already grouped entries
          * @param {module:datarestructor.TransformConfig} config configuration for the data transformation
          * @returns {module:datarestructor.DescribedEntry[]}
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function processJsonUsingDescriptions(jsonData, descriptions, config) {
            // "Flatten" the hierarchical input json to an array of property names (point separated "folders") and values.
            var processedData = internal_object_tools.flattenToArray(jsonData);
            // Fill in properties ending with the name "_comma_separated_values" for array values to make it easier to display them.
            processedData = fillInArrayValues(processedData);
            if (config.debugMode) {
              console.log("flattened data with array values:");
              console.log(processedData);
            }
            // Mark, identify and harmonize the flattened data by applying one description after another in their given order.
            var describedData = [];
            var descriptionIndex, description, dataWithDescription;
            for (descriptionIndex = 0; descriptionIndex < descriptions.length; descriptionIndex += 1) {
              description = descriptions[descriptionIndex];
              // Filter all entries that match the current description and enrich them with it
              dataWithDescription = extractEntriesByDescription(processedData, description);
              // Remove duplicate entries where a deduplicationPattern is described
              describedData = deduplicateFlattenedData(describedData, dataWithDescription);
            }
            processedData = describedData;
            if (config.debugMode) {
              console.log("describedData data:");
              console.log(processedData);
            }
            // Group entries where a groupPattern is described
            processedData = groupFlattenedData(processedData);
            if (config.debugMode) {
              console.log("grouped describedData data:");
              console.log(processedData);
            }
            // Move group entries where a groupDestinationPattern is described
            processedData = applyGroupDestinationPattern(processedData);
            if (config.debugMode) {
              console.log("moved grouped describedData data:");
              console.log(processedData);
            }
            // Turns the grouped object back into an array of DescribedEntry-Objects
            processedData = propertiesAsArray(processedData);
            // Converts the internal described entries  into described fields
            processedData = toDescribedFields(processedData, config);
            if (config.debugMode) {
              console.log("transformed result:");
              console.log(processedData);
            }
            return processedData;
          }
          /**
          * Takes two arrays of objects, e.g. [{id: B, value: 2},{id: C, value: 3}]
          * and [{id: A, value: 1},{id: B, value: 4}] and merges them into one:
          * [{id: C, value: 3},{id: A, value: 1},{id: B, value: 4}]
          *
          * Entries with the same id ("duplicates") will be overwritten.
          * Only the last element with the same id remains. The order is
          * determined by the order of the array elements, whereas the first
          * array comes before the second one. This means, that entries with the
          * same id in the second array overwrite entries in the first array,
          * and entries that occur later in the array overwrite earlier ones,
          * if they have the same id.
          *
          * The id is extracted from every element using the given function.
          *
          * @param {module:datarestructor.DescribedEntry[]} entries
          * @param {module:datarestructor.DescribedEntry[]} entriesToMerge
          * @param {module:datarestructor.stringFieldOfDescribedEntryFunction} idOfElementFunction returns the id of an DescribedEntry
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function mergeFlattenedData(entries, entriesToMerge, idOfElementFunction) {
            var entriesToMergeById = asIdBasedObject(entriesToMerge, idOfElementFunction);
            var merged = [];
            var index, entry, id;
            for (index = 0; index < entries.length; index += 1) {
              entry = entries[index];
              id = idOfElementFunction(entry);
              if (id == null || id === "" || entriesToMergeById[id] == null) {
                merged.push(entry);
              }
            }
            for (index = 0; index < entriesToMerge.length; index += 1) {
              entry = entriesToMerge[index];
              merged.push(entry);
            }
            return merged;
          }
          /**
          * Takes two arrays of objects, e.g. [{id: B, value: 2},{id: C, value: 3}]
          * and [{id: A, value: 1},{id: B, value: 4}] and merges them into one:
          * [{id: C, value: 3},{id: A, value: 1},{id: B, value: 4}]
          *
          * Entries with the same id ("duplicates") will be overwritten.
          * Only the last element with the same id remains. The order is
          * determined by the order of the array elements, whereas the first
          * array comes before the second one. This means, that entries with the
          * same id in the second array overwrite entries in the first array,
          * and entries occurring later in the array overwrite earlier ones,
          * if they have the same id.
          *
          * "entriesToMerge" will be returned directly, if "entries" is null or empty.
          *
          * The id is extracted from every element using their deduplication pattern (if available).
          *
          * @param {module:datarestructor.DescribedEntry[]} entries
          * @param {module:datarestructor.DescribedEntry[]} entriesToMerge
          * @param {module:datarestructor.stringFieldOfDescribedEntryFunction} idOfElementFunction returns the id of an DescribedEntry
          * @see mergeFlattenedData
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function deduplicateFlattenedData(entries, entriesToMerge) {
            if (entries == null || entries.length == 0) {
              return entriesToMerge;
            }
            var idOfElementFunction = function (entry) {
              return entry._identifier.deduplicationId;
            };
            return mergeFlattenedData(entries, entriesToMerge, idOfElementFunction);
          }
          /**
          * Converts the given elements to an object, that provides these
          * entries by their id. For example, [{id: A, value: 1}] becomes
          * result['A'] = 1.
          * @param {module:datarestructor.DescribedEntry[]} elements of DescribedEntry elements
          * @param {module:datarestructor.stringFieldOfDescribedEntryFunction} idOfElementFunction returns the id of an DescribedEntry
          * @return {module:datarestructor.DescribedEntry[] entries indexed by id
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function asIdBasedObject(elements, idOfElementFunction) {
            var idIndexedObject = new Object();
            for (var index = 0; index < elements.length; index++) {
              var element = elements[index];
              idIndexedObject[idOfElementFunction(element)] = element;
            }
            return idIndexedObject;
          }
          /**
          * Converts the given elements into an object, that provides these
          * entries by their id (determined by the entry's groupPattern).
          * For example, [{id: A, value: 1}] becomes result['A'] = 1.
          *
          * Furthermore, this function creates a group property (determined by the entry's groupName)
          * and collects all related elements (specified by their group pattern) in it.
          *
          * @param {module:datarestructor.DescribedEntry[]} elements of DescribedEntry elements
          * @return {module:datarestructor.DescribedEntry[] entries indexed by id
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function groupFlattenedData(flattenedData) {
            return groupById(flattenedData, function (entry) {
              return entry._identifier.groupId;
            }, function (entry) {
              return entry._description.groupName;
            });
          }
          /**
          * Converts the given elements into an object, that provides these
          * entries by their id. For example, [{id: A, value: 1}] becomes
          * result['A'] = 1. Furthermore, this function creates a group property (with the name )
          * and collects all related elements (specified by their group pattern) in it.
          *
          * @param {module:datarestructor.DescribedEntry[]} elements of DescribedEntry elements
          * @param {module:datarestructor.stringFieldOfDescribedEntryFunction} groupNameOfElementFunction function, that returns the name of the group property that will be created inside the "main" element.
          * @param {module:datarestructor.stringFieldOfDescribedEntryFunction} groupIdOfElementFunction returns the group id of an DescribedEntry
          * @return {module:datarestructor.DescribedEntry[] entries indexed by id
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function groupById(elements, groupIdOfElementFunction, groupNameOfElementFunction) {
            var groupedResult = new Object();
            for (var index = 0; index < elements.length; index++) {
              var element = elements[index];
              var groupId = groupIdOfElementFunction(element);
              if (groupId === "") {
                continue;
              }
              var groupName = groupNameOfElementFunction(element);
              if (groupName == null || groupName === "") {
                continue;
              }
              if (!groupedResult[groupId]) {
                groupedResult[groupId] = element;
              }
              groupedResult[groupId].addGroupEntry(groupName, element);
            }
            return groupedResult;
          }
          /**
          * Extracts entries out of "flattened" JSON data and provides an array of objects.
          * @param {Object[]} flattenedData - flattened json from search query result
          * @param {string} flattenedData[].name - name of the property in hierarchical order separated by points
          * @param {string} flattenedData[].value - value of the property as string
          * @param {module:datarestructor.PropertyStructureDescription} - description of structure of the entries that should be extracted
          * @return {module:datarestructor.DescribedEntry[]}
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function extractEntriesByDescription(flattenedData, description) {
            var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");
            var filtered = [];
            flattenedData.filter(function (entry) {
              var propertyNameWithoutArrayIndices = entry.name.replace(removeArrayBracketsRegEx, "");
              if (description.matchesPropertyName(propertyNameWithoutArrayIndices)) {
                var describedEntry = new datarestructor.DescribedEntryCreator(entry, description);
                if (describedEntry._isMatchingIndex) {
                  filtered.push(describedEntry);
                }
              }
            });
            return filtered;
          }
          /**
          * Takes already grouped {@link module:datarestructor.DescribedEntry} objects and
          * uses their "_identifier.groupDestinationId" (if exists)
          * to move groups to the given destination.
          *
          * This is useful, if separately described groups like "summary" and "detail" should be put together,
          * so that every summery contains a group with the regarding details.
          *
          * @param {module:datarestructor.DescribedEntry[]} groupedObject - already grouped entries
          * @return {module:datarestructor.DescribedEntry[]}
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function applyGroupDestinationPattern(groupedObject) {
            var keys = Object.keys(groupedObject);
            var keysToDelete = [];
            for (var index = 0; index < keys.length; index++) {
              var key = keys[index];
              var entry = groupedObject[key];
              if (entry._description.groupDestinationPattern != "") {
                var destinationKey = entry._identifier.groupDestinationId;
                if (groupedObject[destinationKey] != null) {
                  var newGroup = entry[entry._description.groupName];
                  groupedObject[destinationKey].addGroupEntries(entry._description.groupDestinationName, newGroup);
                  keysToDelete.push(key);
                }
              }
            }
            // delete all moved entries that had been collected by their key
            for (index = 0; index < keysToDelete.length; index += 1) {
              var keyToDelete = keysToDelete[index];
              delete groupedObject[keyToDelete];
            }
            return groupedObject;
          }
          /**
          * Fills in extra "_comma_separated_values" properties into the flattened data
          * for properties that end with an array. E.g. response.hits.hits.tags[0]="active" and response.hits.hits.tags[0]="ready"
          * will lead to the extra element "response.hits.hits.tags_comma_separated_values="active, ready".
          *
          * @return flattened data with filled in "_comma_separated_values" properties
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function fillInArrayValues(flattenedData) {
            var trailingArrayIndexRegEx = new RegExp("\\[\\d+\\]$", "gi");
            var result = [];
            var lastArrayProperty = "";
            var lastArrayPropertyValue = "";
            flattenedData.filter(function (entry) {
              if (!entry.name.match(trailingArrayIndexRegEx)) {
                if (lastArrayProperty !== "") {
                  result.push({
                    name: lastArrayProperty + "_comma_separated_values",
                    value: lastArrayPropertyValue
                  });
                  lastArrayProperty = "";
                }
                result.push(entry);
                return;
              }
              var propertyNameWithoutTrailingArrayIndex = entry.name.replace(trailingArrayIndexRegEx, "");
              if (lastArrayProperty === propertyNameWithoutTrailingArrayIndex) {
                lastArrayPropertyValue += ", " + entry.value;
              } else {
                if (lastArrayProperty !== "") {
                  result.push({
                    name: lastArrayProperty + "_comma_separated_values",
                    value: lastArrayPropertyValue
                  });
                  lastArrayProperty = "";
                }
                lastArrayProperty = propertyNameWithoutTrailingArrayIndex;
                lastArrayPropertyValue = entry.value;
              }
              result.push(entry);
            });
            return result;
          }
          function propertiesAsArray(groupedData) {
            var result = [];
            var propertyNames = Object.keys(groupedData);
            for (var propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex++) {
              var propertyName = propertyNames[propertyIndex];
              var propertyValue = groupedData[propertyName];
              result.push(propertyValue);
            }
            return result;
          }
          /**
          * Converts described entries (internal data structure) to described fields (external data structure).
          * Since the structure of a described field is hierarchical, every field needs to be converted
          * in a recursive manner. The maximum recursion depth is taken as the second parameter.
          * @param {module:datarestructor.DescribedEntry[]} describedEntries
          * @param {module:datarestructor.TransformConfig} config configuration for the data transformation
          * @returns {module:described_field.DescribedDataField[]}
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function toDescribedFields(describedEntries, config) {
            var result = [];
            var index;
            var describedEntity;
            for (index = 0; index < describedEntries.length; index += 1) {
              describedEntity = describedEntries[index];
              result.push(toDescribedField(describedEntity, 0, config));
            }
            return result;
          }
          /**
          * Converts a internal described entry to a newly created public described field.
          * Since the structure of a described field is hierarchical, this function is called recursively.
          * Because the internal described entries may very likely contain cyclic references, the depth of recursion
          * needs to be limited. Therefore, the current recursion depth is taken as second parameter
          * and the maximum recursion depth is taken as third parameter.
          * @param {module:datarestructor.DescribedEntry} entry the internal entry that will be converted
          * @param {number} recursionDepth current hierarchy recursion depth
          * @param {module:datarestructor.TransformConfig} config configuration for the data transformation
          * @returns {module:described_field.DescribedDataField}
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function toDescribedField(entry, recursionDepth, config) {
            var field = new described_field.DescribedDataFieldBuilder().category(entry.category).type(entry.type).abbreviation(entry.abbreviation).image(entry.image).index(entry.index).displayName(entry.displayName).fieldName(entry.fieldName).value(entry.value).build();
            if (recursionDepth > config.maxRecursionDepth) {
              return field;
            }
            var fieldGroups = new described_field.DescribedDataFieldGroup(field);
            forEachGroupEntry(entry, function (groupName, groupEntry) {
              if (groupEntry != entry || recursionDepth <= config.removeDuplicationAboveRecursionDepth) {
                fieldGroups.addGroupEntry(groupName, toDescribedField(groupEntry, recursionDepth + 1, config));
              } else {
                if (config.debugMode) {
                  console.log("Removed duplicate field " + groupEntry.fieldName + " with value " + groupEntry.value + " of group " + groupName + " at recursion depth " + recursionDepth);
                }
              }
            });
            return field;
          }
          /**
          * Takes the full qualified original property name and extracts a simple name out of it.
          *
          * @callback module:datarestructor.onEntryFoundFunction
          * @param {string} groupName name of the group where the entry had been found.
          * @param {module:datarestructor.DescribedEntry} foundEntry the found entry itself.
          */
          /**
          * Traverses through all groups and their entries and calls the given function on every found entry
          * with the group name and the entry itself as parameters.
          * @param {module:datarestructor.DescribedEntry} rootEntry
          * @param {module:datarestructor.onEntryFoundFunction} onFoundEntry
          * @protected
          * @memberof module:datarestructor.Transform
          */
          function forEachGroupEntry(rootEntry, onFoundEntry) {
            var groupIndex, entryIndex;
            var groupName, entry;
            for (groupIndex = 0; groupIndex < rootEntry.groupNames.length; groupIndex += 1) {
              groupName = rootEntry.groupNames[groupIndex];
              for (entryIndex = 0; entryIndex < rootEntry[groupName].length; entryIndex += 1) {
                entry = rootEntry[groupName][entryIndex];
                onFoundEntry(groupName, entry);
              }
            }
          }
          return Transform;
        })();
        /**
        * Main fassade for the data restructor as static function(s).
        *
        * @example
        * var allDescriptions = [];
        * allDescriptions.push(summariesDescription());
        * allDescriptions.push(detailsDescription());
        * var result = datarestructor.Restructor.processJsonUsingDescriptions(jsonData, allDescriptions);
        * @namespace module:datarestructor.Restructor
        */
        datarestructor.Restructor = {};
        /**
        * Static fassade function for the "Assembly line", that takes the jsonData and processes it using all given descriptions in their given order.
        * @param {object} jsonData - parsed JSON data or any other data object
        * @param {module:datarestructor.PropertyStructureDescription[]} descriptions - already grouped entries
        * @param {boolean} debugMode - false=default=off, true=write additional logs for detailed debugging
        * @returns {module:datarestructor.DescribedEntry[]}
        * @memberof module:datarestructor.Restructor
        * @deprecated since v3.1.0, please use "new datarestructor.Transform(descriptions).processJson(jsonData)".
        */
        datarestructor.Restructor.processJsonUsingDescriptions = function (jsonData, descriptions, debugMode) {
          var restructor = new datarestructor.Transform(descriptions);
          if (debugMode) {
            restructor.enableDebugMode();
          }
          return restructor.processJson(jsonData);
        };
      }, {
        "../../lib/js/flattenToArray": "kBit",
        "../../src/js/templateResolver": "gEHB",
        "../../src/js/describedfield": "NvOR"
      }]
    }, {}, ["hflC"], "data_restructor_js");
  }
  function $4b4ac60d2c65cf4f1893cebd12938841$init() {
    if (!$4b4ac60d2c65cf4f1893cebd12938841$executed) {
      $4b4ac60d2c65cf4f1893cebd12938841$executed = true;
      $4b4ac60d2c65cf4f1893cebd12938841$exec();
    }
    return $4b4ac60d2c65cf4f1893cebd12938841$exports;
  }
  // ASSET: src/js/restruct-data-client.js
  var $0d6a4c43af361229567048135f77b56e$exports, $0d6a4c43af361229567048135f77b56e$var$module, $0d6a4c43af361229567048135f77b56e$var$restruct, $0d6a4c43af361229567048135f77b56e$var$datarestructor, $0d6a4c43af361229567048135f77b56e$executed = false;
  // Fallback for vanilla js without modules
  function $0d6a4c43af361229567048135f77b56e$var$datarestructorInternalCreateIfNotExists(objectToCheck) {
    return objectToCheck || ({});
  }
  function $0d6a4c43af361229567048135f77b56e$exec() {
    $0d6a4c43af361229567048135f77b56e$exports = {};
    $0d6a4c43af361229567048135f77b56e$var$module = $0d6a4c43af361229567048135f77b56e$var$datarestructorInternalCreateIfNotExists($0d6a4c43af361229567048135f77b56e$var$module);
    $0d6a4c43af361229567048135f77b56e$var$restruct = $0d6a4c43af361229567048135f77b56e$var$module.exports = {};
    // Export module for npm...
    $0d6a4c43af361229567048135f77b56e$var$restruct.internalCreateIfNotExists = $0d6a4c43af361229567048135f77b56e$var$datarestructorInternalCreateIfNotExists;
    $0d6a4c43af361229567048135f77b56e$var$datarestructor = $0d6a4c43af361229567048135f77b56e$var$datarestructor || $4b4ac60d2c65cf4f1893cebd12938841$init();
    // supports vanilla js & npm
    $0d6a4c43af361229567048135f77b56e$var$restruct.DataConverter = (function () {
      /**
      * Provides the data converter for the search.
      * It uses "datarestructor" and acts as a delegating client in between.
      * @constructs DataConverter
      */
      function DataConverter() {
        /**
        * Creates the data converter function with or without debugMode.
        * @function
        * @param {boolean} debugMode
        * @returns data converter function
        * @memberof DataConverter#
        */
        this.createDataConverter = function (debugMode) {
          return function (jsonData) {
            return restructJson(jsonData, debugMode);
          };
        };
        /**
        * @function
        * @returns {PropertyStructureDescription}
        * @memberof DataConverter#
        */
        this.getDescriptions = function () {
          return getDescriptions();
        };
      }
      function restructJson(jsonData, debugMode) {
        if (debugMode) {
          console.log("data before it gets restructured:");
          console.log(jsonData);
        }
        var transform = new $0d6a4c43af361229567048135f77b56e$var$datarestructor.Transform(getDescriptions()).setRemoveDuplicationAboveRecursionDepth(0).setMaxRecursionDepth(2);
        if (debugMode) {
          transform.enableDebugMode();
        }
        var restructured = transform.processJson(jsonData);
        if (debugMode) {
          console.log("restructured data:");
          console.log(JSON.stringify(restructured, null, 2));
        }
        return restructured;
      }
      function getDescriptions() {
        var descriptions = [];
        descriptions.push(summarizedAccountNumberDescription());
        descriptions.push(summarizedAccountNameDescription());
        descriptions.push(summarizedAccountTypeDescription());
        descriptions.push(detailsDescription());
        descriptions.push(filtersDescription());
        descriptions.push(sitesMainDescription());
        descriptions.push(sitesOptionDefaultUrlPatternDescription());
        descriptions.push(sitesOptionsSummaryDescription());
        // descriptions.push(sitesOptionDetailsDescription()); //TODO could add details to filter options
        descriptions.push(sitesOptionUrlPatternDescription());
        return descriptions;
      }
      function summarizedAccountNumberDescription() {
        return new $0d6a4c43af361229567048135f77b56e$var$datarestructor.PropertyStructureDescriptionBuilder().type("summary").category("account").abbreviation("&#x1F4B6;").// banknote with euro sign
        indexStartsWith("0.").propertyPatternEqualMode().propertyPattern("responses.hits.hits._source.accountnumber").groupName("summaries").groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}").deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}").build();
      }
      function summarizedAccountNameDescription() {
        return new $0d6a4c43af361229567048135f77b56e$var$datarestructor.PropertyStructureDescriptionBuilder().type("summary").category("account").indexStartsWith("0.").propertyPatternEqualMode().propertyPattern("responses.hits.hits._source.disposer").groupName("summaries").groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}").groupDestinationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}").deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}").build();
      }
      function summarizedAccountTypeDescription() {
        return new $0d6a4c43af361229567048135f77b56e$var$datarestructor.PropertyStructureDescriptionBuilder().type("summary").category("account").indexStartsWith("0.").propertyPatternEqualMode().propertyPattern("responses.hits.hits._source.businesstype").groupName("summaries").groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}").groupDestinationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}").deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}").build();
      }
      function detailsDescription() {
        return new $0d6a4c43af361229567048135f77b56e$var$datarestructor.PropertyStructureDescriptionBuilder().type("detail").category("account").indexStartsWith("0.").propertyPatternTemplateMode().propertyPattern("responses.hits.hits._source.{{fieldName}}").groupName("details").groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}").groupDestinationPattern("{{category}}--summary--{{index[0]}}--{{index[1]}}").build();
      }
      function filtersDescription() {
        return new $0d6a4c43af361229567048135f77b56e$var$datarestructor.PropertyStructureDescriptionBuilder().type("filter").category("account").abbreviation("&#128206;").// Paperclip symbol
        indexStartsWith("1.").propertyPatternTemplateMode().propertyPattern("responses.aggregations.{{fieldName}}.buckets.key").groupName("options").groupPattern("{{index[0]}}--{{type}}--{{category}}--{{fieldName}}").build();
      }
      function sitesMainDescription() {
        return new $0d6a4c43af361229567048135f77b56e$var$datarestructor.PropertyStructureDescriptionBuilder().type("main").category("account").abbreviation("&#x261c;").// finger left navigation symbol
        indexStartsWith("2.").propertyPatternEqualMode().propertyPattern("responses.hits.hits._source.name").displayPropertyName("Target").groupName("default").groupPattern("{{category}}--{{type}}").build();
      }
      function sitesOptionDefaultUrlPatternDescription() {
        return new $0d6a4c43af361229567048135f77b56e$var$datarestructor.PropertyStructureDescriptionBuilder().type("url").category("account").indexStartsWith("2.").propertyPatternEqualMode().propertyPattern("responses.hits.hits._source.urltemplate").groupName("urltemplate").groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}").groupDestinationPattern("{{category}}--main").build();
      }
      function sitesOptionsSummaryDescription() {
        return new $0d6a4c43af361229567048135f77b56e$var$datarestructor.PropertyStructureDescriptionBuilder().type("summary").category("account").indexStartsWith("3.").propertyPatternEqualMode().propertyPattern("responses.hits.hits._source.name").displayPropertyName("Target").groupName("summaries").groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}").groupDestinationPattern("{{category}}--main").groupDestinationName("options").build();
      }
      // TODO could add details to filter/navigation options
      // function sitesOptionDetailsDescription() {
      // return new datarestructor.PropertyStructureDescriptionBuilder()
      // .type("details")
      // .category("account")
      // .indexStartsWith("3.")
      // .propertyPatternTemplateMode()
      // .propertyPattern("responses.hits.hits._source.{{fieldName}}")
      // .groupName("details")
      // .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      // .groupDestinationPattern("{{category}}--summary--{{index[0]}}--{{index[1]}}")
      // .build();
      // }
      function sitesOptionUrlPatternDescription() {
        return new $0d6a4c43af361229567048135f77b56e$var$datarestructor.PropertyStructureDescriptionBuilder().type("url").category("account").indexStartsWith("3.").propertyPatternTemplateMode().propertyPattern("responses.hits.hits._source.urltemplate").groupName("urltemplate").groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}").groupDestinationPattern("{{category}}--summary--{{index[0]}}--{{index[1]}}").build();
      }
      return DataConverter;
    })();
  }
  function $0d6a4c43af361229567048135f77b56e$init() {
    if (!$0d6a4c43af361229567048135f77b56e$executed) {
      $0d6a4c43af361229567048135f77b56e$executed = true;
      $0d6a4c43af361229567048135f77b56e$exec();
    }
    return $0d6a4c43af361229567048135f77b56e$exports;
  }
  // supports vanilla js & npm
  var $e24d7b60828abdbaee8b1b607b83c7e3$var$restruct = $e24d7b60828abdbaee8b1b607b83c7e3$var$restruct || $0d6a4c43af361229567048135f77b56e$init();
  // supports vanilla js & npm
  // Search using elasticsearch "Multi search API"
  // Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-multi-search.html
  $e24d7b60828abdbaee8b1b607b83c7e3$var$httpSearchClient = new $e24d7b60828abdbaee8b1b607b83c7e3$var$searchMenuServiceClient.HttpSearchConfig().searchMethod("POST").searchContentType("application/x-ndjson").searchUrlTemplate("http://localhost:9200/_msearch/template?filter_path=responses.hits.total.value,responses.hits.hits._source,hits.responses.hits.highlight,responses.aggregations.*.buckets").searchBodyTemplate('{"index": "accounts"}\n' + '{"id": "account_search_as_you_type_v1", "params":{{jsonSearchParameters}}}\n' + '{"index": "accounts"}\n' + '{"id": "account_tags_v1", "params":{"account_aggregations_prefix": "", "account_aggregations_size": 10}}\n' + '{"index": "sites"}\n' + '{"id": "sites_default_v1", "params":{"tenantnumber":{{tenantnumber}}}}\n' + '{"index": "sites"}\n' + '{"id": "sites_search_as_you_type_v1", "params":{{jsonSearchParameters}}}\n').debugMode(true).build();
  // Locally mocked search with a few pre-queried search results (for local debugging and testing)
  // Uncomment this section to try search without elasticsearch with some prerecorded data responses.
  // httpSearchClient = new searchMenuServiceClient.HttpSearchConfig()
  // .searchMethod("GET")
  // .searchUrlTemplate("/example/data/AccountSearchResult-{{searchtext}}.json")
  // .debugMode(true)
  // .build();
  // Locally mocked ALREADY CONVERTED AND OPTIMIZED search menu data with a few pre-queried search results (for local debugging and testing)
  // Uncomment this section and the dataConverter-Assignment to try search without elasticsearch with some prerecorded data responses.
  // httpSearchClient = new searchMenuServiceClient.HttpSearchConfig()
  // .searchMethod("GET")
  // .searchUrlTemplate("/example/data/AccountConvertedSearchOptimizedData-{{searchtext}}.json")
  // .debugMode(true)
  // .build();
  // TODO could add an example on how to configure a view (e.g. results view)
  // TODO could add an example on how to use HTML inside a view's "listEntryTextTemplate" to further style the entries
  // Configure and start the search bar functionality.
  new $e24d7b60828abdbaee8b1b607b83c7e3$var$searchmenu.SearchMenuAPI().searchService($e24d7b60828abdbaee8b1b607b83c7e3$var$httpSearchClient.search).dataConverter(new $e24d7b60828abdbaee8b1b607b83c7e3$var$restruct.DataConverter().createDataConverter(true)).templateResolver(function (template, sourceObject) {
    return new $e24d7b60828abdbaee8b1b607b83c7e3$var$template_resolver.Resolver(sourceObject).resolveTemplate(template);
  }).addPredefinedParametersTo(function (searchParameters) {
    searchParameters.tenantnumber = 999;
  }).addFocusStyleClassOnEveryCreatedElement("searchresultfocus").start();
})();

//# sourceMappingURL=search-binding.js.map
