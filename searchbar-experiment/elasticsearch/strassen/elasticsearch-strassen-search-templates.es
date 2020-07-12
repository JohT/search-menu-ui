//Search templates for "Strassen"

// Test a search template (e.g. how mustache fills in parameters):
GET strassen/_search/template
{
    "source": {
        "_source": [
            "strassenname",
            "postleitzahl",
            "ort",
            "bundesland"
        ],
        "suggest": {
            "strassen": {
                "prefix": "{{strassen_prefix}}",
                "completion": {
                    "field": "strassenname.suggest",
                    "size": "{{strassen_size}}",
                    "skip_duplicates": true,
                    "fuzzy": {}
                }
            }
        }
    },
    "params": {
        "strassen_prefix": "the",
        "strassen_size": 5
    }
}

// store search template script
POST _scripts/strassen_complete_prefix_v1
{
  "script": {
    "lang": "mustache",
    "source": {
        "_source": [
            "strassenname",
            "postleitzahl",
            "ort",
            "bundesland"
        ],
        "suggest": {
            "strassen": {
                "prefix": "{{strassen_prefix}}",
                "completion": {
                    "field": "strassenname.suggest",
                    "size": "{{strassen_size}}",
                    "skip_duplicates": true,
                    "fuzzy": {}
                }
            }
        }
    }
  }
}

//show stored search template script
GET _scripts/strassen_complete_prefix_v1

//run stored search template script with given parameters and filtered response
GET strassen/_search/template?q=elasticsearch&filter_path=suggest.strassen.options.text,suggest.strassen.options._id,suggest.strassen.options._source
{
    "id": "strassen_complete_prefix_v1",
    "params": {
        "strassen_prefix": "there",
        "strassen_size": 10
    }
}