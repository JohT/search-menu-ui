//--------------------------------------------------------
// index setup, analyzer, searches, etc. for sites
//--------------------------------------------------------

// Delete index and all data to start from scratch
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-delete-index.html
DELETE /sites

// Altough it is no neccessary to define the index with all its fields and types,
// it provides much more options and control.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-create-index.html
PUT /sites
{
    "mappings": {
        "properties": {
            "tenantnumber": {
                "type": "keyword"
            },
            "domain": {
                "type": "keyword",
                "normalizer": "name_normalizer"
            },            
            "businesstype": {
                "type": "keyword",
                "normalizer": "name_normalizer"
            },            
            "name": {
                "type": "text",
                "analyzer": "german_decompound_analzer",
                "term_vector": "with_positions_offsets", // for highlighting
                "fields": {
                    "shingles": {
                        "type": "search_as_you_type"
                    }
                }
            },
            "fieldnames": {
                "type": "text",
                "analyzer": "german_decompound_analzer",
                "term_vector": "with_positions_offsets", // for highlighting
                "fields": {
                    "shingles": {
                        "type": "search_as_you_type"
                    }
                }
            },
            "fields": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer"
            },
            "urltemplate": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer"
            },
            "defaultsite": {
                "type": "boolean"
            },
            "creationdate": {
                "type": "date"
            },
            "updatetime": {
                "type": "date"
            }
        }
    },
    "settings": {
        "analysis": {
            "analyzer": {
                "german_decompound_analzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": [
                        "lowercase",
                        "german_decompounder",
                        "german_normalization",
                        "german_stemmer"
                    ]
                }
            },
            "normalizer": {
                "name_normalizer": {
                    "type": "custom",
                    "filter": [
                        "lowercase",
                        "asciifolding"
                    ]
                },
                "lowercase_normalizer": {
                    "type": "custom",
                    "filter": [
                        "lowercase"
                    ]
                }
            },
            "filter": {
                "german_decompounder": {
                    "type": "hyphenation_decompounder",
                    "word_list_path": "./analysis/dictionary/dictionary-de.txt",
                    "hyphenation_patterns_path": "./analysis/hyphenation/de_DR.xml",
                    "only_longest_match": true,
                    "min_subword_size": 4
                },
                "german_stemmer": {
                    "type": "stemmer",
                    "language": "light_german"
                }
            }
        }
    }
}

//The behaviour of the declared "name_analyzer" can be tested with an given text.
// Testing parts like filters and analyzers in isolation provides is adviseable to learn fast.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-analyze.html
POST sites/_analyze
{
  "analyzer": "german_decompound_analzer",
  "text":     "Jack Bauer Kim Bauer Account Overview"
}

// The behaviour of the declared "german_decompounder" can be tested with an given text.
// Testing parts like filters and analyzers in isolation provides is adviseable to learn fast.
// Reference: https://github.com/uschindler/german-decompounder
POST _analyze
{
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        {
            "type": "hyphenation_decompounder",
            "hyphenation_patterns_path": "./analysis/hyphenation/de_DR.xml",
            "word_list_path": "./analysis/dictionary/dictionary-de.txt",
            "only_longest_match": true,
            "min_subword_size": 4
        },
        "german_normalization",
        {
            "type":       "stemmer",
            "language":   "light_german"
        }
    ],
    "text": "Account Overview"
}

// Index Statistics
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-stats.html
GET sites/_stats

// Query index definition
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-index.html
GET sites

// The "default" ID is chosen to distinguish this entry from others.
// It can then be treated as pre selected navigation filter in the search menu UI.
// If the navigation filter isn't change, the url template of this entry will be used when a result is selected.

// Adds some test data documents to the index.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-index_.html
PUT sites/_doc/default
{
    "tenantnumber": "999",
    "domain": "Account",
    "businesstype": "Giro",
    "name": "Account Overview",
    "fieldnames": [
        "iban",
        "product",
        "description"
    ],
    "fields": [
        "iban",
        "prod",
        "desc"
    ],
    "urltemplate": "http://127.0.0.1:5500/example/index.html#overview-{{summaries.accountnumber}}",
    "defaultsite": true,
    "creationdate": "2020-10-29",
    "updatetime": "2021-04-29T08:53:30Z"
}

POST sites/_doc/1
{
    "tenantnumber": "999",
    "domain": "Account",
    "businesstype": "Giro",
    "name": "Credit Interests",
    "fieldnames": [
        "creditinterest",
        "bonusinterest"
    ],
    "fields": [
        "crin",
        "boin"
    ],
    "urltemplate": "http://127.0.0.1:5500/example/index.html#creditinterest-{{summaries.accountnumber}}",
    "creationdate": "2020-10-30",
    "updatetime": "2021-04-30T09:06:30Z"
}

POST sites/_doc/2
{
    "tenantnumber": "999",
    "domain": "Account",
    "businesstype": "Giro",
    "name": "Debit Interests",
    "fieldnames": [
        "debitinterest",
        "debit interest margin"
    ],
    "fields": [
        "dein",
        "deim"
    ],
    "urltemplate": "http://127.0.0.1:5500/example/index.html#debitinterest-{{summaries.accountnumber}}",
    "creationdate": "2020-11-07",
    "updatetime": "2021-04-07T09:06:30Z"
}

POST sites/_doc/3
{
    "tenantnumber": "999",
    "domain": "Kunde",
    "name": "Customer Overview",
    "fieldnames": [
        "iban",
        "product",
        "description"
    ],
    "fields": [
        "iban",
        "prod",
        "desc"
    ],
    "urltemplate": "http://127.0.0.1:5500/example/index.html#overview-customer-{{details.customernumber}}",
    "creationdate": "2021-03-31"
}

// Query all accounts that match the given tenant number.
// References: 
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html
GET sites/_search
{
    "query": {
        "match": {
            "tenantnumber": {
                "query": "999"
            }
        }
    }
}

// Query all entries except the default one (marked with defaultsite=true).
// References: 
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html
GET sites/_search
{
    "query": {
        "match": {
            "defaultsite": {
                "query": false
            }
        }
    }
}

// Query "search as you type" fields.
// Query-Parameter to filter response: ?filter_path=hits.total.value,hits.hits._source
// Query-Parameter to only return stored fields (e.g. "highlight") without document sources: ?stored_fields=true
// References:
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html
GET sites/_search
{
    "size": "20",
    "query": {
        "bool": {
            "must": [
                {
                    "multi_match": {
                        "query": "pro",
                        "type": "bool_prefix",
                        "fields": [
                            "name",
                            "name.shingles",
                            "name.shingles._2gram",
                            "name.shingles._3gram",
                            "name.shingles._index_prefix",
                            "fieldnames",
                            "fieldnames.shingles",
                            "fieldnames.shingles._2gram",
                            "fieldnames.shingles._3gram",
                            "fieldnames.shingles._index_prefix",
                            "fields"
                        ]
                    }
                },
                {
                    "match": {
                        "tenantnumber": {
                            "query": "999"
                        }
                    }
                }
            ],
            "should": [
                {
                    "match": {
                        "businesstype": "Giro"
                    }
                }
            ]
        }
    },
    "highlight": {
        "require_field_match": false,
        "fields": [
            {
                "name": {}
            },
            {
                "fieldnames": {}
            },
            {
                "fields": {}
            }
        ]
    }
}

// Aggregate query for all distinct values of the field "fields" and how often they occur (limited to 100 entries).
// Similar to "SELECT FIELD, COUNT(*) GROUP BY FIELD" in SQL.
// Reference https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html
GET sites/_search?filter_path=aggregations.fields.buckets*
{
    "size": 0,
    "aggs": {
        "fields": {
            "terms": {
                "field": "fields",
                "size": 100
            }
        }
    }
}

// Tests a search template script. Provides fast feedback for developing. Supports mustache for pre rendering.
// Testing search template in isolation provides is adviseable to learn fast.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html
GET sites/_search/template
{
    "source": {
        "size": 20,
        "query": {
            "bool": {
                "must": [
                    {
                        "multi_match": {
                            "query": "{{searchtext}}",
                            "type": "bool_prefix",
                            "fields": [
                                "name",
                                "name.shingles",
                                "name.shingles._2gram",
                                "name.shingles._3gram",
                                "name.shingles._index_prefix",
                                "fieldnames",
                                "fieldnames.shingles",
                                "fieldnames.shingles._2gram",
                                "fieldnames.shingles._3gram",
                                "fieldnames.shingles._index_prefix",
                                "fields"
                            ]
                        }
                    },
                    {
                        "match": {
                            "tenantnumber": {
                                "query": "{{tenantnumber}}"
                            }
                        }
                    }
                ],
                "should": [
                    {
                        "match": {
                            "businesstype": "{{businesstype}}{{^businesstype}}giro{{/businesstype}}"
                        }
                    }
                ]
            }
        },
        "highlight": {
            "require_field_match": false,
            "fields": [
                {
                "name": {}
            },
            {
                "fieldnames": {}
            },
            {
                "fields": {}
            }
            ]
        }
    },
    "params": {
        "searchtext": "over",
        "tenantnumber": 999,
        "businesstype": "Giro"
    }
}

// Delete search template script.
// Provides a distinct search for the default navigation target based on the given parameters.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/delete-stored-script-api.html
DELETE _scripts/sites_default_v1

// Store search template script.
// Provides a distinct search for the default navigation target based on the given parameters.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html
POST _scripts/sites_default_v1
{
    "script": {
        "lang": "mustache",
        "source": {
            "size": 1,
            "query": {
                 "bool": {
                    "must": [
                        {
                            "match" : {
                                "defaultsite": {
                                    "query": true
                                }
                            }
                        },
                        {
                            "match": {
                                "tenantnumber": {
                                    "query": "{{tenantnumber}}"
                                }
                            }
                        }
                    ]
                 }
            }
        }
    }
}

// Execute the stored search template script with given parameters and filtered response (using GET).
// Provides a distinct search for the default navigation target based on the given parameters.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html#use-registered-templates
GET sites/_search/template?filter_path=hits.hits._source
{
    "id": "sites_default_v1",
    "params": {
        "tenantnumber": 999
    }
}

// Delete search template script.
// Provides "search as you type" for sites (navigation targets), their descriptions and their fields.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/delete-stored-script-api.html
DELETE _scripts/sites_search_as_you_type_v1

// Store search template script.
// Provides "search as you type" for sites (navigation targets), their descriptions and their fields.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html
POST _scripts/sites_search_as_you_type_v1
{
    "script": {
        "lang": "mustache",
        "source": {
            "size": 20,
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "tenantnumber": {
                                    "query": "{{tenantnumber}}"
                                }
                            }
                        }
                    ],
                    "must_not": [
                        {
                            "match": {
                                "defaultsite": {
                                    "query": true
                                }
                            }
                        }
                    ],
                    "should": [
                        {
                            "multi_match": {
                                "query": "{{searchtext}}",
                                "type": "bool_prefix",
                                "fields": [
                                    "name",
                                    "name.shingles",
                                    "name.shingles._2gram",
                                    "name.shingles._3gram",
                                    "name.shingles._index_prefix",
                                    "fieldnames",
                                    "fieldnames.shingles",
                                    "fieldnames.shingles._2gram",
                                    "fieldnames.shingles._3gram",
                                    "fieldnames.shingles._index_prefix",
                                    "fields"
                                ]
                            }
                        },
                        {
                            "match": {
                                "businesstype": "{{businesstype}}{{^businesstype}}giro{{/businesstype}}"
                            }
                        }
                    ]
                }
            },
            "highlight": {
                "require_field_match": false,
                "fields": [
                    {
                        "name": {}
                    },
                    {
                        "fieldnames": {}
                    },
                    {
                        "fields": {}
                    }
                ]
            }
        }
    }
}

// Execute the stored search template script with given parameters and filtered response (using GET).
// Provides "search as you type" for sites (navigation targets), their descriptions and their fields.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html#use-registered-templates
GET sites/_search/template?filter_path=hits.total.value,hits.hits._source,hits.hits.highlight
{
    "id": "sites_search_as_you_type_v1",
    "params": {
        "searchtext": "Over",
        "tenantnumber": 999,
        "businesstype": "Giro"
    }
}

// Delete search template script.
// Provides an aggregation of all fields for a given fieldname prefix.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/delete-stored-script-api.html
DELETE _scripts/sites_fields_v1

// Store search template script.
// Provides an aggregation of all fields for a given fieldname prefix.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html

POST _scripts/sites_fields_v1
{
    "script": {
        "lang": "mustache",
        "source": {
            "size": 0,
            "aggs": {
                "fields": {
                    "terms": {
                        "field": "fields",
                        "size": "{{fields_aggregations_size}}",
                        "include": "{{fields_aggregations_prefix}}.*"
                    }
                }
            }
        }
    }
}

// Execute the stored search template script with given parameters and filtered response (using GET).
// Provides an aggregation of all fields for a given fieldname prefix.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html#use-registered-templates
GET sites/_search/template//?filter_path=aggregations.*.buckets
{
    "id": "sites_fields_v1",
    "params": {
        "fields_aggregations_prefix": "p",
        "fields_aggregations_size": 10
    }
}

// Executes multiple search templates within one request using the given parameters.
// Combines multiple searches in one request. 
// Templates provide encapsulation / implementation hiding to decouple search tweaks from code changes.
// Needs to be executed using postman until multi-line-json (new line separated) is supported here.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/multi-search-template.html
GET _msearch/template?filter_path=responses.hits.total.value,responses.hits.hits._source,responses.hits.hits.highlight,hits.responses.hits.highlight,responses.aggregations.*.buckets
{"index": "sites"}
{"id": "sites_default_v1", "params":{"tenantnumber":999}}
{"index": "sites"}
{"id": "sites_search_as_you_type_v1", "params":{"searchtext":"cre", "tenantnumber":999,"businesstype":"Giro"}}

// To add fields search use:
//{"index": "sites"}
//{"id": "sites_fields_v1", "params":{"fields_aggregations_prefix": "cre", "fields_aggregations_size": 10}}
