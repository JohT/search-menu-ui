"use strict";

describe("resultparser.Parser (use case)", function () {
  var jsonData;
  var parserUnderTest;

  beforeEach(function () {
    jsonData = testdata.UserCase.getJson();
    parserUnderTest = resultparser.Parser;
  });

  //strictly speaking, this is not a unit test. It could be seen as integration test.
  //It shows an example on how to use the resultparser.
  describe("processes JSON using descriptions based on a complete use case", function () {
    var parserResults;
    var atLeastOneEntryAsserted;

    beforeEach(function () {
      atLeastOneEntryAsserted = false;
      var descriptions = [];
      descriptions.push(summariesDescription());
      descriptions.push(highlightedDescription());
      descriptions.push(detailsDescription());
      descriptions.push(filtersDescription());
      parserResults = parserUnderTest.processJsonUsingDescriptions(jsonData, descriptions);
    });

    afterEach(function () {
      expect(atLeastOneEntryAsserted).toBeTrue(); //assures, that at least one entry had been asserted by "expect"
    });

    function summariesDescription() {
      return new resultparser.PropertyStructureDescriptionBuilder()
        .type("summary")
        .category("account")
        .propertyPatternEqualMode()
        .propertyPattern("responses.hits.hits._source.accountnumber")
        .groupName("summaries")
        .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
        .deduplicationPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}--{{fieldName}}")
        .build();
    }

    function highlightedDescription() {
      return new resultparser.PropertyStructureDescriptionBuilder()
        .type("summary")
        .category("account")
        .propertyPatternEqualMode()
        .propertyPattern("responses.hits.hits.highlight.accountnumber")
        .groupName("summaries")
        .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
        .deduplicationPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}--{{fieldName}}")
        .build();
    }

    function detailsDescription() {
      return new resultparser.PropertyStructureDescriptionBuilder()
        .type("detail")
        .category("account")
        .propertyPatternTemplateMode()
        .propertyPattern("responses.hits.hits._source.{{fieldName}}")
        .groupName("details")
        .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
        .groupDestinationPattern("account--summary--{{id[0]}}--{{id[1]}}")
        .build();
    }

    function filtersDescription() {
      return new resultparser.PropertyStructureDescriptionBuilder()
        .type("filter")
        .category("account")
        .propertyPatternTemplateMode()
        .propertyPattern("responses.aggregations.{{fieldName}}.buckets.key")
        .groupName("options")
        .groupPattern("{{id[0]}}--{{type}}--{{category}}--{{fieldName}}")
        .build();
    }

    function forEachEntry(callback) {
      expect(parserResults.length).toBeGreaterThan(3);
      var index = 0;
      for (index = 0; index < parserResults.length; index += 1) {
        callback(parserResults[index]);
      }
    }

    function forEachEntryMatching(matcher, callback) {
      return forEachEntry(function (entry) {
        if (matcher(entry) === true) {
          callback(entry);
        }
      });
    }

    it("every entry has the described category 'account'", function () {
      forEachEntry(function (entry) {
        atLeastOneEntryAsserted = true;
        expect(entry.category).toBe("account");
      });
    });

    it("every entry of type 'summary' has a group 'summaries' with at least one entry", function () {
      forEachEntryMatching(
        function (entry) {
          return entry.type === "summary";
        },
        function (entry) {
          atLeastOneEntryAsserted = true;
          expect(entry.summaries.length).toBeGreaterThan(0);
        }
      );
    });

    it("every entry of type 'filter' has a group 'options' with at least two entries", function () {
      forEachEntryMatching(
        function (entry) {
          return entry.type === "filter";
        },
        function (entry) {
          atLeastOneEntryAsserted = true;
          expect(entry.options.length).toBeGreaterThan(1);
        }
      );
    });

    it("every entry in group 'options' inside type 'filter' belongs to the same filter field name", function () {
      forEachEntryMatching(
        function (entry) {
          return entry.type === "filter";
        },
        function (entry) {
          var index = 0;
          var expectedFieldName = entry.fieldName;
          // For each entry in 'options' of the current filter entry
          for (index = 0; index < entry.options.length; index += 1) {
            atLeastOneEntryAsserted = true;
            expect(entry.options[index].fieldName).toEqual(expectedFieldName);
          }
        }
      );
    });

    it("every entry in group 'options' inside type 'filter' belongs to the same filter display field name", function () {
      forEachEntryMatching(
        function (entry) {
          return entry.type === "filter";
        },
        function (entry) {
          var index = 0;
          var expectedDisplayName = entry.displayName;
          // For each entry in 'options' of the current filter entry
          for (index = 0; index < entry.options.length; index += 1) {
            atLeastOneEntryAsserted = true;
            expect(entry.options[index].displayName).toEqual(expectedDisplayName);
          }
        }
      );
    });

    it("every entry of type 'summary' has a group 'details' (moved by groupDestinationPattern) with more than 10 entries", function () {
      forEachEntryMatching(
        function (entry) {
          return entry.type === "summary";
        },
        function (entry) {
          atLeastOneEntryAsserted = true;
          expect(entry.details.length).toBeGreaterThan(10);
        }
      );
    });

    it("every entry of type 'summary' had been overwritten with the highlighted value", function () {
      forEachEntryMatching(
        function (entry) {
          return entry.type === "summary";
        },
        function (entry) {
          atLeastOneEntryAsserted = true;
          expect(entry.value).toContain("<em>");
          expect(entry.value).toContain("</em>");
          expect(entry._identifier.propertyNameWithoutArrayIndizes).toContain(".highlight.");
        }
      );
    });

    it("every entry in group 'details' inside type 'summary' has one entry containing the same account number", function () {
      forEachEntryMatching(
        function (entry) {
          return entry.type === "summary";
        },
        function (entry) {
          var index = 0;
          var summaryEntryValue = entry.value;
          // Pick 'accountnumber' out of group 'details' of the current summary entry
          var valueOfTheAccountNumberInsideDetails;
          for (index = 0; index < entry.details.length; index += 1) {
            if (entry.details[index].fieldName === "accountnumber") {
              valueOfTheAccountNumberInsideDetails = entry.details[index].value;
              break;
            }
          }
          atLeastOneEntryAsserted = true;
          expect(summaryEntryValue).toContain(valueOfTheAccountNumberInsideDetails);
        }
      );
    });

  });
});
