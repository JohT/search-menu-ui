/*
 * Merged using [merger-js](https://www.npmjs.com/package/merger-js).
 */
// @import<<dir ./../../lib/js/polyfills/'
// $import './../../lib/js/flattenToArray'
// $import './../../src/js/templateResolver'
// $import './../../src/js/describedfield'
// $import './../../src/js/datarestructor.js'
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Polyfill
if (!Array.prototype.filter){
    Array.prototype.filter = function(func, thisArg) {
      'use strict';
      if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
          throw new TypeError();
     
      var len = this.length >>> 0,
          res = new Array(len), // preallocate array
          t = this, c = 0, i = -1;
  
      var kValue;
      if (thisArg === undefined){
        while (++i !== len){
          // checks to see if the key was set
          if (i in this){
            kValue = t[i]; // in case t is changed in callback
            if (func(t[i], i, t)){
              res[c++] = kValue;
            }
          }
        }
      }
      else{
        while (++i !== len){
          // checks to see if the key was set
          if (i in this){
            kValue = t[i];
            if (func.call(thisArg, t[i], i, t)){
              res[c++] = kValue;
            }
          }
        }
      }
     
      res.length = c; // shrink down array to proper size
      return res;
    };
  }
//https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
if (!Array.prototype.indexOf)  Array.prototype.indexOf = (function(Object, max, min){
    "use strict";
    return function indexOf(member, fromIndex) {
      if(this===null||this===undefined)throw TypeError("Array.prototype.indexOf called on null or undefined");
      
      var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len);
      if (i < 0) i = max(0, Len+i); else if (i >= Len) return -1;
      
      if(member===void 0){ for(; i !== Len; ++i) if(that[i]===void 0 && i in that) return i; // undefined
      }else if(member !== member){   for(; i !== Len; ++i) if(that[i] !== that[i]) return i; // NaN
      }else                           for(; i !== Len; ++i) if(that[i] === member) return i; // all else
  
      return -1; // if the value was not found, then return -1
    };
  })(Object, Math.max, Math.min);
// https://gist.github.com/brianonn/4ef965a06b9e950d80e4e8b8e4c527f9
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
//http://tokenposts.blogspot.com/2012/04/javascript-objectkeys-browser.html
if (!Object.keys) Object.keys = function(o) {
    if (o !== Object(o))
      throw new TypeError('Object.keys called on a non-object');
    var k=[],p;
    for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
    return k;
  }
"use strict";
/**
 * @fileOverview Modded (compatibility, recursion depth) version of: https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objectss
 * @version ${project.version}
 * @see {@link https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objectss|stackoverflow flatten nested json objects}
 */
var module = module || {}; // Fallback for vanilla js without modules

/**
 * internal_object_tools. Not meant to be used outside this repository.
 * @default {}
 */
var internal_object_tools = module.exports={}; // Export module for npm...

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
internal_object_tools.flattenToArray = function (data, maxRecursionDepth) {
  var result = [];
  if (typeof maxRecursionDepth !== "number" || maxRecursionDepth < 1) {
    maxRecursionDepth = 20;
  }
  function recurse(cur, prop, depth) {
    if (depth > maxRecursionDepth || typeof cur === "function") {
      return;
    }
    if (Object(cur) !== cur) {
      result.push({ name: prop, value: cur });
    } else if (Array.isArray(cur)) {
      var i;
      var l = cur.length;
      for (i = 0; i < l; i += 1) {
        recurse(cur[i], prop + "[" + i + "]", depth + 1);
      }
      if (l === 0) {
        result[prop] = [];
        result.push({ name: prop, value: "" });
      }
    } else {
      var isEmpty = true;
      var p;
      for (p in cur) {
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
};

/**
 * @file Provides a simple template resolver, that replaces variables in double curly brackets with the values of a given object.
 * @version {@link https://github.com/JohT/data-restructor-js/releases/latest latest version}
 * @author JohT
 * @version ${project.version}
 */
"use strict";
var module = templateResolverInternalCreateIfNotExists(module); // Fallback for vanilla js without modules

function templateResolverInternalCreateIfNotExists(objectToCheck) {
  return objectToCheck || {};
}

/**
 * Provides a simple template resolver, that replaces variables in double curly brackets with the values of a given object.
 * @module template_resolver
 */
var template_resolver = (module.exports = {}); // Export module for npm...
template_resolver.internalCreateIfNotExists = templateResolverInternalCreateIfNotExists;

var internal_object_tools = internal_object_tools || require("../../lib/js/flattenToArray"); // supports vanilla js & npm

template_resolver.Resolver = (function () {
  var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");

  /**
   * Resolver. Is used inside this repository. It could also be used outside.
   * @param {*} sourceDataObject The properties of this object will be used to replace the placeholders in the template.
   * @constructs Resolver
   * @alias module:template_resolver.Resolver
   */
  function Resolver(sourceDataObject) {
    /**
     * The properties of this source data object will be used to replace the placeholders in the template.
     */
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
     * @public
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
   * @protected
   * @memberof module:template_resolver.Resolver
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
   * @protected
   * @memberof module:template_resolver.Resolver
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
   * @protected
   * @memberof module:template_resolver.Resolver
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

  return Resolver;
}());

/**
 * @file Describes a data field of the restructured data.
 * @version {@link https://github.com/JohT/data-restructor-js/releases/latest latest version}
 * @author JohT
 * @version ${project.version}
 */
"use strict";
var module = describedFieldInternalCreateIfNotExists(module); // Fallback for vanilla js without modules

function describedFieldInternalCreateIfNotExists(objectToCheck) {
  return objectToCheck || {};
}

/**
 * Describes a data field of the restructured data.
 * @module described_field
 */
var described_field = (module.exports = {}); // Export module for npm...
described_field.internalCreateIfNotExists = describedFieldInternalCreateIfNotExists;

/**
 * Describes a field of the restructured data.
 * Dynamically added properties represent custom named groups containing DescribedDataField-Arrays.
 *
 * @typedef {Object} module:described_field.DescribedDataField
 * @property {string} [category=""] - name of the category. Could contain a short domain name like "product" or "vendor".
 * @property {string} [type=""] - type of the data element. Examples: "summary" for e.g. a list overview. "detail" e.g. when a summary is selected. "filter" e.g. for field/value pair results that can be selected as data filters.
 * @property {string} [abbreviation=""] - one optional character, a symbol character or a short abbreviation of the category
 * @property {string} [image=""] - one optional path to an image resource
 * @property {string} index - array of numbers containing the splitted index. Example: "responses[2].hits.hits[4]._source.name" will have an index of [2,4]
 * @property {string[]} groupNames - array of names of all dynamically added properties representing groups
 * @property {string} displayName - display name of the field
 * @property {string} fieldName - field name
 * @property {{*}} value - content of the field
 * @property {module:described_field.DescribedDataField[]} [couldBeAnyCustomGroupName] any number of groups attached to the field each containing multiple fields
 */

described_field.DescribedDataFieldBuilder = (function () {
  /**
   * Builds a {@link module:described_field.DescribedDataField}.
   * DescribedDataField is the main element of the restructured data and therefore considered "public".
   * @constructs DescribedDataFieldBuilder
   * @alias module:described_field.DescribedDataFieldBuilder
   */
  function DescribedDataFieldBuilder() {
    /**
     * @type {module:described_field.DescribedDataField}
     */
    this.describedField = {
      category: "",
      type: "",
      abbreviation: "",
      image: "",
      index: [],
      groupNames: [],
      displayName: "",
      fieldName: "",
      value: ""
    };
    /**
     * Takes over all values of the template {@link module:described_field.DescribedDataField}.
     * @function
     * @param {module:described_field.DescribedDataField} template
     * @returns {DescribedDataFieldBuilder}
     * @example fromDescribedDataField(sourceField)
     */
    this.fromDescribedDataField = function (template) {
      this.category(template.category);
      this.type(template.type);
      this.abbreviation(template.abbreviation);
      this.image(template.image);
      this.index(template.index);
      this.groupNames(template.groupNames);
      this.displayName(template.displayName);
      this.fieldName(template.fieldName);
      this.value(template.value);
      return this;
    };
    /**
     * Sets the category.
     *
     * Contains a short domain nam, for example:
     * - "product" for products
     * - "vendor" for vendors
     *
     * @function
     * @param {String} [value=""]
     * @returns {DescribedDataFieldBuilder}
     * @example category("Product")
     */
    this.category = function (value) {
      this.describedField.category = withDefaultString(value, "");
      return this;
    };
    /**
     * Sets the type.
     *
     * Contains the type of the entry, for example:
     * - "summary" for e.g. a list overview.
     * - "detail" e.g. when a summary is selected.
     * - "filter" e.g. for field/value pair results that can be selected as search parameters.
     *
     * @function
     * @param {String} [value=""]
     * @returns {DescribedDataFieldBuilder}
     * @example type("summary")
     */
    this.type = function (value) {
      this.describedField.type = withDefaultString(value, "");
      return this;
    };
    /**
     * Sets the optional abbreviation.
     *
     * Contains a symbol character or a very short abbreviation of the category.
     * - "P" for products
     * - "V" for vendors
     *
     * @function
     * @param {String} [value=""]
     * @returns {DescribedDataFieldBuilder}
     * @example abbreviation("P")
     */
    this.abbreviation = function (value) {
      this.describedField.abbreviation = withDefaultString(value, "");
      return this;
    };
    /**
     * Sets the optional path to an image resource.
     *
     * @function
     * @param {String} [value=""]
     * @returns {DescribedDataFieldBuilder}
     * @example image("img/product.png")
     */
    this.image = function (value) {
      this.describedField.image = withDefaultString(value, "");
      return this;
    };
    /**
     * Sets the index as an array of numbers containing the splitted array indexes of the source field.
     * Example: "responses[2].hits.hits[4]._source.name" will have an index of [2,4].
     *
     * @function
     * @param {number[]} [value=[]]
     * @returns {DescribedDataFieldBuilder}
     * @example index([2,4])
     */
    this.index = function (value) {
      this.describedField.index = withDefaultArray(value, []);
      return this;
    };
    /**
     * Sets the group names as an array of strings containing the names of the dynamically added properties,
     * that contain an array of {@link module:described_field.DescribedDataField}-Objects.
     *
     * @function
     * @param {string[]} [value=[]]
     * @returns {DescribedDataFieldBuilder}
     * @example groupNames(["summaries","details","options"])
     */
    this.groupNames = function (value) {
      this.describedField.groupNames = withDefaultArray(value, []);
      return this;
    };
    /**
     * Sets the display name.
     *
     * @function
     * @param {String} [value=""]
     * @returns {DescribedDataFieldBuilder}
     * @example displayName("Color")
     */
    this.displayName = function (value) {
      this.describedField.displayName = withDefaultString(value, "");
      return this;
    };
    /**
     * Sets the (technical) field name.
     *
     * @function
     * @param {String} [value=""]
     * @returns {DescribedDataFieldBuilder}
     * @example fieldName("color")
     */
    this.fieldName = function (value) {
      this.describedField.fieldName = withDefaultString(value, "");
      return this;
    };
    /**
     * Sets the value/content of the field.
     *
     * @function
     * @param {*} value
     * @returns {DescribedDataFieldBuilder}
     * @example value("darkblue")
     */
    this.value = function (value) {
      this.describedField.value = value;
      return this;
    };

    /**
     * Finalizes the settings and builds the {@link module:described_field.DescribedDataField}.
     * @function
     * @returns {module:described_field.DescribedDataField}
     */
    this.build = function () {
      return this.describedField;
    };
  }

  function isSpecifiedString(value) {
    return typeof value === "string" && value !== null && value !== "";
  }

  function withDefaultString(value, defaultValue) {
    return isSpecifiedString(value) ? value : defaultValue;
  }

  function withDefaultArray(value, defaultValue) {
    return value === undefined || value === null ? defaultValue : value;
  }

  return DescribedDataFieldBuilder;
}());

/**
 * Creates a new described data field with all properties of the original one except for dynamically added groups.
 * @param {module:described_field.DescribedDataField} describedDataField
 * @returns {module:described_field.DescribedDataField}
 * @memberof module:described_field
 */
described_field.copyWithoutGroups = function (describedDataField) {
  return new described_field.DescribedDataFieldBuilder().fromDescribedDataField(describedDataField).groupNames([]).build();
};

described_field.DescribedDataFieldGroup = (function () {
  /**
   * Adds groups to {@link module:described_field.DescribedDataField}s. These groups are dynamically added properties
   * that contain an array of sub fields of the same type {@link module:described_field.DescribedDataField}s.
   *
   * @param {module:described_field.DescribedDataField} dataField
   * @constructs DescribedDataFieldGroup
   * @alias module:described_field.DescribedDataFieldGroup
   * @example new described_field.DescribedDataFieldGroup(field).addGroupEntry("details", detailField);
   */
  function DescribedDataFieldGroup(dataField) {
    this.dataField = dataField;

    /**
     * Adds an entry to the given group. If the group does not exist, it will be created.
     * @function
     * @param {String} groupName name of the group to which the entry will be added
     * @param {module:described_field.DescribedDataField} describedField sub field that is added to the group
     * @returns {DescribedDataFieldGroup}
     */
    this.addGroupEntry = function (groupName, describedField) {
      this.addGroupEntries(groupName, [describedField]);
      return this;
    };

    /**
     * Adds entries to the given group. If the group does not exist, it will be created.
     * @function
     * @param {String} groupName name of the group to which the entries will be added
     * @param {module:described_field.DescribedDataField[]} describedFields sub fields that are added to the group
     * @returns {DescribedDataFieldGroup}
     */
    this.addGroupEntries = function (groupName, describedFields) {
      if (!groupName || groupName.length === 0) {
        return this;
      }
      if (!describedFields || describedFields.length === 0) {
        return this;
      }
      if (this.dataField[groupName] === undefined) {
        this.dataField.groupNames.push(groupName);
        this.dataField[groupName] = [];
      }
      var index;
      var describedField;
      for (index = 0; index < describedFields.length; index += 1) {
        describedField = describedFields[index];
        this.dataField[groupName].push(describedField);
      }
      return this;
    };
  }

  return DescribedDataFieldGroup;
}());

/**
 * @file datarestructor transforms parsed JSON objects into a uniform data structure
 * @version {@link https://github.com/JohT/data-restructor-js/releases/latest latest version}
 * @author JohT
 */

 "use strict";
var module = datarestructorInternalCreateIfNotExists(module); // Fallback for vanilla js without modules

function datarestructorInternalCreateIfNotExists(objectToCheck) {
  return objectToCheck || {};
}

/**
 * datarestructor namespace and module declaration.
 * It contains all functions to convert an object (e.g. parsed JSON) into uniform enumerated list of described field entries.
 * 
 * <b>Transformation steps:</b>
 * - JSON
 * - flatten
 * - mark and identify
 * - add array fields
 * - deduplicate 
 * - group
 * - flatten again
 * @module datarestructor
 */
var datarestructor = module.exports={}; // Export module for npm...
datarestructor.internalCreateIfNotExists = datarestructorInternalCreateIfNotExists;

var internal_object_tools = internal_object_tools || require("../../lib/js/flattenToArray"); // supports vanilla js & npm
var template_resolver = template_resolver || require("../../src/js/templateResolver"); // supports vanilla js & npm
var described_field = described_field || require("../../src/js/describedfield"); // supports vanilla js & npm

/**
 * Takes the full qualified original property name and extracts a simple name out of it.
 * 
 * @callback module:datarestructor.propertyNameFunction
 * @param {string} propertyName full qualified, point separated property name 
 * @return {String} extracted, simple name
 */

/**
 * Describes a selected part of the incoming data structure and defines, 
 * how the data should be transformed.
 * 
 * @typedef {Object} module:datarestructor.PropertyStructureDescription
 * @property {string} type - ""(default). Some examples: "summary" for e.g. a list overview. "detail" e.g. when a summary is selected. "filter" e.g. for field/value pair results that can be selected as search parameters.
 * @property {string} category - name of the category. Default = "". Could contain a short domain name like "product" or "vendor".
 * @property {string} [abbreviation=""] - one optional character, a symbol character or a short abbreviation of the category
 * @property {string} [image=""] - one optional path to an image resource
 * @property {boolean} propertyPatternTemplateMode - "false"(default): property name needs to be equal to the pattern. "true" allows variables like "{{fieldName}}" inside the pattern.
 * @property {string} propertyPattern - property name pattern (without array indices) to match
 * @property {string} indexStartsWith - ""(default) matches all ids. String that needs to match the beginning of the id. E.g. "1." will match id="1.3.4" but not "0.1.2".
 * @property {module:datarestructor.propertyNameFunction} getDisplayNameForPropertyName - display name for the property. ""(default) last property name element with upper case first letter.
 * @property {module:datarestructor.propertyNameFunction} getFieldNameForPropertyName - field name for the property. "" (default) last property name element.
 * @property {string} groupName - name of the property, that contains grouped entries. Default="group".
 * @property {string} groupPattern - Pattern that describes how to group entries. "groupName" defines the name of this group. A pattern may contain variables in double curly brackets {{variable}}.
 * @property {string} groupDestinationPattern - Pattern that describes where the group should be moved to. Default=""=Group will not be moved. A pattern may contain variables in double curly brackets {{variable}}.
 * @property {string} groupDestinationName - (default=groupName) Name of the group when it had been moved to the destination.
 * @property {string} deduplicationPattern - Pattern to use to remove duplicate entries. A pattern may contain variables in double curly brackets {{variable}}.
 */

datarestructor.PropertyStructureDescriptionBuilder = (function () {
  "use strict";

  /**
   * Builder for a {@link PropertyStructureDescription}.
   * @constructs PropertyStructureDescriptionBuilder
   * @alias module:datarestructor.PropertyStructureDescriptionBuilder
   */
  function PropertyStructureDescription() {
    /**
     * @type {module:datarestructor.PropertyStructureDescription}
     */
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
    /**
     * Sets the type.
     * 
     * Contains the type of the entry, for example: 
     * - "summary" for e.g. a list overview. 
     * - "detail" e.g. when a summary is selected. 
     * - "filter" e.g. for field/value pair results that can be selected as search parameters.
     * 
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example type("summary")
     */
    this.type = function (value) {
      this.description.type = withDefault(value, "");
      return this;
    };
    /**
     * Sets the category.
     * 
     * Contains a short domain nam, for example: 
     * - "product" for products
     * - "vendor" for vendors
     * 
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example category("Product")
     */
    this.category = function (value) {
      this.description.category = withDefault(value, "");
      return this;
    };
    /**
     * Sets the optional abbreviation.
     * 
     * Contains a symbol character or a very short abbreviation of the category.
     * - "P" for products
     * - "V" for vendors
     * 
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example abbreviation("P")
     */
    this.abbreviation = function (value) {
      this.description.abbreviation = withDefault(value, "");
      return this;
    };
    /**
     * Sets the optional path to an image resource.
     * 
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example image("img/product.png")
     */
    this.image = function (value) {
      this.description.image = withDefault(value, "");
      return this;
    };
    /**
     * Sets "equal mode" for the property pattern.
     * 
     * "propertyPattern" need to match exactly if this mode is activated.
     *  It clears propertyPatternTemplateMode which means "equal" mode.
     * @function
     * @returns {module:datarestructor.PropertyStructureDescription}
     */
    this.propertyPatternEqualMode = function () {
      this.description.propertyPatternTemplateMode = false;
      return this;
    };
    /**
     * Sets "template mode" for the property pattern.
     * 
     * "propertyPattern" can contain variables like {{fieldName}} and
     * doesn't need to match the property name exactly. If the "propertyPattern"
     * is shorter than the property name, it also matches when the property name
     * starts with the "propertyPattern".
     * 
     * @function
     * @returns {module:datarestructor.PropertyStructureDescription}
     */
    this.propertyPatternTemplateMode = function () {
      this.description.propertyPatternTemplateMode = true;
      return this;
    };
    /**
     * Sets the property name pattern. 
     * 
     * Contains single property names with sub types separated by "." without array indices.
     * May contain variables in double curly brackets.
     * 
     * Example: 
     * - responses.hits.hits._source.{{fieldName}}
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example propertyPattern("responses.hits.hits._source.{{fieldName}}")
     */
    this.propertyPattern = function (value) {
      this.description.propertyPattern = withDefault(value, "");
      return this;
    };
    /**
     * Sets the optional beginning of the id that needs to match.
     * Matches all indices if set to "" (or not called).
     * 
     * For example:
     * - "1." will match id="1.3.4" but not "0.1.2".
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example indexStartsWith("1.")
     */
    this.indexStartsWith = function (value) {
      this.description.indexStartsWith = withDefault(value, "");
      return this;
    };
    /**
     * Overrides the display name of the property.
     * 
     * If it is not set or set to "" then it will be derived from the
     * last part of original property name starting with an upper case character.
     *  
     * For example:
     * - "Product"
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example displayPropertyName("Product")
     */
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
    /**
     * Overrides the (technical) field name of the property.
     * 
     * If it is not set or set to "" then it will be derived from the
     * last part of original property name.
     *  
     * For example:
     * - "product"
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example fieldName("product")
     */
    this.fieldName = function (value) {
      this.description.getFieldNameForPropertyName = createNameExtractFunction(value, this.description);
      return this;
    };
    /**
     * Sets the name of the property, that contains grouped entries. 
     * 
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example groupName("details")
     */
    this.groupName = function (value) {
      this.description.groupName = withDefault(value, "");
      return this;
    };
    /**
     * Sets the pattern that describes how to group entries. 
     * 
     * "groupName" defines the name of this group.
     * A pattern may contain variables in double curly brackets {{variable}}.
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example groupPattern("{{type}}-{{category}}")
     */
    this.groupPattern = function (value) {
      this.description.groupPattern = withDefault(value, "");
      return this;
    };
    /**
     * Sets the pattern that describes where the group should be moved to. 
     * 
     * Default=""=Group will not be moved.
     * A pattern may contain variables in double curly brackets {{variable}}.
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example groupDestinationPattern("main-{{category}}")
     */
    this.groupDestinationPattern = function (value) {
      this.description.groupDestinationPattern = withDefault(value, "");
      return this;
    };
    /**
     * Sets the name of the group when it had been moved to the destination.
     * 
     * The default value is the groupName, which will be used when the value is not valid (null or empty)
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example groupDestinationPattern("options")
     */
    this.groupDestinationName = function (value) {
      this.description.groupDestinationName = withDefault(value, this.description.groupName);
      return this;
    };
    /**
     * Sets the pattern to be used to remove duplicate entries. 
     * 
     * A pattern may contain variables in double curly brackets {{variable}}.
     * A pattern may contain variables in double curly brackets {{variable}}.
     * @function
     * @param {String} [value=""]
     * @returns {module:datarestructor.PropertyStructureDescription}
     * @example deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
     */
    this.deduplicationPattern = function (value) {
      this.description.deduplicationPattern = withDefault(value, "");
      return this;
    };
    /**
     * Finalizes the settings and builds the  PropertyStructureDescription.
     * @function
     * @returns {module:datarestructor.PropertyStructureDescription}
     */
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
      return function () {
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
      return function () {
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

  return PropertyStructureDescription;
})();

/**
 * Adds a group item/entry to the {@link module:datarestructor.DescribedEntry}.
 * 
 * @callback module:datarestructor.addGroupEntryFunction
 * @param {String} groupName name of the group that should be added
 * @param {module:datarestructor.DescribedEntry} describedEntry entry that should be added to the group
 */

/**
 * Adds some group items/entries to the {@link module:datarestructor.DescribedEntry}.
 * 
 * @callback module:datarestructor.addGroupEntriesFunction
 * @param {String} groupName name of the group that should be added
 * @param {module:datarestructor.DescribedEntry[]} describedEntry entries that should be added to the group
 */

/**
 * @typedef {Object} module:datarestructor.DescribedEntry
 * @property {string} category - category of the result from the PropertyStructureDescription using a short name or e.g. a symbol character
 * @property {string} type - type of the result from PropertyStructureDescription
 * @property {string} [abbreviation=""] - one optional character, a symbol character or a short abbreviation of the category
 * @property {string} [image=""] - one optional path to an image resource
 * @property {string} index - array of numbers containing the split index. Example: "responses[2].hits.hits[4]._source.name" leads to an array with the two elements: [2,4]
 * @property {string} displayName - display name extracted from the point separated hierarchical property name, e.g. "Name"
 * @property {string} fieldName - field name extracted from the point separated hierarchical property name, e.g. "name"
 * @property {string} value - content of the field
 * @property {string[]} groupNames - array of names of all dynamically added properties representing groups
 * @property {module:datarestructor.addGroupEntryFunction} addGroupEntry - function, that adds an entry to the given group. If the group does not exist, it will be created.
 * @property {module:datarestructor.addGroupEntriesFunction} addGroupEntries - function, that adds entries to the given group. If the group does not exist, it will be created.
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
 * Returns a field value of the given {@link module:datarestructor.DescribedEntry}.
 * 
 * @callback module:datarestructor.stringFieldOfDescribedEntryFunction
 * @param {module:datarestructor.DescribedEntry} entry described entry that contains the field that should be returned
 * @returns {String} field value 
 */

datarestructor.DescribedEntryCreator = (function () {
  "use strict";

  var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");

  /**
   * Creates a {@link module:datarestructor.DescribedEntry}.
   * @constructs DescribedEntryCreator
   * @alias module:datarestructor.DescribedEntryCreator
   */
  function DescribedEntry(entry, description) {
    var indices = indicesOf(entry.name);
    var propertyNameWithoutArrayIndices = entry.name.replace(removeArrayBracketsRegEx, "");
    var templateResolver = new template_resolver.Resolver(this);
    this.category = description.category;
    this.type = description.type;
    this.abbreviation = description.abbreviation;
    this.image = description.image;
    /**
     * Array of numbers containing the split index.
     * Example: "responses[2].hits.hits[4]._source.name" leads to an array with two elements: [2,4]
     * This is the public version of the internal variable _identifier.index, which contains in contrast all index elements in one point separated string (e.g. "2.4").
     * @type {number[]}
     */
    this.index = indices.numberArray;
    this.displayName = description.getDisplayNameForPropertyName(propertyNameWithoutArrayIndices);
    this.fieldName = description.getFieldNameForPropertyName(propertyNameWithoutArrayIndices);
    this.value = entry.value;
    this.groupNames = [];
    this._isMatchingIndex = indices.pointDelimited.indexOf(description.indexStartsWith) == 0;
    this._description = description;

    this._identifier = {
      index: indices.pointDelimited,
      propertyNameWithArrayIndices: entry.name,
      propertyNameWithoutArrayIndices: propertyNameWithoutArrayIndices,
      groupId: "",
      groupDestinationId: "",
      deduplicationId: ""
    };
    this._identifier.groupId = templateResolver.replaceResolvableFields(
      description.groupPattern,
      templateResolver.resolvableFieldsOfAll(this, this._description, this._identifier)
    );
    this._identifier.groupDestinationId = templateResolver.replaceResolvableFields(
      description.groupDestinationPattern,
      templateResolver.resolvableFieldsOfAll(this, this._description, this._identifier)
    );
    this._identifier.deduplicationId = templateResolver.replaceResolvableFields(
      description.deduplicationPattern,
      templateResolver.resolvableFieldsOfAll(this, this._description, this._identifier)
    );

    /**
     * Adds an entry to the given group. If the group does not exist, it will be created.
     * @param {String} groupName name of the group that should be added
     * @param {module:datarestructor.DescribedEntry} describedEntry entry that should be added to the group
     */
    this.addGroupEntry = function(groupName, describedEntry) {
      this.addGroupEntries(groupName, [describedEntry]);
    };

    /**
     * Adds entries to the given group. If the group does not exist, it will be created.
     * @param {String} groupName
     * @param {module:datarestructor.DescribedEntry[]} describedEntries
     */
    this.addGroupEntries = function(groupName, describedEntries) {
      if (!this[groupName]) {
        this.groupNames.push(groupName);
        this[groupName] = [];
      }
      var index;
      var describedEntry;
      for (index = 0; index < describedEntries.length; index += 1) {
        describedEntry = describedEntries[index];
        this[groupName].push(describedEntry);
      }
    };
  }
  /**
   * @typedef {Object} module:datarestructor.ExtractedIndices
   * @property {string} pointDelimited - bracket indices separated by points
   * @property {number[]} numberArray as array of numbers
   */

  /**
   * Returns "1.12.123" and [1,12,123] for "results[1].hits.hits[12].aggregates[123]".
   *
   * @param {String} fullPropertyName
   * @return {module:datarestructor.ExtractedIndices} extracted indices in different representations
   * @protected
   * @memberof module:datarestructor.DescribedEntryCreator
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
   * @return {module:datarestructor.ExtractedIndices} extracted indices in different representations
   * @protected
   * @memberof module:datarestructor.DescribedEntryCreator
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

  return DescribedEntry;
})();

  /**
   * @typedef {Object} module:datarestructor.TransformConfig
   * @property {boolean} debugMode enables/disables detailed logging
   * @property {number} [maxRecursionDepth=8] Maximum recursion depth
   * @property {number} [removeDuplicationAboveRecursionDepth=1]  Duplications will be removed above the given recursion depth value and remain unchanged below it.
   */


datarestructor.Transform = (function () {
  "use strict";

  /**
   * Main class for the data transformation.
   * @param {module:datarestructor.PropertyStructureDescription[]} descriptions
   * @constructs Transform
   * @alias module:datarestructor.Transform
   */
  function Transform(descriptions) {
    /**
     * Descriptions of the input data that define the behaviour of the transformation.
     * @type {module:datarestructor.DescribedEntry[]}
     */
    this.descriptions = descriptions;
    /**
     * Configuration for the transformation.
     * @protected
     * @type {module:datarestructor.TransformConfig}
     */
    this.config = {
      /**
       * Debug mode switch, that enables/disables detailed logging.
       * @protected
       * @type {boolean}
       */
      debugMode: false,
      /**
       * Maximum recursion depth. Defaults to 8.
       * @protected
       * @type {number}
       */
      maxRecursionDepth: 8,
      /**
       * Duplications will be removed above the given recursion depth and remain below it.
       * Defaults to 1.
       *
       * Since fields can contain groups of fields that can contain groups of fields..., cyclic
       * data structures are possible by nature and will lead to duplications. Some of them
       * might be intended e.g. to take one (sub-)field with all (duplicated) groups.
       * To restrict duplications and improve performance it is beneficial to define a
       * recursion depth, above which further duplication won't be used and should be removed/avoided.
       *
       * @protected
       * @type {number}
       */
      removeDuplicationAboveRecursionDepth: 1
    };
    /**
     * Enables debug mode. Logs additional information.
     * @returns {module:datarestructor.Transform}
     */
    this.enableDebugMode = function () {
      this.config.debugMode = true;
      return this;
    };

    /**
     * Sets the maximum recursion depth. Defaults to 8 if not set.
     * @param {number} value non negative number.
     * @returns {module:datarestructor.Transform}
     */
    this.setMaxRecursionDepth = function (value) {
      if (typeof value !== "number" || value < 0) {
        throw "Invalid max recursion depth value: " + value;
      }
      this.config.maxRecursionDepth = value;
      return this;
    };
    /**
     * Sets the recursion depth above which duplication will be removed. Duplications below it remain unchanged.
     * Defaults to 1.
     *
     * Since fields can contain groups of fields that can contain groups of fields..., cyclic
     * data structures are possible by nature and will lead to duplications. Some of them
     * might be intended e.g. to take one (sub-)field with all (duplicated) groups.
     * To restrict duplications and improve performance it is beneficial to define a
     * recursion depth, above which further duplication won't be used and should be removed/avoided.
     *
     * @param {number} value non negative number.
     * @returns {module:datarestructor.Transform}
     */
    this.setRemoveDuplicationAboveRecursionDepth = function (value) {
      if (typeof value !== "number" || value < 0) {
        throw "Invalid remove duplications above recursion depth value: " + value;
      }
      this.config.removeDuplicationAboveRecursionDepth = value;
      return this;
    };
    /**
     * "Assembly line", that takes the (pared JSON) data and processes it using all given descriptions in their given order.
     * @param {object} data - parsed JSON data or any other data object
     * @returns {module:datarestructor.DescribedEntry[]}
     * @example
     * var allDescriptions = [];
     * allDescriptions.push(summariesDescription());
     * allDescriptions.push(detailsDescription());
     * var result = new datarestructor.Transform(allDescriptions).processJson(jsonData);
     */
    this.processJson = function (data) {
      return processJsonUsingDescriptions(data, this.descriptions, this.config);
    };
  }

  /**
   * "Assembly line", that takes the jsonData and processes it using all given descriptions in their given order.
   * @param {object} jsonData parsed JSON data or any other data object
   * @param {module:datarestructor.PropertyStructureDescription[]} descriptions - already grouped entries
   * @param {module:datarestructor.TransformConfig} config configuration for the data transformation
   * @returns {module:datarestructor.DescribedEntry[]}
   * @protected
   * @memberof module:datarestructor.Transform
   */
  function processJsonUsingDescriptions(jsonData, descriptions, config) {
    // "Flatten" the hierarchical input json to an array of property names (point separated "folders") and values.
    var processedData = internal_object_tools.flattenToArray(jsonData);
    // Fill in properties ending with the name "_comma_separated_values" for array values to make it easier to display them.
    processedData = fillInArrayValues(processedData);

    if (config.debugMode) {
      console.log("flattened data with array values:");
      console.log(processedData);
    }

    // Mark, identify and harmonize the flattened data by applying one description after another in their given order.
    var describedData = [];
    var descriptionIndex, description, dataWithDescription;
    for (descriptionIndex = 0; descriptionIndex < descriptions.length; descriptionIndex += 1) {
      description = descriptions[descriptionIndex];
      // Filter all entries that match the current description and enrich them with it
      dataWithDescription = extractEntriesByDescription(processedData, description);
      // Remove duplicate entries where a deduplicationPattern is described
      describedData = deduplicateFlattenedData(describedData, dataWithDescription);
    }
    processedData = describedData;

    if (config.debugMode) {
      console.log("describedData data:");
      console.log(processedData);
    }

    // Group entries where a groupPattern is described
    processedData = groupFlattenedData(processedData);

    if (config.debugMode) {
      console.log("grouped describedData data:");
      console.log(processedData);
    }

    // Move group entries where a groupDestinationPattern is described
    processedData = applyGroupDestinationPattern(processedData);

    if (config.debugMode) {
      console.log("moved grouped describedData data:");
      console.log(processedData);
    }

    // Turns the grouped object back into an array of DescribedEntry-Objects
    processedData = propertiesAsArray(processedData);

    // Converts the internal described entries  into described fields
    processedData = toDescribedFields(processedData, config);

    if (config.debugMode) {
      console.log("transformed result:");
      console.log(processedData);
    }

    return processedData;
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
   * @param {module:datarestructor.DescribedEntry[]} entries
   * @param {module:datarestructor.DescribedEntry[]} entriesToMerge
   * @param {module:datarestructor.stringFieldOfDescribedEntryFunction} idOfElementFunction returns the id of an DescribedEntry
   * @protected
   * @memberof module:datarestructor.Transform
   */
  function mergeFlattenedData(entries, entriesToMerge, idOfElementFunction) {
    var entriesToMergeById = asIdBasedObject(entriesToMerge, idOfElementFunction);
    var merged = [];
    var index, entry, id;
    for (index = 0; index < entries.length; index += 1) {
      entry = entries[index];
      id = idOfElementFunction(entry);
      if (id == null || id === "" || entriesToMergeById[id] == null) {
        merged.push(entry);
      }
    }
    for (index = 0; index < entriesToMerge.length; index += 1) {
      entry = entriesToMerge[index];
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
   * and entries occurring later in the array overwrite earlier ones,
   * if they have the same id.
   *
   * "entriesToMerge" will be returned directly, if "entries" is null or empty.
   *
   * The id is extracted from every element using their deduplication pattern (if available).
   *
   * @param {module:datarestructor.DescribedEntry[]} entries
   * @param {module:datarestructor.DescribedEntry[]} entriesToMerge
   * @param {module:datarestructor.stringFieldOfDescribedEntryFunction} idOfElementFunction returns the id of an DescribedEntry
   * @see mergeFlattenedData
   * @protected
   * @memberof module:datarestructor.Transform
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
   * @param {module:datarestructor.DescribedEntry[]} elements of DescribedEntry elements
   * @param {module:datarestructor.stringFieldOfDescribedEntryFunction} idOfElementFunction returns the id of an DescribedEntry
   * @return {module:datarestructor.DescribedEntry[] entries indexed by id
   * @protected
   * @memberof module:datarestructor.Transform
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
   * @param {module:datarestructor.DescribedEntry[]} elements of DescribedEntry elements
   * @return {module:datarestructor.DescribedEntry[] entries indexed by id
   * @protected
   * @memberof module:datarestructor.Transform
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
   * @param {module:datarestructor.DescribedEntry[]} elements of DescribedEntry elements
   * @param {module:datarestructor.stringFieldOfDescribedEntryFunction} groupNameOfElementFunction function, that returns the name of the group property that will be created inside the "main" element.
   * @param {module:datarestructor.stringFieldOfDescribedEntryFunction} groupIdOfElementFunction returns the group id of an DescribedEntry
   * @return {module:datarestructor.DescribedEntry[] entries indexed by id
   * @protected
   * @memberof module:datarestructor.Transform
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
      }
      groupedResult[groupId].addGroupEntry(groupName, element);
    }
    return groupedResult;
  }

  /**
   * Extracts entries out of "flattened" JSON data and provides an array of objects.
   * @param {Object[]} flattenedData - flattened json from search query result
   * @param {string} flattenedData[].name - name of the property in hierarchical order separated by points
   * @param {string} flattenedData[].value - value of the property as string
   * @param {module:datarestructor.PropertyStructureDescription} - description of structure of the entries that should be extracted
   * @return {module:datarestructor.DescribedEntry[]}
   * @protected
   * @memberof module:datarestructor.Transform
   */
  function extractEntriesByDescription(flattenedData, description) {
    var removeArrayBracketsRegEx = new RegExp("\\[\\d+\\]", "gi");
    var filtered = [];

    flattenedData.filter(function (entry) {
      var propertyNameWithoutArrayIndices = entry.name.replace(removeArrayBracketsRegEx, "");
      if (description.matchesPropertyName(propertyNameWithoutArrayIndices)) {
        var describedEntry = new datarestructor.DescribedEntryCreator(entry, description);
        if (describedEntry._isMatchingIndex) {
          filtered.push(describedEntry);
        }
      }
    });
    return filtered;
  }

  /**
   * Takes already grouped {@link module:datarestructor.DescribedEntry} objects and
   * uses their "_identifier.groupDestinationId" (if exists)
   * to move groups to the given destination.
   *
   * This is useful, if separately described groups like "summary" and "detail" should be put together,
   * so that every summery contains a group with the regarding details.
   *
   * @param {module:datarestructor.DescribedEntry[]} groupedObject - already grouped entries
   * @return {module:datarestructor.DescribedEntry[]}
   * @protected
   * @memberof module:datarestructor.Transform
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
          groupedObject[destinationKey].addGroupEntries(entry._description.groupDestinationName, newGroup);
          keysToDelete.push(key);
        }
      }
    }
    // delete all moved entries that had been collected by their key
    for (index = 0; index < keysToDelete.length; index += 1) {
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
   * @protected
   * @memberof module:datarestructor.Transform
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
   * Converts described entries (internal data structure) to described fields (external data structure).
   * Since the structure of a described field is hierarchical, every field needs to be converted
   * in a recursive manner. The maximum recursion depth is taken as the second parameter.
   * @param {module:datarestructor.DescribedEntry[]} describedEntries
   * @param {module:datarestructor.TransformConfig} config configuration for the data transformation
   * @returns {module:described_field.DescribedDataField[]}
   * @protected
   * @memberof module:datarestructor.Transform
   */
  function toDescribedFields(describedEntries, config) {
    var result = [];
    var index;
    var describedEntity;
    for (index = 0; index < describedEntries.length; index += 1) {
      describedEntity = describedEntries[index];
      result.push(toDescribedField(describedEntity, 0, config));
    }
    return result;
  }

  /**
   * Converts a internal described entry to a newly created public described field.
   * Since the structure of a described field is hierarchical, this function is called recursively.
   * Because the internal described entries may very likely contain cyclic references, the depth of recursion
   * needs to be limited. Therefore, the current recursion depth is taken as second parameter
   * and the maximum recursion depth is taken as third parameter.
   * @param {module:datarestructor.DescribedEntry} entry the internal entry that will be converted
   * @param {number} recursionDepth current hierarchy recursion depth
   * @param {module:datarestructor.TransformConfig} config configuration for the data transformation
   * @returns {module:described_field.DescribedDataField}
   * @protected
   * @memberof module:datarestructor.Transform
   */
  function toDescribedField(entry, recursionDepth, config) {
    var field = new described_field.DescribedDataFieldBuilder()
      .category(entry.category)
      .type(entry.type)
      .abbreviation(entry.abbreviation)
      .image(entry.image)
      .index(entry.index)
      .displayName(entry.displayName)
      .fieldName(entry.fieldName)
      .value(entry.value)
      .build();
    if (recursionDepth > config.maxRecursionDepth) {
      return field;
    }
    var fieldGroups = new described_field.DescribedDataFieldGroup(field);
    forEachGroupEntry(entry, function (groupName, groupEntry) {
      if (groupEntry != entry || recursionDepth <= config.removeDuplicationAboveRecursionDepth) {
        fieldGroups.addGroupEntry(groupName, toDescribedField(groupEntry, recursionDepth + 1, config));
      } else {
        if (config.debugMode) {
          console.log(
            "Removed duplicate field " +
              groupEntry.fieldName +
              " with value " +
              groupEntry.value +
              " of group " +
              groupName +
              " at recursion depth " +
              recursionDepth
          );
        }
      }
    });
    return field;
  }

  /**
   * Takes the full qualified original property name and extracts a simple name out of it.
   *
   * @callback module:datarestructor.onEntryFoundFunction
   * @param {string} groupName name of the group where the entry had been found.
   * @param {module:datarestructor.DescribedEntry} foundEntry the found entry itself.
   */

  /**
   * Traverses through all groups and their entries and calls the given function on every found entry
   * with the group name and the entry itself as parameters.
   * @param {module:datarestructor.DescribedEntry} rootEntry
   * @param {module:datarestructor.onEntryFoundFunction} onFoundEntry
   * @protected
   * @memberof module:datarestructor.Transform
   */
  function forEachGroupEntry(rootEntry, onFoundEntry) {
    var groupIndex, entryIndex;
    var groupName, entry;
    for (groupIndex = 0; groupIndex < rootEntry.groupNames.length; groupIndex += 1) {
      groupName = rootEntry.groupNames[groupIndex];
      for (entryIndex = 0; entryIndex < rootEntry[groupName].length; entryIndex += 1) {
        entry = rootEntry[groupName][entryIndex];
        onFoundEntry(groupName, entry);
      }
    }
  }

  return Transform;
})();

/**
 * Main fassade for the data restructor as static function(s).
 * 
 * @example 
 * var allDescriptions = [];
 * allDescriptions.push(summariesDescription());
 * allDescriptions.push(detailsDescription());
 * var result = datarestructor.Restructor.processJsonUsingDescriptions(jsonData, allDescriptions);
 * @namespace module:datarestructor.Restructor
 */
datarestructor.Restructor = {};
/**
 * Static fassade function for the "Assembly line", that takes the jsonData and processes it using all given descriptions in their given order.
 * @param {object} jsonData - parsed JSON data or any other data object
 * @param {module:datarestructor.PropertyStructureDescription[]} descriptions - already grouped entries
 * @param {boolean} debugMode - false=default=off, true=write additional logs for detailed debugging
 * @returns {module:datarestructor.DescribedEntry[]}
 * @memberof module:datarestructor.Restructor
 * @deprecated since v3.1.0, please use "new datarestructor.Transform(descriptions).processJson(jsonData)".
 */
datarestructor.Restructor.processJsonUsingDescriptions = function(jsonData, descriptions, debugMode) {
  var restructor = new datarestructor.Transform(descriptions);
  if (debugMode) {
    restructor.enableDebugMode();
  }
  return restructor.processJson(jsonData);
};
