package cl.mesatech.bff.client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class SolicitudesClient {

    private final RestClient rc;

    public SolicitudesClient(@Qualifier("solicitudesRestClient") RestClient rc) {
        this.rc = rc;
    }

    public Object crear(Map<String, Object> body) {
        return DownstreamCaller
                .call(() -> rc.post().uri("/internal/solicitudes").body(body).retrieve().body(Object.class));
    }

    public Object todas() {
        return get("/internal/solicitudes");
    }

    public Object deSolicitante(String id) {
        return get("/internal/solicitudes/solicitante/{id}", id);
    }

    public Object disponibles() {
        return get("/internal/solicitudes/disponibles");
    }

    public Object deOperador(String id) {
        return get("/internal/solicitudes/operador/{id}", id);
    }

    public Object asignar(Long id, Map<String, Object> body) {
        return patch("/internal/solicitudes/{id}/asignacion", id, body);
    }

    public Object cambiarEstado(Long id, Map<String, Object> body) {
        return patch("/internal/solicitudes/{id}/estado", id, body);
    }

    public Object atencion(Long id, Map<String, Object> body) {
        return DownstreamCaller.call(() -> rc.post().uri("/internal/solicitudes/{id}/atenciones", id).body(body)
                .retrieve().body(Object.class));
    }

    private Object get(String uri, Object... vars) {
        return DownstreamCaller.call(() -> rc.get().uri(uri, vars).retrieve().body(Object.class));
    }

    private Object patch(String uri, Long id, Map<String, Object> body) {
        return DownstreamCaller.call(() -> rc.patch().uri(uri, id).body(body).retrieve().body(Object.class));
    }
}
