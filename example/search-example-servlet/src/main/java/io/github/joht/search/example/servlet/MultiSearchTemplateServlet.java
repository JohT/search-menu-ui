package io.github.joht.search.example.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.google.json.JsonSanitizer;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;

/**
 * Shows an example on how to write a servlet to forward multi search template requests to elasticsearch.
 * Even though this is a very specialized case, the underlying search request adapter is an example
 * for a pretty universal request delegation.
 * 
 * @see <a href="https://www.elastic.co/guide/en/elasticsearch/client/java-rest/current/java-rest-low-usage-requests.html">Elasticsearch Java Low Level REST-Client</a>
 * @see WebServlet
 * @see HttpServlet
 */
@WebServlet("/_msearch/template")
public class MultiSearchTemplateServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(MultiSearchTemplateServlet.class.getName());

    private RestClient restClient;

    @Override
    public void init() throws ServletException {
        // This is a simple example configuration which needs to be refined for production use.
        // Add external configuration, TLS, ...
        restClient = RestClient.builder(new HttpHost("localhost", 9200, "http")).build();
    }

    @Override
    public void destroy() {
        try {
            restClient.close();
        } catch (IOException e) {
            LOGGER.log(Level.INFO, e, () -> "Error closing Elasticsearch RestClient");
        }
    }

    @Override
    protected void doPost(HttpServletRequest httpRequest, HttpServletResponse httpResponse) throws ServletException, IOException {
        try {
            Request searchRequest = SearchRequestAdapter.adapt(httpRequest).toElasticSearchRequest();
            Response searchResponse = restClient.performRequest(searchRequest);
            updateHttpResponse(searchResponse.getEntity(), httpResponse);
        } catch (IOException e) {
            handleException(httpResponse, e);
        }
    }

    private void handleException(HttpServletResponse httpResponse, IOException e) {
        String logId = UUID.randomUUID().toString();
        LOGGER.log(Level.SEVERE, e, () -> logId + " Error forwarding request to Elasticsearch");
        try {
            httpResponse.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, logId);
        } catch (IOException e1) {
            LOGGER.log(Level.SEVERE, e1, () -> logId + " Error sending error response to client");
        }
    }

    private void updateHttpResponse(HttpEntity entity, final HttpServletResponse httpResponse) throws IOException {
        httpResponse.setContentType(entity.getContentType().getValue());
        try (PrintWriter printWriter = httpResponse.getWriter();) {
            final String elasticSearchResponse = EntityUtils.toString(entity);
            LOGGER.finer(() -> "Response from Elasticsearch: " + elasticSearchResponse);
            String encodedResponse = JsonSanitizer.sanitize(elasticSearchResponse);
            LOGGER.finer(() -> "Encoded response from Elasticsearch: " + encodedResponse);
            printWriter.println(encodedResponse);
        }
    }
}