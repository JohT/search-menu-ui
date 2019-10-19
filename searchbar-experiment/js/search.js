"use strict";

var search = document.getElementById("searchbar");
addEvent("input", search, function (element, event) {
  updateSearch(element.currentTarget.value);
});
addEvent("focusin", search, function (element, event) {
  showResults();
});
addEvent("focusout", search, function (element, event) {
  hideResults();
});

function updateSearch(searchText) {
  var matchlist = document.getElementById("searchmatches");
  matchlist.innerHTML = "";
  if (searchText.length === 0) {
    hideResults();
    return;
  }
  showResults();
  var regex = new RegExp("^" + searchText, "gi");
  fetch("../data/state_capitals.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data.filter(function (entry) {
        return entry.name.match(regex) || entry.abbr.match(regex);
      });
    })
    .then(function (data) {
      data.forEach(function (entry) {
        matchlist.innerHTML += "<li>" + entry.name + " (" + entry.abbr + ")" + "</li> ";
      });
    });
}

function showResults() {
  hideResults();
  var element = document.getElementById("searchresult");
  var name = "show";
  element.className += " " + name;
}

function hideResults() {
  var element = document.getElementById("searchresult");
  element.className = element.className.replace(/\bshow\b/g, "");
}

function addEvent(evnt, elem, func) {
  if (elem.addEventListener)  // W3C DOM
     elem.addEventListener(evnt,func,false);
  else if (elem.attachEvent) { // IE DOM
     elem.attachEvent("on"+evnt, func);
  }
  else { // No much to do
     elem["on"+evnt] = func;
  }
}
