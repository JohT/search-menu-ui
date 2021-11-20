package io.github.joht.search.example.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Map.Entry;
import java.util.logging.Logger;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import org.apache.http.HttpEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.nio.entity.NStringEntity;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RequestOptions.Builder;

/**
 * Creates an elasticsearch low level REST client {@link Request} based on the given
 * {@link HttpServletRequest}.
 */
class SearchRequestAdapter {

    private static final Logger LOGGER = Logger.getLogger(SearchRequestAdapter.class.getName());

    private static final List<String> ALLOWED_HEADERS =
            Arrays.asList("Accept", "Accept-Encoding", "Accept-Language", "Authorization", "Connection", "Contest-Length", "es-secondary-authorization", "Host", "Origin", "Referer", "User-Agent");

    private static final Pattern CONTROL_CHARACTERS = Pattern.compile("\\p{Cntrl}");

    private final HttpServletRequest httpRequest;
    private final Collection<String> allowedHeaders = new ArrayList<>(ALLOWED_HEADERS);
    private int bodyReaderBufferSize = 1024;

    public static final SearchRequestAdapter adapt(HttpServletRequest httpRequest) {
        return new SearchRequestAdapter(httpRequest);
    }

    protected SearchRequestAdapter(HttpServletRequest httpRequest) {
        this.httpRequest = Objects.requireNonNull(httpRequest, () -> "httpRequest may not be null");
    }

    public SearchRequestAdapter addAllowedHeader(String headerName) {
        allowedHeaders.add(Objects.requireNonNull(headerName, () -> "header may not be null"));
        return this;
    }

    public SearchRequestAdapter withBodyReaderBufferSize(int value) {
        bodyReaderBufferSize = value;
        return this;
    }

    public Collection<String> getAllowedHeaders() {
        return Collections.unmodifiableCollection(allowedHeaders);
    }

    public int getBodyReaderBufferSize() {
        return bodyReaderBufferSize;
    }

    public Request toElasticSearchRequest() throws IOException {
        Request searchRequest = new Request(httpRequest.getMethod(), httpRequest.getRequestURI());
        searchRequest.addParameters(firstArrayValue(httpRequest.getParameterMap()));
        searchRequest.setOptions(headersToSearchRequestOptions());
        searchRequest.setEntity(bodyToSearchRequestEntity());
        return searchRequest;
    }

    private RequestOptions headersToSearchRequestOptions() {
        Builder searchRequestOptions = RequestOptions.DEFAULT.toBuilder();
        for (String headerName : Collections.list(httpRequest.getHeaderNames())) {
            if (allowedHeaders.contains(headerName)) {
                String headerValue =  sanatizeHeaderValue(httpRequest.getHeader(headerName));
                searchRequestOptions.addHeader(headerName, headerValue);
                LOGGER.finer(() -> "Adding header " + headerName + " with value " + headerValue);
            }
        }
        return searchRequestOptions.build();
    }

    private static String sanatizeHeaderValue(final String headerValue) {
        final String sanatizedHeaderValue = CONTROL_CHARACTERS.matcher(headerValue).replaceAll("");
        LOGGER.finer(() -> "Sanatized header value " + headerValue + " to " + sanatizedHeaderValue);
        return sanatizedHeaderValue;
    }

    private HttpEntity bodyToSearchRequestEntity() throws IOException {
        String searchBody = getBody();
        ContentType searchContentType = ContentType.create(httpRequest.getContentType());
        LOGGER.finer(() -> "Search body: " + searchBody);
        LOGGER.finer(() -> "Search content type: " + searchContentType);
        return new NStringEntity(searchBody, searchContentType);
    }

    private String getBody() throws IOException {
        // Reference: https://www.baeldung.com/java-convert-reader-to-string
        char[] buffer = new char[bodyReaderBufferSize];
        StringBuilder requestBody = new StringBuilder();
        int numCharsRead;
        try (BufferedReader reader = httpRequest.getReader()) {
            while ((numCharsRead = reader.read(buffer, 0, buffer.length)) != -1) {
                requestBody.append(buffer, 0, numCharsRead);
            }
        }
        return requestBody.toString();
    }

    static <K, V> Map<K, V> firstArrayValue(Map<K, V[]> map) {
        Map<K, V> result = new HashMap<>();
        for (Entry<K, V[]> entry : map.entrySet()) {
            result.put(entry.getKey(), getFirstArrayValue(entry.getValue()));
        }
        LOGGER.finer(() -> "First array values: " + result);
        return result;
    }

    private static <T> T getFirstArrayValue(T[] array) {
        return (array != null && array.length > 0) ? array[0] : null;
    }

    @Override
    public String toString() {
        return "SearchRequestAdapter [allowedHeaders=" + allowedHeaders + ", bodyReaderBufferSize="
                + bodyReaderBufferSize + ", httpRequest=" + httpRequest + "]";
    }
}
