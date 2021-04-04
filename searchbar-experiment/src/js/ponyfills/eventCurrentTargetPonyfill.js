"use strict";

var module = module || {}; // Fallback for vanilla js without modules
/**
 * @@namespace eventtarget
 */
var eventtarget = (module.exports = {}); // Fallback for vanilla js without modules

/**
 * @returns {Element} target of the event
 * @memberof eventtarget
 */
eventtarget.getEventTarget = function (event) {
  if (typeof event.currentTarget !== "undefined" && event.currentTarget != null) {
    return event.currentTarget;
  }
  if (typeof event.srcElement !== "undefined" && event.srcElement != null) {
    return event.srcElement;
  } else {
    throw new Error("Event doesn't contain bounded element: " + event);
  }
};