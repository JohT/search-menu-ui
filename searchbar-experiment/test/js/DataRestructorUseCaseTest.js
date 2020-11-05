"use strict";

describe("datarestructor.Restructor (use case)", function () {
  var jsonData;
  var restructorUnderTest;

  beforeEach(function () {
    jsonData = testdata.UserCase.getJson();
    restructorUnderTest = datarestructor.Restructor;
  });

  //strictly speaking, this is not a unit test. It could be seen as integration test.
  //It shows an example on how to use the datarestructor.
  describe("processes JSON using descriptions based on a complete use case", function () {
    var restructorResults;
    var atLeastOneEntryAsserted;

    beforeEach(function () {
      atLeastOneEntryAsserted = false;
      var descriptions = [];
      descriptions.push(summariesDescription());
      descriptions.push(highlightedDescription());
      descriptions.push(detailsDescription());
      descriptions.push(filtersDescription());
      descriptions.push(filterCountsDescription());
      restructorResults = restructorUnderTest.processJsonUsingDescriptions(jsonData, descriptions);
    });

    afterEach(function () {
      expect(atLeastOneEntryAsserted).toBeTrue(); //assures, that at least one entry had been asserted by "expect"
    });

    function summariesDescription() {
      return new datarestructor.PropertyStructureDescriptionBuilder()
        .type("summary")
        .category("account")
        .propertyPatternEqualMode()
        .propertyPattern("responses.hits.hits._source.accountnumber")
        .groupName("summaries")
        .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
        .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
        .indexStartsWith("0.")
        .build();
    }

    function highlightedDescription() {
      return new datarestructor.PropertyStructureDescriptionBuilder()
        .type("summary")
        .category("account")
        .propertyPatternEqualMode()
        .propertyPattern("responses.hits.hits.highlight.accountnumber")
        .groupName("summaries")
        .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
        .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
        .indexStartsWith("0.")
        .build();
    }

    function detailsDescription() {
      return new datarestructor.PropertyStructureDescriptionBuilder()
        .type("detail")
        .category("account")
        .propertyPatternTemplateMode()
        .propertyPattern("responses.hits.hits._source.{{fieldName}}")
        .groupName("details")
        .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
        .groupDestinationPattern("account--summary--{{index[0]}}--{{index[1]}}")
        .indexStartsWith("0.")
        .build();
    }

    function filtersDescription() {
      return new datarestructor.PropertyStructureDescriptionBuilder()
        .type("filter")
        .category("account")
        .propertyPatternTemplateMode()
        .propertyPattern("responses.aggregations.{{fieldName}}.buckets.key")
        .groupName("options")
        .groupPattern("{{index[0]}}--{{type}}--{{category}}--{{fieldName}}")
        .indexStartsWith("1.")
        .build();
    }

    function filterCountsDescription() {
      return new datarestructor.PropertyStructureDescriptionBuilder()
        .type("count")
        .category("account")
        .propertyPatternTemplateMode()
        .propertyPattern("responses.aggregations.{{fieldName}}.buckets.doc_count")
        .groupName("stats")
        .groupPattern("{{index[0]}}--{{type}}--{{category}}--{{fieldName}}")
        .groupDestinationPattern("{{index[0]}}--filter--{{category}}--{{fieldName}}")
        .groupDestinationName("counts")
        .indexStartsWith("1.")
        .build();
    }

    function forEachEntry(callback) {
      expect(restructorResults.length).toBeGreaterThan(3);
      var index = 0;
      for (index = 0; index < restructorResults.length; index += 1) {
        callback(restructorResults[index]);
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

    it("every entry in the moved & renamed group 'counts' inside type 'filter' contains a number value", function () {
      forEachEntryMatching(
        function (entry) {
          return entry.type === "filter";
        },
        function (entry) {
          var index = 0;
          // For each entry in 'options' of the current filter entry
          for (index = 0; index < entry.options.length; index += 1) {
            atLeastOneEntryAsserted = true;
            expect(entry.counts[index].value).toEqual(jasmine.any(Number));
          }
        }
      );
    });

    it("every entry in the moved & renamed group 'counts' inside type 'filter' belongs to the same filter field name", function () {
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
            expect(entry.counts[index].fieldName).toEqual(expectedFieldName);
          }
        }
      );
    });

    it("every entry in the moved & renamed group 'counts' inside type 'filter' belongs to the same filter display field name", function () {
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
            expect(entry.counts[index].displayName).toEqual(expectedDisplayName);
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
          expect(entry._identifier.propertyNameWithoutArrayIndices).toContain(".highlight.");
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

    it("all detail fields of one accountnumber should belong to it and should be equal to the test data", function () {
      forEachEntryMatching(
        function (entry) {
          return (entry.type === "summary") && (entry.value === "<em>12345678905</em>");
        },
        function (entry) {
          atLeastOneEntryAsserted = true;
          var index; 
          var detailField;
          var detailFields = {};
          for (index = 0; index < entry.details.length; index += 1) {
            detailField = entry.details[index];
            detailFields[detailField.fieldName] = detailField.value;
          }
          expect(detailFields.iban).toEqual("AT424321012345678905");
          expect(detailFields.accountnumber).toEqual("12345678905");
          expect(detailFields.customernumber).toEqual("00001234570");
          expect(detailFields.tenantnumber).toEqual("999");
          expect(detailFields.accounttype).toEqual("loan");
          expect(detailFields.productidentifier).toEqual("priloa");
          expect(detailFields.creationdate).toEqual("2020-08-08");
          expect(detailFields.lastchangetimestamp).toEqual("2020-08-08T14:20:30Z");
          expect(detailFields.name).toEqual("Clare Klammer");
          expect(detailFields.currency).toEqual("CHF");
          expect(detailFields.tags_comma_separated_values).toEqual("active, short-term");
        }
      );
    });


  });
});
