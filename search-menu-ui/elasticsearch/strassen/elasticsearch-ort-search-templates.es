//Search templates for "Strassen"
//Suche aller unterschiedlicher Orte mit je einem Strassen-Beispiel
 
// Test a search template (e.g. how mustache fills in parameters):
GET strassen/_search/template
{
    "source": {
        "size": 0, // don't return a list of hits
        "aggs": {
            "orte": {
                "terms": {
                    "field": "ort",
                    "size": "{{ort_size}}",
                    "include": "{{ort_prefix}}.*"
                },
                "aggs": {
                    "example": {
                        "top_hits": {
                            "_source":["postleitzahl", "ort", "bundesland"],
                            "size": 10
                    }
                    }
                }
            }
        }
    },
    "params": {
        "ort_prefix": "inn",
        "ort_size": 2
    }
}

// store search template script
POST _scripts/ort_complete_prefix_v1
{
  "script": {
    "lang": "mustache",
    "source": {
        "size": 0, // don't return a list of hits
        "aggs": {
            "orte": {
                "terms": {
                    "field": "ort",
                    "size": "{{ort_size}}",
                    "include": "{{ort_prefix}}.*"
                },
                "aggs": {
                    "example": {
                        "top_hits": {
                            "_source":["postleitzahl", "ort", "bundesland"],
                            "size": 10
                    }
                    }
                }
            }
        }
    }
  }
}

//show stored search template script
GET _scripts/ort_complete_prefix_v1

//?q=elasticsearch&filter_path=suggest.ort.options.text,suggest.strassen.options._id,suggest.strassen.options._source
//run stored search template script with given parameters and filtered response
GET strassen/_search/template
{
    "id": "ort_complete_prefix_v1",
    "params": {
        "ort_prefix": "in",
        "ort_size": 10
    }
}