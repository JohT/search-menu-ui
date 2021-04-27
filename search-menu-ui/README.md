[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# DataRestructorJS

When parsing JSON on client-side, the structure of it attracts most of our attention.  
If the structure evolves over time, it leads to recurring changes in the code that depends on it.

## Features:
* Adapter that takes e.g. parsed JSON and transforms it into a standardized structure
* Multiple transformation steps including flattening, removing duplicates, grouping, ...
* Takes descriptions that reflect the incoming structure and define the standardized output
* Reusable and flexible
* Supports most browser including ie5

## Not intended when 
* a "backend for frontend" exists, that is responsible to deliver the structure and content the way the client needs it.
* the structure of the data is already stable, well abstracted and/or rather generic. 
* the code, that depends on the structure of the data can easily be changed (only a view lines, same team, ...).

## Quickstart
Copy `datarestructor.js` into your source folder. NPM not yet supported (Oct. 2020).  

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
  return datarestructor.Restructor.processJsonUsingDescriptions(jsonData, allDescriptions));
}

function summariesDescription() {
  return new datarestructor.PropertyStructureDescriptionBuilder()
    .type("summary")
    .category("account")
    .propertyPatternEqualMode()
    .propertyPattern("responses.hits.hits._source.accountnumber")
    .groupName("summaries")
    .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
    .build();
}

function detailsDescription() {
  return new datarestructor.PropertyStructureDescriptionBuilder()
    .type("detail")
    .category("account")
    .propertyPatternTemplateMode()
    .propertyPattern("responses.hits.hits._source.{{fieldName}}")
    .groupName("details")
    .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
    .groupDestinationPattern("account--summary--{{index[0]}}--{{index[1]}}")
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
If a description matches a property, the description gets attached to it.
This can be used to categorize and filter properties.
The description builder accepts these ways to configure property matching:

- Equal Mode (default):  
The property name needs to match the described pattern exactly. It is not needed to set equal mode.  
Example:
   ```javascript
   new datarestructor.PropertyStructureDescriptionBuilder()
   .propertyPatternEqualMode()
   .propertyPattern("responses.hits.hits._source.accountnumber")
   ...
  ```
- Pattern Mode:  
The property name needs to start with the described pattern. 
The pattern may contain variables inside double curly brackets.  
The variable `{{fieldName}}` is a special case which describes from where the fieldname should be taken.
This mode needs to set using `propertyPatternTemplateMode`, since the default mode is `propertyPatternEqualMode`.
Example:  
   ```javascript
   new datarestructor.PropertyStructureDescriptionBuilder()
   .propertyPatternTemplateMode()
   .propertyPattern("responses.hits.hits._source.{{fieldName}}")
   ...
  ```
- Index Matching (Optional):  
If the source data is structured in an top level array and all property names look pretty much the same 
it may be needed to describe data based on the array index. 
The index of an property is taken out of its array qualifiers.  
For example, the property name `responses[0].hits.hits[1]._source.tags[2]` has the index `0.1.2`.  
Index Matching can be combined with property name matching.
This example restricts the description to the first top level array:  
   ```javascript
   new datarestructor.PropertyStructureDescriptionBuilder()
   .indexStartsWith("0.")
   ...
  ```

### 4. Removing duplicates (deduplication):
To remove duplicate properties or to override properties with other ones when they exist,
a `deduplicationPattern` can be defined.<br/><br/>
Variables (listed below) are put into double curly brackets and will be replaced with the contents 
of the description and the matching property.  
If there are two entries with the same resolved `deduplicationPattern` (=`_identifier.deduplicationId`),
the second one will override the first (the first one will be removed). 
Example:
   ```javascript
   new datarestructor.PropertyStructureDescriptionBuilder()
   .deduplicationPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}--{{fieldName}}")
   ...
  ```

### 5. Grouping:
Since data had been flattened in the step 1., it is structured as a list of property names and their values.
This non-hierarchical structure is ideal to add further properties, attach descriptions and remove duplicates.
After all, a fully flat structure might not be suitable to display overviews/details or to collect options. <br/><br/>
The `groupName` defines the name of the group attribute (defaults to "group" if not set). <br/><br/>
The `groupPattern` describes, which properties belong to the same group.  
Variables (listed below) are put into double curly brackets and will be replaced with the contents 
of the description and the matching property.  
The `groupPattern` will be resolved to the `_identifier.groupId`. Every property, that leads to a
new groupId gets a new attribute named by the `groupName`, where this entry and all others of the
same group will be put into. Example:  
   ```javascript
   new datarestructor.PropertyStructureDescriptionBuilder()
   .groupName("details")
   .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
   ...
  ```

### 6. Moving groups (destination group):
After grouping in step 5., every property containing a group and the remaining non-grouped properties 
are listed one after another. To organize them further, groups can be moved to another (destination) group. <br/><br/>
The `groupDestinationPattern` contains the pattern of the group to where the own group should be moved.
Variables (listed below) are put into double curly brackets and will be replaced with the contents 
of the description and the matching property.  
Example, where the details group is moved to the summary, because the group destination pattern 
of the details resolves to the same id as the resolved group pattern of the summary: 
   ```javascript
  var summaryDescription = new datarestructor.PropertyStructureDescriptionBuilder()
    .category("account")
    .type("summary")
    .groupName("summaries")
    .groupPattern("{{category}}--{{type}}--{{index[0]}}--{{index[1]}}")
    ...

  var detailsDescription = new datarestructor.PropertyStructureDescriptionBuilder()
   .groupDestinationPattern("account--summary--{{index[0]}}--{{index[1]}}")
   ...
  ```

## Types, fields, variables:
This section lists the types and their fields in detail (mostly taken from jsdoc).
Every field can be used as variable in double curly brackets inside pattern properties.
Additionally, single elements of the index can be used by specifying the index position e.g. `{{index[0]}}` (first), `{{index[1]}}` (second),...


### PropertyStructureDescription (input description)

 * **type** - ""(default). Some examples: "summary" for e.g. a list overview. "detail" e.g. when a summary is selected. "filter" e.g. for field/value pair results that can be selected as search parameters.
 * **category** - name of the category. Default = "". Could contain a symbol character or a short domain name. (e.g. "city")
 * **propertyPatternTemplateMode** - boolean "false"(default): property name needs to be equal to the pattern. "true" allows variables like "{{fieldname}}" inside the pattern.
 * **propertyPattern** - property name pattern (without array indices) to match
 * **indexStartsWith** - ""(default) matches all ids. String that needs to match the beginning of the id. E.g. "1." will match id="1.3.4" but not "0.1.2".
 * **groupName** - name of the property, that contains grouped entries. Default="group".
 * **groupPattern** - Pattern that describes how to group entries. "groupName" defines the name of this group. A pattern may contain variables in double curly brackets {{variable}}.
 * **groupDestinationPattern** - Pattern that describes where the group should be moved to. Default=""=Group will not be moved. A pattern may contain variables in double curly brackets {{variable}}.
 * **deduplicationPattern** - Pattern to use to remove duplicate entries. A pattern may contain variables in double curly brackets {{variable}}.


### DescribedEntry (output element)

#### Public fields
 * **category** - category of the result from the PropertyStructureDescription using a short name or e.g. a symbol character
 * **type** - type of the result from PropertyStructureDescription
 * **displayName** - display name extracted from the point separated hierarchical property name, e.g. "Name"
 * **fieldName** - field name extracted from the point separated hierarchical property name, e.g. "name"
 * **value** - content of the field

#### Public functions
 * **resolveTemplate** - resolves the given template string. The template may contain variables in double curly brackets. Supported variables are all properties of this object, e.g. `"{{fieldName}}"`, `"{{displayName}}"`, `"{{value}}"`. The index can also be inserted using `"{{index}}"`, parts of the index using e.g. `"{{index[1]}}"`.

#### Described groups
 * **"name of described group"** as described in PropertyStructureDescription
 * **"names of moved groups"** as described in PropertyStructureDescription of another group that had been moved

#### Internal fields (should be avoided if possible, since they may change)
 * **isMatchingIndex** - true, if _identifier.index matches the described "indexStartsWith"
 * **_identifier** - internal structure for identifier. Avoid using it outside since it may change.
 * **_identifier.index** - array indices in hierarchical order separated by points, e.g. "0.0"
 * **_identifier.value** - the (single) value of the "flattened" property, e.g. "Smith"
 * **_identifier.propertyNamesWithArrayIndices** - the "original" flattened property name in hierarchical order separated by points, e.g. "responses[0].hits.hits[0]._source.name"
 * **_identifier.propertyNameWithoutArrayIndices** - same as propertyNamesWithArrayIndices but without array indices, e.g. "responses.hits.hits._source.name"
 * **_identifier.groupId** - Contains the resolved groupPattern from the PropertyStructureDescription. Entries with the same id will be grouped into the "groupName" of the PropertyStructureDescription.
 * **_identifier.groupDestinationId** - Contains the resolved groupDestinationPattern from the PropertyStructureDescription. Entries with this id will be moved to the given destination group.
 * **_identifier.deduplicationId** - Contains the resolved deduplicationPattern from the PropertyStructureDescription. Entries with the same id will be considered to be a duplicate and hence removed.
 * **_description** - PropertyStructureDescription for internal use. Avoid using it outside since it may change.

