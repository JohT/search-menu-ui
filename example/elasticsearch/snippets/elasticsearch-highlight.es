// Example from
// https://stackoverflow.com/questions/59677406/how-do-i-get-elasticsearch-to-highlight-a-partial-word-from-a-search-as-you-type

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