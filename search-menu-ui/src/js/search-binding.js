/**
 * @file Configures the search service client, assembles all parts and attaches it to the ui (start()).
 * @version {@link https://github.com/JohT/search-menu-ui/releases/latest latest version}
 * @author JohT
 */

var httpSearchClient;
var searchService = searchService || require("./search-service-client"); // supports vanilla js & npm
var searchmenu = searchmenu || require("./search-menu-ui"); // supports vanilla js & npm
var restruct = restruct || require("./restruct-data-client"); // supports vanilla js & npm

// Locally mocked search with a view pre-queried search results (for local debugging and testing)
httpSearchClient = new searchService.HttpSearchConfig()
  .searchMethod("GET")
  .searchUrlTemplate("/data/AccountSearchResult-{{searchtext}}.json")
  .debugMode(true)
  .build();

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

// Configure and start the search bar functionality.
new searchmenu.SearchMenuAPI()
  .searchService(httpSearchClient.search)
  .dataConverter(new restruct.DataConverter().createDataConverter(true))
  .addPredefinedParametersTo(function (searchParameters) {
    searchParameters.tenantnumber = 999;
  })
  .addFocusStyleClassOnEveryCreatedElement("searchresultfocus")
  .start();
