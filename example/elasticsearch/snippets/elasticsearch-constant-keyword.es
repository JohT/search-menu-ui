// This test shows how "constant_keyword" could be used.
// Similar to "alias", this type is not stored and therefore
// not shown in the result "_source".

DELETE /constantkeywordtest 

// index setup including constant_keyword
PUT /constantkeywordtest
{
    "mappings": {
        "properties": {
            "message": {
                "type": "text"
            },
            "constant": {
                "type": "constant_keyword",
                "value": "immutable"
            },
            "constantalias": {
                "type": "alias",
                "path": "constant"
            },
            "messagealias": {
                "type": "alias",
                "path": "message"
            }
        }
    }
}

GET constantkeywordtest

PUT constantkeywordtest/_doc/1
{
  "message": "Should have a second property named 'constant' with value 'immutable'."
}

GET constantkeywordtest/_doc/1

PUT constantkeywordtest/_doc/2
{
  "message": "Should not work, since an constant field can't be changed",
  "constant": "something-else"
}

POST constantkeywordtest/_search
{
    "query": {
        "match_all": {}
    }
}

POST constantkeywordtest/_search
{
    "query": {
        "match": {
            "constant": {
                "query": "immutable"
            }
        }
    }
}
