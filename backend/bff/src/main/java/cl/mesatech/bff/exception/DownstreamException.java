package cl.mesatech.bff.exception;

import org.springframework.http.HttpStatusCode;

public class DownstreamException extends RuntimeException {
    private final HttpStatusCode status;
    private final String body;

    public DownstreamException(HttpStatusCode status, String body) {
        super(body);
        this.status = status;
        this.body = body;
    }

    public HttpStatusCode getStatus() { return status; }
    public String getBody() { return body; }
}
