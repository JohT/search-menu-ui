function getTestDataJson() {
  return {
    responses: [
      {
        hits: {
          total: {
            value: 7,
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
                tags: ["active", "online"],
              },
              highlight: {
                accountnumber: ["<em>12345678901</em>"],
                iban: ["<em>AT424321012345678901</em>"],
              },
            },
            {
              _source: {
                iban: "AT424321012345678907",
                accountnumber: "12345678907",
                customernumber: "00001234571",
                tenantnumber: "999",
                accounttype: "giro",
                productidentifier: "trust",
                creationdate: "2020-08-09",
                lastchangetimestamp: "2020-08-09T08:20:30Z",
                name: "Carlo Martinez",
                clerk: "SARCON",
                currency: "EUR",
                tags: ["active"],
              },
              highlight: {
                accountnumber: ["<em>12345678907</em>"],
                iban: ["<em>AT424321012345678907</em>"],
              },
            },
            {
              _source: {
                iban: "AT424321012345678903",
                accountnumber: "12345678903",
                customernumber: "00001234569",
                tenantnumber: "999",
                accounttype: "loan",
                productidentifier: "housing",
                creationdate: "2020-08-08",
                lastchangetimestamp: "2020-08-08T08:42:30Z",
                name: "Carlo Solér",
                clerk: "SARCON",
                currency: "EUR",
                tags: ["deleted", "bullet", "long-term"],
              },
              highlight: {
                accountnumber: ["<em>12345678903</em>"],
                iban: ["<em>AT424321012345678903</em>"],
              },
            },
            {
              _source: {
                iban: "AT424321012345678902",
                accountnumber: "12345678902",
                customernumber: "00001234568",
                tenantnumber: "999",
                accounttype: "giro",
                productidentifier: "comerc",
                creationdate: "2020-08-08",
                lastchangetimestamp: "2020-08-08T08:37:30Z",
                name: "Romed Giner",
                inhaber: "Giner KG",
                clerk: "claken",
                currency: "EUR",
                tags: ["active", "online"],
              },
              highlight: {
                accountnumber: ["<em>12345678902</em>"],
                iban: ["<em>AT424321012345678902</em>"],
              },
            },
            {
              _source: {
                iban: "AT424321012345678904",
                accountnumber: "12345678904",
                customernumber: "00001234569",
                tenantnumber: "999",
                accounttype: "giro",
                productidentifier: "private",
                creationdate: "2020-08-08",
                lastchangetimestamp: "2020-08-08T08:58:30Z",
                name: "Romed Giner",
                clerk: "claken",
                currency: "EUR",
                tags: ["active"],
              },
              highlight: {
                accountnumber: ["<em>12345678904</em>"],
                iban: ["<em>AT424321012345678904</em>"],
              },
            },
            {
              _source: {
                iban: "AT424321012345678908",
                accountnumber: "12345678908",
                customernumber: "00001234572",
                tenantnumber: "999",
                accounttype: "giro",
                productidentifier: "salary",
                creationdate: "2020-08-09",
                lastchangetimestamp: "2020-08-09T08:22:30Z",
                name: "Carmen Martin",
                clerk: "claken",
                currency: "EUR",
                tags: ["active"],
              },
              highlight: {
                accountnumber: ["<em>12345678908</em>"],
                iban: ["<em>AT424321012345678908</em>"],
              },
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
                tags: ["active", "short-term"],
              },
              highlight: {
                accountnumber: ["<em>12345678905</em>"],
                iban: ["<em>AT424321012345678905</em>"],
              },
            },
          ],
        },
      },
      {
        hits: {
          total: {
            value: 8,
          },
        },
        aggregations: {
          accounttype: {
            buckets: [
              {
                key: "giro",
                doc_count: 5,
              },
              {
                key: "loan",
                doc_count: 3,
              },
            ],
          },
          clerk: {
            buckets: [
              {
                key: "claken",
                doc_count: 4,
              },
              {
                key: "sarcon",
                doc_count: 3,
              },
              {
                key: "marsom",
                doc_count: 1,
              },
            ],
          },
          currency: {
            buckets: [
              {
                key: "eur",
                doc_count: 7,
              },
              {
                key: "chf",
                doc_count: 1,
              },
            ],
          },
          productidentifier: {
            buckets: [
              {
                key: "salary",
                doc_count: 2,
              },
              {
                key: "priloa",
                doc_count: 2,
              },
              {
                key: "comerc",
                doc_count: 1,
              },
              {
                key: "private",
                doc_count: 1,
              },
              {
                key: "trust",
                doc_count: 1,
              },
              {
                key: "housing",
                doc_count: 1,
              },
            ],
          },
          tags: {
            buckets: [
              {
                key: "active",
                doc_count: 7,
              },
              {
                key: "short-term",
                doc_count: 2,
              },
              {
                key: "online",
                doc_count: 2,
              },
              {
                key: "bullet",
                doc_count: 1,
              },
              {
                key: "deleted",
                doc_count: 1,
              },
              {
                key: "long-term",
                doc_count: 1,
              },
            ],
          },
        },
      },
    ],
  };
}
