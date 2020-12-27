/**
 * @fileOverview datarestructor for the web search client
 * @version ${project.version}
 */

/**
 * datarestructor namespace declaration.
 * It contains all functions to convert a JSON into enumerated list entries.
 * Workflow: JSON -> flatten -> mark and identify -> add array fields -> deduplicate -> group -> flatten again
 * @default {}
 */
var datarestructor = datarestructor || {};

/**
 * @callback propertyNameFunction
 *  @param {string} propertyname
 */

/**
 * @typedef {Object} PropertyStructureDescription
 * @property {string} type - ""(default). Some examples: "summary" for e.g. a list overview. "detail" e.g. when a summary is selected. "filter" e.g. for field/value pair results that can be selected as search parameters.
 * @property {string} category - name of the category. Default = "". Could contain a symbol character or a short domain name. (e.g. "city")
 * @property {string} [abbreviation=""] - one optional character, a symbol character or a short abbreviation of the category
 * @property {string} [image=""] - one optional path to an image resource
 * @property {boolean} propertyPatternTemplateMode - "false"(default): property name needs to be equal to the pattern. "true" allows variables like "{{fieldName}}" inside the pattern.
 * @property {string} propertyPattern - property name pattern (without array indices) to match
 * @property {string} indexStartsWith - ""(default) matches all ids. String that needs to match the beginning of the id. E.g. "1." will match id="1.3.4" but not "0.1.2".
 * @property {propertyNameFunction} getDisplayNameForPropertyName - display name for the property. ""(default) last property name element with upper case first letter.
 * @property {propertyNameFunction} getFieldNameForPropertyName - field name for the property. "" (default) last property name element.
 * @property {string} groupName - name of the property, that contains grouped entries. Default="group".
 * @property {string} groupPattern - Pattern that describes how to group entries. "groupName" defines the name of this group. A pattern may contain variables in double curly brackets {{variable}}.
 * @property {string} groupDestinationPattern - Pattern that describes where the group should be moved to. Default=""=Group will not be moved. A pattern may contain variables in double curly brackets {{variable}}.
 * @property {string} groupDestinationName - (default=groupName) Name of the group when it had been moved to the destination.
 * @property {string} deduplicationPattern - Pattern to use to remove duplicate entries. A pattern may contain variables in double curly brackets {{variable}}.
 */

/**
 * PropertyStructureDescriptionBuilder
 *
 * @namespace
 */
datarestructor.PropertyStructureDescriptionBuilder = (function () {
  "use strict";

  /**
   * Constructor function and container for everything, that needs to exist per instance.
   */
  function PropertyStructureDescription() {
    this.description = {
      type: "",
      category: "",
      abbreviation: "",
      image: "",
      propertyPatternTemplateMode: false,
      propertyPattern: "",
      indexStartsWith: "",
      groupName: "group",
      groupPattern: "",
      groupDestinationPattern: "",
      groupDestinationName: null,
      deduplicationPattern: "",
      getDisplayNameForPropertyName: null,
      getFieldNameForPropertyName: null,
      matchesPropertyName: null
    };
    this.type = function (value) {
      this.description.type = value;
      return this;
    };
    this.category = function (value) {
      this.description.category = value;
      return this;
    };
    this.abbreviation = function (value) {
      this.description.abbreviation = withDefault(value, "");
      return this;
    };
    this.image = function (value) {
      this.description.image = withDefault(value, "");
      return this;
    };
    /**
     * "propertyPattern" need to match exactly if this mode is activated.
     *  It clears propertyPatternTemplateMode which means "equal" mode.
     */
    this.propertyPatternEqualMode = function () {
      this.description.propertyPatternTemplateMode = false;
      return this;
    };
    /**
     * "propertyPattern" can contain variables like {{fieldName}} and
     * doesn't need to match the property name exactly. If the "propertyPattern"
     * is shorter than the property name, it also matches when the property name
     * starts with the "propertyPattern".
     */
    this.propertyPatternTemplateMode = function () {
      this.description.propertyPatternTemplateMode = true;
      return this;
    };
    /**
     * property name pattern (single property names with sub types separated by "." without array indices) to match.
     * May contain variables in double curly brackets.
     * Example: responses.hits.hits._source.{{fieldName}}
     * @returns {PropertyStructureDescription}
     */
    this.propertyPattern = function (value) {
      this.description.propertyPattern = withDefault(value, "");
      return this;
    };
    /**
     *  String that needs to match the beginning of the id.
     *  E.g. "1." will match id="1.3.4" but not "0.1.2".
     *  Default is "" which will match every id.
     */
    this.indexStartsWith = function (value) {
      this.description.indexStartsWith = withDefault(value, "");
      return this;
    };
    this.displayPropertyName = function (value) {
      this.description.getDisplayNameForPropertyName = createNameExtractFunction(value, this.description);
      if (isSpecifiedString(value)) {
        return this;
      }
      this.description.getDisplayNameForPropertyName = removeArrayValuePropertyPostfixFunction(
        this.description.getDisplayNameForPropertyName
      );
      this.description.getDisplayNameForPropertyName = upperCaseFirstLetterForFunction(
        this.description.getDisplayNameForPropertyName
      );
      return this;
    };
    this.fieldName = function (value) {
      this.description.getFieldNameForPropertyName = createNameExtractFunction(value, this.description);
      return this;
    };
    this.groupName = function (value) {
      this.description.groupName = withDefault(value, "");;
      return this;
    };
    /**
     * Pattern that describes how to group entries. "groupName" defines the name of this group.
     * A pattern may contain variables in double curly brackets {{variable}}.
     */
    this.groupPattern = function (value) {
      this.description.groupPattern = withDefault(value, "");;
      return this;
    };
    /**
     * Pattern that describes where the group should be moved to. Default=""=Group will not be moved.
     * A pattern may contain variables in double curly brackets {{variable}}.
     */
    this.groupDestinationPattern = function (value) {
      this.description.groupDestinationPattern = withDefault(value, "");;
      return this;
    };
    /**
     * Name of the group when it had been moved to the destination.
     * The default value is the groupName, which will be used when the value is not valid (null or empty)
     */
    this.groupDestinationName = function (value) {
      this.description.groupDestinationName = withDefault(value, this.description.groupName);
      return this;
    };
    /**
     * Pattern to use to remove duplicate entries. A pattern may contain variables in double curly brackets {{variable}}.
     * A pattern may contain variables in double curly brackets {{variable}}.
     */
    this.deduplicationPattern = function (value) {
      this.description.deduplicationPattern = withDefault(value, "");;
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
      if (this.description.groupDestinationName == null) {
        this.groupDestinationName("");
      }
      return this.description;
    };
  }

  function createNameExtractFunction(value, description) {
    if (isSpecifiedString(value)) {
      return function (propertyName) {
        return value;
      };
    }
    if (description.propertyPatternTemplateMode) {
      var patternToMatch = description.propertyPattern; // closure (closed over) parameter
      return extractNameUsingTemplatePattern(patternToMatch);
    }
    return extractNameUsingRightMostPropertyNameElement();
  }

  function createFunctionMatchesPropertyName(description) {
    var propertyPatternToMatch = description.propertyPattern; // closure (closed over) parameter
    if (!isSpecifiedString(propertyPatternToMatch)) {
      return function (propertyNameWithoutArrayIndices) {
        return false; // Without a propertyPattern, no property will match (deactivated mark/identify).
      };
    }
    if (description.propertyPatternTemplateMode) {
      return function (propertyNameWithoutArrayIndices) {
        return templateModePatternRegexForPattern(propertyPatternToMatch).exec(propertyNameWithoutArrayIndices) != null;
      };
    }
    return function (propertyNameWithoutArrayIndices) {
      return propertyNameWithoutArrayIndices === propertyPatternToMatch;
    };
  }

  function rightMostPropertyNameElement(propertyName) {
    var regularExpression = new RegExp("(\\w+)$", "gi");
    var match = propertyName.match(regularExpression);
    if (match != null) {
      return match[0];
    }
    return propertyName;
  }

  function upperCaseFirstLetter(value) {
    if (value.length > 1) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

  function upperCaseFirstLetterForFunction(nameExtractFunction) {
    return function (propertyName) {
      return upperCaseFirstLetter(nameExtractFunction(propertyName));
    };
  }

  function removeArrayValuePropertyPostfixFunction(nameExtractFunction) {
    return function (propertyName) {
      var name = nameExtractFunction(propertyName);
      name = name != null ? name : "";
      return name.replace("_comma_separated_values", "");
    };
  }

  function extractNameUsingTemplatePattern(propertyPattern) {
    return function (propertyName) {
      var regex = templateModePatternRegexForPatternAndVariable(propertyPattern, "{{fieldName}}");
      var match = regex.exec(propertyName);
      if (match && match[1] != "") {
        return match[1];
      }
      return rightMostPropertyNameElement(propertyName);
    };
  }

  function extractNameUsingRightMostPropertyNameElement() {
    return function (propertyName) {
      return rightMostPropertyNameElement(propertyName);
    };
  }

  function templateModePatternRegexForPattern(propertyPatternToUse) {
    var placeholderInDoubleCurlyBracketsRegEx = new RegExp("\\\\\\{\\\\\\{[-\\w]+\\\\\\}\\\\\\}", "gi");
    return templateModePatternRegexForPatternAndVariable(propertyPatternToUse, placeholderInDoubleCurlyBracketsRegEx);
  }

  function templateModePatternRegexForPatternAndVariable(propertyPatternToUse, variablePattern) {
    var pattern = escapeCharsForRegEx(propertyPatternToUse);
    if (typeof variablePattern === "string") {
      variablePattern = escapeCharsForRegEx(variablePattern);
    }
    pattern = pattern.replace(variablePattern, "([-\\w]+)");
    pattern = "^" + pattern;
    return new RegExp(pattern, "i");
  }

  function escapeCharsForRegEx(characters) {
    var nonWordCharactersRegEx = new RegExp("([^-\\w])", "gi");
    return characters.replace(nonWordCharactersRegEx, "\\$1");
  }

  function withDefault(value, defaultValue) {
    return isSpecifiedString(value) ? value : defaultValue;
  }

  function isSpecifiedString(value) {
    return typeof value === "string" && value != null && value != "";
  }

  /**
   * Public interface
   * @scope datarestructor.PropertyStructureDescriptionBuilder
   */
  return PropertyStructureDescription;
})();

/**
 * @typedef {Object} DescribedEntry
 * @property {string} category - category of the result from the PropertyStructureDescription using a short name or e.g. a symbol character
 * @property {string} type - type of the result from PropertyStructureDescription
 * @property {string} [abbreviation=""] - one optional character, a symbol character or a short abbreviation of the category
 * @property {string} [image=""] - one optional path to an image resource
 * @property {string} index - array of numbers containing the split index. Example: "responses[2].hits.hits[4]._source.name" leads to an array with the two elements: [2,4]
 * @property {string} displayName - display name extracted from the point separated hierarchical property name, e.g. "Name"
 * @property {string} fieldName - field name extracted from the point separated hierarchical property name, e.g. "name"
 * @property {string} value - content of the field
 * @property {string} resolveTemplate - function, that replaces propertyNames in double curly brackets with the values in this object.
 * @property {string} publicFieldsJson - function, that converts the public fields including grouped sub structures to JSON.
 * @property {boolean} _isMatchingIndex - true, when _identifier.index matches the described "indexStartsWith"
 * @property {Object} _identifier - internal structure for identifier. Avoid using it outside since it may change.
 * @property {string} _identifier.index - array indices in hierarchical order separated by points, e.g. "0.0"
 * @property {string} _identifier.value - the (single) value of the "flattened" property, e.g. "Smith"
 * @property {string} _identifier.propertyNameWithArrayIndices - the "original" flattened property name in hierarchical order separated by points, e.g. "responses[0].hits.hits[0]._source.name"
 * @property {string} _identifier.propertyNameWithoutArrayIndices - same as propertyNamesWithArrayIndices but without array indices, e.g. "responses.hits.hits._source.name"
 * @property {string} _identifier.groupId - Contains the resolved groupPattern from the PropertyStructureDescription. Entries with the same id will be grouped into the "groupName" of the PropertyStructureDescription.
 * @property {string} _identifier.groupDestinationId - Contains the resolved groupDestinationPattern from the PropertyStructureDescription. Entries with this id will be moved to the given destination group.
 * @property {string} _identifier.deduplicationId - Contains the resolved deduplicationPattern from the PropertyStructureDescription. Entries with the same id will be considered to be a duplicate and hence removed.
 * @property {Object} _description - PropertyStructureDescription for internal use. Avoid using it outside since it may change.
 */

/**
 * @callback stringFieldOfDescribedEntryFunction
 *  @param {DescribedEntry} entry
 */

/**
 * DescribedEntryCreator
 *
 * @namespace
 */
datarestructor.DescribedEntryCreator = (function () {
  "use strict";

  var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");

  /**
   * Constructor function and container for everything, that needs to exist per instance.
   */
  function DescribedEntry(entry, description) {
    var indices = indicesOf(entry.name);
    var propertyNameWithoutArrayIndices = entry.name.replace(removeArrayBracketsRegEx, "");

    this.category = description.category;
    this.type = description.type;
    this.abbreviation = description.abbreviation;
    this.image = description.image;
    /**
     * Array of numbers containing the split index. 
     * Example: "responses[2].hits.hits[4]._source.name" leads to an array with two elements: [2,4]
     * This is the public version of the internal variable _identifier.index, which contains in contrast all index elements in one point separated string (e.g. "2.4").
     */
    this.index = indices.numberArray;
    this.displayName = description.getDisplayNameForPropertyName(propertyNameWithoutArrayIndices);
    this.fieldName = description.getFieldNameForPropertyName(propertyNameWithoutArrayIndices);
    this.value = entry.value;
    this._isMatchingIndex = indices.pointDelimited.startsWith(description.indexStartsWith);
    this._description = description;

    this._identifier = {
      index: indices.pointDelimited,
      propertyNameWithArrayIndices: entry.name,
      propertyNameWithoutArrayIndices: propertyNameWithoutArrayIndices,
      groupId: "",
      groupDestinationId: "",
      deduplicationId: ""
    };
    this._identifier.groupId = replaceResolvableFields(
      description.groupPattern,
      resolvableFieldsOfAll(this, this._description, this._identifier)
    );
    this._identifier.groupDestinationId = replaceResolvableFields(
      description.groupDestinationPattern,
      resolvableFieldsOfAll(this, this._description, this._identifier)
    );
    this._identifier.deduplicationId = replaceResolvableFields(
      description.deduplicationPattern,
      resolvableFieldsOfAll(this, this._description, this._identifier)
    );
    /**
     * Resolves the given template.
     * 
     * The template may contain variables in double curly brackets.
     * Supported variables are all properties of this object, e.g. "{{fieldName}}", "{{displayName}}", "{{value}}".
     * Since this object may also contains (described) groups of sub objects, they can also be used, e.g. "{{summaries[0].value}}" 
     * Parts of the index can be inserted by using e.g. "{{index[1]}}".
     * 
     * @param {string} template
     * @returns {string} resolved template
     */
    this.resolveTemplate = function (template) {
      return replaceResolvableFields(template, resolvableFieldsOfAll(this));
    };

    /**
     * Returns JSON containing all the public fields
     * @param space — Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     */
    this.publicFieldsJson = function (space) {
      var propertyNames = propertyNamesWithoutObjectsAndFunctions(this);
      var prettyPrintJsonSpace = typeof space === "number" ? space : 0;
      return JSON.stringify(this, replacerRetainsOnlyDefinedPublicFields(propertyNames), prettyPrintJsonSpace);
    };
  }

  /**
   * Returns "1.12.123" and [1,12,123] for "results[1].hits.hits[12].aggregates[123]".
   *
   * @param {String} fullPropertyName
   * @return {ExtractedIndices} extracted indices in different representations
   */
  function indicesOf(fullPropertyName) {
    var arrayBracketsRegEx = new RegExp("\\[(\\d+)\\]", "gi");
    return indicesOfWithRegex(fullPropertyName, arrayBracketsRegEx);
  }

  /**
   * Returns "1.12.123" and [1,12,123] for "results[1].hits.hits[12].aggregates[123]".
   *
   * @param {string} fullPropertyName
   * @param {RegExp} regexWithOneNumberGroup
   * @return {ExtractedIndices} extracted indices in different representations
   */
  function indicesOfWithRegex(fullPropertyName, regexWithOneNumberGroup) {
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

  /**
   * Returns a map like object, that contains all resolvable fields and their values as properties.
   * This function takes a variable count of input parameters, 
   * each containing an object that contains resolvable fields to extract from.
   * 
   * The recursion depth is limited to 3, so that an object, 
   * that contains an object can contain another object (but not further).
   * 
   * Properties beginning with an underscore in their name will be filtered out, since they are considered as internal fields.
   * 
   * @param {...object} varArgs variable count of parameters. Each parameter contains an object that fields should be resolvable for variables. 
   * @returns {object} object with resolvable field names and their values.
   */
  function resolvableFieldsOfAll(varArgs) {
    var map = {};
    var ignoreInternalFields = function (properyName) {
      return !properyName.startsWith("_") && (properyName.indexOf("._") < 0);
    };
    for (var index = 0; index < arguments.length; index+=1) {
      addToFilteredMapObject(datarestructor.InternalTools.flattenToArray(arguments[index], 3), map, ignoreInternalFields);
    }
    return map;
  }

  /**
   * Replaces all variables in double curly brackets, e.g. {{property}},
   * with the value of that property from the resolvableProperties.
   *
   * Supported property types: string, number, boolean
   * @param {string} stringContainingVariables
   * @param {object[]} resolvableFields (name=value)
   */
  function replaceResolvableFields(stringContainingVariables, resolvableFields) {
    var replaced = stringContainingVariables;
    var propertyNames = Object.keys(resolvableFields);
    var propertyIndex = 0;
    var propertyName = "";
    var propertyValue = "";
    for (propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex += 1) {
      propertyName = propertyNames[propertyIndex];
      propertyValue = resolvableFields[propertyName];
      replaced = replaced.replace("{{" + propertyName + "}}", propertyValue);
    }
    return replaced;
  }

  /**
   * Returns an array of property names of the given object without properties of type "object".
   */
  function propertyNamesWithoutObjectsAndFunctions(obj) {
    var result = [];
    var propertyIndex;
    var propertyName;
    var propertyNames = Object.keys(obj);
    for (propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex += 1) {
      propertyName = propertyNames[propertyIndex];
      if (typeof obj[propertyName] !== "object" && typeof obj[propertyName] !== "function") {
        result.push(propertyName);
      }
    }
    return result;
  }

  /**
   * Returns a function, that takes two arguments and is therefore applicable to be used as "replacer" parameter for JSON.stringify.
   * It only retains the given property names and removes everything else except for embedded "sub" objects
   * with the same structure (and only one recursive level). These sub objects will be cloned to get rid of the circular
   * structure that would lead to the error message "TypeError: Converting circular structure to JSON".
   * Internal properties containing objects but beginning with an underscore in their name will also be removed.
   *
   * @param key name of the property to be converted to JSON or empty for the whole object.
   * @param value value of the property to be converted to JSON.
   * @returns function that is applicable to be used as "replacer" parameter for JSON.stringify.
   */
  function replacerRetainsOnlyDefinedPublicFields(propertyNames) {
    return function (key, value) {
      return onlyDefinedPublicFields(key, value, propertyNames);
    };
  }
  /**
   * This function takes two arguments and is therefore applicable to be used as "replacer" parameter for JSON.stringify.
   * It removes internal properties beginning with an underscore in their name
   * and creates new objects for grouped structures (only one recursion level) to get rid of the circular structure
   * that would lead to the error message "TypeError: Converting circular structure to JSON".
   *
   * @param {string} key name of the property to be converted to JSON or empty for the whole object.
   * @param {string} value value of the property to be converted to JSON.
   * @param {string[]} propertyNames array of strings containing only the public fields that will be converted to JSON.
   */
  function onlyDefinedPublicFields(key, value, propertyNames) {
    if (typeof value !== "object" && propertyNames.indexOf(key) < 0 && key != "") {
      return undefined; // Remove all properties that are not contained in the given list.
    }
    if (key.startsWith("_")) {
      return undefined; //Remove all properties with a name beginning with an underscore (internal fields).
    }
    if (Array.isArray(value)) {
      var index, propertyIndex;
      var entry, clonedEntry;
      var clonedArray = [];
      for (index = 0; index < value.length; index += 1) {
        entry = value[index];
        clonedEntry = {};
        for (propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex += 1) {
          clonedEntry[propertyNames[propertyIndex]] = entry[propertyNames[propertyIndex]];
        }
        clonedArray.push(clonedEntry);
      }
      return clonedArray;
    }
    return value;
  }

  /**
   * Collects all flattened name-value-pairs into one object using the property names as keys and their values as values (map-like).
   * Example: `{name: "accountNumber", value: "12345"}` becomes `mapObject["accountNumber"]="12345"`.
   * 
   * @param {NameValuePair[]} elements flattened array of name-value-pairs
   * @param {object} mapObject container to collect the results. Needs to be created before e.g. using `{}`. 
   * @param {function} filterMatchesFunction takes the property name as string argument and returns true (include) or false (exclude).
   */
  function addToFilteredMapObject(elements, mapObject, filterMatchesFunction) {
    var index, element;
    for (index = 0; index < elements.length; index += 1) {
      element = elements[index];
      if (typeof filterMatchesFunction === "function" && filterMatchesFunction(element.name)) {
        mapObject[element.name] = element.value;
      }
    }
    return mapObject;
  }

  /**
   * Public interface
   * @scope datarestructor.DescribedEntryCreator
   */
  return DescribedEntry;
})();

datarestructor.Restructor = (function () {
  "use strict";

  /**
   * "Assembly line", that takes the jsonData and processes it using all given descriptions in their given order.
   * Workflow: JSON -> flatten -> mark and identify -> add array fields -> deduplicate -> group -> flatten again
   * @param {object} jsonData - parsed JSON data or any other data object
   * @param {PropertyStructureDescription[]} descriptions - already grouped entries
   * @param {boolean} debugMode - false=default=off, true=write additional logs for detailed debugging
   */
  function processJsonUsingDescriptions(jsonData, descriptions, debugMode) {
    // "Flatten" the hierarchical input json to an array of property names (point separated "folders") and values.
    var processedData = datarestructor.InternalTools.flattenToArray(jsonData);
    // Fill in properties ending with the name "_comma_separated_values" for array values to make it easier to display them.
    processedData = fillInArrayValues(processedData);

    if ((typeof debugMode === "boolean") && debugMode) {
      console.log("flattened data with array values:");
      console.log(processedData);
    }

    // Mark, identify and harmonize the flattened data by applying one description after another in their given order.
    var describedData = [];
    for (var descriptionIndex = 0; descriptionIndex < descriptions.length; descriptionIndex++) {
      var description = descriptions[descriptionIndex];
      // Filter all entries that match the current description and enrich them with it
      var dataWithDescription = extractEntriesByDescription(processedData, description);
      // Remove duplicate entries where a deduplicationPattern is described
      describedData = deduplicateFlattenedData(describedData, dataWithDescription);
    }
    processedData = describedData;

    // Group entries where a groupPattern is described
    processedData = groupFlattenedData(processedData);

    // Move group entries where a groupDestinationPattern is described
    processedData = applyGroupDestinationPattern(processedData);

    // Turns the grouped object back into an array of DescribedEntry-Objects
    return propertiesAsArray(processedData);
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
   * and entries that occur later in the array overwrite earlier ones,
   * if they have the same id.
   *
   * The id is extracted from every element using the given function.
   *
   * @param {DescribedEntry[]} entries
   * @param {DescribedEntry[]} entriesToMerge
   * @param {stringFieldOfDescribedEntryFunction} idOfElementFunction returns the id of an DescribedEntry
   */
  function mergeFlattenedData(entries, entriesToMerge, idOfElementFunction) {
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
   * @param {DescribedEntry[]} entries
   * @param {DescribedEntry[]} entriesToMerge
   * @param {stringFieldOfDescribedEntryFunction} idOfElementFunction returns the id of an DescribedEntry
   * @see mergeFlattenedData
   */
  function deduplicateFlattenedData(entries, entriesToMerge) {
    if (entries == null || entries.length == 0) {
      return entriesToMerge;
    }
    var idOfElementFunction = function (entry) {
      return entry._identifier.deduplicationId;
    };
    return mergeFlattenedData(entries, entriesToMerge, idOfElementFunction);
  }

  /**
   * Converts the given elements to an object, that provides these
   * entries by their id. For example, [{id: A, value: 1}] becomes
   * result['A'] = 1.
   * @param {DescribedEntry[]} elements of DescribedEntry elements
   * @param {stringFieldOfDescribedEntryFunction} idOfElementFunction returns the id of an DescribedEntry
   * @return {DescribedEntry[] entries indexed by id
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
   * @param {DescribedEntry[]} elements of DescribedEntry elements
   * @return {DescribedEntry[] entries indexed by id
   */
  function groupFlattenedData(flattenedData) {
    return groupById(
      flattenedData,
      function (entry) {
        return entry._identifier.groupId;
      },
      function (entry) {
        return entry._description.groupName;
      }
    );
  }

  /**
   * Converts the given elements into an object, that provides these
   * entries by their id. For example, [{id: A, value: 1}] becomes
   * result['A'] = 1. Furthermore, this function creates a group property (with the name )
   * and collects all related elements (specified by their group pattern) in it.
   *
   * @param {DescribedEntry[]} elements of DescribedEntry elements
   * @param {stringFieldOfDescribedEntryFunction} groupNameOfElementFunction function, that returns the name of the group property that will be created inside the "main" element.
   * @param {stringFieldOfDescribedEntryFunction} groupIdOfElementFunction returns the group id of an DescribedEntry
   * @return {DescribedEntry[] entries indexed by id
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
   * @return {DescribedEntry[]}
   */
  function extractEntriesByDescription(flattenedData, description) {
    var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");
    var filtered = [];

    flattenedData.filter(function (entry) {
      var propertyNameWithoutArrayIndices = entry.name.replace(removeArrayBracketsRegEx, "");
      if (description.matchesPropertyName(propertyNameWithoutArrayIndices)) {
        var descibedEntry = new datarestructor.DescribedEntryCreator(entry, description);
        if (descibedEntry._isMatchingIndex) {
          filtered.push(descibedEntry);
        }
      }
    });
    return filtered;
  }

  /**
   * Takes already grouped {@link DescribedEntry} objects and
   * uses their "_identifier.groupDestinationId" (if exists)
   * to move groups to the given destination.
   *
   * This is useful, if separately described groups like "summary" and "detail" should be put together,
   * so that every summery contains a group with the regarding details.
   *
   * @param {DescribedEntry[]} groupedObject - already grouped entries
   * @return {DescribedEntry[]}
   */
  function applyGroupDestinationPattern(groupedObject) {
    var keys = Object.keys(groupedObject);
    var keysToDelete = [];
    for (var index = 0; index < keys.length; index++) {
      var key = keys[index];
      var entry = groupedObject[key];
      if (entry._description.groupDestinationPattern != "") {
        var destinationKey = entry._identifier.groupDestinationId;
        if (groupedObject[destinationKey] != null) {
          var newGroup = entry[entry._description.groupName];
          var existingGroup = groupedObject[destinationKey][entry._description.groupDestinationName]; //join if exists
          var updatedGroup = existingGroup != null ? existingGroup.concat(newGroup) : newGroup;
          groupedObject[destinationKey][entry._description.groupDestinationName] = updatedGroup;
          keysToDelete.push(key);
        }
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
   * @typedef {Object} ExtractedIndices
   * @property {string} pointDelimited - bracket indices separated by points
   * @property {number[]} numberArray as array of numbers
   */
  function propertiesAsArray(groupedData) {
    var result = [];
    var propertyNames = Object.keys(groupedData);
    for (var propertyIndex = 0; propertyIndex < propertyNames.length; propertyIndex++) {
      var propertyName = propertyNames[propertyIndex];
      var propertyValue = groupedData[propertyName];
      result.push(propertyValue);
    }
    return result;
  }

  /**
   * Public interface
   * @scope datarestructor.Restructor
   */
  return {
    /**
     * "Assembly line", that takes the jsonData and processes it using all given descriptions in their given order.
     * Workflow: JSON -> flatten -> mark and identify -> add array fields -> deduplicate -> group -> flatten again
     * @param {object} jsonData - parsed JSON data or any other data object
     * @param {PropertyStructureDescription[]} descriptions - already grouped entries
     * @param {boolean} debugMode - false=default=off, true=write additional logs for detailed debugging
     */
    processJsonUsingDescriptions: processJsonUsingDescriptions
  };
})();

/**
 * InternalTools. Not meant to be called outside of "datarestructor".
 *
 * @namespace
 */
datarestructor.InternalTools = (function () {
  "use strict";
  
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
  //Modded (compatibility, recursion depth) version of:
  //https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objectss
  function flattenToArray(data, maxRecursionDepth) {
    var result = [];
    if (typeof maxRecursionDepth !== "number" || maxRecursionDepth < 1) {
      maxRecursionDepth = 20;
    }
    function recurse(cur, prop, depth) {
      if ((depth > maxRecursionDepth) || (typeof cur === "function")){
        return;
      }
      if (Object(cur) !== cur) {
        result.push({ name: prop, value: cur });
      } else if (Array.isArray(cur)) {
        for (var i = 0, l = cur.length; i < l; i++) recurse(cur[i], prop + "[" + i + "]", depth + 1);
        if (l == 0) {
          result[prop] = [];
          result.push({ name: prop, value: "" });
        }
      } else {
        var isEmpty = true;
        for (var p in cur) {
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
  }

  /**
   * Public interface
   * @scope datarestructor.InternalTools
   */
  return { flattenToArray: flattenToArray };
})();
