var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},n={},o=e.parcelRequire6f19;null==o&&((o=function(e){if(e in t)return t[e].exports;if(e in n){var o=n[e];delete n[e];var r={id:e,exports:{}};return t[e]=r,o.call(r.exports,r,r.exports),r.exports}var s=new Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(e,t){n[e]=t},e.parcelRequire6f19=o),o.register("5opz4",(function(e,t){"use strict";var n=n||{};(n.exports={}).getXMLHttpRequest=function(){if("undefined"!=typeof XMLHttpRequest)try{var e=new XMLHttpRequest;return e.status,e}catch(e){console.log("XMLHttpRequest not available: "+e)}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){console.log("XMLHttpRequest Msxml2.XMLHTTP.6.0 not available: "+e)}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){console.log("XMLHttpRequest Msxml2.XMLHTTP.3.0 not available: "+e)}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){console.log("XMLHttpRequest Microsoft.XMLHTTP not available: "+e)}throw new Error("This browser does not support XMLHttpRequest.")}}));var r=s(r);function s(e){return e||{}}var i=r.exports={};i.internalCreateIfNotExists=s;var c=c||o("5opz4");i.HttpSearchConfig=function(){function e(e,n,o){if(null==e)return null;var r,s=JSON.stringify(n),i=e;return i=t(i,"jsonSearchParameters",s),r=i,function(e,t){var n,o,r=Object.keys(e);for(n=0;n<r.length;n+=1)t(o=r[n],e[o])}(n,(function(e,n){r=t(r,e,n)})),i=r,o&&(console.log("template="+e),console.log("{{jsonSearchParameters}}="+s),console.log("resolved template="+i)),i}function t(e,t,n){var o,r,s=new RegExp("\\{\\{"+(o=t,r=new RegExp("([^-\\w])","gi"),o.replace(r,"\\$1")+"\\}\\}"),"gm");return e.replace(s,n)}return function(){this.config={searchUrlTemplate:"",searchMethod:"POST",searchContentType:"application/json",searchBodyTemplate:null,resolveSearchUrl:function(t){return e(this.searchUrlTemplate,t,this.debugMode)},resolveSearchBody:function(t){return e(this.searchBodyTemplate,t,this.debugMode)},httpRequest:null,debugMode:!1},this.searchUrlTemplate=function(e){return this.config.searchUrlTemplate=e,this},this.searchMethod=function(e){return this.config.searchMethod=e,this},this.searchContentType=function(e){return this.config.searchContentType=e,this},this.searchBodyTemplate=function(e){return this.config.searchBodyTemplate=e,this},this.httpRequest=function(e){return this.config.httpRequest=e,this},this.debugMode=function(e){return this.config.debugMode=!0===e,this},this.build=function(){return this.config.httpRequest||(this.config.httpRequest=c.getXMLHttpRequest()),new i.HttpClient(this.config)}}}(),i.HttpClient=function(e){this.config=e,this.search=function(e,t){return function(n,o){var r,s=function(e,t){console.error("search failed with status code "+t+": "+e)},i=e.resolveSearchUrl(n),c=e.resolveSearchBody(n),a={url:i,method:e.searchMethod,contentType:e.searchContentType,body:c};e.debugMode&&(r=o,o=function(e,t){console.log("successful search response with code "+t+": "+JSON.stringify(e,null,2)),r(e,t)}),function(e,t,n,o){t.onreadystatechange=function(){if(4===t.readyState)if(t.status>=200&&t.status<=299){var e=JSON.parse(t.responseText);n(e,t.status)}else o(t.responseText,t.status)},t.open(e.method,e.url,!0),t.setRequestHeader("Content-Type",e.contentType),t.send(e.body)}(a,t,o,s)}}(this.config,this.config.httpRequest)};
//# sourceMappingURL=search-service-client.js.map
