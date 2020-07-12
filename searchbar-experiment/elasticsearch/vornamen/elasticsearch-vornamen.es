//delete index
DELETE /vornamen 

// index setup including analyzers
PUT /vornamen
{
    "mappings": {
        "properties": {
            "vorname": {
                "type": "keyword",
                "normalizer": "namen_normalizer",
                "fields": {
                    "suggest": {
                        "type": "completion",
                        "analyzer": "vornamen_analyzer",
                        "preserve_separators": false
                    },
                    "search_as_you_type": {
                        "type": "search_as_you_type"
                    }
                }
            },
            "vereinfacht": {
                "type": "keyword",
                "normalizer": "namen_normalizer"
            },
            "geschlecht": {
                "type": "keyword",
                "normalizer": "namen_normalizer"
            },
            "quelle": {
                "type": "keyword",
                "normalizer": "namen_normalizer"
            },
            "rang_seit_1984": {
                "type": "integer",
                "fields": {
                    "rank": {
                        "type": "rank_feature"
                    }
                }
            },
            "anzahl_seit_1984": {
                "type": "integer"
            },
            "synchronisierung": {
                "type": "date"
            }
        }
    },
    "settings": {
        "analysis": {
            "analyzer": {
                "vornamen_analyzer": {
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
                }
            }
        }
    }
}

//test analyzer
POST vornamen/_analyze
{
  "analyzer": "vornamen_analyzer",
  "text":     "Franz-Patrick"
}

DELETE vornamen/_doc/1

PUT vornamen/_doc/1
{
    "vorname": "Franz-Patrick",
    "vereinfacht": "Franz-Patrick",
    "geschlecht": "maennlich",
    "quelle": "manuell",
    "anzahl_seit_1984": 0,
    "rang_seit_1984": 100000
}

PUT vornamen/_doc/2
{
    "vorname": "Franz",
    "vereinfacht": "Franz",
    "geschlecht": "maennlich",
    "quelle": "manuell",
    "anzahl_seit_1984": 0,
    "rang_seit_1984": 100000
}

PUT vornamen/_doc/3
{
    "vorname": "Patrick",
    "vereinfacht": "Patrick",
    "geschlecht": "maennlich",
    "quelle": "manuell",
    "anzahl_seit_1984": 0,
    "rang_seit_1984": 100000

}

PUT vornamen/_doc/4
{
    "vorname": "Matthea",
    "vereinfacht": "Matthea",
    "geschlecht": "weiblich",
    "quelle": "manuell",
    "anzahl_seit_1984": 0,
    "rang_seit_1984": 100000
}

PUT vornamen/_doc/5
{
    "vorname": "Andrè",
    "vereinfacht": "Andrè",
    "geschlecht": "weiblich",
    "quelle": "manuell",
    "anzahl_seit_1984": 0,
    "rang_seit_1984": 100000
}

// search near match using fuzziness
POST vornamen/_search
{
    "query": {
        "match": {
            "vorname": {
                "query": "matthea",
                "fuzziness": "AUTO"
            }
        }
    }
}


// query suggestions, full output
POST vornamen/_search
{
    "suggest": {
        "vorname": {
            "prefix": "fr",
            "completion": {
                "field": "vorname.suggest",
                "size": 5,
                "skip_duplicates": true,
                "fuzzy": {}
            }
        }
    }
}

// query suggestions, minimize output
POST vornamen/_search?q=elasticsearch&filter_path=suggest.vorname.options.text,suggest.vorname.options._id
{
    "suggest": {
        "vorname": {
            "prefix": "fr",
            "completion": {
                "field": "vorname.suggest",
                "size": 5,
                "skip_duplicates": true,
                "fuzzy": {}
            }
        }
    }
}

GET vornamen/_search
{
  "query": {
    "multi_match": {
      "query": "fr",
      "type": "bool_prefix",
      "fields": [
        "vorname.search_as_you_type",
        "vorname.search_as_you_type._2gram",
        "vorname.search_as_you_type._3gram"
      ]
    }
  }
}