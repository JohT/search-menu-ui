var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;

// var dom = new JSDOM(
//   '<html><head></head><body>' +
//     '<div id="searcharea">' +
//     '  <input type="text" id="searchbar" tabindex="0"/><br>' +
//     '  <div id="searchresults"> ' +
//     '    <ul id="searchmatches"></ul>' +
//     '    <ul id="searchfilters"></ul>' +
//     '  </div>' +
//     '  <div id="searchdetails">' +
//     '    <ul id="searchdetailentries"></ul>' +
//     '  </div>' +
//     '  <div id="searchfilteroptions">' +
//     '    <ul id="searchfilteroptionentries"></ul>' +
//     '  </div>' +
//     '</div>' +
//     '</body></html>'
// );
var dom = new JSDOM('<html><head></head><body><div id="test-container"></div></body></html>');

window = dom.window;

if (Object.keys(window).length === 0) {
  // this happens if contextify, one of jsdom's dependencies doesn't install correctly
  // (it installs different code depending on the OS, so it cannot get checked in.);
  throw "jsdom failed to create a usable environment, try uninstalling and reinstalling it";
}
global.window = window;
global.document = window.document;
console.log("jsdom installed");


