// index setup, analyzer, searches, etc. for streets (Austria)

DELETE /strassen

PUT /strassen
{
    "mappings": {
        "properties": {
            "aktualisierung": {
                "type": "date"
            },
            "postleitzahl": {
                "type": "integer"
            },
            "quelle": {
                "type": "keyword"
            },
            "synchronisierung": {
                "type": "date"
            },
            "ortschaftsname": {
                "type": "keyword",
                "normalizer": "namen_normalizer"
            },
            "ort": {
                "type": "keyword",
                "normalizer": "namen_normalizer",
                "fields": {
                    "search_as_you_type": {
                        "type": "search_as_you_type"
                    },
                    "suggest": {
                        "type": "completion",
                        "analyzer": "strassen_analyzer",
                        "preserve_separators": false
                    }
                 }
            },
            "strassenname": {
                "type": "text",
                "analyzer": "strassen_analyzer",
                "fields": {
                    "keyword": {
                        "type": "keyword"
                    },
                    "suggest": {
                        "type": "completion",
                        "analyzer": "strassen_analyzer",
                        "preserve_separators": false
                    },
                    "search_as_you_type": {
                        "type": "search_as_you_type"
                    }
                }
            },
            "bundesland": {
                "type": "keyword",
                "normalizer": "namen_normalizer"
            }
        }
    },
    "settings": {
        "analysis": {
            "analyzer": {
                "strassen_analyzer": {
                    "type": "custom",
                    "tokenizer": "strassen_tokenizer",
                    "char_filter": [
                        "html_strip"
                    ],
                    "filter": [
                        "lowercase",
                        "asciifolding",
                        "strassen_einheitlich",
                        "gassen_einheitlich",
                        "wege_einheitlich",
                        "word_delimiter_graph",
                        "unique"
                    ]
                }
            },
            "filter": {
                "strassen_einheitlich": {
                    "type": "pattern_replace",
                    "pattern": "(.*)(strasse|stra\\ße|strasze|str\\.|str)$",
                    "replacement": "$1strasse $1 strasse"
                },
                "gassen_einheitlich": {
                    "type": "pattern_replace",
                    "pattern": "(.*)(gasse|g\\.)$",
                    "replacement": "$1gasse $1 gasse"
                },
                "wege_einheitlich": {
                    "type": "pattern_replace",
                    "pattern": "(.*)(weg|w\\.)$",
                    "replacement": "$1weg $1 weg"
                }
            },
            // Tokenizer um den Strassentyp vom eigentlichen Namen zu trennen
            "tokenizer": {
                "strassen_tokenizer": {
                    "type": "simple_pattern",
                    "pattern": ".*(Strasse|Stra\\ße|Strasze|Str|Str\\.|strasse|stra\\ße|strasze|str|str\\.|Weg|W\\.|weg|w\\.|Gasse|G.|gasse|g\\.|Allee|allee|—|_|\\ )?"
                }
            },
            "normalizer": {
                "namen_normalizer": {
                    "type": "custom",
                    "filter": [
                        "lowercase",
                        "asciifolding"
                    ]
                }
            }
        }
    }
}

GET strassen/_stats


GET strassen/_search
{
    "size": 0, // don't return list of hits
    "aggs": {
        "orte": {
            "terms": {
                "field": "ort",
                "size": 5,
                "include": "li.*"
            },
            "aggs": {
                "example": {
                    "top_hits": {
                        "_source":["postleitzahl", "ort", "bundesland"],
                        "size": 1
                    }
                }
            }
        },
        "bundeslaender": {
            "terms": {
                "field": "bundesland",
                "size": 9
            }
        }
    }
}

// Kardinalitaet: Anzahl unterschiedlicher Werte eines Feldes
GET /strassen/_search
{
  "size": 0,
  "aggs": {
    "type_count": {
      "cardinality": {
        "field": "ort"
      }
    }
  }
}

//
// Suche aller unterschiedlicher Orte mit je einem Strassen-Beispiel
GET /strassen/_search?filter_path=aggregations.orte.buckets.example.hits.hits._source,aggregations.orte.buckets.doc_count
{
    "size": 0, // don't return list of hits
    "aggs": {
        "orte": {
            "terms": {
                "field": "ort",
                "size": 10,
                "include": "li.*"
            },
            "aggs": {
                "example": {
                    "top_hits": {
                        "_source":["postleitzahl", "ort", "bundesland"],
                        "size": 1
                    }
                }
            }
        }
    }
}

POST strassen/_search
{
    "query": {
        "match": {
            "strassenname": {
                "query": "Theresien",
                "fuzziness": "AUTO"
            }
        }
    },
    "size": 10,
    "from": 0,
    "_source": [
        "strassenname",
        "postleitzahl",
        "ort"
    ]
}

POST strassen/_search?filter_path=suggest.strassen.options._source
{
    "_source": [
        "strassenname",
        "postleitzahl",
        "ort",
        "bundesland"
    ],
    "suggest": {
        "strassen": {
            "prefix": "thresien",
            "completion": {
                "field": "strassenname.suggest",
                "size": 10,
                "skip_duplicates": true,
                "fuzzy": {}
            }
        }
    }
}

// complete suggester fuer strassen und orte
POST strassen/_search?filter_path=suggest.strassen.options._source,suggest.orte.options._source
{
    "_source": [
        "strassenname",
        "postleitzahl",
        "ort",
        "bundesland"
    ],
    "suggest": {
        "strassen": {
            "prefix": "thresien",
            "completion": {
                "field": "strassenname.suggest",
                "size": 10,
                "skip_duplicates": true,
                "fuzzy": {}
            }
        },
        "orte": {
            "prefix": "thresien",
            "completion": {
                "field": "ort.suggest",
                "size": 10,
                "skip_duplicates": true,
                "fuzzy": {}
            }
        }
    }
}

//search as you type for "strassen"
GET strassen/_search?filter_path=hits.hits._source
{
    "_source": [
        "strassenname",
        "postleitzahl",
        "ort",
        "bundesland"
    ],
    "query": {
        "bool": {
            "must": [
                {
                    "multi_match": {
                        "query": "Wolfg",
                        "type": "bool_prefix",
                        "fields": [
                            "strassenname.search_as_you_type",
                            "strassenname.search_as_you_type._2gram",
                            "strassenname.search_as_you_type._3gram"
                        ]
                    }
                }
            ],
            "should": [
                {
                    "match": {
                        "bundesland": "Tirol"
                    }
                }
            ]
        }
    }
}

//?filter_path=hits.hits._source
//search as you type for "orte"
GET strassen/_search?filter_path=aggregations.orte.buckets.single_hit.hits.hits._source
{
    "_source": [
        "postleitzahl",
        "ort",
        "bundesland"
    ],
    "query": {
        "bool": {
            "must": [
                {
                    "multi_match": {
                        "query": "Inn",
                        "type": "bool_prefix",
                        "fields": [
                            "ort.search_as_you_type",
                            "ort.search_as_you_type._2gram",
                            "ort.search_as_you_type._3gram"
                        ]
                    }
                }
            ],
            "should": [
                {
                    "match": {
                        "bundesland": "Tirol"
                    }
                }
            ]
        }
    },
    "aggs": {
        "orte": {
            "terms": {
                "field": "ort",
                "size": 10
            },
            "aggs": {
                "single_hit": {
                    "top_hits": {
                        "size": 1,
                        "_source": [
                            "postleitzahl",
                            "ort",
                            "bundesland"
                        ]
                    }
                }
            }
        }
    }
}

DELETE /strassen_backup

GET /strassen_backup

GET /_shards

POST _reindex?wait_for_completion=false
{
    "source": {
        "index": "strassen_backup"
    },
    "dest": {
        "index": "strassen"
    }
}

GET _tasks/8Jd_SShfQma47i75VmuSWw:143276

DELETE /strassen_backup

GET /strassen/_stats

GET /strassen_backup/_stats