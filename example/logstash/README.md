# search-menu-ui-example - logstash

This example shows how to use [logstash][logstash] 

## Getting started
 - Open a terminal/command window
 - Prepare H2 Database
    - Download the newest version of the [H2 Database Engine][H2 Database Engine Download]
    - Locate the downloaded jar
    - Start the h2 database server using:   
    ```java -cp h2*.jar org.h2.tools.Server -tcpAllowOthers -ifNotExists```
    - Open another terminal/command window. Don't close the one where the h2 server is running
    - Open the directory where this document is located
    - Create the database, the example table for accounts and some data by running:   
    ```java -cp path/to/h2*.jar org.h2.tools.RunScript -url jdbc:h2:tcp://localhost/mem:search-menu-ui-example -script search-menu-ui-example.sql -user sa -password sa```
 - Alternatively, any other database can be used as well. 
    - Run [search-menu-ui-example.sql](search-menu-ui-example.sql) to create the example table with some data. The SQL is held as common as possible but might need some adaption for some databases.
 - Download [logstash opensource][logstash opensource download]
 - Open the directory where this document is located
 - Run ```logstash -f search-menu-ui-example.conf``` 

## References:
- [logstash][logstash]
- [logstash-jdbc-input-plugin blog][logstash-jdbc-input-plugin blog]
- [H2 Database][H2 Database]

[logstash]: https://www.elastic.co/de/logstash
[logstash opensource download]: https://www.elastic.co/de/downloads/logstash-oss
[logstash-jdbc-input-plugin blog]: https://www.elastic.co/de/blog/logstash-jdbc-input-plugin

[H2 Database]: http://www.h2database.com/html/main.html
[H2 Database Engine Download]: https://mvnrepository.com/artifact/com.h2database/h2