// index setup, analyzer, searches, etc. for sites
DELETE /sites

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

//test analyzer
POST sites/_analyze
{
  "analyzer": "german_decompound_analzer",
  "text":     "Jack Bauer Kim Bauer Account Overview"
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
    "text": "Account Overview"
}


GET sites/_stats

GET sites

// Test-Sites
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
    "urltemplate": "http://127.0.0.1:5500/index.html#overview-{{summaries.accountnumber}}",
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
    "urltemplate": "http://127.0.0.1:5500/index.html#creditinterest-{{summaries.accountnumber}}",
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
    "urltemplate": "http://127.0.0.1:5500/index.html#debitinterest-{{summaries.accountnumber}}",
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
    "urltemplate": "http://127.0.0.1:5500/index.html#overview-customer-{{details.kundennummer}}",
    "creationdate": "2021-03-31"
}

// alle sites eines mandanten
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

// Suche alle Tags
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

//run stored search template script with given parameters and filtered response
GET sites/_search/template?filter_path=hits.hits._source
{
    "id": "sites_default_v1",
    "params": {
        "tenantnumber": 999
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

//run stored search template script with given parameters and filtered response
GET sites/_search/template?filter_path=hits.total.value,hits.hits._source,hits.hits.highlight
{
    "id": "sites_search_as_you_type_v1",
    "params": {
        "searchtext": "Over",
        "tenantnumber": 999,
        "businesstype": "Giro"
    }
}

// delete search template script - sites_fields_v1
DELETE _scripts/sites_fields_v1

// store search template script - sites_fields_v1
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


//execute stored search template script - site_fields_v1
GET sites/_search/template//?filter_path=aggregations.*.buckets
{
    "id": "sites_fields_v1",
    "params": {
        "fields_aggregations_prefix": "p",
        "fields_aggregations_size": 10
    }
}

// Needs to be executed using postman until multi-line-json is supported here
GET _msearch/template?filter_path=responses.hits.total.value,responses.hits.hits._source,responses.hits.hits.highlight,hits.responses.hits.highlight,responses.aggregations.*.buckets
{"index": "sites"}
{"id": "sites_default_v1", "params":{"tenantnumber":999}}
{"index": "sites"}
{"id": "sites_search_as_you_type_v1", "params":{"searchtext":"cre", "tenantnumber":999,"businesstype":"Giro"}}
//{"index": "sites"}
//{"id": "sites_fields_v1", "params":{"fields_aggregations_prefix": "cre", "fields_aggregations_size": 10}}
