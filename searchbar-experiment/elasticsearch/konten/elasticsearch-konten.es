// index setup, analyzer, searches, etc. for Konten (accounts)
DELETE /konten

PUT /konten
{
    "mappings": {
        "properties": {
            "iban": {
                "type": "keyword",
                "normalizer": "namen_normalizer",
                "copy_to": "bezeichnung"
            },
            "kontonummer": {
                "type": "keyword",
                "copy_to": "bezeichnung",
                "fields": {
                    "number": {
                        "type": "long"
                    }
                }
            },
            "kundennummer": {
                "type": "keyword",
                "fields": {
                    "number": {
                        "type": "long"
                    }
                }
            },
            "mandantennummer": {
                "type": "keyword"
            },
            "geschaeftsart": {
                "type": "keyword",
                "normalizer": "namen_normalizer"
            },
            "produktkennung": {
                "type": "keyword",
                "normalizer": "namen_normalizer"
            },
            "waehrungskennung": {
                "type": "keyword",
                "normalizer": "namen_normalizer"
            },
            "betreuerkennung": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer"
            },
            "tags": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer"
            },
            "neuanlagedatum": {
                "type": "date"
            },
            "aktualisierungsdatum": {
                "type": "date"
            },
            "verfuegungsberechtigt": {
                "type": "text",
                "copy_to": "bezeichnung"
            },
            "inhaber": {
                "type": "text",
                "copy_to": "bezeichnung"
            },
            "bezeichnung": {
                "type": "text",
                "analyzer": "namen_analyzer",
                "term_vector": "with_positions_offsets",
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
                "namen_analyzer": {
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

//test analyzer
POST konten/_analyze
{
  "analyzer": "namen_analyzer",
  "text":     "1234 AT1234 Jack Bauer Kim Bauer"
}

GET konten/_stats

GET konten

// Testkonten
PUT konten/_doc/99912345678901
{
    "iban": "AT424321012345678901",
    "kontonummer": "12345678901",
    "kundennummer": "00001234567",
    "mandantennummer": "999",
    "geschaeftsart": "Giro",
    "produktkennung": "GEHALT",
    "neuanlagedatum": "2020-08-08",
    "aktualisierungsdatum": "2020-08-08T08:31:30Z",
    "verfuegungsberechtigt": "Hans Mustermann",
    "betreuerkennung": "SARCON",
    "waehrungskennung": "EUR",
    "tags": [
        "aktiv",
        "online"
    ]
}

PUT konten/_doc/99912345678902
{
    "iban": "AT424321012345678902",
    "kontonummer": "12345678902",
    "kundennummer": "00001234568",
    "mandantennummer": "999",
    "geschaeftsart": "Giro",
    "produktkennung": "KOMMERZ",
    "neuanlagedatum": "2020-08-08",
    "aktualisierungsdatum": "2020-08-08T08:37:30Z",
    "verfuegungsberechtigt": "Romed Giner",
    "inhaber": "Giner KG",
    "betreuerkennung": "KLAKLE",
    "waehrungskennung": "EUR",
    "tags": [
        "aktiv",
        "online"
    ]
}

PUT konten/_doc/99912345678903
{
    "iban": "AT424321012345678903",
    "kontonummer": "12345678903",
    "kundennummer": "00001234569",
    "mandantennummer": "999",
    "geschaeftsart": "Darlehen",
    "produktkennung": "WOHNBAU",
    "neuanlagedatum": "2020-08-08",
    "aktualisierungsdatum": "2020-08-08T08:42:30Z",
    "verfuegungsberechtigt": "Carlo Solér",
    "betreuerkennung": "SARCON",
    "waehrungskennung": "EUR",
    "tags": [
        "gelöscht",
        "endfällig",
        "langfristig"
    ]
}

PUT konten/_doc/99912345678904
{
    "iban": "AT424321012345678904",
    "kontonummer": "12345678904",
    "kundennummer": "00001234569",
    "mandantennummer": "999",
    "geschaeftsart": "Giro",
    "produktkennung": "PRIVKON",
    "neuanlagedatum": "2020-08-08",
    "aktualisierungsdatum": "2020-08-08T08:58:30Z",
    "verfuegungsberechtigt": "Romed Giner",
    "betreuerkennung": "KLAKLE",
    "waehrungskennung": "EUR",
    "tags": [
        "aktiv"
    ]
}

PUT konten/_doc/99912345678905
{
    "iban": "AT424321012345678905",
    "kontonummer": "12345678905",
    "kundennummer": "00001234570",
    "mandantennummer": "999",
    "geschaeftsart": "Darlehen",
    "produktkennung": "PRIVKRE",
    "neuanlagedatum": "2020-08-08",
    "aktualisierungsdatum": "2020-08-08T14:20:30Z",
    "verfuegungsberechtigt": "Klara Klammer",
    "betreuerkennung": "KLAKLE",
    "waehrungskennung": "CHF",
    "tags": [
        "aktiv",
        "kurzfristig"
    ]
}

PUT konten/_doc/99912345678906
{
    "iban": "AT424321012345678906",
    "kontonummer": "12345678905",
    "kundennummer": "00000000001",
    "mandantennummer": "888",
    "geschaeftsart": "Darlehen",
    "produktkennung": "PRIVKRE",
    "neuanlagedatum": "2020-08-08",
    "aktualisierungsdatum": "2020-08-08T18:36:30Z",
    "verfuegungsberechtigt": "Michael Mair",
    "betreuerkennung": "MARSOM",
    "waehrungskennung": "EUR",
    "tags": [
        "aktiv",
        "kurzfristig"
    ]
}

PUT konten/_doc/99912345678907
{
    "iban": "AT424321012345678907",
    "kontonummer": "12345678907",
    "kundennummer": "00001234571",
    "mandantennummer": "999",
    "geschaeftsart": "Giro",
    "produktkennung": "TREUHND",
    "neuanlagedatum": "2020-08-09",
    "aktualisierungsdatum": "2020-08-09T08:20:30Z",
    "verfuegungsberechtigt": "Carlo Martinez",
    "betreuerkennung": "SARCON",
    "waehrungskennung": "EUR",
    "tags": [
        "aktiv"
    ]
}

PUT konten/_doc/99912345678908
{
    "iban": "AT424321012345678908",
    "kontonummer": "12345678908",
    "kundennummer": "00001234572",
    "mandantennummer": "999",
    "geschaeftsart": "Giro",
    "produktkennung": "GEHALT",
    "neuanlagedatum": "2020-08-09",
    "aktualisierungsdatum": "2020-08-09T08:22:30Z",
    "verfuegungsberechtigt": "Carmen Martin",
    "betreuerkennung": "KLAKLE",
    "waehrungskennung": "EUR",
    "tags": [
        "aktiv"
    ]
}

// alle konten eines mandanten
GET konten/_search
{
    "query": {
        "match": {
            "mandantennummer": {
                "query": "999"
            }
        }
    }
}

//search as you type for "konten"
//?filter_path=hits.total.value,hits.hits._source
//?stored_fields=true
GET konten/_search
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
                            "bezeichnung",
                            "bezeichnung.shingles",
                            "bezeichnung.shingles._2gram",
                            "bezeichnung.shingles._3gram",
                            "bezeichnung.shingles._index_prefix"
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
                },
                {
                    "match": {
                        "betreuerkennung": "SARCON"
                    }
                },
                {
                    "match": {
                        "produktkennung": "GEHALT"
                    }
                },
                {
                    "match": {
                        "waehrungskennung": "EUR"
                    }
                }
            ]
        }
    },
    "highlight": {
        "require_field_match": false,
        "fields": [
            {
                "verfuegungsberechtigt": {}
            },
            {
                "inhaber": {}
            },
            {
                "kontonummer": {}
            },
            {
                "iban": {}
            }
        ]
    }
}

// Suche alle Tags
GET konten/_search?filter_path=aggregations.tags.buckets.key,aggregations.tags.buckets.doc_count
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

// test search template script
GET konten/_search/template
{
    "source": {
        "size": 20,
        "query": {
            "bool": {
                "must": [
                    {
                        "multi_match": {
                            "query": "{{konto_prefix}}",
                            "type": "bool_prefix",
                            "fields": [
                                "bezeichnung",
                                "bezeichnung.shingles",
                                "bezeichnung.shingles._2gram",
                                "bezeichnung.shingles._3gram",
                                "bezeichnung.shingles._index_prefix"
                            ]
                        }
                    },
                    {
                        "match": {
                            "mandantennummer": {
                                "query": "{{mandantennummer}}"
                            }
                        }
                    },
                    {
                        "range": {
                            "kundennummer": {
                                "gte": "{{kundennummer}}{{^kundennummer}}0{{/kundennummer}}",
                                "lte": "{{kundennummer}}{{^kundennummer}}99999999999{{/kundennummer}}"
                            }
                        }
                    }
                ],
                "should": [
                    {
                        "match": {
                            "geschaeftsart": "{{geschaeftsart}}{{^geschaeftsart}}giro{{/geschaeftsart}}"
                        }
                    },
                    {
                        "match": {
                            "betreuerkennung": "{{betreuerkennung}}"
                        }
                    },
                    {
                        "match": {
                            "produktkennung": "{{produktkennung}}"
                        }
                    },
                    {
                        "match": {
                            "waehrungskennung": "{{waehrungskennung}}{{^waehrungskennung}}EUR{{/waehrungskennung}}"
                        }
                    }
                ]
            }
        },
        "highlight": {
            "require_field_match": false,
            "fields": [
                {
                    "verfuegungsberechtigt": {}
                },   
                {
                    "inhaber": {}
                },
                {
                    "kontonummer": {}
                },
                {
                    "iban": {}
                }
            ]
        }
    },
    "params": {
        "konto_prefix": "AT",
        "mandantennummer": 999,
        "betreuerkennung": "SARCON"
        //,"waehrungskennung": "EUR" //optional, default= EUR
        //,"produktkennung": "KOMMERZ" //Optional
        //,"geschaeftsart": "Giro"
        //,"kundennummer": "00001234570",
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
                                "query": "{{konto_prefix}}",
                                "type": "bool_prefix",
                                "fields": [
                                    "bezeichnung",
                                    "bezeichnung.shingles",
                                    "bezeichnung.shingles._2gram",
                                    "bezeichnung.shingles._3gram",
                                    "bezeichnung.shingles._index_prefix"
                                ]
                            }
                        },
                        {
                            "match": {
                                "mandantennummer": {
                                    "query": "{{mandantennummer}}"
                                }
                            }
                        },
                        {
                            "range": {
                                "kundennummer": {
                                    "gte": "{{kundennummer}}{{^kundennummer}}0{{/kundennummer}}",
                                    "lte": "{{kundennummer}}{{^kundennummer}}99999999999{{/kundennummer}}"
                                }
                            }
                        }
                    ],
                    "should": [
                        {
                            "match": {
                                "geschaeftsart": "{{geschaeftsart}}{{^geschaeftsart}}giro{{/geschaeftsart}}"
                            }
                        },
                        {
                            "match": {
                                "betreuerkennung": "{{betreuerkennung}}"
                            }
                        },
                        {
                            "match": {
                                "produktkennung": "{{produktkennung}}"
                            }
                        },
                        {
                        "match": {
                            "waehrungskennung": "{{waehrungskennung}}{{^waehrungskennung}}EUR{{/waehrungskennung}}"
                        }
                        }
                    ]
                }
            },
            "highlight": {
                "require_field_match": false,
                "fields": [
                    {
                        "verfuegungsberechtigt": {}
                    },
                    {
                        "inhaber": {}
                    },
                    {
                        "kontonummer": {}
                    },
                    {
                        "iban": {}
                    }
                ]
            }
        }
    }
}

//run stored search template script with given parameters and filtered response
GET konten/_search/template?filter_path=hits.total.value,hits.hits._source,hits.hits.highlight
{
    "id": "konto_search_as_you_type_v1",
    "params": {
        "konto_prefix": "AT",
        "mandantennummer": 999,
        "betreuerkennung": "SARCON"
        //,"waehrungskennung": "EUR" //optional, default= EUR
        //,"produktkennung": "KOMMERZ" //Optional
        //,"geschaeftsart": "Giro"
        //,"kundennummer": "00001234570",
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
GET konten/_search/template//?filter_path=aggregations.*.buckets
{
    "id": "konto_tags_v1",
    "params": {
        "konto_aggregations_prefix": "",
        "konto_aggregations_size": 10
    }
}









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