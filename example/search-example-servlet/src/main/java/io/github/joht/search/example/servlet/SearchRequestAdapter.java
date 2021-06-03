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

    private static final List<String> HEADERS_TO_IGNORE_BY_DEFAULT =
            Arrays.asList("Content-Length", "Content-Type");

    private final HttpServletRequest httpRequest;
    private final Collection<String> headersToIgnore = new ArrayList<>(HEADERS_TO_IGNORE_BY_DEFAULT);
    private int bodyReaderBufferSize = 1024;

    public static final SearchRequestAdapter adapt(HttpServletRequest httpRequest) {
        return new SearchRequestAdapter(httpRequest);
    }

    protected SearchRequestAdapter(HttpServletRequest httpRequest) {
        this.httpRequest = Objects.requireNonNull(httpRequest, () -> "httpRequest may not be null");
    }

    public SearchRequestAdapter addHeaderToIgnore(String headerName) {
        headersToIgnore.add(Objects.requireNonNull(headerName, () -> "header may not be null"));
        return this;
    }

    public SearchRequestAdapter withBodyReaderBufferSize(int value) {
        bodyReaderBufferSize = value;
        return this;
    }

    public Collection<String> getHeadersToIgnore() {
        return Collections.unmodifiableCollection(headersToIgnore);
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
            if (!headersToIgnore.contains(headerName)) {
                searchRequestOptions.addHeader(headerName, httpRequest.getHeader(headerName));
            }
        }
        return searchRequestOptions.build();
    }

    private HttpEntity bodyToSearchRequestEntity() throws IOException {
        String searchBody = getBody();
        ContentType searchContentType = ContentType.create(httpRequest.getContentType());
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
        return result;
    }

    private static <T> T getFirstArrayValue(T[] array) {
        return (array != null && array.length > 0) ? array[0] : null;
    }

    @Override
    public String toString() {
        return "SearchRequestAdapter [httpRequest=" + httpRequest + "]";
    }
}
