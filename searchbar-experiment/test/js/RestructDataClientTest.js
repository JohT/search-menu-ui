"use strict";

var require = require || function () {};
var restruct = restruct || require("../../src/js/restruct-data-client"); // supports vanilla js & npm

describe("restruct-data-client.Data", function () {
  var data;

  beforeEach(function () {
    data = restruct.Data;
  });

  describe("descriptions ", function () {
    var descriptions;

    beforeEach(function () {
      descriptions = data.getDescriptions();
    });

    function forEachDescription(callback) {
      expect(descriptions).toBeDefined();
      expect(descriptions.length).toBeGreaterThan(0);
      var index = 0;
      for (index = 0; index < descriptions.length; index += 1) {
        callback(descriptions[index]);
      }
    }

    function forEachDescriptionMatching(matcher, callback) {
      return forEachDescription(function (entry) {
        if (matcher(entry)) {
          callback(entry);
        }
      });
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

    it("should contain at least 10 entries", function () {
      expect(descriptions.length).toBeGreaterThanOrEqual(10);
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

    it("should all define an abbreviation", function () {
      forEachDescription(function (description) {
        expect(description.abbreviation.length).toBeGreaterThanOrEqual(1);
      });
    });

  });
});