"use strict";

var searchbar = searchbar || require("../../src/js/search"); // supports vanilla js & npm

describe("search.js SearchViewDescription", function () {
  var searchUnderTest;

  beforeEach(function () {
    searchUnderTest = searchbar;
  });

  describe("SearchViewDescriptionBuilder", function () {
    var searchViewDescriptionBuilderUnderTest;

    beforeEach(function () {
      searchViewDescriptionBuilderUnderTest = new searchUnderTest.SearchViewDescriptionBuilder();
    });

    it("should contain an empty string for viewElementId if set to null", function () {
      searchViewDescriptionBuilderUnderTest.viewElementId(null);
      expect(searchViewDescriptionBuilderUnderTest.description.viewElementId).toEqual("");
    });

    it("should contain an empty string for viewElementId if set to undefined", function () {
      searchViewDescriptionBuilderUnderTest.viewElementId(undefined);
      expect(searchViewDescriptionBuilderUnderTest.description.viewElementId).toEqual("");
    });

    it("should contain listParentElementId", function () {
      var expectedValue = "seachdetailentries";
      searchViewDescriptionBuilderUnderTest.listParentElementId(expectedValue);
      expect(searchViewDescriptionBuilderUnderTest.description.listParentElementId).toEqual(expectedValue);
    });

    it("should contain viewElementId", function () {
      var expectedValue = "seachdetails";
      searchViewDescriptionBuilderUnderTest.viewElementId(expectedValue);
      expect(searchViewDescriptionBuilderUnderTest.description.viewElementId).toEqual(expectedValue);
    });

    it("should contain listEntryElementIdPrefix", function () {
      var expectedValue = "result";
      searchViewDescriptionBuilderUnderTest.listEntryElementIdPrefix(expectedValue);
      expect(searchViewDescriptionBuilderUnderTest.description.listEntryElementIdPrefix).toEqual(expectedValue);
    });

    it("should contain listEntryTextTemplate", function () {
      var expectedValue = "{{abbreviation}} {{displayName}}";
      searchViewDescriptionBuilderUnderTest.listEntryTextTemplate(expectedValue);
      expect(searchViewDescriptionBuilderUnderTest.description.listEntryTextTemplate).toEqual(expectedValue);
    });

    it("should contain listEntrySummaryTemplate", function () {
      var expectedValue = "{{summaries[0].abbreviation}}";
      searchViewDescriptionBuilderUnderTest.listEntrySummaryTemplate(expectedValue);
      expect(searchViewDescriptionBuilderUnderTest.description.listEntrySummaryTemplate).toEqual(expectedValue);
    });

    it("should contain isSelectableFilterOption", function () {
      var expectedValue = true;
      searchViewDescriptionBuilderUnderTest.isSelectableFilterOption(expectedValue);
      expect(searchViewDescriptionBuilderUnderTest.description.isSelectableFilterOption).toEqual(expectedValue);
    });

  });
  
  describe("SearchViewDescriptionBuilder from template", function () {
    var searchViewDescriptionBuilderUnderTest;

    beforeEach(function () {
      searchViewDescriptionBuilderUnderTest = new searchUnderTest.SearchViewDescriptionBuilder();
    });

    it("should contain viewElementId of template", function () {
      var expectedValue = "seachdetailsoftemplate";
      var template = searchViewDescriptionBuilderUnderTest.viewElementId(expectedValue).build();
      searchViewDescriptionBuilderUnderTest = new searchUnderTest.SearchViewDescriptionBuilder(template);
      expect(searchViewDescriptionBuilderUnderTest.description.viewElementId).toEqual(expectedValue);
    });

    it("should contain listParentElementId", function () {
      var expectedValue = "seachdetailentries";
      var template = searchViewDescriptionBuilderUnderTest.listParentElementId(expectedValue).build();
      searchViewDescriptionBuilderUnderTest = new searchUnderTest.SearchViewDescriptionBuilder(template);
      expect(searchViewDescriptionBuilderUnderTest.description.listParentElementId).toEqual(expectedValue);
    });

    it("should contain viewElementId", function () {
      var expectedValue = "seachdetails";
      var template = searchViewDescriptionBuilderUnderTest.viewElementId(expectedValue).build();
      searchViewDescriptionBuilderUnderTest = new searchUnderTest.SearchViewDescriptionBuilder(template);
      expect(searchViewDescriptionBuilderUnderTest.description.viewElementId).toEqual(expectedValue);
    });

    it("should contain listEntryElementIdPrefix", function () {
      var expectedValue = "result";
      var template = searchViewDescriptionBuilderUnderTest.listEntryElementIdPrefix(expectedValue).build();
      searchViewDescriptionBuilderUnderTest = new searchUnderTest.SearchViewDescriptionBuilder(template);
      expect(searchViewDescriptionBuilderUnderTest.description.listEntryElementIdPrefix).toEqual(expectedValue);
    });

    it("should contain listEntryTextTemplate", function () {
      var expectedValue = "{{abbreviation}} {{displayName}}";
      var template = searchViewDescriptionBuilderUnderTest.listEntryTextTemplate(expectedValue).build();
      searchViewDescriptionBuilderUnderTest = new searchUnderTest.SearchViewDescriptionBuilder(template);
      expect(searchViewDescriptionBuilderUnderTest.description.listEntryTextTemplate).toEqual(expectedValue);
    });

    it("should contain listEntrySummaryTemplate", function () {
      var expectedValue = "{{summaries[0].abbreviation}}";
      var template = searchViewDescriptionBuilderUnderTest.listEntrySummaryTemplate(expectedValue).build();
      searchViewDescriptionBuilderUnderTest = new searchUnderTest.SearchViewDescriptionBuilder(template);
      expect(searchViewDescriptionBuilderUnderTest.description.listEntrySummaryTemplate).toEqual(expectedValue);
    });

    it("should contain isSelectableFilterOption", function () {
      var expectedValue = true;
      var template =  searchViewDescriptionBuilderUnderTest.isSelectableFilterOption(expectedValue).build();
      searchViewDescriptionBuilderUnderTest = new searchUnderTest.SearchViewDescriptionBuilder(template);
      expect(searchViewDescriptionBuilderUnderTest.description.isSelectableFilterOption).toEqual(expectedValue);
    });

  });

});
