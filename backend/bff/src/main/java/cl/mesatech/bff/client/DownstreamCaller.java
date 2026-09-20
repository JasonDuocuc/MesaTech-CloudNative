package cl.mesatech.bff.client;

import java.util.function.Supplier;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.RestClientResponseException;

import cl.mesatech.bff.exception.DownstreamException;

final class DownstreamCaller {

    private DownstreamCaller() {}

    /** 4xx del microservicio se propagan igual; 5xx se convierten en 502. */
    static <T> T call(Supplier<T> s) {
        try {
            return s.get();
        } catch (RestClientResponseException e) {
            HttpStatusCode st = e.getStatusCode().is5xxServerError() ? HttpStatus.BAD_GATEWAY : e.getStatusCode();
            throw new DownstreamException(st, e.getResponseBodyAsString());
        }
    }
}
