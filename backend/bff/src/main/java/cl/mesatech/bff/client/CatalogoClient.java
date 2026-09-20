package cl.mesatech.bff.client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class CatalogoClient {

    private static final ParameterizedTypeReference<Map<String, Object>> MAP = new ParameterizedTypeReference<>() {
    };

    private final RestClient rc;

    public CatalogoClient(@Qualifier("catalogoRestClient") RestClient rc) {
        this.rc = rc;
    }

    public Map<String, Object> catalogo() {
        return DownstreamCaller.call(() -> rc.get().uri("/internal/catalogo").retrieve().body(MAP));
    }

    public Map<String, Object> categoria(Long id) {
        return DownstreamCaller.call(() -> rc.get().uri("/internal/catalogo/categorias/{id}", id).retrieve().body(MAP));
    }

    public Map<String, Object> prioridad(Long id) {
        return DownstreamCaller
                .call(() -> rc.get().uri("/internal/catalogo/prioridades/{id}", id).retrieve().body(MAP));
    }

    /** recurso: "categorias" | "prioridades" */
    public Object crear(String recurso, Object body) {
        return DownstreamCaller
                .call(() -> rc.post().uri("/internal/catalogo/{r}", recurso).body(body).retrieve().body(Object.class));
    }

    public Object actualizar(String recurso, Long id, Object body) {
        return DownstreamCaller.call(() -> rc.put().uri("/internal/catalogo/{r}/{id}", recurso, id).body(body)
                .retrieve().body(Object.class));
    }

    public void eliminar(String recurso, Long id) {
        DownstreamCaller.call(() -> {
            rc.delete().uri("/internal/catalogo/{r}/{id}", recurso, id).retrieve().toBodilessEntity();
            return null;
        });
    }
}
