"use strict";

var datarestructor = datarestructor || require("../../src/js/datarestructor.js"); // supports vanilla js & npm
var template_resolver = template_resolver || require("../../src/js/templateResolver"); // supports vanilla js & npm

describe("templateResolver.Resolver", function () {
  var description;
  var rawEntry;
  var describedEntry;
  var resolver;

  beforeEach(function () {
  });

  describe("resolves a template with variables of contained properties and ", function () {
    beforeEach(function () {
      rawEntry = { name: "responses[0].hits.hits[3]._source.tag[5]", value: "inactive" };
      description = new datarestructor.PropertyStructureDescriptionBuilder().type("testtype").category("testcategory").build();
      describedEntry = new datarestructor.DescribedEntryCreator(rawEntry, description);
      resolver = new template_resolver.Resolver(describedEntry);
    });

    it("should resolve variable {{type}}", function () {
      var expectedValue = "testtype";
      expect(resolver.resolveTemplate("{{type}}")).toEqual(expectedValue);
    });

    it("should resolve variable {{category}}", function () {
      var expectedValue = "testcategory";
      expect(resolver.resolveTemplate("{{category}}")).toEqual(expectedValue);
    });

    it("should resolve variable {{abbreviation}}", function () {
      var expectedValue = "T";
      description.abbreviation = expectedValue;
      describedEntry = new datarestructor.DescribedEntryCreator(rawEntry, description);
      resolver = new template_resolver.Resolver(describedEntry);
      expect(resolver.resolveTemplate("{{abbreviation}}")).toEqual(expectedValue);
    });

    it("should resolve variable {{image}}", function () {
      var expectedValue = "image.png";
      description.image = expectedValue;
      describedEntry = new datarestructor.DescribedEntryCreator(rawEntry, description);
      resolver = new template_resolver.Resolver(describedEntry);
      expect(resolver.resolveTemplate("{{image}}")).toEqual(expectedValue);
    });

    it("should NOT resolve variable {{index}} anymore, since it is an internal field. {{index[0]}} can (still) be used instead.", function () {
      expect(resolver.resolveTemplate("{{index}}")).toEqual("{{index}}");
    });

    it("should resolve variable {{index[1]}} with a part of the index", function () {
      var expectedValue = "3";
      var template = "{{index[1]}}";
      expect(resolver.resolveTemplate(template)).toEqual(expectedValue);
    });
    
    it("should resolve variable {{displayName}}", function () {
      var expectedValue = "Tag";
      expect(resolver.resolveTemplate("{{displayName}}")).toEqual(expectedValue);
    });

    it("should resolve variable {{fieldName}}", function () {
      var expectedValue = "tag";
      expect(resolver.resolveTemplate("{{fieldName}}")).toEqual(expectedValue);
    });

    it("should resolve variable {{value}}", function () {
      var expectedValue = "inactive";
      expect(resolver.resolveTemplate("{{value}}")).toEqual(expectedValue);
    });

    it("should resolve the described field directly with its fieldName {{tag}}", function () {
      var expectedValue = "inactive";
      expect(resolver.resolveTemplate("{{tag}}")).toEqual(expectedValue);
    });

    it("should resolve sub object variable {{testsubobject.value}}", function () {
      var expectedValue = "subobjectvalue";
      describedEntry = new datarestructor.DescribedEntryCreator(rawEntry, description);
      describedEntry.testsubobject = new datarestructor.DescribedEntryCreator(rawEntry, description);
      describedEntry.testsubobject.value = expectedValue;
      resolver = new template_resolver.Resolver(describedEntry);
      expect(resolver.resolveTemplate("{{testsubobject.value}}")).toEqual(expectedValue);
    });

    it("should resolve sub object array {{testgroup.value}}", function () {
      var expectedValue = "subarrayvalue";
      describedEntry = new datarestructor.DescribedEntryCreator(rawEntry, description);
      describedEntry.testgroup = [];
      describedEntry.testgroup[0] = new datarestructor.DescribedEntryCreator(rawEntry, description);
      describedEntry.testgroup[0].value = expectedValue;
      resolver = new template_resolver.Resolver(describedEntry);
      expect(resolver.resolveTemplate("{{testgroup[0].value}}")).toEqual(expectedValue);
    });

    it("should resolve the described field in the sub object directly with its group and field name {{testsubobject.tag}}", function () {
      var expectedValue = "subobjectvalue";
      describedEntry = new datarestructor.DescribedEntryCreator(rawEntry, description);
      describedEntry.testsubobject = new datarestructor.DescribedEntryCreator(rawEntry, description);
      describedEntry.testsubobject.value = expectedValue;
      resolver = new template_resolver.Resolver(describedEntry);
      expect(resolver.resolveTemplate("{{testsubobject.tag}}")).toEqual(expectedValue);
    });
    
  });

});
