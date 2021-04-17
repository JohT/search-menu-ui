// Configure the search service client.
var httpSearchClient = new searchService.HttpSearchConfig()
.searchMethod("POST")
.searchContentType("application/x-ndjson")
.searchUrl(
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
new searchbar.SearchbarAPI().searchService(httpSearchClient.search)
  .dataConverter(new restruct.DataConverter().createDataConverter(true))
  .addPredefinedParametersTo(function (searchParameters) {
    searchParameters.tenantnumber = 999;
  })
  .addFocusStyleClassOnEveryCreatedElement("searchresultfocus")
  .start();
