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
 * @global
 * @typedef {Object} DescribedDataField
 * @property {string} [category=""] - name of the category. Could contain a short domain name like "product" or "vendor".
 * @property {string} [type=""] - type of the data element. Examples: "summary" for e.g. a list overview. "detail" e.g. when a summary is selected. "filter" e.g. for field/value pair results that can be selected as data filters.
 * @property {string} [abbreviation=""] - one optional character, a symbol character or a short abbreviation of the category
 * @property {string} [image=""] - one optional path to an image resource
 * @property {string} index - array of numbers containing the splitted index. Example: "responses[2].hits.hits[4]._source.name" will have an index of [2,4]
 * @property {string[]} groupNames - array of names of all dynamically added properties representing groups
 * @property {string} displayName - display name of the field
 * @property {string} fieldName - field name
 * @property {{*}} value - content of the field
 * @property {DescribedDataField[]} [couldBeAnyCustomGroupName] any number of groups attached to the field each containing multiple fields
 */

described_field.DescribedDataFieldBuilder = (function () {
  /**
   * Builds a DescribedDataField.  
   * DescribedDataField is the main element of the restructured data and therefore considered "public".
   * @constructs DescribedDataFieldBuilder
   */
  function DescribedDataFieldBuilder() {
    /**
     * @type {DescribedDataField}
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
     * Takes over all values of the template DescribedDataField.
     * @function
     * @param {DescribedDataField} template
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
     * that contain an array of DescribedDataField-Objects.
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
     * Finalizes the settings and builds the DescribedDataField.
     * @function
     * @returns {DescribedDataField}
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
})();

/**
 * Creates a new described data field with all properties of the original one except for dynamically added groups.
 * @param {DescribedDataField} describedDataField 
 * @returns {DescribedDataField} 
 * @memberof described_field
 */
described_field.copyWithoutGroups = function(describedDataField) {
  return new described_field.DescribedDataFieldBuilder().fromDescribedDataField(describedDataField).build();
};

described_field.DescribedDataFieldGroup = (function () {
  /**
   * Adds groups to DescribedDataFields. These groups are dynamically added properties
   * that contain an array of sub fields of the same type DescribedDataFields.
   * 
   * @param {DescribedDataField} dataField
   * @constructs DescribedDataFieldGroup
   * @example new described_field.DescribedDataFieldGroup(field).addGroupEntry("details", detailField);
   */
  function DescribedDataFieldGroup(dataField) {
    this.dataField = dataField;

    /**
     * Adds an entry to the given group. If the group does not exist, it will be created.
     * @function
     * @param {String} groupName name of the group to which the entry will be added
     * @param {DescribedDataField} describedField sub field that is added to the group
     * @returns {DescribedDataFieldGroup}
     * @memberOf DescribedDataFieldGroup
     */
    this.addGroupEntry = function (groupName, describedField) {
      this.addGroupEntries(groupName, [describedField]);
      return this;
    };

    /**
     * Adds entries to the given group. If the group does not exist, it will be created.
     * @function
     * @param {String} groupName name of the group to which the entries will be added
     * @param {DescribedDataField[]} describedFields sub fields that are added to the group
     * @returns {DescribedDataFieldGroup}
     * @memberOf DescribedDataFieldGroup
     */
    this.addGroupEntries = function (groupName, describedFields) {
      if (!this.dataField[groupName]) {
        this.dataField.groupNames.push(groupName);
        this.dataField[groupName] = [];
      }
      var index;
      var describedField;
      for (index = 0; index < describedFields.length; index += 1) {
        describedField = describedFields[index];
        describedField = described_field.copyWithoutGroups(describedField);
        this.dataField[groupName].push(describedField);
      }
      return this;
    };
  }

  return DescribedDataFieldGroup;
})();
