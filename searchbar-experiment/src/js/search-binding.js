// Configure the search service client.
//var restSearchClient = searchService.RestSearchConfig.searchURI("../data/KontenMultiSearchTemplateResponse.json").searchMethod("GET").build();
var httpSearchClient = new searchService.HttpSearchConfig()
.searchMethod("POST")
.searchContentType("application/x-ndjson")
.searchUrl(
  "http://localhost:9200/_msearch/template?filter_path=responses.hits.total.value,responses.hits.hits._source,hits.responses.hits.highlight,responses.aggregations.*.buckets"
)
  .searchBodyTemplate(
    '{"index": "konten"}\n' +
      '{"id": "konto_search_as_you_type_v1", "params":{{jsonSearchParameters}}}\n' +
      '{"index": "konten"}\n' +
      '{"id": "konto_tags_v1", "params":{"konto_aggregations_prefix": "", "konto_aggregations_size": 10}}\n' +
      '{"index": "sites"}\n' +
      '{"id": "sites_default_v1", "params":{"mandantennummer":{{mandantennummer}}}}\n' +
      '{"index": "sites"}\n' +
      '{"id": "sites_search_as_you_type_v1", "params":{{jsonSearchParameters}}}\n'
  )
  .debugMode(true)
  .build();

// Configure and start the search bar functionality.
new searchbar.SearchbarAPI().searchService(httpSearchClient.search)
  .dataConverter(new restruct.DataConverter().createDataConverter(true))
  .addPredefinedParametersTo(function (searchParameters) {
    searchParameters.mandantennummer = 999;
  })
  .addFocusStyleClassOnEveryCreatedElement("searchresultfocus")
  .start();
