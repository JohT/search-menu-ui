/**
 * @file Configures the search service client, assembles all parts and attaches it to the ui (start()).
 * @version {@link https://github.com/JohT/search-menu-ui/releases/latest latest version}
 * @author JohT
 */

var httpSearchClient;
//TODO include "search-menu-ui" and "search-service-client" as node dependency?
var searchService = searchService || require("../../../search-service-client"); // supports vanilla js & npm
var searchmenu = searchmenu || require("../../../src/js/search-menu-ui"); // supports vanilla js & npm
var template_resolver = template_resolver || require("data-restructor/devdist/templateResolver"); // supports vanilla js & npm
var restruct = restruct || require("./restruct-data-client"); // supports vanilla js & npm

// Search using elasticsearch multisearch
httpSearchClient = new searchService.HttpSearchConfig()
  .searchMethod("POST")
  .searchContentType("application/x-ndjson")
  .searchUrlTemplate(
    "http://localhost:9200/_msearch/template?filter_path=responses.hits.total.value,responses.hits.hits._source,hits.responses.hits.highlight,responses.aggregations.*.buckets"
  )
  .searchBodyTemplate(
    '{"index": "accounts"}\n' +
      '{"id": "account_search_as_you_type_v1", "params":{{jsonSearchParameters}}}\n' +
      '{"index": "accounts"}\n' +
      '{"id": "account_tags_v1", "params":{"account_aggregations_prefix": "", "account_aggregations_size": 10}}\n' +
      '{"index": "sites"}\n' +
      '{"id": "sites_default_v1", "params":{"tenantnumber":{{tenantnumber}}}}\n' +
      '{"index": "sites"}\n' +
      '{"id": "sites_search_as_you_type_v1", "params":{{jsonSearchParameters}}}\n'
  )
  .debugMode(true)
  .build();

// Locally mocked search with a few pre-queried search results (for local debugging and testing)
// Uncomment this section to try search without elasticsearch with some prerecorded data responses.
// httpSearchClient = new searchService.HttpSearchConfig()
//   .searchMethod("GET")
//   .searchUrlTemplate("/example/data/AccountSearchResult-{{searchtext}}.json")
//   .debugMode(true)
//   .build();

// Locally mocked ALREADY CONVERTED AND OPTIMIZED search menu data with a few pre-queried search results (for local debugging and testing)
// Uncomment this section and the dataConverter-Assignment to try search without elasticsearch with some prerecorded data responses.
// httpSearchClient = new searchService.HttpSearchConfig()
//   .searchMethod("GET")
//   .searchUrlTemplate("/example/data/AccountConvertedSearchOptimizedData-{{searchtext}}.json")
//   .debugMode(true)
//   .build();

// Configure and start the search bar functionality.
new searchmenu.SearchMenuAPI()
  .searchService(httpSearchClient.search)
  .dataConverter(new restruct.DataConverter().createDataConverter(true))
  .templateResolver(function (template, sourceObject) {
    return new template_resolver.Resolver(sourceObject).resolveTemplate(template);
  })
  .addPredefinedParametersTo(function (searchParameters) {
    searchParameters.tenantnumber = 999;
  })
  .addFocusStyleClassOnEveryCreatedElement("searchresultfocus")
  .start();
