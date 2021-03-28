var jsdom = require("jsdom");
const { JSDOM } = jsdom;

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


