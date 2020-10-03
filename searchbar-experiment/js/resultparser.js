/**
 * @fileOverview resultparser for the web search client
 * @version ${project.version}
 */

/**
 * resultparser namespace declaration.
 * It contains all functions to convert a JSON into enumerated list entries.
 * Workflow: JSON -> flatten -> mark and identify -> add array fields -> deduplicate -> group -> flatten again
 * @default {}
 */
var resultparser = resultparser || {};

/**
 * @typedef {Object} FlattenedEntry
 * @property {string} category - category of the result using a short name or e.g. a symbol character
 * @property {string} type - type of the result from PropertyStructureDescription-type
 * @property {string} id - array indizes in hierarchical order separated by points, e.g. "0.0"
 * @property {string} displayName - display name extracted from the point separated hierarchical property name, e.g. "Name"
 * @property {string} fieldName - field name extracted from the point separated hierarchical property name, e.g. "name"
 * @property {string} value - the (single) value of the "flattened" property, e.g. "Smith"
 * @property {string} propertyNamesWithArrayIndizes - the "original" flattened property name in hierarchical order separated by points, e.g. "responses[0].hits.hits[0]._source.name"
 * @property {string} propertyNameWithoutArrayIndizes - same as propertyNamesWithArrayIndizes but without array indizes, e.g. "responses.hits.hits._source.name"
 * @property {string} groupName - name of the property, that contains grouped entries. Default="group".
 * @property {string} groupPattern - pattern that descibes how to group using {{variables}}. Deault="" (no grouping)
 * @property {string} groupDestinationPattern - Pattern that descibes where the group should be moved to. Default=""=Group will not be moved. A pattern may contain variables in double curly brackets {{variable}}.
 */

/**
 * @callback stringFieldOfElementFunction
 *  @param {FlattenedEntry} entry
 */

/**
 * @callback propertyNameFunction
 *  @param {string} propertyname
 */

/**
 * @typedef {Object} PropertyStructureDescription
 * @property {string} type - "summary"(default) for the list overview. "detail" when a summary is selected. "filter" for field/value pair results that can be selected as search parameters.
 * @property {string} category - name of the category. Default = "". Could contain a symbol character or a short domain name. (e.g. "city")
 * @property {string} propertyPatternMode - "equal"(default): propertyname is equal to pattern. "template" allows variables like "{{fieldname}}".
 * @property {string} propertyPattern - property name pattern (without array indizes) to match
 * @property {propertyNameFunction} getDisplayNameForPropertyName - display name for the property. ""(default) last property name element with upper case first letter.
 * @property {propertyNameFunction} getFieldNameForPropertyName - field name for the property. "" (default) last property name element.
 * @property {string} groupName - name of the property, that contains grouped entries. Default="group".
 * @property {string} groupPattern - Pattern that descibes how to group entries. "groupName" defines the name of this group. A pattern may contain variables in double curly brackets {{variable}}.
 * @property {string} groupDestinationPattern - Pattern that descibes where the group should be moved to. Default=""=Group will not be moved. A pattern may contain variables in double curly brackets {{variable}}.
 * @property {string} deduplicationPattern - Pattern to use to remove duplicate entries. A pattern may contain variables in double curly brackets {{variable}}.
 */

// TODO idPattern to distinguish between results of main array index 0, 1, 2 ....

/**
 * PropertyStructureDescription
 *
 * @namespace
 */
resultparser.PropertyStructureDescription = (function () {
  "use strict";

  /**
   * Constructor function and container for everything, that needs to exist per instance.
   */
  function Instance() {
    this.description = {
      type: "summary",
      category: "",
      propertyPatternMode: "equal",
      propertyPattern: "",
      groupName: "group",
      groupPattern: "",
      groupDestinationPattern: "",
      deduplicationPattern: "",
      getDisplayNameForPropertyName: null,
      getFieldNameForPropertyName: null,
      matchesPropertyName: null,
    };
    this.type = function (value) {
      this.description.type = value;
      return this;
    };
    this.category = function (value) {
      this.description.category = value;
      return this;
    };
    this.propertyPatternMode = function (value) {
      this.description.propertyPatternMode = value;
      return this;
    };
    this.propertyPattern = function (value) {
      this.description.propertyPattern = value;
      return this;
    };
    this.displayPropertyName = function (value) {
      this.description.getDisplayNameForPropertyName = createNameExtractFunction(value, this.description);
      if (isSpecifiedString(value)) {
        return this;
      }
      this.description.getDisplayNameForPropertyName = removeArrayValuePropertyPostfixFunction(this.description.getDisplayNameForPropertyName);
      this.description.getDisplayNameForPropertyName = upperCaseFirstLetterForFunction(this.description.getDisplayNameForPropertyName);
      return this;
    };
    this.fieldName = function (value) {
      this.description.getFieldNameForPropertyName = createNameExtractFunction(value, this.description);
      return this;
    };
    this.groupName = function (value) {
      this.description.groupName = value;
      return this;
    };
    /**
     * Pattern that descibes how to group entries. "groupName" defines the name of this group.
     * A pattern may contain variables in double curly brackets {{variable}}.
     */
    this.groupPattern = function (value) {
      this.description.groupPattern = value;
      return this;
    };
    /**
     * Pattern that descibes where the group should be moved to. Default=""=Group will not be moved.
     * A pattern may contain variables in double curly brackets {{variable}}.
     */
    this.groupDestinationPattern = function (value) {
      this.description.groupDestinationPattern = value;
      return this;
    };
    /**
     * Pattern to use to remove duplicate entries. A pattern may contain variables in double curly brackets {{variable}}.
     * A pattern may contain variables in double curly brackets {{variable}}.
     */
    this.deduplicationPattern = function (value) {
      this.description.deduplicationPattern = value;
      return this;
    };
    this.build = function () {
      this.description.matchesPropertyName = createFunctionMatchesPropertyName(this.description);
      if (this.description.getDisplayNameForPropertyName == null) {
        this.displayPropertyName("");
      }
      if (this.description.getFieldNameForPropertyName == null) {
        this.fieldName("");
      }
      return this.description;
    };
  }

  function createNameExtractFunction(value, description) {
    if (isSpecifiedString(value)) {
      return function (propertyname) {
        return value;
      };
    }
    if (isTemplatePatternMode(description)) {
      var patternToMatch = description.propertyPattern; // closure (closed over) parameter
      return extractNameUsingTemplatePattern(patternToMatch);
    }
    return extractNameUsingRightMostPropertyNameElement();
  }

  function createFunctionMatchesPropertyName(description) {
    var propertyPatternToMatch = description.propertyPattern; // closure (closed over) parameter
    if (!isSpecifiedString(propertyPatternToMatch)) {
      return function (propertyNameWithoutArrayIndizes) {
        return false; // Without a propertyPattern, no property will match (deactivated mark/identify).
      };
    }
    if (isTemplatePatternMode(description)) {
      return function (propertyNameWithoutArrayIndizes) {
        return templateModePatternRegexForPattern(propertyPatternToMatch).exec(propertyNameWithoutArrayIndizes);
      };
    }
    return function (propertyNameWithoutArrayIndizes) {
      return propertyNameWithoutArrayIndizes === propertyPatternToMatch;
    };
  }

  function isEuqalPatternMode(description) {
    return description.propertyPatternMode === "equal";
  }

  function isTemplatePatternMode(description) {
    return description.propertyPatternMode === "template";
  }

  function rigthMostPropertyNameElement(propertyname) {
    var regularExpression = new RegExp("(\\w+)$", "gi");
    var match = propertyname.match(regularExpression);
    if (match != null) {
      return match[0];
    }
    return propertyname;
  }

  function upperCaseFirstLetter(value) {
    if (value.length > 1) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

  function upperCaseFirstLetterForFunction(nameExtractFunction) {
    return function (propertyname) {
      return upperCaseFirstLetter(nameExtractFunction(propertyname));
    };
  }

  function removeArrayValuePropertyPostfixFunction(nameExtractFunction) {
    return function (propertyname) {
      var name = nameExtractFunction(propertyname);
      name = (name != null)? name : "";
      return name.replace("_comma_separated_values", "");
    };
  }

  function extractNameUsingTemplatePattern(propertyPattern) {
    return function (propertyname) {
      var regex = templateModePatternRegexForPattern(propertyPattern);
      var match = regex.exec(propertyname);
      if (match && match[1] != "") {
        return match[1];
      }
      return value;
    };
  }

  function extractNameUsingRightMostPropertyNameElement() {
    return function (propertyname) {
      return rigthMostPropertyNameElement(propertyname);
    };
  }

  function templateModePatternRegex(description) {
    return templateModePatternRegexForPattern(description.propertyPattern);
  }

  function templateModePatternRegexForPattern(propertyPatternToUse) {
    var placeholderInDoubleCurlyBracketsRegEx = new RegExp("\\\\\\{\\\\\\{[-\\w]+\\\\\\}\\\\\\}", "gi");
    var pattern = escapeCharsForRegEx(propertyPatternToUse);
    pattern = pattern.replace(placeholderInDoubleCurlyBracketsRegEx, "([-\\w]+)");
    pattern = "^" + pattern;
    return new RegExp(pattern, "i");
  }

  function escapeCharsForRegEx(characters) {
    var nonWordCharactersRegEx = new RegExp("([^-\\w])", "gi");
    return characters.replace(nonWordCharactersRegEx, "\\$1");
  }

  function isSpecifiedString(value) {
    return typeof value === "string" && value != null && value != "";
  }

  function isNotSpecified(value) {
    return typeof value !== "string" || value == null || value == "";
  }

  /**
   * Public interface
   * @scope resultparser.PropertyStructureDescription
   */
  return Instance;
})();

resultparser.Tools = (function () {
  "use strict";

  //TODO Only to try out
  function introspectJson(jsonData) {
    // console.log("summaries");
    // console.log(extractSummaries(fillInArrayValues(flattenToArray(jsonData))));
    // console.log("highlighted");
    // console.log(extractHighlighted(fillInArrayValues(flattenToArray(jsonData))));
    // console.log("old merged:");
    // var merged = mergeFlattenedData(
    //   extractSummaries(fillInArrayValues(flattenToArray(jsonData))),
    //   extractHighlighted(fillInArrayValues(flattenToArray(jsonData))),
    //   getIdAndDisplayName
    // );
    // console.log(merged);
    // console.log("deduplicated:");
    // console.log(
    //   deduplicateFlattenedData(
    //     extractSummaries(fillInArrayValues(flattenToArray(jsonData))),
    //     extractHighlighted(fillInArrayValues(flattenToArray(jsonData)))
    //   )
    // );
    // console.log("details:");
    // console.log(extractDetails(fillInArrayValues(flattenToArray(jsonData))));
    // console.log("grouped details:");
    // console.log(groupFlattenedData(extractDetails(fillInArrayValues(flattenToArray(jsonData)))));
    // console.log("filters:");
    // console.log(extractFilters(fillInArrayValues(flattenToArray(jsonData))));

    // console.log("grouped filters:");
    // console.log(groupFlattenedData(extractFilters(fillInArrayValues(flattenToArray(jsonData)))));

    // console.log("object assign two grouped objects:");
    // var groupedHighlights = groupFlattenedData(extractHighlighted(fillInArrayValues(flattenToArray(jsonData))));
    // var groupedDetails = groupFlattenedData(extractDetails(fillInArrayValues(flattenToArray(jsonData))));
    // var joinedHighlightsAndDetails = Object.assign(groupedHighlights, groupedDetails);
    // console.log(applyGroupDestinationPattern(joinedHighlightsAndDetails));

    console.log("full assembly line:");
    var allDescriptions = [];
    allDescriptions.push(summariesDescription());
    allDescriptions.push(highlightedDescription());
    allDescriptions.push(detailsDescription());
    allDescriptions.push(filtersDescription());
    console.log(processJsonUsingDescriptions(jsonData, allDescriptions));

    return jsonData;
  }

  function getIdAndDisplayName(entry) {
    return entry.category + "-" + entry.type + "-" + entry.id + "-" + entry.fieldName;
  }

  /**
   * "Assembly line", that takes the jsonData and processes it using all given descriptions (in their given order).
   * Workflow: JSON -> flatten -> mark and identify -> add array fields -> deduplicate -> group -> flatten again
   */
  function processJsonUsingDescriptions(jsonData, descriptions) {
    // "Flatten" the hierarchical input json to an array of propertynames (point spearated "folders") and values.
    var processedData = flattenToArray(jsonData);

    // Fill in properties ending with the name "_comma_separated_values" for array values to make it easier to display them.
    processedData = fillInArrayValues(processedData);

    // Mark, identify and harmonize the flattened data by applying one description after another in their given order.
    var harmonizedData = [];
    for (var descriptionIndex = 0; descriptionIndex < descriptions.length; descriptionIndex++) {
      var description = descriptions[descriptionIndex];
      // Filter all entries that match the current description and enrich them with it
      var dataWithDescription = extractEntriesByDescription(processedData, description);
      // Remove duplicate entries where a deduplicationPattern is described
      harmonizedData = deduplicateFlattenedData(harmonizedData, dataWithDescription);
    }
    processedData = harmonizedData;

    // Group entries where a groupPattern is described
    processedData = groupFlattenedData(processedData);

    // Move group entries where a groupDestinationPattern is described
    processedData = applyGroupDestinationPattern(processedData);

    return processedData;
  }

  function summariesDescription() {
    return new resultparser.PropertyStructureDescription()
      .type("summary")
      .category("Konto")
      .propertyPatternMode("equal")
      .propertyPattern("responses.hits.hits._source.kontonummer")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}--{{fieldName}}")
      .build();
  }

  function extractSummaries(flattenedData) {
    return extractEntriesByDescription(flattenedData, summariesDescription());
  }
  function highlightedDescription() {
    return new resultparser.PropertyStructureDescription()
      .type("summary")
      .category("Konto")
      .propertyPatternMode("equal")
      .propertyPattern("responses.hits.hits.highlight.kontonummer")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}--{{fieldName}}")
      .build();
  }

  function extractHighlighted(flattenedData) {
    return extractEntriesByDescription(flattenedData, highlightedDescription());
  }

  function detailsDescription() {
    return new resultparser.PropertyStructureDescription()
      .type("detail")
      .category("Konto")
      .propertyPatternMode("template")
      .propertyPattern("responses.hits.hits._source.{{fieldName}}")
      .groupName("details")
      .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
      .groupDestinationPattern("Konto--summary--{{id[0]}}--{{id[1]}}")
      .build();
  }

  function extractDetails(flattenedData) {
    return extractEntriesByDescription(flattenedData, detailsDescription());
  }

  function filtersDescription() {
    return new resultparser.PropertyStructureDescription()
      .type("filter")
      .category("Konto")
      .propertyPatternMode("template")
      .propertyPattern("responses.aggregations.{{fieldName}}.buckets.key")
      .groupName("options")
      .groupPattern("{{id[0]}}--{{type}}--{{category}}--{{fieldName}}")
      .build();
  }

  function extractFilters(flattenedData) {
    return extractEntriesByDescription(flattenedData, filtersDescription());
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
   *
   * @param {FlattenedEntry[]} entries
   * @param {FlattenedEntry[]} entriesToMerge
   * @param {stringFieldOfElementFunction} idOfElementFunction returns the id of an FlattenedEntry
   */
  function mergeFlattenedData(entries, entriesToMerge, idOfElementFunction) {
    var entriesById = asIdBasedObject(entries, idOfElementFunction);
    var entriesToMergeById = asIdBasedObject(entriesToMerge, idOfElementFunction);
    var merged = [];
    for (var index = 0; index < entries.length; index++) {
      var entry = entries[index];
      var id = idOfElementFunction(entry);
      if (id == null || id === "" || entriesToMergeById[id] == null) {
        merged.push(entry);
      }
    }
    for (var index = 0; index < entriesToMerge.length; index++) {
      var entry = entriesToMerge[index];
      merged.push(entry);
    }
    return merged;
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
   * "entriesToMerge" will be returned directly, if "entries" is null or empty.
   *
   * The id is extracted from every element using their deduplication pattern (if available).
   *
   * @param {FlattenedEntry[]} entries
   * @param {FlattenedEntry[]} entriesToMerge
   * @param {stringFieldOfElementFunction} idOfElementFunction returns the id of an FlattenedEntry
   * @see mergeFlattenedData
   */
  function deduplicateFlattenedData(entries, entriesToMerge) {
    if (entries == null || entries.length == 0) {
      return entriesToMerge;
    }
    var idOfElementFunction = function (entry) {
      return entry.replaceVariables(entry.deduplicationPattern);
    };
    return mergeFlattenedData(entries, entriesToMerge, idOfElementFunction);
  }

  /**
   * Converts the given elements to an object, that provides these
   * entries by their id. For example, [{id: A, value: 1}] becomes
   * result['A'] = 1.
   * @param {FlattenedEntry[]} elements of FlattenedEntry elements
   * @param {stringFieldOfElementFunction} idOfElementFunction returns the id of an FlattenedEntry
   * @return {FlattenedEntry[] entries indexed by id
   */
  function asIdBasedObject(elements, idOfElementFunction) {
    var idIndexedObject = new Object();
    for (var index = 0; index < elements.length; index++) {
      var element = elements[index];
      idIndexedObject[idOfElementFunction(element)] = element;
    }
    return idIndexedObject;
  }

  /**
   * Converts the given elements into an object, that provides these
   * entries by their id (determined by the entry's groupPattern). 
   * For example, [{id: A, value: 1}] becomes result['A'] = 1. 
   * 
   * Furthermore, this function creates a group property (determined by the entry's groupName)
   * and collects all related elements (specified by their group pattern) in it.
   * 
   * @param {FlattenedEntry[]} elements of FlattenedEntry elements
   * @return {FlattenedEntry[] entries indexed by id
   */
  function groupFlattenedData(flattenedData) {
    return groupById(
      flattenedData,
      function (entry) {
        return entry.replaceVariables(entry.groupPattern);
      },
      function (entry) {
        return entry.groupName;
      }
    );
  }

  /**
   * Converts the given elements into an object, that provides these
   * entries by their id. For example, [{id: A, value: 1}] becomes
   * result['A'] = 1. Furthermore, this function creates a group property (with the name )
   * and collects all related elements (specified by their group pattern) in it.
   *
   * @param {FlattenedEntry[]} elements of FlattenedEntry elements
   * @param {stringFieldOfElementFunction} groupNameOfElementFunction function, that returns the name of the group property that will be created inside the "main" element.
   * @param {stringFieldOfElementFunction} groupIdOfElementFunction returns the group id of an FlattenedEntry
   * @return {FlattenedEntry[] entries indexed by id
   */
  function groupById(elements, groupIdOfElementFunction, groupNameOfElementFunction) {
    var groupedResult = new Object();
    for (var index = 0; index < elements.length; index++) {
      var element = elements[index];
      var groupId = groupIdOfElementFunction(element);
      if (groupId === "") {
        continue;
      }
      var groupName = groupNameOfElementFunction(element);
      if (groupName == null || groupName === "") {
        continue;
      }
      if (!groupedResult[groupId]) {
        groupedResult[groupId] = element;
        groupedResult[groupId][groupName] = [];
      }
      groupedResult[groupId][groupName].push(element);
    }
    return groupedResult;
  }

  /**
   * Extracts entries out of "flattened" JSON data and provides an array of objects.
   * @param {Object[]} flattenedData - flattened json from search query result
   * @param {string} flattenedData[].name - name of the property in hierarchical order separated by points
   * @param {string} flattenedData[].value - value of the property as string
   * @param {PropertyStructureDescription} - description of structure of the entries that should be extracted
   * @return {FlattenedEntry}
   */
  function extractEntriesByDescription(flattenedData, description) {
    var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");
    var extractIndizes = new RegExp("");
    var filtered = [];

    flattenedData.filter(function (entry) {
      var indizes = indizesOf(entry.name);
      var propertyNameWithoutArrayIndizes = entry.name.replace(removeArrayBracketsRegEx, "");
      if (description.matchesPropertyName(propertyNameWithoutArrayIndizes)) {
        filtered.push({
          //TODO builder for this structure (FlattenedEntry)
          //TODO full description object as one entry?
          id: indizes.pointDelimited,
          category: description.category,
          type: description.type,
          displayName: description.getDisplayNameForPropertyName(propertyNameWithoutArrayIndizes),
          fieldName: description.getFieldNameForPropertyName(propertyNameWithoutArrayIndizes),
          value: entry.value,
          propertyNameWithArrayIndizes: entry.name,
          propertyNameWithoutArrayIndizes: propertyNameWithoutArrayIndizes,
          groupName: description.groupName,
          groupPattern: description.groupPattern,
          groupDestinationPattern: description.groupDestinationPattern,
          deduplicationPattern: description.deduplicationPattern,
          // groupId: this.replaceVariables(description.groupPattern),
          // groupDestinationId: this.replaceVariables(description.groupDestinationPattern),
          // deduplicationId: this.replaceVariables(description.deduplicationPattern),
          replaceVariables: function (stringContainingVariables) {
            //TODO Refactoring
            var replaced = stringContainingVariables;
            
            var idVariableWithArrayIndex = new RegExp("\\{\\{id\\[(\\d+)\\]\\}\\}", "gi");
            var idVariables = indizesOfWithRegex(stringContainingVariables, idVariableWithArrayIndex);
            for (var varPos = 0; varPos < idVariables.numberArray.length; varPos++) {
              var idIndex = idVariables.numberArray[varPos];
              replaced = replaced.replace("{{id[" + idIndex + "]}}", indizes.numberArray[varPos]);
            }

            var propertyNames = Object.keys(this)
            for (var propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex++) {
              var propertyName = propertyNames[propertyIndex];
              var propertyValue = this[propertyName];
              if (typeof propertyValue === "string") {
                replaced = replaced.replace("{{" + propertyName + "}}", propertyValue);
              }
            }
            return replaced;
          },
        });
      }
    });
    return filtered;
  }

  function applyGroupDestinationPattern(groupedObject) {
    var keys = Object.keys(groupedObject);
    var keysToDelete = [];
    for (var index = 0; index < keys.length; index++) {
      var key = keys[index];
      var entry = groupedObject[key];
      if (entry.groupDestinationPattern != "") {
        var destinationKey = entry.replaceVariables(entry.groupDestinationPattern);
        if (groupedObject[destinationKey] != null) {
          groupedObject[destinationKey][entry.groupName] = entry[entry.groupName];
          keysToDelete.push(key);
        } //TODO ? else log "No object with destinationKey found"
      }
    }
    // delete all moved entries that had been collected by their key
    for (var index = 0; index < keysToDelete.length; index++) {
      var keyToDelete = keysToDelete[index];
      delete groupedObject[keyToDelete];
    }
    return groupedObject;
  }

  /**
   * Fills in extra "_comma_separated_values" properties into the flattened data
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
   * @typedef {Object} ExctractedIndizes
   * @property {string} pointDelimited - bracket indizes separated by points
   * @property {number[]} numberArray as array of numbers
   */

  /**
   * Returns "1.12.123" and [1,12,123] for "results[1].hits.hits[12].aggregates[123]".
   *
   * @param {String} fullPropertyName
   * @return {ExctractedIndizes} extracted indizes in different representations
   */
  function indizesOf(fullPropertyName) {
    var arrayBracketsRegEx = new RegExp("\\[(\\d+)\\]", "gi");
    return indizesOfWithRegex(fullPropertyName, arrayBracketsRegEx);
  }

  /**
   * Returns "1.12.123" and [1,12,123] for "results[1].hits.hits[12].aggregates[123]".
   *
   * @param {string} fullPropertyName
   * @param {RegExp} regexWithOneNumberGroup
   * @return {ExctractedIndizes} extracted indizes in different representations
   */
  function indizesOfWithRegex(fullPropertyName, regexWithOneNumberGroup) {
    var pointDelimited = "";
    var numberArray = [];
    var match;
    do {
      match = regexWithOneNumberGroup.exec(fullPropertyName);
      if (match) {
        if (pointDelimited.length > 0) {
          pointDelimited += ".";
        }
        pointDelimited += match[1];
        numberArray.push(parseInt(match[1]));
      }
    } while (match);
    return { pointDelimited: pointDelimited, numberArray: numberArray };
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
