/**
 * @file restruct-data-client adapts the search result JSON from the server to the data structure needed by the search UI.
 * @version {@link https://github.com/JohT/search-menu-ui/releases/latest latest version}
 * @author JohT
 */
//TODO JSDoc

 "use strict";

var module = datarestructorInternalCreateIfNotExists(module); // Fallback for vanilla js without modules

function datarestructorInternalCreateIfNotExists(objectToCheck) {
  return objectToCheck || {};
}

/**
 * Adapts the search result JSON from the server to the data structure needed by the search UI.
 * @module restruct
 */
 var restruct = module.exports={}; // Export module for npm...
 restruct.internalCreateIfNotExists = datarestructorInternalCreateIfNotExists;
 
//TODO must find a way to use the "dist" module
//TODO must find a way to use ie compatible module
var datarestructor = datarestructor || require("data-restructor/devdist/datarestructor"); // supports vanilla js & npm

restruct.DataConverter = (function () {
  /**
   * Provides the data converter for the search. 
   * It uses "datarestructor" and acts as a delegating client in between.
   * @constructs DataConverter
   */
  function DataConverter() {

    /**
     * Creates the data converter function with or without debugMode.
     * @function
     * @param {boolean} debugMode 
     * @returns data converter function
     * @memberof DataConverter#
     */
    this.createDataConverter = function(debugMode) {
      return function(jsonData) {
        return restructJson(jsonData, debugMode);
      };
    };

    /**
     * @function
     * @returns {PropertyStructureDescription}
     * @memberof DataConverter#
     */
    this.getDescriptions = function() {
      return getDescriptions();
    };
  }

  function restructJson(jsonData, debugMode) {
    if (debugMode) {
      console.log("data before it gets restructured:");
      console.log(jsonData);
    }
    var transform = new datarestructor.Transform(getDescriptions()).setRemoveDuplicationAboveRecursionDepth(0).setMaxRecursionDepth(2);
    if (debugMode) {
      transform.enableDebugMode();
    }
    var restructured = transform.processJson(jsonData);
    if (debugMode) {
      console.log("restructured data:");
      console.log(JSON.stringify(restructured, null, 2));
    }
    return restructured;
  }

  function getDescriptions() {
    var descriptions = [];
    descriptions.push(summarizedAccountNumberDescription());
    descriptions.push(summarizedAccountNameDescription());
    descriptions.push(summarizedAccountTypeDescription());
    
    descriptions.push(detailsDescription());
    descriptions.push(filtersDescription());

    descriptions.push(sitesMainDescription());
    descriptions.push(sitesOptionDefaultUrlPatternDescription());
    descriptions.push(sitesOptionsSummaryDescription());
    //descriptions.push(sitesOptionDetailsDescription()); //TODO could add details to filter options
    descriptions.push(sitesOptionUrlPatternDescription());
    return descriptions;
  }

  function summarizedAccountNumberDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("account") 
      .abbreviation("&#x1F4B6;") //banknote with euro sign
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.accountnumber")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
      .build();
  }

  function summarizedAccountNameDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("account") 
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.disposer")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
      .build();
  }

  function summarizedAccountTypeDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("account") 
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.businesstype")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
      .build();
  }

  function detailsDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("detail")
      .category("account")
      .indexStartsWith("0.")
      .propertyPatternTemplateMode()
      .propertyPattern("responses.hits.hits._source.{{fieldName}}")
      .groupName("details")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("{{category}}--summary--{{index[0]}}--{{index[1]}}")
      .build();
  }

  function filtersDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("filter")
      .category("account")
      .abbreviation("&#128206;") //Paperclip symbol
      .indexStartsWith("1.")
      .propertyPatternTemplateMode()
      .propertyPattern("responses.aggregations.{{fieldName}}.buckets.key")
      .groupName("options")
      .groupPattern("{{index[0]}}--{{type}}--{{category}}--{{fieldName}}")
      .build();
  }

  function sitesMainDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("main")
      .category("account") 
      .abbreviation("&#x261c;") //finger left navigation symbol
      .indexStartsWith("2.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.name")
      .displayPropertyName("Target")
      .groupName("default")
      .groupPattern("{{category}}--{{type}}")
      .build();
  }

  function sitesOptionDefaultUrlPatternDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("url")
      .category("account")
      .indexStartsWith("2.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.urltemplate")
      .groupName("urltemplate")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("{{category}}--main")
      .build();
  }

  function sitesOptionsSummaryDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("account")
      .indexStartsWith("3.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.name")
      .displayPropertyName("Target")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("{{category}}--main")
      .groupDestinationName("options")
      .build();
  }

  function sitesOptionDetailsDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("details")
      .category("account")
      .indexStartsWith("3.")
      .propertyPatternTemplateMode()
      .propertyPattern("responses.hits.hits._source.{{fieldName}}")
      .groupName("details")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("{{category}}--summary--{{index[0]}}--{{index[1]}}")
      .build();
  }

  function sitesOptionUrlPatternDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("url")
      .category("account")
      .indexStartsWith("3.")
      .propertyPatternTemplateMode()
      .propertyPattern("responses.hits.hits._source.urltemplate")
      .groupName("urltemplate")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("{{category}}--summary--{{index[0]}}--{{index[1]}}")
      .build();
  }

  return DataConverter;
}());
