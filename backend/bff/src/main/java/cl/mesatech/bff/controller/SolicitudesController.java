package cl.mesatech.bff.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import cl.mesatech.bff.client.CatalogoClient;
import cl.mesatech.bff.client.SolicitudesClient;
import cl.mesatech.bff.dto.AtencionRequest;
import cl.mesatech.bff.dto.CambiarEstadoRequest;
import cl.mesatech.bff.dto.CrearSolicitudRequest;
import cl.mesatech.bff.security.CurrentUser;
import jakarta.validation.Valid;

@RestController
public class SolicitudesController {

    private static final String TODOS = "hasAnyRole('CLIENTE','OPERADOR','ADMINISTRADOR')";
    private static final String STAFF = "hasAnyRole('OPERADOR','ADMINISTRADOR')";

    private final SolicitudesClient solicitudes;
    private final CatalogoClient catalogo;

    public SolicitudesController(SolicitudesClient solicitudes, CatalogoClient catalogo) {
        this.solicitudes = solicitudes;
        this.catalogo = catalogo;
    }

    @PostMapping("/v1/solicitudes")
    @PreAuthorize(TODOS)
    public ResponseEntity<Object> crear(@Valid @RequestBody CrearSolicitudRequest req,
                                        @AuthenticationPrincipal Jwt jwt) {
        CurrentUser u = CurrentUser.from(jwt);
        var cat = catalogo.categoria(req.categoriaId());   // 404 si no existe
        var pri = catalogo.prioridad(req.prioridadId());

        Map<String, Object> body = new HashMap<>();
        body.put("titulo", req.titulo());
        body.put("descripcion", req.descripcion());
        body.put("categoriaId", req.categoriaId());
        body.put("categoriaNombre", cat.get("nombre"));
        body.put("prioridadId", req.prioridadId());
        body.put("prioridadNombre", pri.get("nombre"));
        body.put("solicitanteId", u.id());
        body.put("solicitanteNombre", u.nombre());
        body.put("solicitanteEmail", u.email());
        return ResponseEntity.status(201).body(solicitudes.crear(body));
    }

    @GetMapping("/v1/solicitudes/mias")
    @PreAuthorize(TODOS)
    public Object mias(@AuthenticationPrincipal Jwt jwt) {
        return solicitudes.deSolicitante(CurrentUser.from(jwt).id());
    }

    @GetMapping("/v2/solicitudes/mias")
    @PreAuthorize(TODOS)
    public Map<String, Object> miasV2(@AuthenticationPrincipal Jwt jwt) {
        List<?> lista = (List<?>) solicitudes.deSolicitante(CurrentUser.from(jwt).id());
        return Map.of("version", "v2", "total", lista.size(), "solicitudes", lista);
    }

    @GetMapping("/v1/solicitudes")
    @PreAuthorize(STAFF)
    public Object todas() {
        return solicitudes.todas();
    }

    @GetMapping("/v1/solicitudes/disponibles")
    @PreAuthorize(STAFF)
    public Object disponibles() {
        return solicitudes.disponibles();
    }

    @GetMapping("/v1/solicitudes/asignadas/mias")
    @PreAuthorize("hasRole('OPERADOR')")
    public Object asignadasMias(@AuthenticationPrincipal Jwt jwt) {
        return solicitudes.deOperador(CurrentUser.from(jwt).id());
    }

    @PatchMapping("/v1/solicitudes/{id}/asignacion")
    @PreAuthorize("hasRole('OPERADOR')")
    public Object asignar(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        CurrentUser u = CurrentUser.from(jwt);
        return solicitudes.asignar(id, Map.of("operadorId", u.id(), "operadorNombre", u.nombre()));
    }

    @PatchMapping("/v1/solicitudes/{id}/estado")
    @PreAuthorize(STAFF)
    public Object estado(@PathVariable Long id, @Valid @RequestBody CambiarEstadoRequest req) {
        return solicitudes.cambiarEstado(id, Map.of("estado", req.estado()));
    }

    @PostMapping("/v1/solicitudes/{id}/atenciones")
    @PreAuthorize(STAFF)
    public ResponseEntity<Object> atencion(@PathVariable Long id, @Valid @RequestBody AtencionRequest req,
                                           @AuthenticationPrincipal Jwt jwt) {
        CurrentUser u = CurrentUser.from(jwt);
        return ResponseEntity.status(201).body(solicitudes.atencion(id,
                Map.of("operadorId", u.id(), "operadorNombre", u.nombre(), "detalle", req.detalle())));
    }
}
