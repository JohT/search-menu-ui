[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Language](https://img.shields.io/github/languages/top/JohT/search-menu-ui/example)
![Branches](https://img.shields.io/badge/Coverage-92.86%25-brightgreen.svg)
![![npm](./src/npm.svg)](https://aleen42.github.io/badges/src/npm.svg)
![![jasmine](./src/jasmine.svg)](https://aleen42.github.io/badges/src/jasmine.svg)
![![eslint](./src/eslint.svg)](https://aleen42.github.io/badges/src/eslint.svg)
![JSDoc](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/example/dev/jsdoc)
![parcel-bundler](https://img.shields.io/github/package-json/dependency-version/JohT/search-menu-ui/example/dev/parcel-bundler)

# search-menu-ui-example

This example shows how to use [search-menu-ui](https://github.com/JohT/search-menu-ui) as an user interface in conjunction with [data-restructor-js](https://github.com/JohT/data-restructor-js) as data converter and [Elasticsearch](https://github.com/elastic/elasticsearch) as backend. 

There are many ways to integrate and design a search UI, this is only one of them.

**Notice:** It is not recommended to directly access [Elasticsearch](https://github.com/elastic/elasticsearch) from the browser. It should be encapsulated and secured within a server application. For prototyping and examples like this, it is handy to directly access it, as long as the HTTP CORS settings work.

## 1. Setup elasticsearch

- Download [elasticsearch]: https://www.elastic.co/de/downloads/elasticsearch
- Install [elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html
- (Recommended) Use [Visual Studio Code] with extension [Elasticsearch for VSCode](https://marketplace.visualstudio.com/items?itemName=ria.elastic)
- (Alternative) All following elasticsearch commands can be executed with any HTTP Client (curl, postman, ...).
- Setup example index "accounts" with the commands listed und described in [elasticsearch-accounts.es](elasticsearch/accounts/elasticsearch-accounts.es). 
- Setup example index "sites" with the commands listed und described in [elasticsearch-sites.es](elasticsearch/sites/elasticsearch-sites.es). 

## 2. Convert elasticsearch results to the unified search menu data structure



## Credits

### Runtime Dependencies
This project builds upon these great libraries at runtime:

- [elasticsearch] - [Multiple Licenses](https://github.com/elastic/elasticsearch/blob/master/LICENSE.txt)
- [data-restructor-js](https://joht.github.io/data-restructor-js/) - [Apache Licence 2.0](https://github.com/JohT/data-restructor-js/blob/master/LICENSE)

### Development Dependencies
This project is created using these great tools as development dependencies:

- [ESLint](https://eslint.org) - [MIT License](https://github.com/eslint/eslint/blob/master/LICENSE)
- [istanbul-badges-readme](https://www.npmjs.com/package/istanbul-badges-readme) - [MIT License](https://github.com/olavoparno/istanbul-badges-readme/blob/develop/LICENSE)
- [Jasmine](https://jasmine.github.io) - [MIT License](https://github.com/jasmine/jasmine/blob/main/MIT.LICENSE)
- [JSDoc](https://jsdoc.app) - [Apache Licence 2.0](https://github.com/jsdoc/jsdoc/blob/master/LICENSE)
- [merger-js](https://github.com/joao-neves95/merger-js) - [GNU General Public License v3.0](https://github.com/joao-neves95/merger-js/blob/master/LICENSE.md)
- [NYC aka Istanbul](https://istanbul.js.org) - [ISC License](https://github.com/istanbuljs/nyc/blob/master/LICENSE.txt)
- [PARCEL](https://parceljs.org) - [MIT License](https://github.com/parcel-bundler/parcel/blob/v2/LICENSE)

[elasticsearch]: https://www.elastic.co/products/elasticsearch
[Visual Studio Code]: https://code.visualstudio.com
[search-menu-ui]: https://joht.github.io/search-menu-ui/