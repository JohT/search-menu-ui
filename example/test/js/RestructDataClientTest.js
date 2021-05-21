"use strict";

var restruct = restruct || require("../../src/js/restruct-data-client"); // supports vanilla js & npm

describe("restruct-data-client.Data", function () {
  var dataConverterClient;

  beforeEach(function () {
    dataConverterClient = new restruct.DataConverter();
  });

  describe("detect empty objects and", function () {
    it("should create a new object if the given one doesn't exist", function () {
      var result = restruct.internalCreateIfNotExists(null);
      expect(result).toEqual({});
    });
  
    it("should use the given object if it exists", function () {
      var expectedExistingObject = {anytestproperty: 3};
      var result = restruct.internalCreateIfNotExists(expectedExistingObject);
      expect(result).toEqual(expectedExistingObject);
    });
  });

  describe("should provide descriptions of the data structure and", function () {
    var descriptions;

    beforeEach(function () {
      descriptions = dataConverterClient.getDescriptions();
    });

    function forEachDescription(callback) {
      expect(descriptions).toBeDefined();
      expect(descriptions.length).toBeGreaterThan(0);
      var index = 0;
      for (index = 0; index < descriptions.length; index += 1) {
        callback(descriptions[index]);
      }
    }

    function forEachDescriptionCount(matcher) {
      var count = 0;
      forEachDescription(function (entry) {
        if (matcher(entry)) {
          count++;
        }
      });
      return count;
    }

    it("should contain at least 9 entries", function () {
      expect(descriptions.length).toBeGreaterThanOrEqual(9);
    });

    it("should contain summaries", function () {
      var count = forEachDescriptionCount(function (description) {
        return (description.groupName === "summaries");
      });
      expect(count).toBeGreaterThanOrEqual(1);
    });

    it("should contain details", function () {
      var count = forEachDescriptionCount(function (description) {
        return (description.groupName === "details");
      });
      expect(count).toBeGreaterThanOrEqual(1);
    });

    it("should contain options", function () {
      var count = forEachDescriptionCount(function (description) {
        return (description.groupName === "options");
      });
      expect(count).toBeGreaterThanOrEqual(1);
    });

    it("should contain urltemplate", function () {
      var count = forEachDescriptionCount(function (description) {
        return (description.groupName === "urltemplate");
      });
      expect(count).toBeGreaterThanOrEqual(1);
    });

    it("should all define a type", function () {
      forEachDescription(function (description) {
        expect(description.type.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should all define a category", function () {
      forEachDescription(function (description) {
        expect(description.category.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("should optionally define an abbreviation", function () {
      var count = forEachDescriptionCount(function (description) {
        return (typeof description.abbreviation !== "undefined");
      });
      expect(count).toBeGreaterThanOrEqual(2);
    });

  });
  describe("should delegate data conversion and ", function () {
    var debugModeEnabled = true;
    var debugModeDisabled = false;
    var dataConverter;

    beforeEach(function () {
      dataConverter = dataConverterClient.createDataConverter(debugModeDisabled);
    });

    it("should be able to convert an empty array object", function () {
      var json = JSON.stringify([]);
      var result = dataConverter(json);
      expect(result).toEqual([]);
    });

    it("should be able to convert an empty array object in debugMode", function () {
      var logSpy = spyOn(console, "log");
      dataConverter = dataConverterClient.createDataConverter(debugModeEnabled);
      var json = JSON.stringify([]);
      var result = dataConverter(json);
      expect(result).toEqual([]);
      expect(logSpy).toHaveBeenCalled();
    });
  });
});