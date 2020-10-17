"use strict";

describe("resultparser.DescribedEntry", function () {
  var description;
  var rawEntry;
  var describedEntry;

  beforeEach(function () {
  });

  describe("is created with the raw entry and", function () {
    beforeEach(function () {
      rawEntry = { name: "responses[0].hits.hits[3]._source.tag[5]", value: "inactive" };
      description = new resultparser.PropertyStructureDescriptionBuilder().type("testtype").category("testcategory").build();
      describedEntry = new resultparser.DescribedEntryCreator(rawEntry, description);
    });

    it("should contain the raw property name", function () {
      var expectedValue = rawEntry.name;
      expect(describedEntry._identifier.propertyNameWithArrayIndizes).toEqual(expectedValue);
    });

    it("should also contain the raw property name with stripped indizes", function () {
      var expectedValue = "responses.hits.hits._source.tag";
      rawEntry.name = "responses[0].hits.hits[3]._source.tag[5]";
      expect(describedEntry._identifier.propertyNameWithoutArrayIndizes).toEqual(expectedValue);
    });

    it("should contain the id consisting only of the array indizes from the raw property name", function () {
      var expectedValue = "0.3.5";
      rawEntry.name = "responses[0].hits.hits[3]._source.tag[5]";
      expect(describedEntry._identifier.id).toEqual(expectedValue);
    });

    it("should contain the raw property value", function () {
      var expectedValue = rawEntry.value;
      expect(describedEntry.value).toEqual(expectedValue);
    });

    it("should contain the field name derived from the raw property name", function () {
      var expectedValue = "tag";
      rawEntry.name = "responses[0].hits.hits[3]._source.tag[5]";
      expect(describedEntry.fieldName).toEqual(expectedValue);
    });

    it("should contain the display name derived from the raw property name", function () {
      var expectedValue = "Tag";
      rawEntry.name = "responses[0].hits.hits[3]._source.tag[5]";
      expect(describedEntry.displayName).toEqual(expectedValue);
    });
  });

  describe("is created with the description and", function () {
    beforeEach(function () {
      rawEntry = { name: "responses[0].hits.hits[3]._source.tag[5]", value: "inactive" };
      description = new resultparser.PropertyStructureDescriptionBuilder().type("testtype").category("testcategory").build();
      describedEntry = new resultparser.DescribedEntryCreator(rawEntry, description);
    });

    it("should contain the description as internal property", function () {
      expect(describedEntry._description).toEqual(description);
    });

    it("should contain the type of the description", function () {
      expect(describedEntry.type).toEqual("testtype");
    });

    it("should contain the category of the description", function () {
      expect(describedEntry.category).toEqual("testcategory");
    });

    it("should have a matching id by default", function () {
      expect(describedEntry.isMatchingId).toBeTrue();
    });

    it("should have a matching id when described prefix matches", function () {
      description.idStartsWith = "1.3";
      rawEntry.name = "responses[1].hits.hits[3]._source.tag[5]";
      describedEntry = new resultparser.DescribedEntryCreator(rawEntry, description);
      expect(describedEntry.isMatchingId).toBeTrue();
    });

    it("shouldn't have a matching id when described prefix doesn't match", function () {
      description.idStartsWith = "5.";
      describedEntry = new resultparser.DescribedEntryCreator(rawEntry, description);
      expect(describedEntry.isMatchingId).toBeFalse();
    });

  });

  describe("resolves all pattern of the description while creation and ", function () {
    beforeEach(function () {
      rawEntry = { name: "responses[0].hits.hits[3]._source.tag[5]", value: "inactive" };
      description = new resultparser.PropertyStructureDescriptionBuilder().type("testtype").category("testcategory").build();
      describedEntry = new resultparser.DescribedEntryCreator(rawEntry, description);
    });

    it("should contain the group id derived from the groupPattern", function () {
      var expectedValue = "testtype-testcategory";
      description.groupPattern = "{{type}}-{{category}}"
      describedEntry = new resultparser.DescribedEntryCreator(rawEntry, description);
      expect(describedEntry._identifier.groupId).toEqual(expectedValue);
    });

    it("should contain the group destination id derived from the groupDestinationPattern", function () {
      var expectedValue = "0.3.5-testtype-testcategory";
      description.groupDestinationPattern = "{{id}}-{{type}}-{{category}}"
      describedEntry = new resultparser.DescribedEntryCreator(rawEntry, description);
      expect(describedEntry._identifier.groupDestinationId).toEqual(expectedValue);
    });

    it("should contain the deduplication id derived from the deduplicationPattern", function () {
      var expectedValue = "abctestcategory";
      description.deduplicationPattern = "abc{{category}}"
      describedEntry = new resultparser.DescribedEntryCreator(rawEntry, description);
      expect(describedEntry._identifier.deduplicationId).toEqual(expectedValue);
    });

    it("should resolve single indizes of the id", function () {
      var expectedValue = "5-0-3";
      description.groupPattern = "{{id[2]}}-{{id[0]}}-{{id[1]}}"
      describedEntry = new resultparser.DescribedEntryCreator(rawEntry, description);
      expect(describedEntry._identifier.groupId).toEqual(expectedValue);
    });

  });

});
