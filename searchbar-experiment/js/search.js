/**
 * @fileOverview "Searchbar" for the web client
 * @version ${project.version}
 */
"use strict";

/**
 * searchbar namespace declaration.
 * It contains all functions for the "search as you type" feature.
 * @default {}
 */
var searchbar = searchbar || {};

/**
 * Searchbar UI
 *
 * @namespace
 */
searchbar.SearchbarUI = (function () {
  var search = document.getElementById("searchbar");
  addEvent("input", search, function (event) {
    updateSearch(getEventTarget(event).value);
  });
  addEvent("keyup", search, function (event) {
    updateSearch(getEventTarget(event).value);
  });
  addEvent("focusin", search, function (event) {
    showResults();
  });
  addEvent("focusout", search, function (event) {
    hideResults();
  });
  addEvent("keypress", document.body, function (event) {
    if (event.key == "Escape" || event.keyCode == 27) {
      hideResults();
    }
  });

  function updateSearch(searchText) {
    var matchlist = document.getElementById("searchmatches");
    matchlist.innerHTML = "";
    if (searchText.length === 0) {
      hideResults();
      return;
    }
    showResults();
    getSearchResults(searchText);
  }

  function getSearchResults(searchText) {
    httpGetJson("../data/state_capitals.json", getHttpRequest(), function (
      jsonResult
    ) {
      displayResults(filterResults(jsonResult, searchText));
    });
  }

  function filterResults(jsonResults, searchText) {
    var regex = new RegExp("^" + searchText, "gi");
    return jsonResults.filter(function (entry) {
      return entry.name.match(regex) || entry.abbr.match(regex);
    });
  }

  function displayResults(jsonResults) {
    var matchlist = document.getElementById("searchmatches");
    jsonResults.forEach(function (entry) {
      matchlist.innerHTML +=
        "<li>" + entry.name + " (" + entry.abbr + ")" + "</li> ";
    });
  }

  function showResults() {
    var element = document.getElementById("searchresult");
    addClass("show", element);
  }

  function hideResults() {
    var element = document.getElementById("searchresult");
    removeClass("show", element);
  }

  function addClass(classToAdd, element) {
    removeClass(classToAdd, element);
    element.className += " " + classToAdd;
  }

  function removeClass(classToRemove, element) {
    var regex = new RegExp("\\s?\\b" + classToRemove + "\\b", "gi");
    element.className = element.className.replace(regex, "");
  }

  function addEvent(eventName, element, eventHandler) {
    if (element.addEventListener)
      element.addEventListener(eventName, eventHandler, false);
    else if (element.attachEvent) {
      element.attachEvent("on" + eventName, eventHandler);
    } else {
      element["on" + eventName] = eventHandler;
    }
  }

  function getEventTarget(event) {
    if (typeof event.currentTarget !== "undefined") {
      return event.currentTarget;
    } else if (typeof event.srcElement !== "undefined") {
      return event.srcElement;
    } else {
      throw new Error("Event doesn't contain bounded element: " + event);
    }
  }

  function httpGetJson(url, httpRequest, onJsonResultReceived) {
    httpRequest.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var jsonResult = JSON.parse(this.responseText);
        onJsonResultReceived(jsonResult);
      }
    };
    httpRequest.open("GET", url, true);
    httpRequest.send();
  }

  function getHttpRequest() {
    if (typeof XMLHttpRequest !== "undefined") {
      return new XMLHttpRequest();
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (e) {}
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
    // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
    throw new Error("This browser does not support XMLHttpRequest.");
  }
})();
