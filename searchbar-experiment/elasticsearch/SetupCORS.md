# Setup CORS for elasticsearch

Add the following lines to `ES_HOME/config/elasticsearch.yml` to activate
CORS (cross origin resource sharing) for "Live Server" in VS-Code (which runs at localhost port 5500):

```
http.cors.enabled: true
http.cors.allow-origin: http://127.0.0.1:5500
```

A good location inside the configuration file is right under "http.port" in the "Network" section.

This is only a very simple way to configure it and only
meant to be used for local testing purposes.