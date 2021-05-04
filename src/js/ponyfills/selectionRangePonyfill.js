"use strict";

var module = module || {}; // Fallback for vanilla js without modules
/**
 * @namespace selectionrange
 */
var selectionrange = (module.exports = {}); // Fallback for vanilla js without modules

selectionrange.moveCursorToEndOf = function (element) {
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