[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# resultparser

When parsing JSON on client-side, the structure of it attracts most of our attention.  
If the structure evolves over time, it leads to recurring changes in the code that depends on it.

### Features:
* Adapter that takes parsed JSON and transforms it into a standerized structure
* Multiple transformation steps including flattening, deduplication, grouping,...
* Takes descriptions that reflect the incoming structure and configure the standarized output
* Reusable and flexible
* Supports most browser, even ie5

# TODO ----------

### Quickstart
Include the following compile-time-only dependency.
It provides the annotations `@TypeAlias`, `@TypeAliases` to attach alias names,
`@TypeAliasGeneratedFile` for customization and the java annotation processing based file generator,
that generates (by default) the ResourceBundle `TypeAlias.java` inside the default package containing all aliases.

```xml
<dependency>
  <groupId>io.github.joht.alias</groupId>
  <artifactId>type-alias</artifactId>
  <version>1.1.0</version>
  <scope>provided</scope>
  <optional>true</optional>
</dependency>
```

### Contents
- [type-alias](https://github.com/JohT/alias/tree/master/type-alias) 
contains the main module with the java annotation processing based file generator.
- [type-alias-example](https://github.com/JohT/alias/tree/master/type-alias-example) 
shows, how to use and customize "type-alias" code generation.
- [type-alias-axon-serializer](https://github.com/JohT/alias/tree/master/type-alias-axon-serializer)
shows, how to enhance axon serializer to use aliases.
- [type-alias-axon-serializer-integration-test](https://github.com/JohT/alias/tree/master/type-alias-axon-serializer-integration-test)
shows, how to configure axon serializer to use aliases.
