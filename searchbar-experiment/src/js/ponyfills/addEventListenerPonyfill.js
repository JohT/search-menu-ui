"use strict";

var module = module || {}; // Fallback for vanilla js without modules
/**
 * @@namespace eventlistener
 */
var eventlistener = (module.exports = {}); // Fallback for vanilla js without modules

/**
 * Adds an event listener/hander using "addEventListener" or whatever method the browser supports.
 * @param {String} eventName
 * @param {Element} element
 * @param {*} eventHandler
 * @memberof addeventlistener
 */
 eventlistener.addEventListener = function (eventName, element, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, eventHandler);
  } else {
    element["on" + eventName] = eventHandler;
  }
};
