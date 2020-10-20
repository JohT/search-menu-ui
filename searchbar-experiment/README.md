[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# resultparser

When parsing JSON on client-side, the structure of it attracts most of our attention.  
If the structure evolves over time, it leads to recurring changes in the code that depends on it.

## Features:
* Adapter that takes parsed JSON and transforms it into a standerized structure
* Multiple transformation steps including flattening, deduplication and grouping
* Takes descriptions that reflect the incoming structure and configure the standarized output
* Reusable and flexible
* Supports most browser including ie5

## Quickstart
Copy `resultparser.js` into your source folder. NPM not yet supported (Oct. 2020).  

## Example
As a starting point you may have a look at the following example.

### Input Object
```json
{
    "responses": [
        {
            "hits": {
                "total": {
                    "value": 1
                },
                "hits": [
                    {
                        "_source": {
                            "iban": "AT424321012345678901",
                            "accountnumber": "12345678901",
                            "customernumber": "00001234567",
                            "currency": "USD",
                            "tags": [
                                "active",
                                "online"
                            ]
                        }
                    }
                ]
            }
        }
    ]
}
```

### Code
```javascript
function restructureJson(jsonData) {
  var allDescriptions = [];
  allDescriptions.push(summariesDescription());
  allDescriptions.push(detailsDescription());
  return resultparser.Parser.processJsonUsingDescriptions(jsonData, allDescriptions));
}

function summariesDescription() {
  return new resultparser.PropertyStructureDescriptionBuilder()
    .type("summary")
    .category("account")
    .propertyPatternEqualMode()
    .propertyPattern("responses.hits.hits._source.accountnumber")
    .groupName("summaries")
    .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
    .build();
}

function detailsDescription() {
  return new resultparser.PropertyStructureDescriptionBuilder()
    .type("detail")
    .category("account")
    .propertyPatternTemplateMode()
    .propertyPattern("responses.hits.hits._source.{{fieldName}}")
    .groupName("details")
    .groupPattern("{{category}}--{{type}}--{{id[0]}}--{{id[1]}}")
    .groupDestinationPattern("Konto--summary--{{id[0]}}--{{id[1]}}")
    .build();
  }
```

### Output Java Object
An Javascript object with this structure and content is returned, 
when the function `restructureJson` from above is called:
```yaml
category: "account"
displayName: "Accountnumber"
fieldName: "accountnumber"
type: "summary"
value: "12345678901"
details:
  - category: "account"
    type: "detail"  
    displayName: "Iban"
    fieldName: "iban"
    value: "AT424321012345678901"
  - category: "account"
    type: "detail"
    displayName: "Accountnumber"
    fieldName: "accountnumber"
    value: "12345678901"
  - category: "Konto"
    type: "detail"
    displayName: "Customernumber"
    fieldName: "customernumber"
    value: "00001234567"
  - category: "Konto"
    type: "detail"
    displayName: "Currency"
    fieldName: "currency"
    value: "USD"
  - category: "Konto"
    type: "detail"
    displayName: "Tags"
    fieldName: "tags"
    value: "active"
  - category: "Konto"
    type: "detail"
    displayName: "Tags"
    fieldName: "tags"
    value: "online"
  - category: "Konto"
    type: "detail"
    displayName: "Tags"
    fieldName: "tags_comma_separated_values"
    value: "active, online"
```

## Transformation Steps:

### 1. Flatten hierarchical data object 
The input data object, e.g. parsed from JSON, is converted to an array of point separated property names and their values. 
For example this structure...
```json
{
    "responses": [
        {
            "hits": {
                "total": {
                    "value": 1
                },
                "hits": [
                    {
                        "_source": {
                            "accountnumber": "123"
                        }
                    }
                ]
            }
        }
    ]
}
```
...is flattened to...
```
responses[0].hits.total.value=1
responses[0].hits.hits[0]._source.accountnumber=123
```

### 2. Add array value properties ending with "_comma_separated_values"
To make it easier to e.g. display array values like tags,
an additional property is added that combines the array values to a single property,
that contains the values in a comma separated way. 
This newly created property gets the name of the array property followed by "_comma_separated_values" 
and is inserted right after the single array values.

For example these lines...
```
responses[0].hits.total.value=1
responses[0].hits.hits[0]._source.tags[0]=active
responses[0].hits.hits[0]._source.tags[1]=online
```
...will lead to an additional property that looks like this... 
```
responses[0].hits.hits[0]._source.tags_comma_separated_values=active, online
```

### 3. Attach description to matching properties 
For every given description, all properties are searched for matches. 
The description builder accepts the following ways to configure property matching:

- Equal Mode (default):  
The propertyname needs to match the described pattern exactly. It is not needed to set equal mode.  
Example:
   ```javascript
   new resultparser.PropertyStructureDescriptionBuilder()
   .propertyPatternEqualMode()
   .propertyPattern("responses.hits.hits._source.accountnumber")
   ...
  ```
- Pattern Mode:  
The propertyname needs to start with the described pattern. 
The pattern may contain variables inside double curly brackets.  
The variable `{{fieldName}}` is a special case which describes from where the fieldname should be taken.  
Example:  
   ```javascript
   new resultparser.PropertyStructureDescriptionBuilder()
   .propertyPatternTemplateMode()
   .propertyPattern("responses.hits.hits._source.{{fieldName}}")
   ...
  ```


# TODO ----------



### Contents
- [type-alias](https://github.com/JohT/alias/tree/master/type-alias) 
contains the main module with the java annotation processing based file generator.
- [type-alias-example](https://github.com/JohT/alias/tree/master/type-alias-example) 
shows, how to use and customize "type-alias" code generation.
- [type-alias-axon-serializer](https://github.com/JohT/alias/tree/master/type-alias-axon-serializer)
shows, how to enhance axon serializer to use aliases.
- [type-alias-axon-serializer-integration-test](https://github.com/JohT/alias/tree/master/type-alias-axon-serializer-integration-test)
shows, how to configure axon serializer to use aliases.
