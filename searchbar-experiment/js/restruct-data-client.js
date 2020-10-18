/**
 * restruct namespace declaration.
 * Adapts the search result JSON from the server to the data structure needed by the search UI.
 * @default {}
 */
var restruct = restruct || {};

restruct.Data = (function () {
  "use strict";

  function restructJson(jsonData) {
    console.log("full assembly line:");
    var allDescriptions = [];
    allDescriptions.push(summariesDescription());
    allDescriptions.push(highlightedDescription());
    allDescriptions.push(detailsDescription());
    allDescriptions.push(filtersDescription());
    var restructured = resultparser.Parser.processJsonUsingDescriptions(jsonData, allDescriptions);
    console.log(restructured);
    return jsonData;
  }

  function summariesDescription() {
    return new resultparser.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("Konto")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits._source.kontonummer")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}--{{fieldName}}")
      .build();
  }

  function highlightedDescription() {
    return new resultparser.PropertyStructureDescriptionBuilder()
      .type("summary")
      .category("Konto")
      .propertyPatternEqualMode()
      .propertyPattern("responses.hits.hits.highlight.kontonummer")
      .groupName("summaries")
      .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
      .deduplicationPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}--{{fieldName}}")
      .build();
  }

  function detailsDescription() {
    return new resultparser.PropertyStructureDescriptionBuilder()
      .type("detail")
      .category("Konto")
      .propertyPatternTemplateMode()
      .propertyPattern("responses.hits.hits._source.{{fieldName}}")
      .groupName("details")
      .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
      .groupDestinationPattern("Konto--summary--{{id[0]}}--{{id[1]}}")
      .build();
  }

  function filtersDescription() {
    return new resultparser.PropertyStructureDescriptionBuilder()
      .type("filter")
      .category("Konto")
      .propertyPatternTemplateMode()
      .propertyPattern("responses.aggregations.{{fieldName}}.buckets.key")
      .groupName("options")
      .groupPattern("{{id[0]}}--{{type}}--{{category}}--{{fieldName}}")
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
