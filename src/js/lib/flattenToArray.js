"use strict";
/**
 * @fileOverview Modded (compatibility, recursion depth) version of: https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objectss
 * @version ${project.version}
 * @see {@link https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objectss|stackoverflow flatten nested json objects}
 */
var module = module || {}; // Fallback for vanilla js without modules

/**
 * internal_object_tools. Not meant to be used outside this repository.
 * @default {}
 */
var internal_object_tools = module.exports={}; // Export module for npm...

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
      result.push({ name: prop, value: cur });
    } else if (Array.isArray(cur)) {
      var i;
      var l = cur.length;
      for (i = 0; i < l; i += 1) {
        recurse(cur[i], prop + "[" + i + "]", depth + 1);
      }
      if (l === 0) {
        result[prop] = [];
        result.push({ name: prop, value: "" });
      }
    } else {
      var isEmpty = true;
      var p;
      for (p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p, depth + 1);
      }
      if (isEmpty && prop) {
        result.push({ name: prop, value: "" });
      }
    }
  }
  recurse(data, "", 0);
  return result;
};
