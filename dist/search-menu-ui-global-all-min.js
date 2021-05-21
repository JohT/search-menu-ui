var require=require||function(){};"use strict";function datarestructorInternalCreateIfNotExists(e){return e||{}}(eventlistener=(module=(module=module||{})||{}).exports={}).addEventListener=function(e,t,n){t.addEventListener?t.addEventListener(e,n,!1):t.attachEvent?t.attachEvent("on"+e,n):t["on"+e]=n},(eventtarget=(module=module||{}).exports={}).getEventTarget=function(e){if(void 0!==e.currentTarget&&null!=e.currentTarget)return e.currentTarget;if(void 0!==e.srcElement&&null!=e.srcElement)return e.srcElement;throw new Error("Event doesn't contain bounded element: "+e)},(selectionrange=(module=module||{}).exports={}).moveCursorToEndOf=function(e){if("function"==typeof e.setSelectionRange)e.setSelectionRange(e.value.length,e.value.length);else if("number"==typeof e.selectionStart&&"number"==typeof e.selectionEnd)e.selectionStart=e.selectionEnd=e.value.length;else if("function"==typeof e.createTextRange){var t=e.createTextRange();t.collapse(!0),t.moveEnd("character",e.value.length),t.moveStart("character",e.value.length),t.select()}},(xmlHttpRequest=(module=module||{}).exports={}).getXMLHttpRequest=function(){if("undefined"!=typeof XMLHttpRequest)try{var e=new XMLHttpRequest;return e.status,e}catch(e){console.log("XMLHttpRequest not available: "+e)}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){console.log("XMLHttpRequest Msxml2.XMLHTTP.6.0 not available: "+e)}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){console.log("XMLHttpRequest Msxml2.XMLHTTP.3.0 not available: "+e)}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){console.log("XMLHttpRequest Microsoft.XMLHTTP not available: "+e)}throw new Error("This browser does not support XMLHttpRequest.")};var searchMenuServiceClient=(module=datarestructorInternalCreateIfNotExists(module)).exports={};searchMenuServiceClient.internalCreateIfNotExists=datarestructorInternalCreateIfNotExists;var module,xmlHttpRequest=xmlHttpRequest||require("../../src/js/ponyfills/xmlHttpRequestPonyfill");function datarestructorInternalCreateIfNotExists(e){return e||{}}searchMenuServiceClient.HttpSearchConfig=function(){function e(e,n,i){if(null==e)return null;var r,l=JSON.stringify(n),s=e;return s=t(s,"jsonSearchParameters",l),r=s,function(e,t){var n,i,r,l=Object.keys(e);for(n=0;n<l.length;n+=1)i=l[n],r=e[i],t(i,r)}(n,function(e,n){r=t(r,e,n)}),s=r,i&&(console.log("template="+e),console.log("{{jsonSearchParameters}}="+l),console.log("resolved template="+s)),s}function t(e,t,n){var i,r,l=new RegExp("\\{\\{"+(i=t,r=new RegExp("([^-\\w])","gi"),i.replace(r,"\\$1"))+"\\}\\}","gm");return e.replace(l,n)}return function(){this.config={searchUrlTemplate:"",searchMethod:"POST",searchContentType:"application/json",searchBodyTemplate:null,resolveSearchUrl:function(t){return e(this.searchUrlTemplate,t,this.debugMode)},resolveSearchBody:function(t){return e(this.searchBodyTemplate,t,this.debugMode)},httpRequest:null,debugMode:!1},this.searchUrlTemplate=function(e){return this.config.searchUrlTemplate=e,this},this.searchMethod=function(e){return this.config.searchMethod=e,this},this.searchContentType=function(e){return this.config.searchContentType=e,this},this.searchBodyTemplate=function(e){return this.config.searchBodyTemplate=e,this},this.httpRequest=function(e){return this.config.httpRequest=e,this},this.debugMode=function(e){return this.config.debugMode=!0===e,this},this.build=function(){return this.config.httpRequest||(this.config.httpRequest=xmlHttpRequest.getXMLHttpRequest()),new searchMenuServiceClient.HttpClient(this.config)}}}(),searchMenuServiceClient.HttpClient=function(){return function(e){this.config=e,this.search=function(e,t){return function(n,i){var r,l=e.resolveSearchUrl(n),s=e.resolveSearchBody(n),o={url:l,method:e.searchMethod,contentType:e.searchContentType,body:s};e.debugMode&&(r=i,i=function(e,t){console.log("successful search response with code "+t+": "+JSON.stringify(e,null,2)),r(e,t)}),function(e,t,n,i){t.onreadystatechange=function(){if(4===t.readyState)if(t.status>=200&&t.status<=299){var e=JSON.parse(t.responseText);n(e,t.status)}else i(t.responseText,t.status)},t.open(e.method,e.url,!0),t.setRequestHeader("Content-Type",e.contentType),t.send(e.body)}(o,t,i,function(e,t){console.error("search failed with status code "+t+": "+e)})}}(this.config,this.config.httpRequest)}}();var searchmenu=(module=datarestructorInternalCreateIfNotExists(module)).exports={};searchmenu.internalCreateIfNotExists=datarestructorInternalCreateIfNotExists;var eventtarget=eventtarget||require("./ponyfills/eventCurrentTargetPonyfill"),selectionrange=selectionrange||require("./ponyfills/selectionRangePonyfill"),eventlistener=eventlistener||require("./ponyfills/addEventListenerPonyfill");searchmenu.SearchViewDescriptionBuilder=function(){function e(e,t){return function(e){return"string"==typeof e&&null!=e&&""!=e}(e)?e:t}return function(t){this.description={viewElementId:t?t.viewElementId:"",listParentElementId:t?t.listParentElementId:"",listEntryElementIdPrefix:t?t.listEntryElementIdPrefix:"",listEntryElementTag:t?t.listEntryElementTag:"li",listEntryTextTemplate:t?t.listEntryTextTemplate:"{{displayName}}: {{value}}",listEntrySummaryTemplate:t?t.listEntrySummaryTemplate:"{{summaries[0].displayName}}: {{summaries[0].value}}",listEntryStyleClassTemplate:t?t.listEntryStyleClassTemplate:"{{view.listEntryElementIdPrefix}} {{category}}",isSelectableFilterOption:!!t&&t.isSelectableFilterOption},this.viewElementId=function(t){return this.description.viewElementId=e(t,""),this},this.listParentElementId=function(t){return this.description.listParentElementId=e(t,""),this},this.listEntryElementIdPrefix=function(t){return this.description.listEntryElementIdPrefix=e(t,""),this},this.listEntryElementTag=function(t){return this.description.listEntryElementTag=e(t,"li"),this},this.listEntryTextTemplate=function(t){return this.description.listEntryTextTemplate=e(t,"{{displayName}}: {{value}}"),this},this.listEntrySummaryTemplate=function(t){return this.description.listEntrySummaryTemplate=e(t,"{{summaries[0].displayName}}: {{summaries[0].value}}"),this},this.listEntryStyleClassTemplate=function(t){return this.description.listEntryStyleClassTemplate=e(t,"{{view.listEntryElementIdPrefix}} {{category}}"),this},this.isSelectableFilterOption=function(e){return this.description.isSelectableFilterOption=!0===e,this},this.build=function(){return this.description}}}(),searchmenu.SearchMenuAPI=function(){function e(e,t,n){eventlistener.addEventListener(e,t,n)}function t(e){return eventtarget.getEventTarget(e)}function n(e,t){var n=new RegExp("\\s?\\b"+e+"\\b","gi");t.className=t.className.replace(n,"")}function i(e,t){return function(e){return"string"==typeof e&&null!=e&&""!=e}(e)?e:t}return function(){this.config={triggerSearch:function(){throw new Error("search service needs to be defined.")},convertData:function(e){return e},resolveTemplate:function(){throw new Error("template resolver needs to be defined.")},addPredefinedParametersTo:function(){},onCreatedElement:function(){},navigateTo:function(e){window.location.href=e},createdElementListeners:[],searchAreaElementId:"searcharea",inputElementId:"searchinputtext",searchTextParameterName:"searchtext",resultsView:(new searchmenu.SearchViewDescriptionBuilder).viewElementId("searchresults").listParentElementId("searchmatches").listEntryElementIdPrefix("result").listEntryTextTemplate("{{abbreviation}} {{displayName}}").listEntrySummaryTemplate("{{summaries[0].abbreviation}} <b>{{summaries[1].value}}</b><br>{{summaries[2].value}}: {{summaries[0].value}}").build(),detailView:(new searchmenu.SearchViewDescriptionBuilder).viewElementId("searchdetails").listParentElementId("searchdetailentries").listEntryElementIdPrefix("detail").listEntryTextTemplate("<b>{{displayName}}:</b> {{value}}").build(),filterOptionsView:(new searchmenu.SearchViewDescriptionBuilder).viewElementId("searchfilteroptions").listParentElementId("searchfilteroptionentries").listEntryElementIdPrefix("filter").listEntryTextTemplate("{{value}}").listEntrySummaryTemplate("{{summaries[0].value}}").isSelectableFilterOption(!0).build(),filtersView:(new searchmenu.SearchViewDescriptionBuilder).viewElementId("searchresults").listParentElementId("searchfilters").listEntryElementIdPrefix("filter").isSelectableFilterOption(!0).build(),waitBeforeClose:700,waitBeforeSearch:500,waitBeforeMouseOver:700},this.searchService=function(e){return this.config.triggerSearch=e,this},this.dataConverter=function(e){return this.config.convertData=e,this},this.templateResolver=function(e){return this.config.resolveTemplate=e,this},this.addPredefinedParametersTo=function(e){return this.config.addPredefinedParametersTo=e,this},this.setElementCreatedHandler=function(e){return this.config.onCreatedElement=e,this},this.addElementCreatedHandler=function(e){return this.config.createdElementListeners.push(e),this},this.addFocusStyleClassOnEveryCreatedElement=function(r){var l=i(r,"focus");return this.addElementCreatedHandler(function(i,r){r&&(e("focus",i,function(e){!function(e,t){n(e,t);var i=t.className.length>0?" ":"";t.className+=i+e}(l,t(e))}),e("blur",i,function(e){n(l,t(e))}))}),this},this.searchAreaElementId=function(e){return this.config.searchAreaElementId=i(e,"searcharea"),this},this.inputElementId=function(e){return this.config.inputElementId=i(e,"searchinputtext"),this},this.searchTextParameterName=function(e){return this.config.searchTextParameterName=i(e,"searchtext"),this},this.resultsView=function(e){return this.config.resultsView=e,this},this.detailView=function(e){return this.config.detailView=e,this},this.filterOptionsView=function(e){return this.config.filterOptionsView=e,this},this.filtersView=function(e){return this.config.filtersView=e,this},this.waitBeforeClose=function(e){return this.config.waitBeforeClose=e,this},this.waitBeforeSearch=function(e){return this.config.waitBeforeSearch=e,this},this.waitBeforeMouseOver=function(e){return this.config.waitBeforeMouseOver=e,this},this.start=function(){var e=this.config;return e.createdElementListeners.length>0&&this.setElementCreatedHandler(function(t,n){var i=0;for(i=0;i<e.createdElementListeners.length;i+=1)e.createdElementListeners[i](t,n)}),new searchmenu.SearchMenuUI(e)}}}(),searchmenu.SearchMenuUI=function(){function e(e,l,s){var o,c,d,f=s.resultsView.listEntryElementIdPrefix+"--"+l,m=O(e,s.resultsView,f,s.resolveTemplate),h=V(e,s.resultsView,f,m);if(A(H(e,s.resultsView,s.resolveTemplate),h),C(h,s.onCreatedElement),function(e){return void 0!==e.details}(e)&&(i(h,u(e.details,s,w)),o=h,c=s.waitBeforeMouseOver,d=u(e.details,s,w),Q("mouseover",o,function(e){this.originalEvent=function(e){for(var t={},n=Object.keys(e),i=0;i<n.length;i++){var r=n[i],l=e[r];t[r]=l}return t}(e),this.delayedHandlerTimer=window.setTimeout(function(){d(void 0!==this.originalEvent?this.originalEvent:e)},c),this.preventEventHandling=function(){null!==this.delayedHandlerTimer&&clearTimeout(this.delayedHandlerTimer)},Q("mouseout",o,this.preventEventHandling),Q("mousedown",o,this.preventEventHandling),Q("keydown",o,this.preventEventHandling)}),r(h,function(){var t,n,i=(t=s.filtersView.listParentElementId,n=y(e,"category",""),g(t,function(e){var t=a(e.id).hiddenFields(),i=y(t,"urltemplate",[""])[0];if(""===i)return null;var r=y(t,n,"");return r!=n&&""!==r?null:j("inactive",e)?null:i.value}));if(i){var r=s.resolveTemplate(i,e);s.navigateTo(r)}})),function(e){return void 0!==e.options}(e)){var v=e.options;if(function(e){return void 0!==e.default}(e))v=function(e,t,n){if(!t)return e;var i,r=!1;for(i=0;i<e.length;i+=1)if(n(e[i],t)){r=!0;break}if(r)return e;var l=[];for(l.push(t),i=0;i<e.length;i+=1)l.push(e[i]);return l}(e.options,e.default[0],t(["value"])),function(e,t,n){W(e,u(t,n,I))}(E(e.default[0],v,s.filtersView,s),v,s);i(h,u(e.options,s,I)),r(h,u(e.options,s,I))}n(h,s)}function t(e){return function(t,n){var i;for(i=0;i<e.length;i+=1)if(t[e[i]]!=n[e[i]])return!1;return!0}}function n(e,t){z(e,o(t,f)),$(e,o(t,m)),J(e,o(t,c)),K(e,o(t,S))}function i(e,t){W(e,t),G(e,t)}function r(e,t){Q("mousedown",e,t),Y(e,t)}function l(e,t){Q("mousedown",e,t),Y(e,t),W(e,t)}function s(e,t){!function(e,t){Q("keydown",e,function(e){"Del"!=e.key&&"Delete"!=e.key&&46!=_(e)||t(e)})}(e,t),function(e,t){Q("keydown",e,function(e){"Backspace"!=e.key&&8!=_(e)||t(e)})}(e,t)}function o(e,t){return function(n){t(n,e)}}function u(e,t,n){return function(i){n(i,e,t)}}function a(e){var t=e.split("--");t.length<2&&console.log("expected at least one '--' separator inside the id "+e);var n=t[0],i=parseInt(t[1]),r=t[t.length-2],l=parseInt(t[t.length-1]),s=e.substring(0,e.lastIndexOf(l)-"--".length);return{id:e,type:r,index:l,previousId:s+"--"+(l-1),nextId:s+"--"+(l+1),firstId:s+"--1",lastId:s+"--"+document.getElementById(e).parentElement.childNodes.length,mainMenuId:n+"--"+i,mainMenuIndex:i,hiddenFieldsId:e+"--fields",isFirstElement:l<=1,isSubMenu:t.length>3,subMenuId:function(t){return e+"--"+t+"--1"},replaceMainMenuIndex:function(t){return n+"--"+t+e.substring(this.mainMenuId.length)},getNewIndexAfterRemovedMainMenuIndex:function(t){if(i<t)return e;if(i==t)throw new Error("index "+t+" should had been removed.");return this.replaceMainMenuIndex(i-1)},hiddenFields:function(){var t=document.getElementById(e+"--fields"),n=y(t,"textContent",t.innerText);return JSON.parse(n)}}}function c(e,t){var n=Z(e),i=document.getElementById(t.inputElementId);return n.blur(),i.focus(),selectionrange.moveCursorToEndOf(i),b(e),k(t),i}function d(e,t){var n=Z(e),i=document.getElementById(t.resultsView.listEntryElementIdPrefix+"--1");i&&(n.blur(),i.focus())}function f(e,t){h(e,function(e){var n=null;return e.type===t.resultsView.listEntryElementIdPrefix&&(n=document.getElementById(t.filterOptionsView.listEntryElementIdPrefix+"--1")),null===n&&(n=document.getElementById(t.resultsView.listEntryElementIdPrefix+"--1")),n}),k(t)}function m(e,t){v(e,function(n){var i=null;if(n.type===t.filterOptionsView.listEntryElementIdPrefix){var r=N(t.resultsView.listEntryElementIdPrefix);i=document.getElementById(t.resultsView.listEntryElementIdPrefix+"--"+r)}return null===i?c(e,t):i}),k(t)}function h(e,t){var n=Z(e),i=a(n.id);i.isSubMenu&&b(e);var r=document.getElementById(i.nextId);null==r&&"function"==typeof t&&(r=t(i)),null==r&&(r=document.getElementById(i.firstId)),null!=r&&(n.blur(),r.focus())}function v(e,t){var n=Z(e),i=a(n.id);i.isSubMenu&&b(e);var r=document.getElementById(i.previousId);null==r&&"function"==typeof t&&(r=t(i)),null==r&&(r=document.getElementById(i.lastId)),null!=r&&(n.blur(),r.focus())}function p(e,n,i){!function(e,t,n){W(e,M),s(e,o(n,P))}(E(function(e,t,n){var i,r,l=a(e).hiddenFields();for(i=0;i<t.length;i+=1)if(r=t[i],n(r,l))return r;return console.log("error: no selected entry found for id "+e+" in "+t),null}(Z(e).id,n,t(["fieldName","value"])),n,i.filtersView,i),0,i),b(e),x(e)}function E(e,t,i,r){var l,s,o,c,d,f,m,h,v,p=N(i.listEntryElementIdPrefix),E=i.listEntryElementIdPrefix+"--"+(p+1),w=y(e,"category",""),T=(l=w,s=e.fieldName,o=i.listParentElementId,c=null,null!=(d=g(o,function(e){var t=a(e.id).hiddenFields();if(t.fieldName===s){var n=y(t,"category","");if(""===n)c=e;else if(n===l)return e}}))?d:c);if(null!=T){var x=O(e,i,T.id,r.resolveTemplate);return m=x,(f=T).innerHTML=m,T=f}return T=V(e,i,E,O(e,i,E,r.resolveTemplate)),A(H(e,i,r.resolveTemplate),T),C(T,r.onCreatedElement),h=T,v=u(t,r,I),Q("mousedown",h,v),Y(h,v),G(h,v),n(T,r),T}function y(e,t,n){return void 0===e[t]?n:e[t]}function g(e,t){var n,i,r=document.getElementById(e);for(n=0;n<r.childNodes.length;n+=1)if(i=t(r.childNodes[n]))return i;return null}function w(e,t,n){k(n),T(e,t,n.detailView,n),b(e)}function I(e,t,n){k(n),T(e,t,n.filterOptionsView,n)}function T(e,t,n,i){!function(e){var t=document.getElementById(e);if("function"==typeof t.cloneNode&&"function"==typeof t.replaceChild){var n=t.cloneNode(!1);t.parentNode.replaceChild(n,t)}else t.innerHTML=""}(n.listParentElementId);var r,s=Z(e),o=null,a=null,c=0,d=s.id+"--"+n.listEntryElementIdPrefix,f=null;for(c=0;c<t.length;c+=1)a=V(o=t[c],n,d=s.id+"--"+n.listEntryElementIdPrefix+"--"+(c+1),O(o,n,d,i.resolveTemplate)),A(H(o,n,i.resolveTemplate),a),C(a,i.onCreatedElement),n.isSelectableFilterOption&&(z(r=a,h),$(r,v),K(r,x),J(r,x),l(a,u(t,i,p))),0===c&&(f=a);var m=F(s,function(e){return"DIV"==e.tagName}),E=document.getElementById(n.viewElementId),y=m.offsetWidth+15,g=function(e){var t=e.getBoundingClientRect();if(void 0!==t.y)return t.y;return t.top}(s)+function(){if(void 0!==window.pageYOffset)return window.pageYOffset;if("CSS1Compat"===(document.compatMode||""))return document.documentElement.scrollTop;return document.body.scrollTop}();E.style.left=y+"px",E.style.top=g+"px",q(E),n.isSelectableFilterOption&&(s.blur(),f.focus())}function x(e){var t=Z(e),n=a(t.id),i=document.getElementById(n.mainMenuId);t.blur(),i.focus(),function(e){var t=F(e,function(e){return j("show",e)});if(null!=t)D(t)}(t)}function S(e,t){k(t)}function b(e){void 0!==e.preventDefault?e.preventDefault():e.returnValue=!1}function M(e){b(e);var t,n,i=Z(e);j(t="inactive",n=i)?U(t,n):A(t,n)}function P(e,t){b(e),m(e,t),function(e){var t=Z(e),n=t.parentElement,i=a(t.id).mainMenuIndex;n.removeChild(t),function e(t,n,i,r){if(n>i||!t.childNodes)return;B(t.childNodes,function(t){r(t),e(t,n+1,i,r)})}(n,0,5,function(e){e.id&&(e.id=a(e.id).getNewIndexAfterRemovedMainMenuIndex(i))})}(e)}function C(e,t){e.id&&t(e,!0),B(e.childNodes,function(e){e.id&&t(e,!1)})}function B(e,t){var n=0;for(n=0;n<e.length;n+=1)t(e[n],n+1)}function N(e){var t=document.getElementById(e+"--1");return null===t?0:t.parentElement.childNodes.length}function V(e,t,n,i){var r=function(e,t,n){var i=document.createElement(n);return i.id=t,i.tabIndex="0",i.innerHTML=e,i}(i,n,t.listEntryElementTag);return document.getElementById(t.listParentElementId).appendChild(r),r}function O(e,t,n,i){var r=i(t.listEntryTextTemplate,e);return void 0!==e.summaries&&(r=i(t.listEntrySummaryTemplate,e)),r+='<p id="'+n+'--fields" style="display: none">'+JSON.stringify(e)+"</p>"}function H(e,t,n){var i=n(t.listEntryStyleClassTemplate,e);return i=n(i,{view:t})}function R(e){X(e.resultsView.viewElementId),X(e.detailView.viewElementId),X(e.filterOptionsView.viewElementId)}function k(e){X(e.detailView.viewElementId),X(e.filterOptionsView.viewElementId)}function L(e){q(document.getElementById(e))}function q(e){A("show",e)}function X(e){D(document.getElementById(e))}function F(e,t){for(var n=e;null!=n;){if(t(n))return n;n=n.parentNode}return null}function D(e){U("show",e)}function A(e,t){U(e,t);var n=t.className.length>0?" ":"";t.className+=n+e}function U(e,t){var n=new RegExp("\\s?\\b"+e+"\\b","gi");t.className=t.className.replace(n,"")}function j(e,t){return null!=t.className&&t.className.indexOf(e)>=0}function J(e,t){Q("keydown",e,function(e){"Escape"!=e.key&&"Esc"!=e.key&&27!=_(e)||t(e)})}function Y(e,t){Q("keydown",e,function(e){"Enter"!=e.key&&13!=_(e)||t(e)})}function W(e,t){Q("keydown",e,function(e){" "!=e.key&&"Spacebar"!=e.key&&32!=_(e)||t(e)})}function $(e,t){Q("keydown",e,function(e){"ArrowUp"!=e.key&&"Up"!=e.key&&38!=_(e)||t(e)})}function z(e,t){Q("keydown",e,function(e){"ArrowDown"!=e.key&&"Down"!=e.key&&40!=_(e)||t(e)})}function G(e,t){Q("keydown",e,function(e){"ArrowRight"!=e.key&&"Right"!=e.key&&39!=_(e)||t(e)})}function K(e,t){Q("keydown",e,function(e){"ArrowLeft"!=e.key&&"Left"!=e.key&&37!=_(e)||t(e)})}function Q(e,t,n){eventlistener.addEventListener(e,t,n)}function Z(e){return eventtarget.getEventTarget(e)}function _(e){return void 0===e.keyCode?-1:e.keyCode}return function(t){this.config=t,this.currentSearchText="",this.focusOutTimer=null,this.waitBeforeSearchTimer=null;var n=document.getElementById(t.inputElementId);J(n,function(e){Z(e).value="",R(t)}),z(n,o(t,d)),Q("keyup",n,function(n){null!==this.waitBeforeSearchTimer&&clearTimeout(this.waitBeforeSearchTimer);var i=Z(n).value;this.waitBeforeSearchTimer=window.setTimeout(function(){i===this.currentSearchText&&""!==this.currentSearchText||(function(t,n){document.getElementById(n.resultsView.listParentElementId).innerHTML="",0!==t.length?(L(n.resultsView.viewElementId),function(t,n){var i,r,l=(i=n.filtersView.listParentElementId,r={},g(i,function(e){var t=a(e.id).hiddenFields();return void 0===t.fieldName||void 0===t.value?null:j("inactive",e)?null:void(r[t.fieldName]=t.value)}),r);l[n.searchTextParameterName]=t,n.addPredefinedParametersTo(l),n.triggerSearch(l,function(t){!function(t,n){var i=0;for(i=0;i<t.length;i+=1)e(t[i],i+1,n)}(n.convertData(t),n)})}(t,n)):R(n)}(i,t),this.currentSearchText=i)},t.waitBeforeSearch)});var i=document.getElementById(t.searchAreaElementId);Q("focusin",i,function(){""!==document.getElementById(t.inputElementId).value&&(null!=this.focusOutTimer&&clearTimeout(this.focusOutTimer),L(t.resultsView.viewElementId))}),Q("focusout",i,function(){this.focusOutTimer=window.setTimeout(function(){R(t)},t.waitBeforeClose)})}}();