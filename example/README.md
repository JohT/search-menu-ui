[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Language](https://img.shields.io/github/languages/top/JohT/search-menu-ui/example)
![Branches](https://img.shields.io/badge/Coverage-92.86%25-brightgreen.svg)
![![npm](./src/npm.svg)](https://aleen42.github.io/badges/src/npm.svg)
![![jasmine](./src/jasmine.svg)](https://aleen42.github.io/badges/src/jasmine.svg)
![![eslint](./src/eslint.svg)](https://aleen42.github.io/badges/src/eslint.svg)
![JSDoc](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/example/dev/jsdoc)
![parcel-bundler](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/example/dev/parcel-bundler)

# search-menu-ui-example

This example shows how to use [search-menu-ui](https://github.com/JohT/search-menu-ui) as user interface 
in conjunction with [data-restructor-js](https://github.com/JohT/data-restructor-js) as data converter and [Elasticsearch](https://github.com/elastic/elasticsearch) as backend. 

There are many ways to integrate and design it, this is only one of them.

It is not recommended to directly access [Elasticsearch](https://github.com/elastic/elasticsearch) from the browser app. It should be encapsulated and secured within a server application. For prototyping and examples like this, it is handy to directly access it, as long as the HTTP CORS settings work.