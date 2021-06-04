[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![Language](https://img.shields.io/github/languages/top/JohT/search-menu-ui/example)
![Branches](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg)
![![npm](./src/npm.svg)](https://aleen42.github.io/badges/src/npm.svg)
![![jasmine](./src/jasmine.svg)](https://aleen42.github.io/badges/src/jasmine.svg)
![![eslint](./src/eslint.svg)](https://aleen42.github.io/badges/src/eslint.svg)

# search-menu-ui-example

This example shows how to use [search-menu-ui](https://github.com/JohT/search-menu-ui) in conjunction with [data-restructor-js](https://github.com/JohT/data-restructor-js) as data converter and [Elasticsearch](https://github.com/elastic/elasticsearch) as backend. 

There are many ways to integrate and design a search UI, this is only one of them.

**Notice:** It is not recommended to directly access [Elasticsearch](https://github.com/elastic/elasticsearch) from the browser. It should be encapsulated and secured within a server application. For fast prototyping and examples like this, it might be handy to directly access it, as long as the HTTP CORS settings work. 

The included [search-example-servlet](./search-example-servlet/README.md) shows how to implement a java application using a standard servlet container to integrate elasticsearch into a application like a database.

**Notice:** This example does not use a bundler and includes all scripts without module system to show, that a minimal-dependencies approach is possible. Both [search-menu-ui](https://github.com/JohT/search-menu-ui) and [data-restructor-js](https://github.com/JohT/data-restructor-js) provide built modules and also support the use of bundler.

## 1. Setup elasticsearch

- Download [elasticsearch]: https://www.elastic.co/de/downloads/elasticsearch
- Install [elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html
- (Recommended) Use [Visual Studio Code] with extension [Elasticsearch for VSCode](https://marketplace.visualstudio.com/items?itemName=ria.elastic)
- (Alternative) All following elasticsearch commands can be executed with any HTTP Client (curl, postman, ...).
- Setup example index "accounts" with the commands listed und described in [elasticsearch-accounts.es](elasticsearch/accounts/elasticsearch-accounts.es). 
- Setup example index "sites" with the commands listed und described in [elasticsearch-sites.es](elasticsearch/sites/elasticsearch-sites.es). 

## 2. Convert elasticsearch results to the search menu data structure

- [data-restructor-js](https://joht.github.io/data-restructor-js) makes it easy to convert the [elasticsearch] response to the search menu data structure (see [Data Structure Reference](../README.md#Data-structure)). 
- The example [restruct-data-client.js](src/js/restruct-data-client.js) describes the 
expected data and how it should be structured for the search menu. The configured data converter 
is then created with `new restruct.DataConverter().createDataConverter(debuMode)`.
- The data converter is attached to the search menu using the [SearchMenuAPI](https://joht.github.io/search-menu-ui/docs/module-searchmenu.SearchMenuAPI.html) as shown in [search-binding.js](src/js/search-binding.js#L53).

## 3. Configure search service backend request

The build-in module `search-service-client.js` contains a very simple yet useable
HTTP client adapter to attach a `XMLHttpRequest` to the search menu. The example configuration is located inside the [search-binding.js](src/js/search-binding.js). More details can
be found here: [search-service-client JSDoc](https://joht.github.io/search-menu-ui/docs/module-searchMenuServiceClient.HttpSearchConfig.html).

## 4. Configure and attach the search menu UI

Finally everything gets assembled and bound to the HTML for this example inside 
[search-binding.js](src/js/search-binding.js#L51). This example mainly uses default 
bindings and settings. The only thing that is left is the definition of the modules for the search service, the data converter and the template resolver. `addFocusStyleClassOnEveryCreatedElement` is additionally used for better browser compatibility (to not depend on CSS `:focus` selector). 

More details and all configuration options can be found here: [SearchMenuAPI JSDoc](https://joht.github.io/search-menu-ui/docs/module-searchmenu.SearchMenuAPI.html)

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
- [NYC aka Istanbul](https://istanbul.js.org) - [ISC License](https://github.com/istanbuljs/nyc/blob/master/LICENSE.txt)

[elasticsearch]: https://www.elastic.co/products/elasticsearch
[Visual Studio Code]: https://code.visualstudio.com
[search-menu-ui]: https://joht.github.io/search-menu-ui/
