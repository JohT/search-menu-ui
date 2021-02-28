"use strict";

var searchresulttestdata = {};

searchresulttestdata.UserCase = function () {
  //TODO convert and fill in test data from comments below
  function getJson() {
    return {
      responses: [
        {
          hits: {
            total: {
              value: 7
            },
            hits: [
              {
                _source: {
                  iban: "AT424321012345678901",
                  accountnumber: "12345678901",
                  customernumber: "00001234567",
                  tenantnumber: "999",
                  accounttype: "giro",
                  productidentifier: "salary",
                  creationdate: "2020-08-08",
                  lastchangetimestamp: "2020-08-08T08:31:30Z",
                  name: "Hans Mustermann",
                  clerk: "SARCON",
                  currency: "EUR",
                  tags: ["active", "online"]
                },
                highlight: {
                  accountnumber: ["<em>12345678901</em>"],
                  iban: ["<em>AT424321012345678901</em>"]
                }
              },
              {
                _source: {
                  iban: "AT424321012345678905",
                  accountnumber: "12345678905",
                  customernumber: "00001234570",
                  tenantnumber: "999",
                  accounttype: "loan",
                  productidentifier: "priloa",
                  creationdate: "2020-08-08",
                  lastchangetimestamp: "2020-08-08T14:20:30Z",
                  name: "Clare Klammer",
                  clerk: "claken",
                  currency: "CHF",
                  tags: ["active", "short-term"]
                },
                highlight: {
                  accountnumber: ["<em>12345678905</em>"],
                  iban: ["<em>AT424321012345678905</em>"]
                }
              }
            ]
          }
        },
        {
          hits: {
            total: {
              value: 8
            }
          },
          aggregations: {
            accounttype: {
              buckets: [
                {
                  key: "giro",
                  doc_count: 5
                },
                {
                  key: "loan",
                  doc_count: 3
                }
              ]
            },
            clerk: {
              buckets: [
                {
                  key: "claken",
                  doc_count: 4
                },
                {
                  key: "sarcon",
                  doc_count: 3
                },
                {
                  key: "marsom",
                  doc_count: 1
                }
              ]
            },
            currency: {
              buckets: [
                {
                  key: "eur",
                  doc_count: 7
                },
                {
                  key: "chf",
                  doc_count: 1
                }
              ]
            },
            productidentifier: {
              buckets: [
                {
                  key: "salary",
                  doc_count: 2
                },
                {
                  key: "priloa",
                  doc_count: 2
                },
                {
                  key: "comerc",
                  doc_count: 1
                },
                {
                  key: "private",
                  doc_count: 1
                },
                {
                  key: "trust",
                  doc_count: 1
                },
                {
                  key: "housing",
                  doc_count: 1
                }
              ]
            },
            tags: {
              buckets: [
                {
                  key: "active",
                  doc_count: 7
                },
                {
                  key: "short-term",
                  doc_count: 2
                },
                {
                  key: "online",
                  doc_count: 2
                },
                {
                  key: "bullet",
                  doc_count: 1
                },
                {
                  key: "deleted",
                  doc_count: 1
                },
                {
                  key: "long-term",
                  doc_count: 1
                }
              ]
            }
          }
        }
      ]
    };
  }
  return {
    getJson: getJson
  };
}();



// Accounts
/*
{
  "category": "account",
  "type": "summary",
  "abbreviation": "&#x1F4B6;",
  "image": "",
  "index": [
    {},
    {}
  ],
  "displayName": "Kontonummer",
  "fieldName": "kontonummer",
  "value": "12345678901",
  "_isMatchingIndex": true,
  "_description": {
    "type": "summary",
    "category": "account",
    "abbreviation": "&#x1F4B6;",
    "image": ""
  },
  "_identifier": {},
  "summaries": [
    {
      "category": "account",
      "type": "summary",
      "abbreviation": "&#x1F4B6;",
      "image": "",
      "displayName": "Kontonummer",
      "fieldName": "kontonummer",
      "value": "12345678901",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "summary",
      "abbreviation": "&#x1F4B6;",
      "image": "",
      "displayName": "Verfuegungsberechtigt",
      "fieldName": "verfuegungsberechtigt",
      "value": "Hans Mustermann",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "summary",
      "abbreviation": "&#x1F4B6;",
      "image": "",
      "displayName": "Geschaeftsart",
      "fieldName": "geschaeftsart",
      "value": "Giro",
      "_isMatchingIndex": true
    }
  ],
  "details": [
    {
      "category": "account",
      "type": "detail",
      "abbreviation": "&#x1F4B6;",
      "image": "",
      "displayName": "Iban",
      "fieldName": "iban",
      "value": "AT424321012345678901",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "detail",
      "abbreviation": "&#x1F4B6;",
      "image": "",
      "displayName": "Kontonummer",
      "fieldName": "kontonummer",
      "value": "12345678901",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "detail",
      "abbreviation": "&#x1F4B6;",
      "image": "",
      "displayName": "Tags",
      "fieldName": "tags",
      "value": "aktiv",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "detail",
      "abbreviation": "&#x1F4B6;",
      "image": "",
      "displayName": "Tags",
      "fieldName": "tags",
      "value": "online",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "detail",
      "abbreviation": "&#x1F4B6;",
      "image": "",
      "displayName": "Tags",
      "fieldName": "tags_comma_separated_values",
      "value": "aktiv, online",
      "_isMatchingIndex": true
    }
  ]
}
*/


// Filter Options::
/*
[Log] { (restruct-data-client.js, line 17)
  "category": "account",
  "type": "filter",
  "abbreviation": "&#128206;",
  "image": "",
  "index": [
    {},
    {}
  ],
  "displayName": "Produktkennung",
  "fieldName": "produktkennung",
  "value": "gehalt",
  "_isMatchingIndex": true,
  "_description": {
    "type": "filter",
    "category": "account",
    "abbreviation": "&#128206;",
    "image": ""
  },
  "_identifier": {},
  "options": [
    {
      "category": "account",
      "type": "filter",
      "abbreviation": "&#128206;",
      "image": "",
      "displayName": "Produktkennung",
      "fieldName": "produktkennung",
      "value": "gehalt",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "filter",
      "abbreviation": "&#128206;",
      "image": "",
      "displayName": "Produktkennung",
      "fieldName": "produktkennung",
      "value": "privkre",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "filter",
      "abbreviation": "&#128206;",
      "image": "",
      "displayName": "Produktkennung",
      "fieldName": "produktkennung",
      "value": "kommerz",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "filter",
      "abbreviation": "&#128206;",
      "image": "",
      "displayName": "Produktkennung",
      "fieldName": "produktkennung",
      "value": "privkon",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "filter",
      "abbreviation": "&#128206;",
      "image": "",
      "displayName": "Produktkennung",
      "fieldName": "produktkennung",
      "value": "treuhnd",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "filter",
      "abbreviation": "&#128206;",
      "image": "",
      "displayName": "Produktkennung",
      "fieldName": "produktkennung",
      "value": "wohnbau",
      "_isMatchingIndex": true
    }
  ]
}
*/



// Site Options
/*
  "category": "account",
  "type": "main",
  "abbreviation": "&#x261c;",
  "image": "",
  "index": [
    {},
    {}
  ],
  "displayName": "Ziel",
  "fieldName": "name",
  "value": "Kontoübersicht",
  "_isMatchingIndex": true,
  "_description": {
    "type": "main",
    "category": "account",
    "abbreviation": "&#x261c;",
    "image": ""
  },
  "_identifier": {},
  "default": [
    {
      "category": "account",
      "type": "main",
      "abbreviation": "&#x261c;",
      "image": "",
      "displayName": "Ziel",
      "fieldName": "name",
      "value": "Kontoübersicht",
      "_isMatchingIndex": true
    }
  ],
  "urltemplate": [
    {
      "category": "account",
      "type": "url",
      "abbreviation": "&#x261c;",
      "image": "",
      "displayName": "Urltemplate",
      "fieldName": "urltemplate",
      "value": "http://127.0.0.1:5500/index.html#overview-{{summaries.kontonummer}}",
      "_isMatchingIndex": true
    }
  ],
  "options": [
    {
      "category": "account",
      "type": "summary",
      "abbreviation": "&#x261c;",
      "image": "",
      "displayName": "Ziel",
      "fieldName": "name",
      "value": "Sollzinsen",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "summary",
      "abbreviation": "&#x261c;",
      "image": "",
      "displayName": "Ziel",
      "fieldName": "name",
      "value": "Habenzinsen",
      "_isMatchingIndex": true
    },
    {
      "category": "account",
      "type": "summary",
      "abbreviation": "&#x261c;",
      "image": "",
      "displayName": "Ziel",
      "fieldName": "name",
      "value": "Kundenübersicht",
      "_isMatchingIndex": true
    }
  ]
}
*/