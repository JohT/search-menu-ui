var e=globalThis,t={},n={},r=e.parcelRequire6f19;null==r&&((r=function(e){if(e in t)return t[e].exports;if(e in n){var r=n[e];delete n[e];var o={id:e,exports:{}};return t[e]=o,r.call(o.exports,o,o.exports),o.exports}var s=Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(e,t){n[e]=t},e.parcelRequire6f19=r),(0,r.register)("5opz4",function(e,t){/**
 * Provide the XMLHttpRequest constructor for Internet Explorer 5.x-6.x:
 * Other browsers (including Internet Explorer 7.x-9.x) do not redefine
 * XMLHttpRequest if it already exists.
 *
 * This example is based on findings at:
 * http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
 * @returns {XMLHttpRequest}
 * @memberof xmlHttpRequest
 */(($3ed30644184af354$var$module||{}).exports={}).getXMLHttpRequest=function(){if("undefined"!=typeof XMLHttpRequest)try{var e=new XMLHttpRequest;return e.status,e}catch(e){console.log("XMLHttpRequest not available: "+e)}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){console.log("XMLHttpRequest Msxml2.XMLHTTP.6.0 not available: "+e)}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){console.log("XMLHttpRequest Msxml2.XMLHTTP.3.0 not available: "+e)}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){console.log("XMLHttpRequest Microsoft.XMLHTTP not available: "+e)}// Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
throw Error("This browser does not support XMLHttpRequest.")}});var o=s(o);// Fallback for vanilla js without modules
function s(e){return e||{}}/**
 * Search-Menu Service-Client.
 * It provides the (http) client/connection to the search backend service.
 * @module searchMenuServiceClient
 */var i=o.exports={};// Export module for npm...
i.internalCreateIfNotExists=s;var c=c||r("5opz4");// supports vanilla js & npm
i.HttpSearchConfig=function(){/**
   * Resolves variables in the template based on the given search parameters object.
   * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
   * @param {String} template contains variables in double curly brackets that should be replaced by the values of the parameterSourceObject.
   * @param {Object} parameterSourceObject object properties will be used to replace the variables of the template
   * @param {boolean} debugMode enables/disables extended logging for debugging
   * @memberof module:searchMenuServiceClient.HttpSearchConfig
   * @protected
   */function e(e,n,r){if(null==e)return null;var o,s=JSON.stringify(n),i=e;return o=i=t(i,"jsonSearchParameters",s),function(e,t){var n,r,o,s=Object.keys(e);for(n=0;n<s.length;n+=1)o=e[r=s[n]],t(r,o)}(n,function(e,n){o=t(o,e,n)}),i=o,r&&(console.log("template="+e),console.log("{{jsonSearchParameters}}="+s),console.log("resolved template="+i)),i}function t(e,t,n){//TODO could there be a better compatible solution to replace ALL occurrences instead of creating regular expressions?
var r,o=RegExp("\\{\\{"+(r=RegExp("([^-\\w])","gi"),t.replace(r,"\\$1"))+"\\}\\}","gm");return e.replace(o,n)}return(/**
   * Configures and builds the {@link module:searchMenuServiceClient.HttpClient}.
   * DescribedDataField is the main element of the restructured data and therefore considered "public".
   * @constructs HttpSearchConfig
   * @alias module:searchMenuServiceClient.HttpSearchConfig
   */function(){/**
     * HTTP Search Configuration.
     * @property {string} searchUrlTemplate URL that is called for every search request. It may include variables in double curly brackets like `{{searchtext}}`.
     * @property {string} [searchMethod="POST"] HTTP Method, that is used for every search request.
     * @property {string} [searchContentType="application/json"] HTTP MIME-Type of the body, that is used for every search request.
     * @property {string} searchBodyTemplate HTTP body template, that is used for every search request. It may include variables in double curly brackets like `{{jsonSearchParameters}}`.
     * @property {XMLHttpRequest} [httpRequest=new XMLHttpRequest()] Contains the XMLHttpRequest that is used to handle HTTP requests and responses. Defaults to XMLHttpRequest.
     * @property {boolean} [debugMode=false] Adds detailed logging for development and debugging.
     */this.config={searchUrlTemplate:"",searchMethod:"POST",searchContentType:"application/json",searchBodyTemplate:null,/**
       * Resolves variables in the search url template based on the given search parameters object.
       * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
       * @param {Object} searchParameters object properties will be used to replace the variables of the searchUrlTemplate
       */resolveSearchUrl:function(t){return e(this.searchUrlTemplate,t,this.debugMode)},/**
       * Resolves variables in the search body template based on the given search parameters object.
       * The variable {{jsonSearchParameters}} will be replaced by the JSON of all search parameters.
       * @param {Object} searchParameters object properties will be used to replace the variables of the searchBodyTemplate
       */resolveSearchBody:function(t){return e(this.searchBodyTemplate,t,this.debugMode)},httpRequest:null,debugMode:!1},/**
     * Sets the url for the HTTP request for the search.
     * It may include variables in double curly brackets like {{searchtext}}.
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */this.searchUrlTemplate=function(e){return this.config.searchUrlTemplate=e,this},/**
     * Sets the HTTP method for the search. Defaults to "POST".
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */this.searchMethod=function(e){return this.config.searchMethod=e,this},/**
     * Sets the HTTP content type of the request body. Defaults to "application/json".
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */this.searchContentType=function(e){return this.config.searchContentType=e,this},/**
     * Sets the HTTP request body template that may contain variables (e.g. {{searchParameters}}) in double curly brackets, or null if there is none.
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */this.searchBodyTemplate=function(e){return this.config.searchBodyTemplate=e,this},/**
     * Sets the HTTP-Request-Object. Defaults to XMLHttpRequest if not set.
     * @param {String} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */this.httpRequest=function(e){return this.config.httpRequest=e,this},/**
     * Sets the debug mode, that prints some more info to the console.
     * @param {boolean} value
     * @return {module:searchMenuServiceClient.HttpSearchConfig}
     */this.debugMode=function(e){return this.config.debugMode=!0===e,this},/**
     * Uses the configuration to build the http client that provides the function "search" (parameters: searchParameters, onSuccess callback).
     * @returns {module:searchMenuServiceClient.HttpClient}
     */this.build=function(){return this.config.httpRequest||(this.config.httpRequest=c.getXMLHttpRequest()),new i.HttpClient(this.config)}})}(),/**
 * This function will be called, when search results are available.
 * @callback module:searchMenuServiceClient.HttpClient.SearchServiceResultAvailable
 * @param {Object} searchResultData already parsed data object containing the result of the search
 */i.HttpClient=function(e){var t,n;/**
     * Configuration for the search HTTP requests.
     * @type {module:searchMenuServiceClient.HttpSearchConfig}
     */this.config=e,/**
     * This function will be called to trigger search (calling the search backend).
     * @function
     * @param {Object} searchParameters object that contains all parameters as properties. It will be converted to JSON.
     * @param {module:searchMenuServiceClient.HttpClient.SearchServiceResultAvailable} onSearchResultsAvailable will be called when search results are available.
     */this.search=(t=this.config,n=this.config.httpRequest,function(e,r){var o,s,i,c=t.resolveSearchUrl(e),a=t.resolveSearchBody(e),u={url:c,method:t.searchMethod,contentType:t.searchContentType,body:a};t.debugMode&&(o=r,r=function(e,t){console.log("successful search response with code "+t+": "+JSON.stringify(e,null,2)),o(e,t)}),s=r,i=function(e,t){console.error("search failed with status code "+t+": "+e)},n.onreadystatechange=function(){4===n.readyState&&(n.status>=200&&n.status<=299?s(JSON.parse(n.responseText),n.status):i(n.responseText,n.status))},n.open(u.method,u.url,!0),n.setRequestHeader("Content-Type",u.contentType),n.send(u.body)})};//# sourceMappingURL=search-service-client.js.map

//# sourceMappingURL=search-service-client.js.map
