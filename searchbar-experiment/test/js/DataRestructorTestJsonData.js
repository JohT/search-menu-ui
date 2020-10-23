"use strict";

var testdata = {};

testdata.UserCase = function () {
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
  /**
   * Public interface
   * @scope testdata.UserCase
   */
  return {
    getJson: getJson
  };
}();
