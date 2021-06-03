# search-example-servlet project

This example shows how to write a java servlet that delegates the incoming request to elasticsearch. It should work with any standard servlet container.
[Quarkus][Quarkus] had been chosen because it simplifies setup for examples like that. 

It build upon the search menu example UI in the outer directory.

The servlet source code can be found here: [MultiSearchTemplateServlet.java](/src/main/java/io/github/joht/search/example/servlet/MultiSearchTemplateServlet.java).

This is only a very simple example to get started. It doesn't accept other requests than multi template searches, doesn't include TLS (SSL) setup, has no additional authentication or authorization setup, .... 
## Running the application in dev mode

You can run your application in dev mode that enables live coding using:
```shell script
./mvnw compile quarkus:dev
```

The development UI is available in dev mode only at http://localhost:8080/q/dev/.

## Packaging and running the application

The application can be packaged using:
```shell script
./mvnw package
```
It produces the `quarkus-run.jar` file in the `target/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/quarkus-app/lib/` directory.

If you want to build an _über-jar_, execute the following command:
```shell script
./mvnw package -Dquarkus.package.type=uber-jar
```

The application is now runnable using `java -jar target/quarkus-app/quarkus-run.jar`.

## Creating a native executable

You can create a native executable using: 
```shell script
./mvnw package -Pnative
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using: 
```shell script
./mvnw package -Pnative -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./target/search-example-servlet-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult https://quarkus.io/guides/maven-tooling.html.


## Setup Commands 

These commands were used in a bash shell with maven to setup this example:
```shell script
mvn io.quarkus:quarkus-maven-plugin:1.13.5.Final:create \
    -DprojectGroupId=io.github.joht.search.example.servlet \
    -DprojectArtifactId=search-example-servlet \
    -DclassName="org.acme.getting.started.GreetingResource" \
    -Dpath="/hello"
cd search-example-servlet
mvn quarkus:add-extension -Dextensions="elasticsearch-rest-client"
```

# Credits

 - [Quarkus], the Supersonic Subatomic Java Framework.
 - [yuicompressor-maven-plugin](https://github.com/davidB/yuicompressor-maven-plugin), maven's plugin to compress (Minify / Ofuscate / Aggregate) Javascript files and CSS files using YUI Compressor
 - [replacer](https://code.google.com/archive/p/maven-replacer-plugin/) Maven Plugin to replace tokens within a file with a given value

[Quarkus]: https://quarkus.io
