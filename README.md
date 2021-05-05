[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Language](https://img.shields.io/github/languages/top/JohT/search-menu-ui)
![Branches](https://img.shields.io/badge/Coverage-81.67%25-yellow.svg)
![![npm](./src/npm.svg)](https://aleen42.github.io/badges/src/npm.svg)
![![jasmine](./src/jasmine.svg)](https://aleen42.github.io/badges/src/jasmine.svg)
![![eslint](./src/eslint.svg)](https://aleen42.github.io/badges/src/eslint.svg)
![JSDoc](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/dev/jsdoc)
![nyc](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/dev/nyc)
![parcel-bundler](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/dev/parcel-bundler)

# search-menu-ui

"All in one place" search UI providing "search as you type" written in vanilla JavaScript.
## Features:
* **"Data-Driven, Data-Agnostic"** approach:   
  * Search data is the source of all contents configured once using templates
  * Search data may also be used to set additional css style classes
  * Search data determines which filters and thus which filter parameters are available
  * Search data determines which target url to open, when a result is selected
* **"Everything Is Searchable"** approach:
  * Filters are search results.
  * Navigation targets are search results.
* **"Set And Forget"** approach:
  * After initial configuration mostly anything else depends on the search response. 
  * New fields, new categories, new filters and new navigation targets shouldn't entail
  any changes in most cases.
* Full keyboard support
* Flexible and configurable 
* Supports most browsers including IE 5
* Can be used without further dependencies
* Integrates perfectly with [data-restructor-js](https://github.com/JohT/data-restructor-js) for data conversion and template resolving
* Integrates perfectly with [elasticsearch](https://www.elastic.co/de/elasticsearch/)

### Not intended to be used when
* a type-safe, non data-agnostic and non-generic strategy is key
* the things that can be searched are pretty well known and stable (don't change that much)
* changing client code is much easier than changing the search service

### Might be added in future:
* specialized filters for numeric limits 
* specialized filters for date and time
* paging
* configuration in html

## Getting started

## Structure

The following screenshots were taken from the example, that is included in this repository. 
Since the search menu UI only takes element IDs, it can be attached in many ways.
Furthermore, anything can be styled using CSS. The screenshots below are therefore
only one of many possible ways on how the search might look like. At least they explain the base structure and parts of it visually.

### Results and Details

![Screenshot Details](https://github.com/JohT/search-menu-ui/blob/master/screenshots/ScreenshotExampleDetails.png?raw=true)

**&#x2460;** shows search results. In this example the text of each entry consists of a symbol followed by the name and a second line with the business type and the account number. 
This is configured using a template that contains all these parts as variables.

**&#x2461;** shows the search details. The details are opened by pressing the space bar or moving the mouse over the result for some time. Here, every entry consists of a emphasized field name followed by its value. This is also configured using a template.

When one of the results is selected using the enter key or a mouse click, the url template of the currently selected navigation target is resolved by the fields of the selected result and then
opened. This enables highly flexible and context and data dependent navigation.

### Filter-Options

![Screenshot Details](https://github.com/JohT/search-menu-ui/blob/master/screenshots/ScreenshotExampleFilterOptions.png?raw=true)

**&#x2460;** shows filter results. These are searched and treated like "normal" search results.
They are configured with a separate template. In this example, only a symbol and the selected filter value are displayed.

**&#x2461;** shows the filter options. In contrast to the details of "normal" search results, 
the filter options can be selected as described below.

### Selected Filter

![Screenshot Details](https://github.com/JohT/search-menu-ui/blob/master/screenshots/ScreenshotExampleSelectedFilter.png?raw=true)

**&#x2460;** shows previously selected filters that are provided as search parameters. 
They can be included as variables in the search service url or the search request body template.

**&#x2461;** shows the same filter options view as in [Filter-Options](#Filter-Options). The selected filter can be changed here as well.

**&#x2461;** shows a special case of a filter option, that not only has a preselected default
value but also contains navigation target url templates. Choosing a target and its (hidden)
url template changes the site that is opened when a result is selected. 

If e.g. "Account Overview" is selected, a click on the first result will open the account overview of this account. If it is changed to "Customer Overview", a click on the first result will open the customer overview of the customer, that owns that account, using the customer number of the details.

Since navigation targets are searchable, it is possible to search for a field inside the application, listing the views where it can be found, selecting the right one and then searching
for e.g. an account, that should be shown in the previously selected view. Since the url templates are all provided by data, only data needs to be updated when a url changes.

### HTML Elements

The HTML of the example, that is included in this repository, is essentially this:
```html
<div id="searcharea">
    <input type="text" id="searchinputtext"/><br>
    <div id="searchresults">
        <ul id="searchmatches"></ul>
        <ul id="searchfilters"></ul>
    </div>
    <div id="searchdetails">
        <ul id="searchdetailentries"></ul>
    </div>
    <div id="searchfilteroptions">
        <ul id="searchfilteroptionentries"></ul>
    </div>
</div>
```

These are the default IDs in the default structure, that doesn't need additional configuration.
A detailed description of everything that can be configured can be found in the [SearchMenuAPI JSDoc](https://joht.github.io/search-menu-ui/docs/module-searchmenu.SearchMenuAPI.html). 


### Flow Chart

This flow chart visualizes what happens, when search text is entered:

![Search Flow-Chart](https://github.com/JohT/search-menu-ui/blob/master/diagrams/searchflowchart-2.png?raw=true)
