// https://gist.github.com/brianonn/4ef965a06b9e950d80e4e8b8e4c527f9
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
}