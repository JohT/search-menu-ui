// This test shows how "alias" fields could be used.
// Similar to "constant_keyword", this type is not stored and therefore
// not shown in the result "_source".

DELETE /aliasfieldtest 

// index setup including constant_keyword
PUT /aliasfieldtest
{
    "mappings": {
        "properties": {
            "message": {
                "type": "text"
            },
            "messagealias": {
                "type": "alias",
                "path": "message"
            }
        }
    }
}

GET aliasfieldtest

PUT aliasfieldtest/_doc/1
{
  "message": "Should also have a second property named 'messagealias' with this text."
}

GET aliasfieldtest/_doc/1

POST aliasfieldtest/_search
{
    "query": {
        "match_all": {}
    }
}

// Alias can be used to filter queries, but isn't shown in the result _source.
POST aliasfieldtest/_search
{
    "query": {
        "multi_match": {
            "query": "Should",
            "type": "bool_prefix",
            "fields": "messagealias"
        }
    }
}
