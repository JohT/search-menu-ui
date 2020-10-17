//developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
https: if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}
