/**
 * @fileOverview resultparser for the web search client
 * @version ${project.version}
 */

/**
 * resultparser namespace declaration.
 * It contains all functions for the "search as you type" feature.
 * @default {}
 */
var resultparser = resultparser || {};

resultparser.Tools = (function () {
  "use strict";

  //TODO Only to try out
  function introspectJson(jsonData) {
    //console.log(extractSummaries(flattenToArray(jsonData)));
    //console.log(extractHighlighted(flattenToArray(jsonData)));
    var merged = mergeFlattenedData(
      extractSummaries(flattenToArray(jsonData)),
      extractHighlighted(flattenToArray(jsonData)),
      getIdAndDisplayName
    );
    console.log("merged:");
    console.log(merged);
    console.log("details:");
    console.log(extractDetails(flattenToArray(jsonData)));
    console.log("fillInArrays:");
    console.log(fillInArrayValues(flattenToArray(jsonData)));
    return jsonData;
  }

  /**
   * @typedef {Object} ExtractConfig
   * @property {string} summaryPropertyName - full qualified property name (without array indizes) for the overview/summary
   * @property {string} displayPropertyName - display name for the overview/summary property
   * @property {string} detailPropertyPrefix - the prefix of the full qualified property names for the detail view
   */

  function extractSummaries(flattenedData) {
    var summaryPropertyName = "responses.hits.hits._source.kontonummer";
    var displayPropertyName = getDefaultDisplayPropertyName(summaryPropertyName);
    return extractEntries(flattenedData, summaryPropertyName, displayPropertyName, "");
  }

  function extractHighlighted(flattenedData) {
    var highlightProperty = "responses.hits.hits.highlight.kontonummer";
    var displayPropertyName = getDefaultDisplayPropertyName(highlightProperty);
    return extractEntries(flattenedData, highlightProperty, displayPropertyName, "");
  }

  function extractDetails(flattenedData) {
    var prefixPropertyName = "responses.hits.hits._source";
    return extractEntries(flattenedData, "", "", prefixPropertyName);
  }

  function getIdAndDisplayName(entry) {
    return entry.id + "-" + entry.displayName;
  }

  /**
   * Takes two arrays of objects, e.g. [{id: B, value: 2},{id: C, value: 3}]
   * and [{id: A, value: 1},{id: B, value: 4}] and merges them into one:
   * [{id: C, value: 3},{id: A, value: 1},{id: B, value: 4}]
   *
   * Entries with the same id ("duplicates") will be overwritten.
   * Only the last element with the same id remains. The order is
   * determined by the order of the array elements, whereas the first
   * array comes before the second one. This means, that entries with the
   * same id in the second array overwrite entries in the first array,
   * and entries occuring later in the array overwrite earlier ones,
   * if they have the same id.
   *
   * The id is extracted from every element using the given function.
   */
  function mergeFlattenedData(entries, entriesToMerge, getIdOfElementFunction) {
    var entriesById = asIdBasedObject(entries, getIdOfElementFunction);
    var entriesToMergeById = asIdBasedObject(entriesToMerge, getIdOfElementFunction);
    var merged = [];
    for (var index = 0; index < entriesById.length; index++) {
      var entryById = entriesById[index];
      if (entriesToMergeById[entryById] === null) {
        merged.push(entryById);
      }
    }
    merged.push(entriesToMerge);
    return merged;
  }

  /**
   * Converts the given array to an object, that provides these
   * entries by their id. For example, [{id: A, value: 1}] becomes
   * result['A'] = 1.
   * @param {array} Array of elements
   * @param {function} Function, that returns the id of an array element
   * @return {Object} indized by ids
   */
  function asIdBasedObject(array, getIdOfElementFunction) {
    var idBasedObject = [];
    for (var index = 0; index < array.length; index++) {
      var element = array[index];
      idBasedObject.push(array[index].id, array[index]);
    }
    return idBasedObject;
  }

  /**
   * @typedef {Object} FlattenedEntry
   * @property {string} id - array indizes in hierarchical order separated by points, e.g. "0.0"
   * @property {string} displayName - display name extracted from the point separated hierarchical property name, e.g. "Name"
   * @property {string} value - the (single) value of the "flattened" property, e.g. "Smith"
   * @property {string} propertyNamesWithArrayIndizes - the "original" flattened property name in hierarchical order separated by points, e.g. "responses[0].hits.hits[0]._source.name"
   * @property {string} propertyNameWithoutArrayIndizes - same as propertyNamesWithArrayIndizes but without array indizes, e.g. "responses.hits.hits._source.name"
   */

  /**
   * Extracts entries out of "flattened" JSON data and provides an array of objects.
   * @return {FlattenedEntry}
   */
  function extractEntries(flattenedData, propertyNameToExtract, displayPropertyName, detailPropertyPrefix) {
    var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");
    var extractIndizes = new RegExp("");
    var filtered = [];

    flattenedData.filter(function (entry) {
      var indizes = indizesOf(entry.name);
      var propertyNameWithoutArrayIndizes = entry.name.replace(removeArrayBracketsRegEx, "");
      if (propertyNameWithoutArrayIndizes === propertyNameToExtract) {
        filtered.push({
          id: indizes,
          //TODO Configurable "display name extract function"
          displayName: getDefaultDisplayPropertyName(propertyNameWithoutArrayIndizes),
          value: entry.value,
          propertyNamesWithArrayIndizes: entry.name,
          propertyNamesWithoutArrayIndizes: propertyNameWithoutArrayIndizes,
        });
      } else if (propertyNameWithoutArrayIndizes.startsWith(detailPropertyPrefix)) {
        filtered.push({
          id: indizes,
          displayName: displayPropertyName,
          value: entry.value,
          propertyNamesWithArrayIndizes: entry.name,
          propertyNamesWithoutArrayIndizes: propertyNameWithoutArrayIndizes,
        });
      }
    });

    return filtered;
  }

  /**
   * Puts extra "_comma_separated_values" properties into the flattened data
   * for properties that end with an array. E.g. response.hits.hits.tags[0]="active" and response.hits.hits.tags[0]="ready"
   * will lead to the extra element "response.hits.hits.tags_comma_separated_values="active, ready".
   *
   * @return flattened data with filled in "_comma_separated_values" properties
   */
  function fillInArrayValues(flattenedData) {
    var trailingArrayIndexRegEx = new RegExp("\\[\\d+\\]$", "gi");
    var result = [];
    var lastArrayProperty = "";
    var lastArrayPropertyValue = "";

    flattenedData.filter(function (entry) {
      if (!entry.name.match(trailingArrayIndexRegEx)) {
        if (lastArrayProperty !== "") {
          result.push({ name: lastArrayProperty + "_comma_separated_values", value: lastArrayPropertyValue });
          lastArrayProperty = "";
        }
        result.push(entry);
        return;
      }
      var propertyNameWithoutTrailingArrayIndex = entry.name.replace(trailingArrayIndexRegEx, "");
      if (lastArrayProperty === propertyNameWithoutTrailingArrayIndex) {
        lastArrayPropertyValue += ", " + entry.value;
      } else {
        if (lastArrayProperty !== "") {
          result.push({ name: lastArrayProperty + "_comma_separated_values", value: lastArrayPropertyValue });
          lastArrayProperty = "";
        }
        lastArrayProperty = propertyNameWithoutTrailingArrayIndex;
        lastArrayPropertyValue = entry.value;
      }
      result.push(entry);
    });
    return result;
  }

  /**
   * Returns "1.12.123" for "results[1].hits.hits[12].aggregates[123]".
   *
   * @param {String} fullPropertyName
   * @return {String} array indizes of the property separated by points
   */
  function indizesOf(fullPropertyName) {
    var arrayBracketsRegEx = new RegExp("\\[(\\d+)\\]", "gi");
    var result = "";
    var match;
    do {
      match = arrayBracketsRegEx.exec(fullPropertyName);
      if (match) {
        if (result.length > 0) {
          result += ".";
        }
        result += match[1];
      }
    } while (match);
    return result;
  }

  /**
   * Converts the full property name to a display ready property name.
   * It basically takes the last element (delimited by a point) and
   * converts the first letter to upper case.
   *
   * @param {String} propertyname
   * @returns {String} property name to display
   */
  function getDefaultDisplayPropertyName(propertyname) {
    var displayPropertyNameRegEx = new RegExp("(\\w+)$", "gi");
    var displayPropertyName = propertyname;
    var displayPropertyNameMatch = propertyname.match(displayPropertyNameRegEx);
    if (displayPropertyNameMatch != null) {
      displayPropertyName = displayPropertyNameMatch[0];
    }
    displayPropertyName = upperCaseFirstLetter(displayPropertyName);
    return displayPropertyName;
  }

  function upperCaseFirstLetter(value) {
    if (typeof value !== "string") {
      return value;
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  //Modded version of:
  //https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objectss
  function flattenToArray(data) {
    var result = [];
    function recurse(cur, prop) {
      if (Object(cur) !== cur) {
        result.push({ name: prop, value: cur });
      } else if (Array.isArray(cur)) {
        for (var i = 0, l = cur.length; i < l; i++) recurse(cur[i], prop + "[" + i + "]");
        if (l == 0) {
          result[prop] = [];
          result.push({ name: prop, value: "" });
        }
      } else {
        var isEmpty = true;
        for (var p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + "." + p : p);
        }
        if (isEmpty && prop) {
          result.push({ name: prop, value: "" });
        }
      }
    }
    recurse(data, "");
    return result;
  }

  /**
   * Public interface
   * @scope resultparser.Tools
   */
  return {
    introspectJson: introspectJson,
  };
})();

// Flattened example
// responses[0].hits.hits[0]._source.aktualisierungsdatum: "2020-08-08T08:31:30Z"
// responses[0].hits.hits[0]._source.betreuerkennung: "SARCON"
// responses[0].hits.hits[0]._source.geschaeftsart: "Giro"
// responses[0].hits.hits[0]._source.iban: "AT424321012345678901"
// responses[0].hits.hits[0]._source.kontonummer: "12345678901"
// responses[0].hits.hits[0]._source.kundennummer: "00001234567"
// responses[0].hits.hits[0]._source.mandantennummer: "999"
// responses[0].hits.hits[0]._source.neuanlagedatum: "2020-08-08"
// responses[0].hits.hits[0]._source.produktkennung: "GEHALT"
// responses[0].hits.hits[0]._source.tags[0]: "aktiv"
// responses[0].hits.hits[0]._source.tags[1]: "online"
// responses[0].hits.hits[0]._source.verfuegungsberechtigt: "Hans Mustermann"
// responses[0].hits.hits[0]._source.waehrungskennung: "EUR"
// responses[0].hits.hits[0].highlight.iban[0]: "<em>AT424321012345678901</em>"
// responses[0].hits.hits[0].highlight.kontonummer[0]: "<em>12345678901</em>"
// responses[0].hits.hits[1]._source.aktualisierungsdatum: "2020-08-09T08:20:30Z"
// responses[0].hits.hits[1]._source.betreuerkennung: "SARCON"
// responses[0].hits.hits[1]._source.geschaeftsart: "Giro"
// responses[0].hits.hits[1]._source.iban: "AT424321012345678907"
// responses[0].hits.hits[1]._source.kontonummer: "12345678907"
// responses[0].hits.hits[1]._source.kundennummer: "00001234571"
// responses[0].hits.hits[1]._source.mandantennummer: "999"
// responses[0].hits.hits[1]._source.neuanlagedatum: "2020-08-09"
// responses[0].hits.hits[1]._source.produktkennung: "TREUHND"
// responses[0].hits.hits[1]._source.tags[0]: "aktiv"
// responses[0].hits.hits[1]._source.verfuegungsberechtigt: "Carlo Martinez"
// responses[0].hits.hits[1]._source.waehrungskennung: "EUR"
// responses[0].hits.hits[1].highlight.iban[0]: "<em>AT424321012345678907</em>"
// responses[0].hits.hits[1].highlight.kontonummer[0]: "<em>12345678907</em>"
// responses[0].hits.total.value: 7
// responses[1].aggregations.betreuerkennung.buckets[0].doc_count: 4
// responses[1].aggregations.betreuerkennung.buckets[0].key: "klakle"
// responses[1].aggregations.betreuerkennung.buckets[1].doc_count: 3
// responses[1].aggregations.betreuerkennung.buckets[1].key: "sarcon"
// responses[1].aggregations.betreuerkennung.buckets[2].doc_count: 1
// responses[1].aggregations.betreuerkennung.buckets[2].key: "marsom"
// responses[1].aggregations.geschaeftsart.buckets[0].doc_count: 5
// responses[1].aggregations.geschaeftsart.buckets[0].key: "giro"
// responses[1].aggregations.geschaeftsart.buckets[1].doc_count: 3
// responses[1].aggregations.geschaeftsart.buckets[1].key: "darlehen"
// responses[1].aggregations.produktkennung.buckets[0].doc_count: 2
// responses[1].aggregations.produktkennung.buckets[0].key: "gehalt"
// responses[1].aggregations.produktkennung.buckets[1].doc_count: 2
// responses[1].aggregations.produktkennung.buckets[1].key: "privkre"
// responses[1].aggregations.produktkennung.buckets[2].doc_count: 1
// responses[1].aggregations.produktkennung.buckets[2].key: "kommerz"
// responses[1].aggregations.produktkennung.buckets[3].doc_count: 1
// responses[1].aggregations.produktkennung.buckets[3].key: "privkon"
// responses[1].aggregations.produktkennung.buckets[4].doc_count: 1
// responses[1].aggregations.produktkennung.buckets[4].key: "treuhnd"
// responses[1].aggregations.produktkennung.buckets[5].doc_count: 1
// responses[1].aggregations.produktkennung.buckets[5].key: "wohnbau"
// responses[1].aggregations.tags.buckets[0].doc_count: 7
// responses[1].aggregations.tags.buckets[0].key: "aktiv"
// responses[1].aggregations.tags.buckets[1].doc_count: 2
// responses[1].aggregations.tags.buckets[1].key: "kurzfristig"
// responses[1].aggregations.tags.buckets[2].doc_count: 2
// responses[1].aggregations.tags.buckets[2].key: "online"
// responses[1].aggregations.tags.buckets[3].doc_count: 1
// responses[1].aggregations.tags.buckets[3].key: "endfällig"
// responses[1].aggregations.tags.buckets[4].doc_count: 1
// responses[1].aggregations.tags.buckets[4].key: "gelöscht"
// responses[1].aggregations.tags.buckets[5].doc_count: 1
// responses[1].aggregations.tags.buckets[5].key: "langfristig"
// responses[1].aggregations.waehrungskennung.buckets[0].doc_count: 7
// responses[1].aggregations.waehrungskennung.buckets[0].key: "eur"
// responses[1].aggregations.waehrungskennung.buckets[1].doc_count: 1
// responses[1].aggregations.waehrungskennung.buckets[1].key: "chf"
// responses[1].hits.total.value: 8
