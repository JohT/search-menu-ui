/**
 * restruct namespace declaration.
 * Adapts the search result JSON from the server to the data structure needed by the search UI.
 * @default {}
 */
var restruct = restruct || {};

restruct.Data = (function () {
  "use strict";

  function restructJson(jsonData) {
    var restructured = datarestructor.Restructor.processJsonUsingDescriptions(jsonData, getDescriptions(), false);
    console.log(restructured);
    return restructured;
  }

  function getDescriptions() {
    var descriptions = [];
    descriptions.push(summarizedAccountNumberDescription());
    // allDescriptions.push(highlightedAccountNumberDescription());
    descriptions.push(summarizedAccountNameDescription());
    // allDescriptions.push(highlightedAccountNameDescription());
    descriptions.push(summarizedAccountTypeDescription());
    
    descriptions.push(detailsDescription());
    descriptions.push(filtersDescription());

    descriptions.push(sitesMainDescription());
    descriptions.push(sitesOptionDefaultUrlPatternDescription());
    descriptions.push(sitesOptionsSummaryDescription());
    descriptions.push(sitesOptionDetailsDescription());
    descriptions.push(sitesOptionUrlPatternDescription());
    return descriptions;
  }

  //TODO new optional property containing a symbol 
  //TODO new optional property containing a imageReference 
  function summarizedAccountNumberDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("account") 
      // .abbreviation("&#128176;") //money bag symbol
      .abbreviation("&#x1F4B6;") //Banknote with Euro Sign
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.kontonummer")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
      .build();
  }

  function highlightedAccountNumberDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("account")
      // .abbreviation("&#128176;") //money bag symbol
      .abbreviation("&#x1F4B6;") //Banknote with Euro Sign
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits.highlight.kontonummer")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
      .build();
  }

  function summarizedAccountNameDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("account") 
      // .abbreviation("&#128176;") //money bag symbol
      .abbreviation("&#x1F4B6;") //Banknote with Euro Sign
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.verfuegungsberechtigt")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
      .build();
  }

  function highlightedAccountNameDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("account")
      // .abbreviation("&#128176;") //money bag symbol
      .abbreviation("&#x1F4B6;") //Banknote with Euro Sign
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits.highlight.verfuegungsberechtigt")
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
      // .abbreviation("&#128176;") //money bag symbol
      .abbreviation("&#x1F4B6;") //Banknote with Euro Sign
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.geschaeftsart")
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
      // .abbreviation("&#128176;") //money bag symbol
      .abbreviation("&#x1F4B6;") //Banknote with Euro Sign
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
      //TODO delete not needed symbols
      //.abbreviation("&#10729;") //Down-Pointing Triangle with Right Half Black symbol
      //.abbreviation("&#128142;") //gem stone symbol
      //.abbreviation("&#127993;") //bow an arrow symbol
      //.abbreviation("&#128071;") //White Down Pointing Backhand Index symbol
      //.abbreviation("&#128205;") //Round Pushpin symbol
      //.abbreviation("&#128204;") //Pushpin symbol
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
      .category("account") //finger left navigation symbol
      .abbreviation("&#x261c;") //finger left navigation symbol
      .indexStartsWith("2.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.name")
      .displayPropertyName("Ziel")
      .groupName("default")
      .groupPattern("{{category}}--{{type}}")
      .build();
  }

  function sitesOptionDefaultUrlPatternDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("url")
      .category("account")
      .abbreviation("&#x261c;") //finger left navigation symbol
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
      .abbreviation("&#x261c;") //finger left navigation symbol
      .indexStartsWith("3.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.name")
      .displayPropertyName("Ziel")
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
      .abbreviation("&#x261c;") //finger left navigation symbol
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
      .abbreviation("&#x261c;") //finger left navigation symbol
      .indexStartsWith("3.")
      .propertyPatternTemplateMode()
      .propertyPattern("responses.hits.hits._source.urltemplate")
      .groupName("urltemplate")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("{{category}}--summary--{{index[0]}}--{{index[1]}}")
      .build();
  }

  /**
   * Public interface
   * @scope restruct.Data
   */
  return {
    restructJson: restructJson,
    getDescriptions: getDescriptions
  };
})();
