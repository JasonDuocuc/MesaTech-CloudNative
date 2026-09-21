package cl.mesatech.solicitudes_service.controller;

import cl.mesatech.solicitudes_service.dto.AsignarSolicitudRequest;
import cl.mesatech.solicitudes_service.dto.AtencionResponse;
import cl.mesatech.solicitudes_service.dto.CambiarEstadoRequest;
import cl.mesatech.solicitudes_service.dto.CrearAtencionRequest;
import cl.mesatech.solicitudes_service.dto.CrearSolicitudRequest;
import cl.mesatech.solicitudes_service.dto.SolicitudResponse;
import cl.mesatech.solicitudes_service.service.SolicitudService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internal/solicitudes")
public class SolicitudController {

    private final SolicitudService solicitudService;

    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @PostMapping
    public ResponseEntity<SolicitudResponse> crear(
            @Valid @RequestBody CrearSolicitudRequest request) {

        SolicitudResponse response = solicitudService.crear(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<SolicitudResponse>> listarTodas() {

        return ResponseEntity.ok(
                solicitudService.listarTodas()
        );
    }

    @GetMapping("/solicitante/{solicitanteId}")
    public ResponseEntity<List<SolicitudResponse>> listarPorSolicitante(
            @PathVariable String solicitanteId) {

        return ResponseEntity.ok(
                solicitudService.listarPorSolicitante(solicitanteId)
        );
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<SolicitudResponse>> listarDisponibles() {

        return ResponseEntity.ok(
                solicitudService.listarDisponibles()
        );
    }

    @GetMapping("/operador/{operadorId}")
    public ResponseEntity<List<SolicitudResponse>> listarPorOperador(
            @PathVariable String operadorId) {

        return ResponseEntity.ok(
                solicitudService.listarPorOperador(operadorId)
        );
    }

    @PatchMapping("/{id}/asignacion")
    public ResponseEntity<SolicitudResponse> asignar(
            @PathVariable Long id,
            @Valid @RequestBody AsignarSolicitudRequest request) {

        return ResponseEntity.ok(
                solicitudService.asignar(id, request)
        );
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudResponse> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoRequest request) {

        return ResponseEntity.ok(
                solicitudService.cambiarEstado(id, request)
        );
    }

    @PostMapping("/{id}/atenciones")
    public ResponseEntity<AtencionResponse> registrarAtencion(
            @PathVariable Long id,
            @Valid @RequestBody CrearAtencionRequest request) {

        AtencionResponse response =
                solicitudService.registrarAtencion(id, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}