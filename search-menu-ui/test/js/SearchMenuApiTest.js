"use strict";

var searchmenu = searchmenu || require("../../src/js/search-menu-ui"); // supports vanilla js & npm

describe("search.js SearchMenuApi", function () {
  var searchUnderTest;

  beforeEach(function () {
    searchUnderTest = searchmenu;
  });

  describe("SearchMenuApi is predefined and", function () {
    var searchMenuApiUnderTest;

    beforeEach(function () {
      searchMenuApiUnderTest = new searchUnderTest.SearchMenuAPI();
      var dummyElement = document.createElement("div");
      document.getElementById = jasmine.createSpy("HTML Element").and.returnValue(dummyElement);
    });

    describe("fails when mandatory functions are not set and", function () {
      it("should throw an exception if no search service had been set", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.triggerSearch).toThrow(new Error("search service needs to be defined."));
      });

      it("should throw an exception if no data converter had been set", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.convertData).toThrow(new Error("data converter needs to be defined."));
      });
    });

    describe("has a defined default behaviour for overridable functions and", function () {
      it("shouldn't do anything if 'addPredefinedParametersTo' isn't used", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        var parameters = jasmine.createSpy("searchParameters");
        resultingSearchUi.config.addPredefinedParametersTo(parameters);
        expect(parameters.calls.any()).toEqual(false);
      });
    });

    describe("has default values for the main element bindings and", function () {
      it("should use `searcharea` as default searchAreaElementId", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.searchAreaElementId).toEqual("searcharea");
      });

      it("should use `searcharea` as default searchAreaElementId when it is set to null", function () {
        var resultingSearchUi = searchMenuApiUnderTest.searchAreaElementId(null).start();
        expect(resultingSearchUi.config.searchAreaElementId).toEqual("searcharea");
      });

      it("should use `searchinputtext` as default inputElementId", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.inputElementId).toEqual("searchinputtext");
      });

      it("should use `searchinputtext` as default inputElementId when it is set to an empty string", function () {
        var resultingSearchUi = searchMenuApiUnderTest.inputElementId("").start();
        expect(resultingSearchUi.config.inputElementId).toEqual("searchinputtext");
      });

      it("should use `searchtext` as default searchTextParameterName", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.searchTextParameterName).toEqual("searchtext");
      });

      it("should use `searchtext` as default searchTextParameterName when the set parameter is missing", function () {
        var resultingSearchUi = searchMenuApiUnderTest.searchTextParameterName().start();
        expect(resultingSearchUi.config.searchTextParameterName).toEqual("searchtext");
      });
    });

    describe("has default values for timings and", function () {
      it("should use 700ms as default for waitBeforeClose", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.waitBeforeClose).toEqual(700);
      });

      it("should use 500ms as default for waitBeforeSearch", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.waitBeforeSearch).toEqual(500);
      });

      it("should use 700ms as default for waitBeforeMouseOver", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.waitBeforeMouseOver).toEqual(700);
      });
    });

    describe("has default values for the resultsView and", function () {
      it("should use `searchresults` as default viewElementId", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.resultsView.viewElementId).toEqual("searchresults");
      });

      it("should use `searchmatches` as default listParentElementId", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.resultsView.listParentElementId).toEqual("searchmatches");
      });

      it("should use `result` as default listEntryElementIdPrefix", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.resultsView.listEntryElementIdPrefix).toEqual("result");
      });

      it("should use `{{abbreviation}} {{displayName}}` as default listEntryTextTemplate ", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.resultsView.listEntryTextTemplate).toEqual("{{abbreviation}} {{displayName}}");
      });
    });

    describe("has default values for the detailView and", function () {
      it("should use `searchdetails` as default viewElementId", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.detailView.viewElementId).toEqual("searchdetails");
      });

      it("should use `searchdetailentries` as default listParentElementId", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.detailView.listParentElementId).toEqual("searchdetailentries");
      });

      it("should use `detail` as default listEntryElementIdPrefix", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.detailView.listEntryElementIdPrefix).toEqual("detail");
      });

      it("should use `{<b>{{displayName}}:</b> {{value}}` as default listEntryTextTemplate ", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.detailView.listEntryTextTemplate).toEqual("<b>{{displayName}}:</b> {{value}}");
      });
    });

    describe("has default values for the filterOptionsView and", function () {
      it("should use `searchfilteroptions` as default viewElementId", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.filterOptionsView.viewElementId).toEqual("searchfilteroptions");
      });

      it("should use `searchfilteroptionentries` as default listParentElementId", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.filterOptionsView.listParentElementId).toEqual("searchfilteroptionentries");
      });

      it("should use `filter` as default listEntryElementIdPrefix", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.filterOptionsView.listEntryElementIdPrefix).toEqual("filter");
      });

      it("should use `{{value}}` as default listEntryTextTemplate ", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.filterOptionsView.listEntryTextTemplate).toEqual("{{value}}");
      });
    });

    describe("has default values for the filtersView and", function () {
      it("should use `searchresults` as default viewElementId", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.filtersView.viewElementId).toEqual("searchresults");
      });

      it("should use `searchfilters` as default listParentElementId", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.filtersView.listParentElementId).toEqual("searchfilters");
      });

      it("should use `filter` as default listEntryElementIdPrefix", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.filtersView.listEntryElementIdPrefix).toEqual("filter");
      });

      it("should use `{{displayName}}: {{value}}` as default listEntryTextTemplate ", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.filtersView.listEntryTextTemplate).toEqual("{{displayName}}: {{value}}");
      });

      it("should use `true` as default isSelectableFilterOption ", function () {
        var resultingSearchUi = searchMenuApiUnderTest.start();
        expect(resultingSearchUi.config.filtersView.isSelectableFilterOption).toBeTruthy();
      });
    });
  });

  describe("SearchMenuApi is customizable and", function () {
    var searchMenuApiUnderTest;

    beforeEach(function () {
      searchMenuApiUnderTest = new searchUnderTest.SearchMenuAPI();
      var dummyElement = document.createElement("div");
      document.getElementById = jasmine.createSpy("HTML Element").and.returnValue(dummyElement);
    });

    it("should use the specified search service", function () {
      var expectedParameter = { parameter: "value" };
      var expectedCallback = jasmine.createSpy("searchResultCallback");
      var searchService = jasmine.createSpy("searchServiceSpy");

      searchMenuApiUnderTest.searchService(searchService);
      var resultingSearchUi = searchMenuApiUnderTest.start();

      resultingSearchUi.config.triggerSearch(expectedParameter, expectedCallback);
      expect(searchService).toHaveBeenCalledWith(expectedParameter, expectedCallback);
    });

    it("should use the specified data converter", function () {
      var expectedSourceData = { parameter: "value" };
      var searchService = jasmine.createSpy("dataConverterSpy");

      searchMenuApiUnderTest.dataConverter(searchService);
      var resultingSearchUi = searchMenuApiUnderTest.start();

      resultingSearchUi.config.convertData(expectedSourceData);
      expect(searchService).toHaveBeenCalledWith(expectedSourceData);
    });

    it("should use the specified `addPredefinedParametersTo` function", function () {
      var expectedSourceData = { parameter: "value" };
      var customParameterFunction = jasmine.createSpy("addPredefinedParametersToSpy");

      searchMenuApiUnderTest.addPredefinedParametersTo(customParameterFunction);
      var resultingSearchUi = searchMenuApiUnderTest.start();

      resultingSearchUi.config.addPredefinedParametersTo(expectedSourceData);
      expect(customParameterFunction).toHaveBeenCalledWith(expectedSourceData);
    });

    it("should use the specified searchAreaElementId", function () {
      var expectedValue = "testSearchAreaElementId";
      searchMenuApiUnderTest.searchAreaElementId(expectedValue);
      var resultingSearchUi = searchMenuApiUnderTest.start();
      expect(resultingSearchUi.config.searchAreaElementId).toEqual(expectedValue);
    });

    it("should use the specified inputElementId", function () {
      var expectedValue = "testInputElementId";
      searchMenuApiUnderTest.inputElementId(expectedValue);
      var resultingSearchUi = searchMenuApiUnderTest.start();
      expect(resultingSearchUi.config.inputElementId).toEqual(expectedValue);
    });

    it("should use the specified searchTextParameterName", function () {
      var expectedValue = "testSearchTextParameterName";
      searchMenuApiUnderTest.searchTextParameterName(expectedValue);
      var resultingSearchUi = searchMenuApiUnderTest.start();
      expect(resultingSearchUi.config.searchTextParameterName).toEqual(expectedValue);
    });

    it("should use the specified value of waitBeforeClose", function () {
      var expectedValue = 345;
      searchMenuApiUnderTest.waitBeforeClose(expectedValue);
      var resultingSearchUi = searchMenuApiUnderTest.start();
      expect(resultingSearchUi.config.waitBeforeClose).toEqual(expectedValue);
    });

    it("should use the specified value of waitBeforeSearch", function () {
      var expectedValue = 346;
      searchMenuApiUnderTest.waitBeforeSearch(expectedValue);
      var resultingSearchUi = searchMenuApiUnderTest.start();
      expect(resultingSearchUi.config.waitBeforeSearch).toEqual(expectedValue);
    });

    it("should use the specified value of waitBeforeMouseOver", function () {
      var expectedValue = 347;
      searchMenuApiUnderTest.waitBeforeMouseOver(expectedValue);
      var resultingSearchUi = searchMenuApiUnderTest.start();
      expect(resultingSearchUi.config.waitBeforeMouseOver).toEqual(expectedValue);
    });

    it("should use the specified resultsView", function () {
      var expectedViewId = "testResultViewId";
      var template = searchMenuApiUnderTest.config.resultsView;
      var expectedView = new searchmenu.SearchViewDescriptionBuilder(template).viewElementId(expectedViewId).build();
      
      searchMenuApiUnderTest.resultsView(expectedView);
      var resultingSearchUi = searchMenuApiUnderTest.start();
      
      expect(resultingSearchUi.config.resultsView).toEqual(expectedView);
      expect(resultingSearchUi.config.resultsView.viewElementId).toEqual(expectedViewId);
    });

    it("should use the specified detailView", function () {
      var expectedViewId = "testDetailViewId";
      var template = searchMenuApiUnderTest.config.detailView;
      var expectedView = new searchmenu.SearchViewDescriptionBuilder(template).viewElementId(expectedViewId).build();
      
      searchMenuApiUnderTest.detailView(expectedView);
      var resultingSearchUi = searchMenuApiUnderTest.start();
      
      expect(resultingSearchUi.config.detailView).toEqual(expectedView);
      expect(resultingSearchUi.config.detailView.viewElementId).toEqual(expectedViewId);
    });

    it("should use the specified filterOptionsView", function () {
      var expectedViewId = "testFilterOptionsViewId";
      var template = searchMenuApiUnderTest.config.filterOptionsView;
      var expectedView = new searchmenu.SearchViewDescriptionBuilder(template).viewElementId(expectedViewId).build();
      
      searchMenuApiUnderTest.filterOptionsView(expectedView);
      var resultingSearchUi = searchMenuApiUnderTest.start();
      
      expect(resultingSearchUi.config.filterOptionsView).toEqual(expectedView);
      expect(resultingSearchUi.config.filterOptionsView.viewElementId).toEqual(expectedViewId);
    });

    it("should use the specified filtersView", function () {
      var expectedViewId = "testFilterViewId";
      var template = searchMenuApiUnderTest.config.filtersView;
      var expectedView = new searchmenu.SearchViewDescriptionBuilder(template).viewElementId(expectedViewId).build();
      
      searchMenuApiUnderTest.filtersView(expectedView);
      var resultingSearchUi = searchMenuApiUnderTest.start();
      
      expect(resultingSearchUi.config.filtersView).toEqual(expectedView);
      expect(resultingSearchUi.config.filtersView.viewElementId).toEqual(expectedViewId);
    });

  });
});
