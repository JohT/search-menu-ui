package io.github.joht.search.example.servlet;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import org.apache.http.Header;
import org.elasticsearch.client.Request;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class SearchRequestAdapterTest {

    private static final String REQUEST_URI = "_msearch/template";
    private static final String HTTP_METHOD_POST = "POST";
    private static final String MIME_TYPE_APPLICATION_JSON = "application/json";
    private static final Character BODY = 'A';

    @Mock
    HttpServletRequest httpRequest;

    @Mock
    BufferedReader reader;

    @Captor
    ArgumentCaptor<Integer> usedBufferSize;

    @InjectMocks
    SearchRequestAdapter adapterUnderTest;

    @BeforeEach
    void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);

        when(httpRequest.getHeaderNames()).thenReturn(Collections.emptyEnumeration());
        when(httpRequest.getReader()).thenReturn(reader);
        when(httpRequest.getMethod()).thenReturn(HTTP_METHOD_POST); 
        when(httpRequest.getRequestURI()).thenReturn(REQUEST_URI);
        when(httpRequest.getContentType()).thenReturn(MIME_TYPE_APPLICATION_JSON);
        when(reader.read( any(char[].class), anyInt(), usedBufferSize.capture())).thenReturn(Character.getNumericValue(BODY), -1);
    }

    @Test
    @DisplayName("it should take a custom body reader buffer size")
    void customBodyReaderBufferSize() {
        int expectedValue = 2048;
        adapterUnderTest.withBodyReaderBufferSize(expectedValue);
        assertThat(adapterUnderTest.getBodyReaderBufferSize(), equalTo(expectedValue));
    }

    @Test
    @DisplayName("it should take 1024 as default body reader buffer size")
    void defaultBodyReaderBufferSize() {
        int expectedValue = 1024;
        assertThat(adapterUnderTest.getBodyReaderBufferSize(), equalTo(expectedValue));
    }

    @Test
    @DisplayName("it should use the buffer size to read the request body")
    void useBodyReaderBufferSize() throws IOException {
        int expectedValue = 4096;
        adapterUnderTest.withBodyReaderBufferSize(expectedValue);
        adapterUnderTest.toElasticSearchRequest();
        assertThat(usedBufferSize.getValue().intValue(), equalTo(expectedValue));
    }

    @Test
    @DisplayName("it should take an header name to ignore and return it in the list of ignored headers")
    void nameOfHeaderToIgnoreAdded() {
        String expectedHeaderName = "headerNameToIgnore";
        adapterUnderTest.addHeaderToIgnore(expectedHeaderName);
        assertThat(adapterUnderTest.getHeadersToIgnore(), hasItem(expectedHeaderName));
    }

    @ParameterizedTest(name = "it should ignore the {0} header by default ({index})")
    @DisplayName("it should ignore some headers by default")
    @ValueSource(strings = {"Content-Length", "Content-Type"})
    void headerToIgnoreByDefault(String expectedHeaderName) {
        assertThat(adapterUnderTest.getHeadersToIgnore(), hasItem(expectedHeaderName));
    }

    @Test
    @DisplayName("first array value should convert a map with array values to a map with the first array entry as value")
    void firstArrayValue() {
        Map<String, String[]> map = new HashMap<>();
        map.put("first", new String[]{"one", "something", "else"});
        map.put("second", new String[]{"two", "something", "else"});
        Map<String, String> resultMap = SearchRequestAdapter.firstArrayValue(map);
        assertThat(resultMap.get("first"), equalTo("one"));
        assertThat(resultMap.get("second"), equalTo("two"));
    }

    @Test
    @DisplayName("first array value should keep null values unchanged")
    void firstArrayValueNullValueUnchanged() {
        Map<String, String[]> map = new HashMap<>();
        map.put("null", null);
        Map<String, String> resultMap = SearchRequestAdapter.firstArrayValue(map);
        assertThat(resultMap.get("null"), CoreMatchers.nullValue());
    }

    @Test
    @DisplayName("first array value should treat empty array values as null value")
    void firstArrayValueEmptyArrayAsNullValue() {
        Map<String, String[]> map = new HashMap<>();
        map.put("null", new String[0]);
        Map<String, String> resultMap = SearchRequestAdapter.firstArrayValue(map);
        assertThat(resultMap.get("null"), CoreMatchers.nullValue());
    }

    @Test
    @DisplayName("first array value should let an empty map through unchanged")
    void firstArrayValueEmptyMap() {
        Map<String, String[]> emptyMap = Collections.emptyMap();
        Map<String, String> resultMap = SearchRequestAdapter.firstArrayValue(emptyMap);
        assertThat(resultMap, equalTo(emptyMap));
    }

    @Test
    @DisplayName("it should use the same HTTP method as the incoming request for elasticsearch")
    void elasticSearchRequestMethod() throws IOException {
        when(httpRequest.getMethod()).thenReturn(HTTP_METHOD_POST); 
        Request request = adapterUnderTest.toElasticSearchRequest();
        assertEquals(HTTP_METHOD_POST, request.getMethod());
    }

    @Test
    @DisplayName("it should use the same HTTP URI path as the incoming request for elasticsearch")
    void elasticSearchRequestUri() throws IOException {
        when(httpRequest.getRequestURI()).thenReturn(REQUEST_URI);
        Request request = adapterUnderTest.toElasticSearchRequest();
        assertEquals(REQUEST_URI, request.getEndpoint());
    }

    @Test
    @DisplayName("it should use the same HTTP mime type as the incoming request for elasticsearch")
    void elasticSearchRequestMimeType() throws IOException {
        when(httpRequest.getContentType()).thenReturn(MIME_TYPE_APPLICATION_JSON);
        Request request = adapterUnderTest.toElasticSearchRequest();
        assertEquals(MIME_TYPE_APPLICATION_JSON, request.getEntity().getContentType().getValue());
    }

    @Test
    @DisplayName("it should use the same custom HTTP headers as the incoming request for elasticsearch")
    void elasticSearchRequest() throws IOException {
        Collection<String> headerNames = Arrays.asList("CustomTestHeader1", "CustomTestHeader2");
        when(httpRequest.getHeaderNames()).thenReturn(Collections.enumeration(headerNames));
        when(httpRequest.getHeader("CustomTestHeader1")).thenReturn("1");
        when(httpRequest.getHeader("CustomTestHeader2")).thenReturn("2");

        Request request = adapterUnderTest.toElasticSearchRequest();
        Map<String, String> searchHeaders = request.getOptions().getHeaders().stream().collect(Collectors.toMap(Header::getName, Header::getValue));
        assertThat(searchHeaders.get("CustomTestHeader1"), equalTo("1"));
        assertThat(searchHeaders.get("CustomTestHeader2"), equalTo("2"));
    }

    @Test
    @DisplayName("it shouldn't transfer headers that were defined to be ignored")
    void elasticSearchRequestWithoutIgnoredHeaders() throws IOException {
        Collection<String> headerNames = Arrays.asList("Content-Type", "Content-Length");
        when(httpRequest.getHeaderNames()).thenReturn(Collections.enumeration(headerNames));
        when(httpRequest.getHeader("Content-Type")).thenReturn("1");
        when(httpRequest.getHeader("Content-Length")).thenReturn("2");

        Request request = adapterUnderTest.toElasticSearchRequest();
        assertTrue(request.getOptions().getHeaders().isEmpty());
    }
}
