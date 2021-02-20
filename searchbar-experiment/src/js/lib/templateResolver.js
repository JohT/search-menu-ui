/**
 * @file Provides a simple template resolver, that replaces variables in double curly brackets with the values of a given object.
 * @version {@link https://github.com/JohT/data-restructor-js/releases/latest latest version}
 * @author JohT
 * @version ${project.version}
 */
"use strict";
var module = module || {}; // Fallback for vanilla js without modules

/**
 * Provides a simple template resolver, that replaces variables in double curly brackets with the values of a given object.
 * @module template_resolver
 */
var template_resolver = (module.exports = {}); // Export module for npm...

var internal_object_tools = internal_object_tools || require("../../lib/js/flattenToArray"); // supports vanilla js & npm

/**
 * Resolver. Is used inside this repository. It could also be used outside.
 */
template_resolver.Resolver = (function () {
  var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");

  /**
   * Constructor function and container for everything, that needs to exist per instance.
   * @constructs Resolver
   */
  function Resolver(sourceDataObject) {
    this.sourceDataObject = sourceDataObject;
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
      return this.replaceResolvableFields(template, addFieldsPerGroup(this.resolvableFieldsOfAll(this.sourceDataObject)));
    };
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
    this.resolvableFieldsOfAll = function () {
      var map = {};
      var ignoreInternalFields = function (propertyName) {
        return propertyName.indexOf("_") !== 0 && propertyName.indexOf("._") < 0;
      };
      var index;
      for (index = 0; index < arguments.length; index += 1) {
        addToFilteredMapObject(internal_object_tools.flattenToArray(arguments[index], 3), map, ignoreInternalFields);
      }
      return map;
    };
    /**
     * Replaces all variables in double curly brackets, e.g. {{property}},
     * with the value of that property from the resolvableProperties.
     *
     * Supported property types: string, number, boolean
     * @param {string} stringContainingVariables
     * @param {object[]} resolvableFields (name=value)
     */
    this.replaceResolvableFields = function (stringContainingVariables, resolvableFields) {
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
    };
  }

  /**
   * Adds the value of the "fieldName" property (including its group prefix) and its associated "value" property content.
   * For example: detail[2].fieldName="name", detail[2].value="Smith" lead to the additional property detail.name="Smith".
   * @param {object} object with resolvable field names and their values.
   * @returns {object} object with resolvable field names and their values.
   */
  function addFieldsPerGroup(map) {
    var propertyNames = Object.keys(map);
    var i, fullPropertyName, propertyInfo, propertyValue;
    for (i = 0; i < propertyNames.length; i += 1) {
      fullPropertyName = propertyNames[i];
      propertyValue = map[fullPropertyName];
      propertyInfo = getPropertyNameInfos(fullPropertyName);
      // Supports fields that are defined by a property named "fieldName" (containing the name)
      // and a property named "value" inside the same sub object (containing its value).
      // Ignore custom fields that are named "fieldName"(propertyValue), since this would lead to an unpredictable behavior.
      // TODO could make "fieldName" and "value" configurable
      if (propertyInfo.name === "fieldName" && propertyValue !== "fieldName") {
        map[propertyInfo.groupWithoutArrayIndices + propertyValue] = map[propertyInfo.group + "value"];
      }
    }
    return map;
  }

  /**
   * Infos about the full property name including the name of the group (followed by the separator) and the name of the property itself.
   * @param {String} fullPropertyName
   * @returns {Object} Contains "group" (empty or group name including trailing separator "."), "groupWithoutArrayIndices" and "name" (property name).
   */
  function getPropertyNameInfos(fullPropertyName) {
    var positionOfRightMostSeparator = fullPropertyName.lastIndexOf(".");
    var propertyName = fullPropertyName;
    if (positionOfRightMostSeparator > 0) {
      propertyName = fullPropertyName.substr(positionOfRightMostSeparator + 1);
    }
    var propertyGroup = "";
    if (positionOfRightMostSeparator > 0) {
      propertyGroup = fullPropertyName.substr(0, positionOfRightMostSeparator + 1); //includes the trailing ".".
    }
    var propertyGroupWithoutArrayIndices = propertyGroup.replace(removeArrayBracketsRegEx, "");
    return { group: propertyGroup, groupWithoutArrayIndices: propertyGroupWithoutArrayIndices, name: propertyName };
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
   * @scope template_resolver.Resolver
   */
  return Resolver;
})();
