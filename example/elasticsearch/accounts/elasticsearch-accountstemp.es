//--------------------------------------------------------
// index setup, analyzer, searches, etc. for accountstemp
//--------------------------------------------------------

// Delete index and all data to start from scratch
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-delete-index.html
DELETE /accountstemp


// Altough it is no neccessary to define the index with all its fields and types,
// it provides much more options and control.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-create-index.html
PUT /accountstemp
{
    "mappings": {
        "properties": {
            "iban": {
                "type": "keyword",
                "normalizer": "name_normalizer",
                "copy_to": "description" // copy to common "search as you type" field
            },
            "accountnumber": {
                "type": "keyword",
                "copy_to": "description", // copy to common "search as you type" field
                "fields": {
                    "number": {
                        "type": "long"
                    }
                }
            },
            "customernumber": {
                "type": "keyword",
                "fields": {
                    "number": {
                        "type": "long"
                    }
                }
            },
            "tenantnumber": {
                "type": "keyword"
            },
            "businesstype": {
                "type": "keyword",
                "normalizer": "name_normalizer"
            },
            "product": {
                "type": "keyword",
                "normalizer": "name_normalizer"
            },
            "currency": {
                "type": "keyword",
                "normalizer": "name_normalizer"
            },
            "accountmanager": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer"
            },
            "tags": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer"
            },
            "creationdate": {
                "type": "date",
                "format": "yyyy-MM-dd"
            },
            "updatetime": {
                "type": "date",
                "format": "yyyy-MM-dd HH:mm:ss.SSS"
            },
            "disposer": {
                "type": "text",
                "copy_to": "description" // copy to common "search as you type" field
            },
            "owner": {
                "type": "text",
                "copy_to": "description" // copy to common "search as you type" field
            },
            // Performance boost option that contains all search as you type contents in one property
            "description": {
                "type": "text",
                "analyzer": "name_analyzer",
                "term_vector": "with_positions_offsets", // for highlighting
                "store": true,
                "fields": {
                    "shingles": {
                        "type": "search_as_you_type"
                    }
                }
            }
        }
    },
    "settings": {
        "analysis": {
            "analyzer": {
                "name_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "char_filter": [
                        "html_strip"
                    ],
                    "filter": [
                        "lowercase",
                        "asciifolding"
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
            "tokenizer": {
                "ngrams": {
                    "type": "ngram",
                    "min_gram": 3,
                    "max_gram": 4
                }
            }
        }
    }
}

//The behaviour of the declared "name_analyzer" can be tested with an given text.
// Testing parts like filters and analyzers in isolation provides is adviseable to learn fast.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-analyze.html
POST accountstemp/_analyze
{
  "analyzer": "name_analyzer",
  "text":     "1234 AT1234 Jack Bauer Kim Bauer"
}

// Index Statistics
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-stats.html
GET accountstemp/_stats

// Query index definition
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-index.html
GET accountstemp

// Adds some test data documents to the index.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-index_.html
PUT accountstemp/_doc/99912345678901
{
    "iban": "AT424321012345678901",
    "accountnumber": "12345678901",
    "customernumber": "00001234567",
    "tenantnumber": "999",
    "businesstype": "Giro",
    "product": "Salary",
    "creationdate": "2020-08-08",
    "updatetime": "2021-04-08 08:31:30.123",
    "disposer": "Hans Mustermann",
    "accountmanager": "Sarah Connor",
    "currency": "EUR",
    "tags": [
        "active",
        "online"
    ]
}

PUT accountstemp/_doc/99912345678902
{
    "iban": "AT424321012345678902",
    "accountnumber": "12345678902",
    "customernumber": "00001234568",
    "tenantnumber": "999",
    "businesstype": "Giro",
    "product": "Commercial Giro",
    "creationdate": "2020-08-08",
    "updatetime": "2021-04-08 08:37:30.123",
    "disposer": "Howard Joel Wolowitz",
    "owner": "Wolowitz KG",
    "accountmanager": "Clara Claton",
    "currency": "EUR",
    "tags": [
        "active",
        "online"
    ]
}

PUT accountstemp/_doc/99912345678903
{
    "iban": "AT424321012345678903",
    "accountnumber": "12345678903",
    "customernumber": "00001234569",
    "tenantnumber": "999",
    "businesstype": "Loan",
    "product": "Housing Loan",
    "creationdate": "2020-08-08",
    "updatetime": "2021-04-08 08:42:30.123",
    "disposer": "Carlo Solér",
    "accountmanager": "Sarah Connor",
    "currency": "EUR",
    "tags": [
        "deleted",
        "bullet bond",
        "long-term"
    ]
}

PUT accountstemp/_doc/99912345678904
{
    "iban": "AT424321012345678904",
    "accountnumber": "12345678904",
    "customernumber": "00001234569",
    "tenantnumber": "999",
    "businesstype": "Giro",
    "product": "Private Giro",
    "creationdate": "2020-08-08",
    "updatetime": "2021-04-08 08:58:30.123",
    "disposer": "Howard Joel Wolowitz",
    "accountmanager": "Clara Claton",
    "currency": "EUR",
    "tags": [
        "active"
    ]
}

PUT accountstemp/_doc/99912345678905
{
    "iban": "AT424321012345678905",
    "accountnumber": "12345678905",
    "customernumber": "00001234570",
    "tenantnumber": "999",
    "businesstype": "Loan",
    "product": "Private Loan",
    "creationdate": "2020-08-08",
    "updatetime": "2021-04-08 14:20:30.123",
    "disposer": "Klara Klammer",
    "accountmanager": "Clara Claton",
    "currency": "CHF",
    "tags": [
        "active",
        "short-term"
    ]
}

PUT accountstemp/_doc/99912345678906
{
    "iban": "AT424321012345678906",
    "accountnumber": "12345678906",
    "customernumber": "00000000001",
    "tenantnumber": "888",
    "businesstype": "Loan",
    "product": "Private Loan",
    "creationdate": "2020-08-08",
    "updatetime": "2021-04-08 18:36:30.123",
    "disposer": "Michael Mair",
    "accountmanager": "John McClane",
    "currency": "EUR",
    "tags": [
        "active",
        "short-term"
    ]
}

PUT accountstemp/_doc/99912345678907
{
    "iban": "AT424321012345678907",
    "accountnumber": "12345678907",
    "customernumber": "00001234571",
    "tenantnumber": "999",
    "businesstype": "Giro",
    "product": "Trust",
    "creationdate": "2020-08-09",
    "updatetime": "2021-04-09 08:20:30.123",
    "disposer": "Carlo Martinez",
    "accountmanager": "Sarah Connor",
    "currency": "EUR",
    "tags": [
        "active"
    ]
}

PUT accountstemp/_doc/99912345678908
{
    "iban": "AT424321012345678908",
    "accountnumber": "12345678908",
    "customernumber": "00001234572",
    "tenantnumber": "999",
    "businesstype": "Giro",
    "product": "Salary",
    "creationdate": "2020-08-09",
    "updatetime": "2021-04-09 08:22:30.123",
    "disposer": "Carmen Martin",
    "accountmanager": "Clara Claton",
    "currency": "EUR",
    "tags": [
        "active"
    ]
}

GET accountstemp/_doc/99912345678903

// Query all accountstemp that match the given tenant number.
// References: 
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html
GET accountstemp/_search
{
    "query": {
        "match": {
            "tenantnumber": {
                "query": "999"
            }
        }
    }
}

// Query "search as you type" field
// Query-Parameter to filter response: ?filter_path=hits.total.value,hits.hits._source
// Query-Parameter to only return stored fields (e.g. "highlight") without document sources: ?stored_fields=true
// References:
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html
// - https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html
GET accountstemp/_search
{
    "size": "20",
    "query": {
        "bool": {
            "must": [
                {
                    "multi_match": {
                        "query": "at42",
                        "type": "bool_prefix",
                        "fields": [
                            "description",
                            "description.shingles",
                            "description.shingles._2gram",
                            "description.shingles._3gram",
                            "description.shingles._index_prefix"
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
                },
                {
                    "match": {
                        "accountmanager": "Sarah Connor"
                    }
                },
                {
                    "match": {
                        "product": "Salary"
                    }
                },
                {
                    "match": {
                        "currency": "EUR"
                    }
                }
            ]
        }
    },
    "highlight": {
        "require_field_match": false,
        "fields": [
            {
                "disposer": {}
            },
            {
                "owner": {}
            },
            {
                "accountnumber": {}
            },
            {
                "iban": {}
            }
        ]
    }
}

// Aggregate query for all distinct values of the field "tags" and how often they occur (limited to 100 entries).
// Similar to "SELECT TAG, COUNT(*) GROUP BY TAG" in SQL.
// Reference https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html
GET accountstemp/_search?filter_path=aggregations.tags.buckets.key,aggregations.tags.buckets.doc_count
{
    "size": 0,
    "aggs": {
        "tags": {
            "terms": {
                "field": "tags",
                "size": 100
            }
        }
    }
}

// Tests a search template script. Provides fast feedback for developing. Supports mustache for pre rendering.
// Testing search template in isolation provides is adviseable to learn fast.
// Reference: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html
GET accountstemp/_search/template
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
                                "description",
                                "description.shingles",
                                "description.shingles._2gram",
                                "description.shingles._3gram",
                                "description.shingles._index_prefix"
                            ]
                        }
                    },
                    {
                        "match": {
                            "tenantnumber": {
                                "query": "{{tenantnumber}}"
                            }
                        }
                    },
                    {
                        "range": {
                            "customernumber": {
                                "gte": "{{customernumber}}{{^customernumber}}0{{/customernumber}}",
                                "lte": "{{customernumber}}{{^customernumber}}99999999999{{/customernumber}}"
                            }
                        }
                    }
                ],
                "should": [
                    {
                        "match": {
                            "businesstype": "{{businesstype}}{{^businesstype}}Giro{{/businesstype}}"
                        }
                    },
                    {
                        "match": {
                            "accountmanager": "{{accountmanager}}"
                        }
                    },
                    {
                        "match": {
                            "product": "{{product}}"
                        }
                    },
                    {
                        "match": {
                            "currency": "{{currency}}{{^currency}}EUR{{/currency}}"
                        }
                    }
                ]
            }
        },
        "highlight": {
            "require_field_match": false,
            "fields": [
                {
                    "disposer": {}
                },   
                {
                    "owner": {}
                },
                {
                    "accountnumber": {}
                },
                {
                    "iban": {}
                }
            ]
        }
    },
    "params": {
        "searchtext": "AT",
        "tenantnumber": 999,
        "accountmanager": "Sarah Connor"
        //,"currency": "EUR" //optional, default= EUR
        //,"product": "Commercial Account" //Optional
        //,"businesstype": "Giro"
        //,"customernumber": "00001234570",
    }
}