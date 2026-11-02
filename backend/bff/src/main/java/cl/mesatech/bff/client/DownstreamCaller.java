package cl.mesatech.bff.client;

import java.util.function.Supplier;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestClientResponseException;

import cl.mesatech.bff.exception.DownstreamException;

final class DownstreamCaller {

    private DownstreamCaller() {}

    /** 4xx del microservicio se propagan igual; 5xx se convierten en 502 sin filtrar su mensaje interno. */
    static <T> T call(Supplier<T> s) {
        try {
            return s.get();
        } catch (RestClientResponseException e) {
            if (e.getStatusCode().is5xxServerError()) {
                throw new DownstreamException(HttpStatus.BAD_GATEWAY,
                        "{\"error\":\"Servicio no disponible\",\"mensaje\":\"Servicio no disponible\"}");
            }
            throw new DownstreamException(e.getStatusCode(), e.getResponseBodyAsString());
        }
    }
}