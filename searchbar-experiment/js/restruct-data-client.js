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
    allDescriptions.push(summariesDescription());
    allDescriptions.push(highlightedDescription());
    allDescriptions.push(detailsDescription());
    allDescriptions.push(filtersDescription());

    allDescriptions.push(sitesMainDescription());
    allDescriptions.push(sitesOptionsSummaryDescription());
    allDescriptions.push(sitesOptionDetailsDescription());
    var restructured = datarestructor.Restructor.processJsonUsingDescriptions(jsonData, allDescriptions, false);
    console.log(restructured);
    return restructured;
  }

  function summariesDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("&#128176;") //money bag symbol
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.kontonummer")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
      .build();
  }

  function highlightedDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("&#128176;") //money bag symbol
      .indexStartsWith("0.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits.highlight.kontonummer")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
      .build();
  }

  function detailsDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("detail")
      .category("&#128176;") //money bag symbol
      .indexStartsWith("0.")
      .propertyPatternTemplateMode()
      .propertyPattern("responses.hits.hits._source.{{fieldName}}")
      .groupName("details")
      .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
      .groupDestinationPattern("Konto--summary--{{index[0]}}--{{index[1]}}")
      .build();
  }

  function filtersDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("filter")
      .category("&#128176;") //money bag symbol
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
      .category("&#x261c;") //finger left navigation symbol
      .indexStartsWith("2.")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.name")
      .groupName("default")
      .groupPattern("{{category}}--{{type}}")
      .build();
  }

  function sitesOptionsSummaryDescription() {
    return new datarestructor.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("&#x261c;") //finger left navigation symbol
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
      .category("&#x261c;") //finger left navigation symbol
      .indexStartsWith("3.")
      .propertyPatternTemplateMode()
      .propertyPattern("responses.hits.hits._source.{{fieldName}}")
      .groupName("details")
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
