// index setup, analyzer, searches, etc. for Konten (accounts)
DELETE /sites

PUT /sites
{
    "mappings": {
        "properties": {
            "mandantennummer": {
                "type": "keyword"
            },
            "domain": {
                "type": "keyword",
                "normalizer": "namen_normalizer"
            },            
            "geschaeftsart": {
                "type": "keyword",
                "normalizer": "namen_normalizer"
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
                //"copy_to": "suchbegriffe" // copy to common "search as you type" field
            },
            "feldnamen": {
                "type": "text",
                "analyzer": "german_decompound_analzer",
                "term_vector": "with_positions_offsets", // for highlighting
                "fields": {
                    "shingles": {
                        "type": "search_as_you_type"
                    }
                }
                //"copy_to": "suchbegriffe" // copy to common "search as you type" field
            },
            "felder": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer"
            },
            "urltemplate": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer"
            },
            // Performance boost option that contains all search as you type contents in one property
            // "suchbegriffe": {
            //     "type": "text",
            //     "analyzer": "namen_analyzer",
            //     "term_vector": "with_positions_offsets", // for highlighting
            //     "store": true,
            //     "fields": {
            //         "shingles": {
            //             "type": "search_as_you_type"
            //         }
            //     }
            // },
            "neuanlagedatum": {
                "type": "date"
            },
            "aktualisierungsdatum": {
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
                "namen_normalizer": {
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

//test analyzer
POST sites/_analyze
{
  "analyzer": "german_decompound_analzer",
  "text":     "Jack Bauer Kim Bauer Kontoübersicht"
}

// Test german analyzer
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
    "text": "Kontoübersicht"
}


GET sites/_stats

GET sites

// Test-Sites
PUT sites/_doc/default
{
    "mandantennummer": "999",
    "domain": "Konto",
    "geschaeftsart": "Giro",
    "name": "Kontoübersicht",
    "feldnamen": [
        "iban",
        "produkt",
        "bezeichnung"
    ],
    "felder": [
        "iban",
        "prod",
        "bez"
    ],
    "urltemplate": "https://httpbin.org/get?type=overview?account={{kontonummer}}",
    "neuanlagedatum": "2020-10-31",
    "aktualisierungsdatum": "2020-10-31T08:53:30Z"
}

POST sites/_doc
{
    "mandantennummer": "999",
    "domain": "Konto",
    "geschaeftsart": "Giro",
    "name": "Habenzinsen",
    "feldnamen": [
        "habenzinssatz",
        "bonuszinssatz",
        "zinsanpassung"
    ],
    "felder": [
        "hab",
        "bon",
        "zan"
    ],
    "urltemplate": "https://httpbin.org/get?type=interest?account={{kontonummer}}",
    "neuanlagedatum": "2020-10-31",
    "aktualisierungsdatum": "2020-10-31T09:06:30Z"
}

POST sites/_doc
{
    "mandantennummer": "999",
    "domain": "Kunde",
    "name": "Kundenübersicht",
    "feldnamen": [
        "kontonummer",
        "produkt",
        "name"
    ],
    "felder": [
        "kto",
        "prod",
        "nam"
    ],
    "urltemplate": "https://httpbin.org/get?type=interest?customer={{kundennummer}}",
    "neuanlagedatum": "2020-10-31"
}

// alle konten eines mandanten
GET sites/_search
{
    "query": {
        "match": {
            "mandantennummer": {
                "query": "999"
            }
        }
    }
}

//TODO
//search as you type for "sites"
//?filter_path=hits.total.value,hits.hits._source
//?stored_fields=true
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
                            "feldnamen",
                            "feldnamen.shingles",
                            "feldnamen.shingles._2gram",
                            "feldnamen.shingles._3gram",
                            "feldnamen.shingles._index_prefix",
                            "felder"
                        ]
                    }
                },
                {
                    "match": {
                        "mandantennummer": {
                            "query": "999"
                        }
                    }
                }
            ],
            "should": [
                {
                    "match": {
                        "geschaeftsart": "Giro"
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
                "feldnamen": {}
            },
            {
                "felder": {}
            }
        ]
    }
}

// Suche alle Tags
GET sites/_search?filter_path=aggregations.felder.buckets*
{
    "size": 0,
    "aggs": {
        "felder": {
            "terms": {
                "field": "felder",
                "size": 100
            }
        }
    }
}

// test search template script
GET sites/_search/template
{
    "source": {
        "size": 20,
        "query": {
            "bool": {
                "must": [
                    {
                        "multi_match": {
                            "query": "{{site_prefix}}",
                            "type": "bool_prefix",
                            "fields": [
                                "name",
                                "name.shingles",
                                "name.shingles._2gram",
                                "name.shingles._3gram",
                                "name.shingles._index_prefix",
                                "feldnamen",
                                "feldnamen.shingles",
                                "feldnamen.shingles._2gram",
                                "feldnamen.shingles._3gram",
                                "feldnamen.shingles._index_prefix",
                                "felder"
                            ]
                        }
                    },
                    {
                        "match": {
                            "mandantennummer": {
                                "query": "{{mandantennummer}}"
                            }
                        }
                    }
                ],
                "should": [
                    {
                        "match": {
                            "geschaeftsart": "{{geschaeftsart}}{{^geschaeftsart}}giro{{/geschaeftsart}}"
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
                "feldnamen": {}
            },
            {
                "felder": {}
            }
            ]
        }
    },
    "params": {
        "site_prefix": "über",
        "mandantennummer": 999,
        "geschaeftsart": "Giro"
    }
}

// delete search template script
DELETE _scripts/konto_search_as_you_type_v1

// store search template script
POST _scripts/konto_search_as_you_type_v1
{
    "script": {
        "lang": "mustache",
        "source": {
            "size": 20,
            "query": {
                "bool": {
                    "must": [
                        {
                            "multi_match": {
                                "query": "{{site_prefix}}",
                                "type": "bool_prefix",
                                "fields": [
                                    "name",
                                    "name.shingles",
                                    "name.shingles._2gram",
                                    "name.shingles._3gram",
                                    "name.shingles._index_prefix",
                                    "feldnamen",
                                    "feldnamen.shingles",
                                    "feldnamen.shingles._2gram",
                                    "feldnamen.shingles._3gram",
                                    "feldnamen.shingles._index_prefix",
                                    "felder"
                                ]
                            }
                        },
                        {
                            "match": {
                                "mandantennummer": {
                                    "query": "{{mandantennummer}}"
                                }
                            }
                        }
                    ],
                    "should": [
                        {
                            "match": {
                                "geschaeftsart": "{{geschaeftsart}}{{^geschaeftsart}}giro{{/geschaeftsart}}"
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
                        "feldnamen": {}
                    },
                    {
                        "felder": {}
                    }
                ]
            }
        }
    }
}

//run stored search template script with given parameters and filtered response
GET sites/_search/template?filter_path=hits.total.value,hits.hits._source,hits.hits.highlight
{
    "id": "konto_search_as_you_type_v1",
    "params": {
        "site_prefix": "über",
        "mandantennummer": 999,
        "geschaeftsart": "Giro"
    }
}

// delete search template script - konto_tags_v1
DELETE _scripts/konto_tags_v1

// store search template script - konto_tags_v1
POST _scripts/konto_tags_v1
{
    "script": {
        "lang": "mustache",
        "source": {
            "size": 0,
            "aggs": {
                "tags": {
                    "terms": {
                        "field": "tags",
                        "size": "{{konto_aggregations_size}}",
                        "include": "{{konto_aggregations_prefix}}.*"
                    }
                },
                "geschaeftsart": {
                    "terms": {
                        "field": "geschaeftsart",
                        "size": "{{konto_aggregations_size}}",
                        "include": "{{konto_aggregations_prefix}}.*"
                    }
                },
                "waehrungskennung": {
                    "terms": {
                        "field": "waehrungskennung",
                        "size": "{{konto_aggregations_size}}",
                        "include": "{{konto_aggregations_prefix}}.*"
                    }
                    // ,"aggs": {
                    //     "example": {
                    //         "top_hits": {
                    //             "_source":["waehrungskennung"],
                    //             "size": 1
                    //         }
                    //     }
                    // }
                },
                "betreuerkennung": {
                    "terms": {
                        "field": "betreuerkennung",
                        "size": "{{konto_aggregations_size}}",
                        "include": "{{konto_aggregations_prefix}}.*"
                    }
                },
                "produktkennung": {
                    "terms": {
                        "field": "produktkennung",
                        "size": "{{konto_aggregations_size}}",
                        "include": "{{konto_aggregations_prefix}}.*"
                    }
                }
            }
        }
    }
}


//execute stored search template script - konto_tags_v1
GET sites/_search/template//?filter_path=aggregations.*.buckets
{
    "id": "konto_tags_v1",
    "params": {
        "konto_aggregations_prefix": "",
        "konto_aggregations_size": 10
    }
}

// Needs to be executed using postman until multi-line-json are supported here
GET _msearch/template?filter_path=responses.hits.total.value,responses.hits.hits._source,responses.hits.hits.highlight,hits.responses.hits.highlight,responses.aggregations.*.buckets
{"index": "konten"}
{"id": "konto_search_as_you_type_v1", "params":{"konto_prefix":"at", "mandantennummer":999,"betreuerkennung":"SARCON"}}
{"index": "konten"}
{"id": "konto_tags_v1", "params":{"konto_aggregations_prefix": "", "konto_aggregations_size": 10}}








//
//Example from
//  https://stackoverflow.com/questions/59677406/how-do-i-get-elasticsearch-to-highlight-a-partial-word-from-a-search-as-you-type

DELETE /highlighttest

PUT /highlighttest
{
  "settings": {
    "analysis": {
      "analyzer": {
        "partial_words" : {
          "type": "custom",
          "tokenizer": "ngrams", 
          "filter": ["lowercase"]
        }
      },
      "tokenizer": {
        "ngrams": {
          "type": "ngram",
          "min_gram": 3,
          "max_gram": 4
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "plain_text": {
        "type": "text",
        "fields": {
          "shingles": { 
            "type": "search_as_you_type",
            "term_vector": "with_positions_offsets"
          },
          "ngrams": {
            "type": "text",
            "analyzer": "partial_words",
            "search_analyzer": "standard",
            "term_vector": "with_positions_offsets"
          }
        }
      }
    }
  }
}

PUT highlighttest/_doc/1
{
    "plain_text": "This is some random text"
}

GET highlighttest/_search
{
  "query": {
    "multi_match": {
      "query": "rand",
      "type": "bool_prefix",
      "fields": [
        "plain_text.shingles",
        "plain_text.shingles._2gram",
        "plain_text.shingles._3gram",
        "plain_text.shingles._index_prefix",
        "plain_text.ngrams"
      ]
    }
  },
  "highlight" : {
    "fields" : [
      {
        "plain_text.ngrams": { 
            "type" : "fvh"
            //,"matched_fields": ["plain_text.ngrams",  "plain_text.shingles", "plain_text.shingles._2gram", "plain_text.shingles._3gram", "plain_text.shingles._index_prefix"]
        } 
      }
    ]
  }
}