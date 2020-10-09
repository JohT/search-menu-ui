describe("PropertyStructureDescription", function () {
  var description;

  beforeEach(function () {
    description = new resultparser.PropertyStructureDescriptionBuilder();
  });

  describe("is created by the builder and", function () {
    beforeEach(function () {});

    it("should contain the given type", function () {
      var expectedValue = "testtype";
      var result = description.type(expectedValue).build();
      expect(result.type).toEqual(expectedValue);
    });

    it("should contain the given category", function () {
      var expectedValue = "testcategory";
      var result = description.category(expectedValue).build();
      expect(result.category).toEqual(expectedValue);
    });

    it("should contain the given propertyPatternMode", function () {
      var expectedValue = "template";
      var result = description.propertyPatternMode(expectedValue).build();
      expect(result.propertyPatternMode).toEqual(expectedValue);
    });

    it("should contain the given propertyPattern", function () {
      var expectedValue = "test.property.pattern";
      var result = description.propertyPattern(expectedValue).build();
      expect(result.propertyPattern).toEqual(expectedValue);
    });

    it("should contain the given groupName", function () {
      var expectedValue = "testgroupname";
      var result = description.groupName(expectedValue).build();
      expect(result.groupName).toEqual(expectedValue);
    });

    it("should contain the given groupPattern", function () {
      var expectedValue = "test.group.pattern";
      var result = description.groupPattern(expectedValue).build();
      expect(result.groupPattern).toEqual(expectedValue);
    });

    it("should contain the given groupDestinationPattern", function () {
      var expectedValue = "test.group.destination.pattern";
      var result = description.groupDestinationPattern(expectedValue).build();
      expect(result.groupDestinationPattern).toEqual(expectedValue);
    });

    it("should contain the given deduplicationPattern", function () {
      var expectedValue = "test.deduplication.destination.pattern";
      var result = description.deduplicationPattern(expectedValue).build();
      expect(result.deduplicationPattern).toEqual(expectedValue);
    });
  });

  describe("is created by the builder using default values and", function () {
    var defaultDescription;
    beforeEach(function () {
      defaultDescription = description.build();
    });

    it("should contain an empty type", function () {
      expect(defaultDescription.type).toEqual("");
    });

    it("should contain an empty category", function () {
      expect(defaultDescription.category).toEqual("");
    });

    it("should contain an empty propertyPattern", function () {
      expect(defaultDescription.propertyPattern).toEqual("");
    });

    it("should contain the default propertyPatternMode 'equal'", function () {
      expect(defaultDescription.propertyPatternMode).toEqual("equal");
    });

    it("should contain the default group name 'group", function () {
      expect(defaultDescription.groupName).toEqual("group");
    });

    it("should contain an empty groupPattern", function () {
      expect(defaultDescription.groupPattern).toEqual("");
    });

    it("should contain an empty groupDestinationPattern", function () {
      expect(defaultDescription.groupDestinationPattern).toEqual("");
    });

    it("should contain an empty deduplicationPattern", function () {
      expect(defaultDescription.deduplicationPattern).toEqual("");
    });

  });

  describe("derives the display name from the full qualified point separated property name and", function () {
    beforeEach(function () {});

    it("should contain the directly set display name", function () {
      var expectedValue = "testDisplayName";
      var result = description.displayPropertyName(expectedValue).build();
      expect(result.getDisplayNameForPropertyName("property.doesnt.matter.here")).toEqual(expectedValue);
    });

    it("should automatically contain the simple display name when fieldName is null", function () {
      var result = description.displayPropertyName(null).build();
      expect(result.getDisplayNameForPropertyName("simplepropertyname")).toEqual("Simplepropertyname");
    });

    it("should automatically contain the simple display name when fieldName is empty", function () {
      var result = description.displayPropertyName(null).build();
      expect(result.getDisplayNameForPropertyName("simplepropertyname")).toEqual("Simplepropertyname");
    });

    it("should contain the simple property name with leading uppercase character", function () {
      var result = description.build();
      expect(result.getDisplayNameForPropertyName("simplepropertyname")).toEqual("Simplepropertyname");
    });

    it("should contain the rightmost part of a point separated property name with leading uppercase character", function () {
      var result = description.build();
      expect(result.getDisplayNameForPropertyName("test.property.name")).toEqual("Name");
    });

    it("should use {{fieldName}} from the propertyPattern in 'template' mode if it exists with leading uppercase character", function () {
      var pattern = "property.to.match.{{fieldName}}.postfix";
      var result = description.propertyPatternMode("template").propertyPattern(pattern).build();
      expect(result.getDisplayNameForPropertyName("property.to.match.testname.postfix")).toEqual("Testname");
    });

    it("should remove '_comma_separated_values' postfix from an array property name", function () {
      var result = description.build();
      expect(result.getDisplayNameForPropertyName("test.property.tags_comma_separated_values")).toEqual("Tags");
    });

    it("should ignore empty property names", function () {
      var result = description.build();
      expect(result.getDisplayNameForPropertyName("")).toEqual("");
    });
  });

  describe("derives the field name from the full qualified point separated property name and", function () {
    beforeEach(function () {});

    it("should contain the directly set field name", function () {
      var expectedValue = "test-field-name";
      var result = description.fieldName(expectedValue).build();
      expect(result.getFieldNameForPropertyName("property.doesnt.matter.here")).toEqual(expectedValue);
    });

    it("should automatically contain the simple property name when fieldName is null", function () {
      var result = description.fieldName(null).build();
      expect(result.getFieldNameForPropertyName("simplepropertyname")).toEqual("simplepropertyname");
    });

    it("should automatically contain the simple property name when fieldName is empty", function () {
      var result = description.fieldName(null).build();
      expect(result.getFieldNameForPropertyName("simplepropertyname")).toEqual("simplepropertyname");
    });

    it("should contain the simple property name", function () {
      var result = description.build();
      expect(result.getFieldNameForPropertyName("simplepropertyname")).toEqual("simplepropertyname");
    });

    it("should contain the rightmost part of a point separated property name", function () {
      var result = description.build();
      expect(result.getFieldNameForPropertyName("test.property.name")).toEqual("name");
    });

    it("should use {{fieldName}} from the propertyPattern in 'template' mode if it exists to extract the fieldName", function () {
      var pattern = "property.to.match.{{fieldName}}.postfix";
      var result = description.propertyPatternMode("template").propertyPattern(pattern).build();
      expect(result.getFieldNameForPropertyName("property.to.match.testname.postfix")).toEqual("testname");
    });

    it("should contain '_comma_separated_values' postfix from an array property name", function () {
      var result = description.build();
      expect(result.getFieldNameForPropertyName("test.property.tags_comma_separated_values")).toEqual("tags_comma_separated_values");
    });

    it("should ignore empty property names", function () {
      var result = description.build();
      expect(result.getFieldNameForPropertyName("")).toEqual("");
    });
  });

  describe("detects if a property name matches the given pattern and", function () {
    beforeEach(function () {});

    it("should match equal property name in 'equal' mode", function () {
      var propertyname = "property.to.match";
      var result = description.propertyPatternMode("equal").propertyPattern(propertyname).build();
      expect(result.matchesPropertyName(propertyname)).toBeTrue();
    });

    it("shouldn't match unequal property name in 'equal' mode", function () {
      var propertyname = "property.to.match";
      var result = description.propertyPatternMode("equal").propertyPattern(propertyname).build();
      expect(result.matchesPropertyName(propertyname + ".not.equal")).toBeFalse();
    });

    it("should match equal property name in 'template' mode", function () {
      var propertyname = "property.to.match";
      var result = description.propertyPatternMode("template").propertyPattern(propertyname).build();
      expect(result.matchesPropertyName(propertyname)).toBeTrue();
    });

    it("should also match property names that starts with the given pattern in 'template' mode", function () {
      var propertyname = "property.to.match";
      var result = description.propertyPatternMode("template").propertyPattern(propertyname).build();
      expect(result.matchesPropertyName(propertyname + ".additional")).toBeTrue();
    });

    it("shouldn't match unequal property name in 'template' mode", function () {
      var propertyname = "property.to.match";
      var result = description.propertyPatternMode("template").propertyPattern(propertyname).build();
      expect(result.matchesPropertyName("not.equal." + propertyname)).toBeFalse();
    });

    it("should match a pattern containing a variable in 'template' mode", function () {
      var pattern = "property.to.match.{{fieldName}}"
      var propertyname = "property.to.match.testfieldname";
      var result = description.propertyPatternMode("template").propertyPattern(pattern).build();
      expect(result.matchesPropertyName(propertyname)).toBeTrue();
    });

    it("should match a pattern containing two variables in 'template' mode", function () {
      var pattern = "property.{{any}}.match.{{fieldName}}"
      var propertyname = "property.to.match.testfieldname";
      var result = description.propertyPatternMode("template").propertyPattern(pattern).build();
      expect(result.matchesPropertyName(propertyname)).toBeTrue();
    });
  });

});
