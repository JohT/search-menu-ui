[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Language](https://img.shields.io/github/languages/top/JohT/search-menu-ui)
![Branches](https://img.shields.io/badge/Coverage-81.96%25-yellow.svg)
![![npm](./src/npm.svg)](https://aleen42.github.io/badges/src/npm.svg)
![![jasmine](./src/jasmine.svg)](https://aleen42.github.io/badges/src/jasmine.svg)
![![eslint](./src/eslint.svg)](https://aleen42.github.io/badges/src/eslint.svg)
![JSDoc](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/search-menu-ui/dev/jsdoc)
![JSDoc](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/dev/jsdoc)
![nyc](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/search-menu-ui/dev/nyc)
![parcel-bundler](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/search-menu-ui/dev/parcel-bundler)

# search-menu-js

Highly flexible and compatible search UI written in vanilla JavaScript.

## Features:
* Search as you type
* Results, details, filters and navigation targets are organized in one place
* **"Data-Driven, Data-Agnostic"** approach:   
  * Search data is the source of all contents configured once using templates
  * Search data may also be used to set additional css style classes dynamically
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
* Highly flexible and configurable 
* Supports most browsers including IE 5
* Can be used without further dependencies
* Integrates perfectly with [data-restructor-js](https://github.com/JohT/data-restructor-js) for data conversion and template resolving
* Integrates perfectly with [elasticsearch](https://www.elastic.co/de/elasticsearch/)

## Not intended to be used when
* a type-safe, non data-agnostic and non-generic strategy is key
* the things that can be searched are pretty well known and stable (don't change that much)
* changing client code is much easier than changing the search service
* key features are missing

## Might be added in future:
* specialized filters for numeric limits 
* specialized filters for date and time
* paging
* configuration in html