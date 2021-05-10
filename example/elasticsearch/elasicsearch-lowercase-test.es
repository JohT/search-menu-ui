// example used in https://github.com/elastic/elasticsearch/issues/60566
DELETE test

PUT test
{
    "settings": {
        "analysis": {
            "normalizer": {
                "lowercase_normalizer": {
                    "type": "custom",
                    "filter": [
                        "lowercase"
                    ]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "genre": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer"
            }
        }
    }
}

PUT test/_doc/1?refresh
{
  "genre": "Rock"
}


// store search template script
POST _scripts/count_per_genre_v1
{
    "script": {
        "lang": "mustache",
        "source": {
            "size": 0,
            "aggs": {
                "genres": {
                    "terms": {
                        "field": "genre",
                        "include": "{{genre_prefix}}.*"
                    }
                }
            }
        }
    }
}

// no returns results because of mixed-case parameter
GET test/_search/template
{
    "id": "count_per_genre_v1",
    "params": {
        "genre_prefix": "Ro"
    }
}

// returns results because of manually up-front lowercased parameter
GET test/_search/template
{
    "id": "count_per_genre_v1",
    "params": {
        "genre_prefix": "ro"
    }
}