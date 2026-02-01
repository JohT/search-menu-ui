# search-menu-ui

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Language](https://img.shields.io/github/languages/top/JohT/search-menu-ui)
![Branches](https://img.shields.io/badge/branches-80.4%25-yellow.svg?style=flat)
![![npm](./src/npm.svg)](https://aleen42.github.io/badges/src/npm.svg)
![![jasmine](./src/jasmine.svg)](https://aleen42.github.io/badges/src/jasmine.svg)
![![eslint](./src/eslint.svg)](https://aleen42.github.io/badges/src/eslint.svg)
![JSDoc](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/dev/jsdoc)
![nyc](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/dev/nyc)
![parcel](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/dev/parcel)

"All in one place" search UI providing "search as you type" written in vanilla JavaScript.

## Approaches

### Data-Driven & Data-Agnostic

- Search data is the source of all contents configured once using templates
- Search data determines which filters and thus which filter parameters are available
- Search data determines which target url to open when a result is selected
- Search data may also be used to set additional CSS style classes

### Everything is Searchable

- Filters are search results and thus searchable
- Navigation targets are search results and thus searchable

### Set and Forget

- After initial configuration mostly anything else depends on the search response
- New fields, new categories, new filters and new navigation targets shouldn't entail any changes in most cases
- Embrace changes by not depending on them at all

## Features

- Full keyboard support
- Flexible and configurable
- Supports most browsers including IE 5
- Can be used without any runtime dependencies
- Integrates perfectly with [data-restructor-js](https://github.com/JohT/data-restructor-js) for data conversion and template resolving as a single runtime dependency
- Built with [elasticsearch](https://www.elastic.co/de/elasticsearch/) in mind

### Not intended to be used when

- a type-safe, non data-agnostic and non-generic strategy is key
- the things that can be searched are pretty well known and stable (don't change that much)
- changing client code is much easier than changing the search service

### Might be added in future

- specialized filters for numeric limits
- specialized filters for date and time
- paging
- configuration in html
- TODO comments inside the code contain further ideas.  
They start with "should" (higher priority) and "could" (lower priority) and might become fully described issues.

## Getting started

The best way to get started is by having a look at the fully working [example](example/README.md). It includes a sub project that shows how to integrate the search into a java application
using a Servlet container: [example](example/search-example-servlet/README.md).

### Code Documentation

The [code documentation](https://joht.github.io/search-menu-ui) is generated using [JSDoc](https://jsdoc.app) and is published using [GitHub Pages](https://pages.github.com) at [https://joht.github.io/search-menu-ui](https://joht.github.io/search-menu-ui).

### Build all

Use the following [commands](COMMANDS.md) to build everything including the example and the example servlet within the current directory. A list of all commands can be found in [COMMANDS.md](COMMANDS.md).

```shell script
npm install merger-js -g
cd example
npm install
cd ..
npm install
npm run all
```

**Note:** merger.js prompts to select a source file. Please select "ALL" using the arrow keys and press enter to continue.

## UI structure

The following screenshots were taken from the example, that is included in this repository.
Since the search menu UI only takes element IDs, it can be attached in many ways.
Furthermore, anything can be styled using CSS. The screenshots below are therefore
only one of many possible ways on how the search might look like. At least they explain the base structure and parts of it visually.

### Results and details

![Screenshot Details](screenshots/ScreenshotExampleDetails.png?raw=true)

**&#x2460;** shows search results. In this example the text of each entry consists of a symbol followed by the name and a second line with the business type and the account number.
This is configured using a template that contains all these parts as variables.

**&#x2461;** shows the search details. The details are opened by pressing the space bar or moving the mouse over the result for some time. Here, every entry consists of a emphasized field name followed by its value. This is also configured using a template.

When one of the results is selected using the enter key or a mouse click, the url template of the currently selected navigation target is resolved by the fields of the selected result and then
opened. This enables highly flexible and context and data dependent navigation.

### Filter options

![Screenshot Details](screenshots/ScreenshotExampleFilterOptions.png?raw=true)

**&#x2460;** shows filter results. These are searched and treated like "normal" search results.
They are configured with a separate template. In this example, only a symbol and the selected filter value are displayed.

**&#x2461;** shows the filter options. In contrast to the details of "normal" search results,
the filter options can be selected as described below.

### Selected filter

![Screenshot Details](screenshots/ScreenshotExampleSelectedFilter.png?raw=true)

**&#x2460;** shows previously selected filters that are provided as search parameters.
They can be included as variables in the search service url or the search request body template.

**&#x2461;** shows the same filter options view as in [Filter-Options](#filter-options). The selected filter can be changed here as well.

**&#x2462;** shows a special case of a filter option, that not only has a preselected default
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

## Flow Chart

This flow chart visualizes what happens, when search text is entered:

![Search Flow-Chart](diagrams/searchflowchart-2.png?raw=true)

## Data structure

The data structure consists basically of an array of "described fields" borrowed from [data-restructor-js](https://joht.github.io/data-restructor-js) in detail documented in the [DescribedDataField JSDoc](https://joht.github.io/data-restructor-js/module-described_field.html#.DescribedDataField). This is why [data-restructor-js](https://joht.github.io/data-restructor-js)  perfectly integrates as data converter for the search menu.

### Described Field Object

In contrast to the [DescribedDataField](https://joht.github.io/data-restructor-js/module-described_field.html#.DescribedDataField) of [data-restructor-js](https://joht.github.io/data-restructor-js) only a subset of these fields are used by the search menu. The tables
below describe, which fields are important and what they are used for.

#### Mandatory properties

Every "described field" needs to contain the following fields:

| Field        | Example           | Description                                                  |
| ------------ |:----------------- | ------------------------------------------------------------ |
| displayName  | "`Accountnumber`" | Display field name. Used in most view templates.             |
| fieldName    | "`accountnumber`" | Technical field name. Needed to recognize selected fields.   |
| value        | "`12345678902`"   | Value of the field. Used in most of the view templates.      |
<br/>

#### Special properties

The `category` is a special field that is only necessary for multi category searches that should provide different navigation targets to react differently on selected results according to their category.

| Field        | Example           | Description                                                     |
| ------------ |:----------------- | --------------------------------------------------------------- |
| category     | "`account`"       | For multi category search results and their navigation targets. |
<br/>

#### Optional properties

Every "described field" may additionally contain these optional fields (amongst others),
that can be used as template variables if present.

| Field        | Example           | Description                                                     |
| ------------ |:----------------- | --------------------------------------------------------------- |
| type         | "`summary`"       | Mainly used for grouping within data convertion.                |
| abbreviation | "`&#x1F4B6;`"     | Optional (symbol) character or a short abbreviation.            |
| image        | ""                | Optional path to an image resource.                             |
| index        | `[0, 0]`          | Array of numbers containing source data position.               |
| groupNames   | `["summaries"]`   | Array of property names that contain arrays of group fields.    |

### Groups

Every "described field" may contain groups. Each group contains another array of described fields.
These groups have a special meaning for the search menu ui.

| Group        | Description                                                                              |
| ------------ | ---------------------------------------------------------------------------------------- |
| summaries    | Contains the fields (template variables) for the result/filter entry itself.             |
| details      | Contains the fields with (not selectable) details for each search result.                |
| options      | Contains the selectable filter options that are used as search parameters.               |
| urltemplate  | Contains a single urltemplate field as navigation target. Belongs to a filter option.    |
| default      | Contains a single filter option that is selected by default. Belongs to a filter option. |

### Data for results and details

The [Results and Details](#results-and-details) UI is a consequence of the following data structure stripped down to the first result and its most essential parts.

```yaml
category: "account"
abbreviation: "&#x1F4B6;"
summaries: 
  - category: "account" # Optional. Used for multi category search navigation targets.
    abbreviation: "&#x1F4B6;" # Optional. Contains the money icon in the example.
    displayName: "Accountnumber"
    fieldName: "accountnumber"
    value: "12345678901"
  - displayName: "Disposer",
    fieldName: "disposer",
    value: "Howard Joel Wolowitz"
  - displayName: "Businesstype"
    fieldName: "businesstype"
    value: "Giro"
details:
  - displayName: "Iban"
    fieldName: "iban"
    value: "AT424321012345678902"
  - displayName: "Accountnumber"
    fieldName: "accountnumber"
    value: "12345678902"
  # ...
```

### Data for filter options

The [Filter-Options](#filter-options) UI is a consequence of the following data structure stripped down to the first filter `product` and its most essential parts.

```yaml
category: "account"
abbreviation: "&#128206;"
options:
  - displayName: "Product"
    fieldName": "product"
    value": "private loan"
  - displayName: "Product"
    fieldName: "product"
    value: "salary"
  - displayName: "Product"
    fieldName: "product"
    value": "commercial giro"
  - displayName: "Product"
    fieldName: "product"
    value: "private giro"
  - displayName: "Product"
    fieldName: "product"
    value: "trust"
```

### Data for default filter options

A filter option, that should be selected by default as shown in the [Selected Filter](#selected-filter) UI, is contained as a single field in the `default` group. The following data structure for example leads to an pre selected product filter for private loans.

```yaml
category: "account"
abbreviation: "&#128206;"
options:
  - displayName: "Product"
    fieldName": "product"
    value": "private loan"
```

### Data for navigation targets

A special case of search filters are the navigation targets, as depicted in the [Flow-Chart](#flow-chart).
These are selectable filter options marked by the group `urltemplate` containing a single field. When a result entry is selected, all active filter options of that category (or the global category `""`) that contain a `urltemplate` are looked up. The first url template will be used to navigate to the selected target.

URL templates may contain variables in double curly brackets, that are replaced
by the fields (details, summaries) of the selected result.

The following data structure leads to the pre selected default target `"Account Overview"`,
as well as to the selectable options `"Credit Interests"` and `"Debit Interests"`. All of them
define a url template that contains the account number of the summaries as variable. The selected and best suited url template will be used to navigate to the target, when a [result entry](#data-for-results-and-details) is selected.

```yaml
category: "account"
abbreviation: "&#x261c;"
default: 
  - displayName: "Target"
    fieldName: "name"
    value: "Account Overview"
    urltemplate:
      - displayName: "Urltemplate"
        fieldName: "urltemplate"
        value: "http://127.0.0.1:5500/example/index.html#overview-{{summaries.accountnumber}}"
options:
  - displayName: "Target"
    fieldName: "name"
    value: "Credit Interests"
    urltemplate:
      - displayName: ""
        fieldName: ""
        value: "http://127.0.0.1:5500/example/index.html#creditinterest-{{summaries.accountnumber}}"
  - displayName: "Target"
    fieldName: "name"
    value: "Debit Interests"
    urltemplate:
      - displayName: ""
        fieldName: ""
        value: "http://127.0.0.1:5500/example/index.html#debitinterest-{{summaries.accountnumber}}"

```

## Related blog articles

- [Most effective ways to push within GitHub Actions](https://joht.github.io/johtizen/build/2022/01/20/github-actions-push-into-repository.html)
- [Continuous Integration for JavaScript with npm](https://joht.github.io/johtizen/build/2021/02/21/continuous-integration-javascript.html)

## Credits

Although this project doesn't use any runtime dependencies, it is created using these great tools:

- [ESLint](https://eslint.org) - [MIT License](https://github.com/eslint/eslint/blob/main/LICENSE)
- [istanbul-badges-readme](https://www.npmjs.com/package/istanbul-badges-readme) - [MIT License](https://github.com/olavoparno/istanbul-badges-readme/blob/develop/LICENSE)
- [Jasmine](https://jasmine.github.io) - [MIT License](https://github.com/jasmine/jasmine/blob/main/MIT.LICENSE)
- [JSDoc](https://jsdoc.app) - [Apache Licence 2.0](https://github.com/jsdoc/jsdoc/blob/main/LICENSE)
- [JSDom](https://github.com/jsdom/jsdom) - [MIT License](https://github.com/jsdom/jsdom/blob/main/LICENSE.txt)
- [merger-js](https://github.com/joao-neves95/merger-js) - [GNU General Public License v3.0](https://github.com/joao-neves95/merger-js/blob/main/LICENSE.md)
- [NYC aka Istanbul](https://istanbul.js.org) - [ISC License](https://github.com/istanbuljs/nyc/blob/main/LICENSE.txt)
- [PARCEL](https://parceljs.org) - [MIT License](https://github.com/parcel-bundler/parcel/blob/v2/LICENSE)
- [mermaid Javascript based diagramming and charting tool](https://mermaid-js.github.io/mermaid/#/) - [MIT License](https://github.com/mermaid-js/mermaid/blob/develop/LICENSE)
