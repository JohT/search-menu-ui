"use strict";

var module = module || {}; // Fallback for vanilla js without modules
var xmlHttpRequestCreator = module.exports={}; // Fallback for vanilla js without modules

/**
 * Provide the XMLHttpRequest constructor for Internet Explorer 5.x-6.x:
 * Other browsers (including Internet Explorer 7.x-9.x) do not redefine
 * XMLHttpRequest if it already exists.
 *
 * This example is based on findings at:
 * http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
 * @returns {XMLHttpRequest}
 */
 xmlHttpRequestCreator.createXMLHttpRequest = function () {
  if (typeof XMLHttpRequest !== "undefined") {
    return new XMLHttpRequest();
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
