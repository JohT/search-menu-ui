/**
 * restruct namespace declaration.
 * Adapts the search result JSON from the server to the data structure needed by the search UI.
 * @default {}
 */
var restruct = restruct || {};

restruct.Data = (function () {
  "use strict";

  function restructJson(jsonData) {
    var allDescriptions = [];
    allDescriptions.push(summarizedAccountNumberDescription());
    allDescriptions.push(highlightedAccountNumberDescription());
    allDescriptions.push(summarizedAccountNameDescription());
    allDescriptions.push(highlightedAccountNameDescription());
    allDescriptions.push(detailsDescription());
    allDescriptions.push(filtersDescription());

    allDescriptions.push(sitesMainDescription());
    allDescriptions.push(sitesOptionDefaultUrlPatternDescription());
    allDescriptions.push(sitesOptionsSummaryDescription());
    allDescriptions.push(sitesOptionDetailsDescription());
    allDescriptions.push(sitesOptionUrlPatternDescription());
    var restructured = datarestructor.Restructor.processJsonUsingDescriptions(jsonData, allDescriptions, false);
    console.log(restructured);
    return restructured;
  }

  //TODO new optional property containing a symbol 
  //TODO new optional property containing a imageReference 
  function summarizedAccountNumberDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("account") 
      .abbreviation("&#128176;") //money bag symbol
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
      .abbreviation("&#128176;") //money bag symbol
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
      .abbreviation("&#128176;") //money bag symbol
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
      .abbreviation("&#128176;") //money bag symbol
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits.highlight.verfuegungsberechtigt")
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
      .abbreviation("&#128176;") //money bag symbol
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
      .category("navigation") //finger left navigation symbol
      .abbreviation("&#x261c;") //finger left navigation symbol
      .indexStartsWith("2.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.name")
      .groupName("default")
      .groupPattern("{{category}}--{{type}}")
      .build();
  }

  //TODO add symbol as optional field that is only used to display results and is not needed for categorisation 
  function sitesOptionDefaultUrlPatternDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("url")
      .category("navigation")
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
      .category("navigation")
      .abbreviation("&#x261c;") //finger left navigation symbol
      .indexStartsWith("3.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.name")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("{{category}}--main")
      .groupDestinationName("options")
      .build();
  }

  function sitesOptionDetailsDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("details")
      .category("navigation")
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
      .category("navigation")
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
    restructJson: restructJson
  };
})();
