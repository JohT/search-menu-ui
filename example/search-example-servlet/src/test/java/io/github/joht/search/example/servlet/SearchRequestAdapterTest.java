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
    @DisplayName("it should take a header name that is added to the list of allowed headers")
    void nameOfHeaderToBeAdded() {
        String expectedHeaderName = "additionalAllowedHeaderName";
        adapterUnderTest.addAllowedHeader(expectedHeaderName);
        assertThat(adapterUnderTest.getAllowedHeaders(), hasItem(expectedHeaderName));
    }

    @ParameterizedTest(name = "it should accept the {0} header by default ({index})")
    @DisplayName("it should accept some headers by default")
    @ValueSource(strings = {"Accept", "Accept-Encoding", "Accept-Language", "Authorization", "Connection", "Contest-Length", "es-secondary-authorization", "Host", "Origin", "Referer", "User-Agent"})
    void headerToAllowByDefault(String expectedHeaderName) {
        assertThat(adapterUnderTest.getAllowedHeaders(), hasItem(expectedHeaderName));
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
    @DisplayName("it should use the HTTP headers of the incoming request if they are in the list of allowed headers")
    void elasticSearchRequest() throws IOException {
        Collection<String> headerNames = Arrays.asList("Accept", "Origin");
        when(httpRequest.getHeaderNames()).thenReturn(Collections.enumeration(headerNames));
        when(httpRequest.getHeader("Accept")).thenReturn("*/*");
        when(httpRequest.getHeader("Origin")).thenReturn("localhost");

        Request request = adapterUnderTest.toElasticSearchRequest();
        Map<String, String> searchHeaders = request.getOptions().getHeaders().stream().collect(Collectors.toMap(Header::getName, Header::getValue));
        assertThat(searchHeaders.get("Accept"), equalTo("*/*"));
        assertThat(searchHeaders.get("Origin"), equalTo("localhost"));
    }

    @Test
    @DisplayName("it should sanatize the incoming HTTP header values before forwarding them")
    void removeControlCharactersFromHttpHeaderValues() throws IOException {
        Collection<String> headerNames = Arrays.asList("Origin");
        when(httpRequest.getHeaderNames()).thenReturn(Collections.enumeration(headerNames));
        when(httpRequest.getHeader("Origin")).thenReturn("localhost" + stringOfControlCharacters());

        Request request = adapterUnderTest.toElasticSearchRequest();

        Map<String, String> searchHeaders = request.getOptions().getHeaders().stream().collect(Collectors.toMap(Header::getName, Header::getValue));
        assertThat(searchHeaders.get("Origin"), equalTo("localhost"));
    }

    private static String stringOfControlCharacters() {
        String invalidCharacters = "";
        for (int index = 0; index < 31; index++) {
            invalidCharacters+= (char) index;
        }
        invalidCharacters += (char)0x7F;
        return invalidCharacters;
    }

    @Test
    @DisplayName("it shouldn't transfer headers that are not defined in the list of allowed headers")
    void elasticSearchRequestWithoutIgnoredHeaders() throws IOException {
        Collection<String> headerNames = Arrays.asList("Content-Type", "Content-Length");
        when(httpRequest.getHeaderNames()).thenReturn(Collections.enumeration(headerNames));
        when(httpRequest.getHeader("Content-Type")).thenReturn("1");
        when(httpRequest.getHeader("Content-Length")).thenReturn("2");

        Request request = adapterUnderTest.toElasticSearchRequest();
        assertTrue(request.getOptions().getHeaders().isEmpty());
    }
}
