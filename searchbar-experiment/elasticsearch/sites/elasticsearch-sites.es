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
            "defaultsite": {
                "type": "boolean"
            },
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
    "urltemplate": "http://127.0.0.1:5500/index.html#overview-{{summaries.kontonummer}}",
    "defaultsite": true,
    "neuanlagedatum": "2020-10-29",
    "aktualisierungsdatum": "2020-10-29T08:53:30Z"
}

POST sites/_doc/1
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
    "urltemplate": "http://127.0.0.1:5500/index.html#creditinterest-{{summaries.kontonummer}}",
    "neuanlagedatum": "2020-10-30",
    "aktualisierungsdatum": "2020-10-30T09:06:30Z"
}

POST sites/_doc/2
{
    "mandantennummer": "999",
    "domain": "Konto",
    "geschaeftsart": "Giro",
    "name": "Sollzinsen",
    "feldnamen": [
        "sollzinssatz",
        "sollzinsmarge",
        "zinsanpassung"
    ],
    "felder": [
        "soz",
        "smg",
        "zan"
    ],
    "urltemplate": "http://127.0.0.1:5500/index.html#debitinterest-{{summaries.kontonummer}}",
    "neuanlagedatum": "2020-11-07",
    "aktualisierungsdatum": "2020-11-07T09:06:30Z"
}

POST sites/_doc/3
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
    "urltemplate": "http://127.0.0.1:5500/index.html#overview-customer-{{details.kundennummer}}",
    "neuanlagedatum": "2020-10-31"
}

// alle sites eines mandanten
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

// default site
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
                            "query": "{{searchtext}}",
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
        "searchtext": "über",
        "mandantennummer": 999,
        "geschaeftsart": "Giro"
    }
}


// delete search template script
DELETE _scripts/sites_default_v1

// store search template script
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
                                "mandantennummer": {
                                    "query": "{{mandantennummer}}"
                                }
                            }
                        }
                    ]
                 }
            }
        }
    }
}

//run stored search template script with given parameters and filtered response
GET sites/_search/template?filter_path=hits.hits._source
{
    "id": "sites_default_v1",
    "params": {
        "mandantennummer": 999
    }
}



// delete search template script
DELETE _scripts/sites_search_as_you_type_v1

// store search template script
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
                                "mandantennummer": {
                                    "query": "{{mandantennummer}}"
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
    "id": "sites_search_as_you_type_v1",
    "params": {
        "searchtext": "Über",
        "mandantennummer": 999,
        "geschaeftsart": "Giro"
    }
}

// delete search template script - sites_felder_v1
DELETE _scripts/sites_felder_v1

// store search template script - sites_felder_v1
POST _scripts/sites_felder_v1
{
    "script": {
        "lang": "mustache",
        "source": {
            "size": 0,
            "aggs": {
                "felder": {
                    "terms": {
                        "field": "felder",
                        "size": "{{felder_aggregations_size}}",
                        "include": "{{felder_aggregations_prefix}}.*"
                    }
                }
            }
        }
    }
}


//execute stored search template script - site_felder_v1
GET sites/_search/template//?filter_path=aggregations.*.buckets
{
    "id": "sites_felder_v1",
    "params": {
        "felder_aggregations_prefix": "p",
        "felder_aggregations_size": 10
    }
}

// Needs to be executed using postman until multi-line-json is supported here
GET _msearch/template?filter_path=responses.hits.total.value,responses.hits.hits._source,responses.hits.hits.highlight,hits.responses.hits.highlight,responses.aggregations.*.buckets
{"index": "sites"}
{"id": "sites_default_v1", "params":{"mandantennummer":999}}
{"index": "sites"}
{"id": "sites_search_as_you_type_v1", "params":{"searchtext":"hab", "mandantennummer":999,"geschaeftsart":"Giro"}}
//{"index": "sites"}
//{"id": "sites_felder_v1", "params":{"felder_aggregations_prefix": "hab", "felder_aggregations_size": 10}}
