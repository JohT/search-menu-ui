"use strict";

var searchresulttestdata = module.exports={} || {};

searchresulttestdata.SearchResult = (function () {
  function getAccounts() {
    return {
      category: "account",
      type: "summary",
      abbreviation: "&#x1F4B6;",
      displayName: "Accountnumber",
      fieldName: "accountnumber",
      value: "12345678901",
      summaries: [
        {
          category: "account",
          type: "summary",
          abbreviation: "&#x1F4B6;",
          displayName: "Accountnumber",
          fieldName: "accountnumber",
          value: "12345678901"
        },
        {
          category: "account",
          type: "summary",
          abbreviation: "&#x1F4B6;",
          image: "",
          displayName: "Name",
          fieldName: "name",
          value: "John Doe"
        },
        {
          category: "account",
          type: "summary",
          abbreviation: "&#x1F4B6;",
          image: "",
          displayName: "Accounttype",
          fieldName: "accounttype",
          value: "Giro"
        }
      ],
      details: [
        {
          category: "account",
          type: "detail",
          abbreviation: "&#x1F4B6;",
          displayName: "Iban",
          fieldName: "iban",
          value: "AT424321012345678901"
        },
        {
          category: "account",
          type: "detail",
          abbreviation: "&#x1F4B6;",
          image: "",
          displayName: "Accountnumber",
          fieldName: "accountnumber",
          value: "12345678901"
        },
        {
          category: "account",
          type: "summary",
          abbreviation: "&#x1F4B6;",
          image: "",
          displayName: "Name",
          fieldName: "name",
          value: "John Doe"
        },
        {
          category: "account",
          type: "summary",
          abbreviation: "&#x1F4B6;",
          image: "",
          displayName: "Accounttype",
          fieldName: "accounttype",
          value: "Giro"
        },
        {
          category: "account",
          type: "detail",
          abbreviation: "&#x1F4B6;",
          displayName: "Tags",
          fieldName: "tags",
          value: "aktiv"
        },
        {
          category: "account",
          type: "detail",
          abbreviation: "&#x1F4B6;",
          displayName: "Tags",
          fieldName: "tags",
          value: "online"
        },
        {
          category: "account",
          type: "detail",
          abbreviation: "&#x1F4B6;",
          displayName: "Tags",
          fieldName: "tags_comma_separated_values",
          value: "aktiv, online"
        }
      ]
    };
  }
  function getProductFilerOptions() {
    return {
      category: "account",
      type: "filter",
      abbreviation: "&#128206;",
      displayName: "Product",
      fieldName: "product",
      value: "salary",
      options: [
        {
          category: "account",
          type: "filter",
          abbreviation: "&#128206;",
          displayName: "Product",
          fieldName: "product",
          value: "salary"
        },
        {
          category: "account",
          type: "filter",
          abbreviation: "&#128206;",
          displayName: "Product",
          fieldName: "product",
          value: "loan"
        },
        {
          category: "account",
          type: "filter",
          abbreviation: "&#128206;",
          displayName: "Product",
          fieldName: "product",
          value: "trust"
        }
      ]
    };
  }
  function getCurrencyFilterOptions() {
    return {
      category: "account",
      type: "filter",
      abbreviation: "&#128206;",
      displayName: "Currency",
      fieldName: "currency",
      value: "EUR",
      options: [
        {
          category: "account",
          type: "filter",
          abbreviation: "&#128206;",
          displayName: "Currency",
          fieldName: "currency",
          value: "EUR"
        },
        {
          category: "account",
          type: "filter",
          abbreviation: "&#128206;",
          displayName: "Currency",
          fieldName: "currency",
          value: "CHF"
        },
        {
          category: "account",
          type: "filter",
          abbreviation: "&#128206;",
          displayName: "Currency",
          fieldName: "currency",
          value: "USD"
        }
      ]
    };
  }
  function getSites() {
    return {
      category: "account",
      type: "main",
      abbreviation: "&#x261c;",
      displayName: "Ziel",
      fieldName: "name",
      value: "account overview",
      default: [
        {
          category: "account",
          type: "main",
          abbreviation: "&#x261c;",
          displayName: "Ziel",
          fieldName: "name",
          value: "account overview",
          urltemplate: [
            {
              category: "account",
              type: "url",
              abbreviation: "&#x261c;",
              displayName: "Urltemplate",
              fieldName: "urltemplate",
              value: "http://127.0.0.1:5500/index.html#overview-{{summaries.accountnumber}}"
            }
          ]
        }
      ],
      urltemplate: [
        {
          category: "account",
          type: "url",
          abbreviation: "&#x261c;",
          displayName: "Urltemplate",
          fieldName: "urltemplate",
          value: "http://127.0.0.1:5500/index.html#overview-{{summaries.accountnumber}}"
        }
      ],
      options: [
        {
          category: "account",
          type: "summary",
          abbreviation: "&#x261c;",
          displayName: "Ziel",
          fieldName: "name",
          value: "debit interest",
          urltemplate: [
            {
              category: "account",
              type: "url",
              abbreviation: "&#x261c;",
              displayName: "Urltemplate",
              fieldName: "urltemplate",
              value: "http://127.0.0.1:5500/index.html#debit-interest-{{summaries.accountnumber}}"
            }
          ]
        },
        {
          category: "account",
          type: "summary",
          abbreviation: "&#x261c;",
          displayName: "Ziel",
          fieldName: "name",
          value: "credit interest",
          urltemplate: [
            {
              category: "account",
              type: "url",
              abbreviation: "&#x261c;",
              displayName: "Urltemplate",
              fieldName: "urltemplate",
              value: "http://127.0.0.1:5500/index.html#credit-interest-{{summaries.accountnumber}}"
            }
          ]
        }
      ]
    };
  }
  return {
    getJson: function () {
      return [getAccounts(), getProductFilerOptions(), getCurrencyFilterOptions(), getSites()];
    }
  };
}());