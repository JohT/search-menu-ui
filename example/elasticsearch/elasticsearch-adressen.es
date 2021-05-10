//delete index
DELETE /adressen 

// index setup including analyzers
PUT /adressen
{
    "mappings": {
        "properties": {
            "mandant": {
                "type": "keyword"
            },
            "vorname": {
                "type": "keyword",
                "normalizer": "adressfeld_normalizer"
            },
            "nachname": {
                "type": "keyword",
                "normalizer": "adressfeld_normalizer"
            },
            "name": {
                "type": "keyword",
                "normalizer": "adressfeld_normalizer"
            },
            "strasse": {
                "type": "text",
                "analyzer": "strassen_analyzer",
                "fields": {
                    "keyword": {
                        "type": "keyword", // for 1:1 search
                        "normalizer": "adressfeld_normalizer"
                    }
                },
                "fielddata": true
            },
            "hausnummer": {
                "type": "keyword"
            },
            "postleitzahl": {
                "type": "keyword"
            },
            "ort": {
                "type": "keyword",
                "normalizer": "adressfeld_normalizer"
            },
            "land": {
                "type": "keyword",
                "normalizer": "adressfeld_normalizer"
            },
            "suggest": {
                "type": "completion",
                "contexts": [
                    {
                        "name": "mandant",
                        "type": "category",
                        "path": "mandant"
                    }
                ]
            }
        }
    },
    "settings": {
        "analysis": {
            "analyzer": {
                // "adressen_analyzer": {
                //     "type": "custom",
                //     "tokenizer": "standard",
                //     "char_filter": [
                //         "html_strip"
                //     ],
                //     "filter": [
                //         "lowercase",
                //         "asciifolding"
                //     ]
                // },
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
                "adressfeld_normalizer": {
                    "type": "custom",
                    "filter": ["lowercase"]
                }
            }
        }
    }
}

//test analyzer
POST adressen/_analyze
{
  "analyzer": "strassen_analyzer",
  "text":     "Wiesengasse"
}

//simple_pattern tokenizer (fuer Strassen unbrauchbar)
POST _analyze
{
    "tokenizer": {
        "type": "simple_pattern",
        "pattern": "(Strasse|Stra\\ße|Strasze|Str|Str\\.|strasse|stra\\ße|strasze|str|str\\.|Weg|W\\.|weg|w\\.|Gasse|G\\.|gasse|g\\.|Allee|allee|—|_|\\ )?"
    },
     "text": "Wiesengasse"
}

//Strassen-Namen Filter-Chain using pattern_replace filter
GET /_analyze
{
    "tokenizer": "whitespace",
    "filter": [
        "lowercase",
        "asciifolding",
        {
            "type": "pattern_replace",
            "pattern": "(.*)(strasse|stra\\ße|strasze|str\\.|str)$",
            "replacement": "$1strasse $1 strasse"
        },
        {
            "type": "pattern_replace",
            "pattern": "(.*)(gasse|g\\.)$",
            "replacement": "$1gasse $1 gasse"
        },
        {
            "type": "pattern_replace",
            "pattern": "(.*)(weg|w\\.)$",
            "replacement": "$1weg $1 weg"
        },
        "word_delimiter_graph",
        "unique"
     ],
    "text": "Willhelm-Greil-Str."
}

//synonym filter
GET /_analyze
{
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        "asciifolding",
        {
            "type": "synonym_graph",
            "synonyms": [
                "strasse, straße, strasze, str, str. => strasse",
                "gasse, g. => gasse",
                "weg, w. => weg"
            ],
            "lenient": "false"
        }
    ],
    "text": "Wiesen gasse"
}

//dictionary_decompounder tokenizer
GET _analyze
{
    "tokenizer": "standard",
    "filter": [
        {
            "type": "dictionary_decompounder",
            "word_list": [
                "Strasse",
                "strasse",
                "Straße",
                "straße",
                "Str",
                "str",
                "Gasse",
                "gasse",
                "g."
            ]
        }
    ],
    "text": "Wiesengasse"
}

// show index 
GET adressen

// Mehrere Adressen auf einmal indizieren (bulk)
POST adressen/_bulk
{"index": { "_id": "00100000000001A00001" }}
{   "mandant": "1",
    "vorname": "Johannes",
    "nachname": "Müller",
    "strasse": "Maria-Theresien-Strasse",
    "hausnummer": "22",
    "postleitzahl": "6020",
    "ort": "Innsbruck",
    "land": "Österreich",
    "suggest": {
        "input": [
            "johannes",
            "müller",
            "maria-theresien",
            "22"
        ],
        "contexts": {
            "mandant": "1"
        }
    }
}
{ "index": { "_id": "00100000000002A00002" } }
{   "mandant": "1",
    "vorname": "Johanna",
    "nachname": "Mair",
    "strasse": "Langerweg",
    "hausnummer": "22",
    "postleitzahl": "6020",
    "ort": "Innsbruck",
    "land": "Österreich",
    "suggest": {
        "input": [
            "Johanna",
            "Mair",
            "Langerweg",
            "1"
        ],
        "contexts": {
            "mandant": "1"
        }
    }
}
{ "index": { "_id": "00100000000003A00003" } }
{   "mandant": "1",
    "voname": "Mario",
    "nachname": "Mair",
    "strasse": "Langerweg",
    "hausnummer": "1",
    "postleitzahl": "6020",
    "ort": "Innsbruck",
    "land": "Österreich",
    "suggest": {
        "input": [
            "mario",
            "mair",
            "langer",
            "weg",
            "1"
        ],
        "contexts": {
            "mandant": "1"
        }
    }
}
{ "index": { "_id": "00100000000004A00001" } }
{   "mandant": "1",
    "vorname": "Claudia",
    "nachname": "Steinbrunnen",
    "strasse": "Wiesengasse",
    "hausnummer": "43",
    "postleitzahl": "6020",
    "ort": "Innsbruck",
    "land": "Österreich",
    "suggest": {
        "input": [
            "claudia",
            "steinbrunnen",
            "wiesengasse",
            "wiesen",
            "43"
        ],
        "contexts": {
            "mandant": "1"
        }
    }
}
{ "index": {"_id": "00100000000005A00001" }}
{   "mandant": "1",
    "vorname": "Markus",
    "nachname": "Johannson",
    "strasse": "Andechstrasse",
    "hausnummer": "4",
    "postleitzahl": "6020",
    "ort": "Innsbruck",
    "land": "Österreich",
    "suggest": {
        "input": [
            "markus",
            "johannson",
            "johanson",
            "andech",
            "4"
        ],
        "contexts": {
            "mandant": "1"
        }
    }
}




// Einzelnes Indizieren/Aktualisierung von Adressen
PUT adressen/_doc/00100000000001A00001
{
    "mandant": "1",
    "vorname": "Johannes",
    "nachname": "Müller",
    "strasse": "Maria-Theresien-Strasse",
    "hausnummer": "22",
    "postleitzahl": "6020",
    "ort": "Innsbruck",
    "land": "Österreich",
    "suggest": {
        "input": [
            "johannes",
            "müller",
            "maria-theresien",
            "22"
        ],
        "contexts": {
            "mandant": "1"
        }
    }
}

PUT adressen/_doc/00100000000002A00002
{
    "mandant": "1",
    "vorname": "Johanna",
    "nachname": "Mair",
    "strasse": "Langerweg",
    "hausnummer": "22",
    "postleitzahl": "6020",
    "ort": "Innsbruck",
    "land": "Österreich",
    "suggest": {
        "input": [
            "johanna",
            "mair",
            "langer",
            "weg",
            "1"
        ],
        "contexts": {
            "mandant": "1"
        }
    }
}

PUT adressen/_doc/00100000000003A00003
{
    "mandant": "1",
    "vorname": "Mario",
    "nachname": "Mair",
    "strasse": "Langerweg",
    "hausnummer": "1",
    "postleitzahl": "6020",
    "ort": "Innsbruck",
    "land": "Österreich",
    "suggest": {
        "input": [
            "mario",
            "mair",
            "langer",
            "weg",
            "1"
        ],
        "contexts": {
            "mandant": "1"
        }
    }
}

PUT adressen/_doc/00100000000004A00001
{
    "mandant": "1",
    "vorname": "Claudia",
    "nachname": "Steinbrunnen",
    "strasse": "Wiesengasse",
    "hausnummer": "43",
    "postleitzahl": "6020",
    "ort": "Innsbruck",
    "land": "Österreich",
    "suggest": {
        "input": [
            "claudia",
            "steinbrunnen",
            "wiesengasse",
            "wiesen",
            "43"
        ],
        "contexts": {
            "mandant": "1"
        }
    }
}

PUT adressen/_doc/00100000000005A00001
{
    "mandant": "1",
    "vorname": "Markus",
    "nachname": "Johannson",
    "strasse": "Andechstrasse",
    "hausnummer": "4",
    "postleitzahl": "6020",
    "ort": "Innsbruck",
    "land": "Österreich",
    "suggest": {
        "input": [
            "markus",
            "johannson",
            "johanson",
            "andech",
            "4"
        ],
        "contexts": {
            "mandant": "1"
        }
    }
}

// search all
POST adressen/_search
{
    "query": {
        "match_all": {}
    }
}

// search exact match (abbreviation filled in by replace filter)
POST adressen/_search
{
    "query": {
        "match": {
            "strasse": {
                "query": "Wieseng."
            }
        }
    }
}

// search near match using fuzziness
POST adressen/_search
{
    "query": {
        "match": {
            "strasse": {
                "query": "Wiesngassl",
                "fuzziness": "AUTO"
            }
        }
    }
}

// search match in multiple fields
POST adressen/_search
{
    "query": {
        "multi_match" : {
            "query" : "Innsbruck",
            "fields" : ["name", "strasse", "ort", "land"]
        }
    }
}

//search with boolean match and wildcard match
POST adressen/_search
{
    "query": {
        "bool": {
            "should": {
                "match": {
                    "ort": "Innsbruck"
                }
            },
            "must": {
                "wildcard": {
                    "name": "*Mai*"
                }
            }
        }
    },
    "size": 5,
    "from": 0
}

// alle strassen nach Anzahl Eintrage mittels "terms aggregation"
GET adressen/_search
{
    "size": 0, // don't return list of hits
    "aggs": {
        "vornamen": {
            "terms": {
                "field": "vorname",
                "size": 10,
                "include": "jo.*"
            }
        },
        "nachnamen": {
            "terms": {
                "field": "nachname",
                "size": 10,
                "include": "jo.*"
            }
        },
        "strassen": {
            "terms": {
                "field": "strasse.keyword",
                "size": 10,
                "include": "la.*"
            }
        },
        "strassenteile": {
            "terms": {
                "field": "strasse",
                "size": 10,
                "include": "la.*"
            }
        },
        "orte": {
            "terms": {
                "field": "ort",
                "size": 10
            }
        }
    }
}

// query suggestions
POST adressen/_search
{
    "suggest": {
        "name-suggest": {
            "prefix": "joh",
            "completion": {
                "field": "suggest",
                "contexts": {
                    "mandant": 1
                }
            }
        }
    }
}