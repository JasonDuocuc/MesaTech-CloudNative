package cl.mesatech.solicitudes_service.service;

import cl.mesatech.solicitudes_service.dto.AsignarSolicitudRequest;
import cl.mesatech.solicitudes_service.dto.AtencionResponse;
import cl.mesatech.solicitudes_service.dto.CambiarEstadoRequest;
import cl.mesatech.solicitudes_service.dto.CrearAtencionRequest;
import cl.mesatech.solicitudes_service.dto.CrearSolicitudRequest;
import cl.mesatech.solicitudes_service.dto.SolicitudResponse;
import cl.mesatech.solicitudes_service.entity.Atencion;
import cl.mesatech.solicitudes_service.entity.Solicitud;
import cl.mesatech.solicitudes_service.enums.EstadoSolicitud;
import cl.mesatech.solicitudes_service.exception.RecursoNoEncontradoException;
import cl.mesatech.solicitudes_service.exception.ReglaNegocioException;
import cl.mesatech.solicitudes_service.repository.AtencionRepository;
import cl.mesatech.solicitudes_service.repository.SolicitudRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final AtencionRepository atencionRepository;

    public SolicitudService(
            SolicitudRepository solicitudRepository,
            AtencionRepository atencionRepository) {

        this.solicitudRepository = solicitudRepository;
        this.atencionRepository = atencionRepository;
    }

    public SolicitudResponse crear(CrearSolicitudRequest request) {

        Solicitud solicitud = new Solicitud();

        solicitud.setTitulo(request.getTitulo());
        solicitud.setDescripcion(request.getDescripcion());

        solicitud.setCategoriaId(request.getCategoriaId());
        solicitud.setCategoriaNombre(request.getCategoriaNombre());

        solicitud.setPrioridadId(request.getPrioridadId());
        solicitud.setPrioridadNombre(request.getPrioridadNombre());

        solicitud.setSolicitanteId(request.getSolicitanteId());
        solicitud.setSolicitanteNombre(request.getSolicitanteNombre());
        solicitud.setSolicitanteEmail(request.getSolicitanteEmail());

        solicitud.setEstado(EstadoSolicitud.CREADA);

        Solicitud guardada = solicitudRepository.save(solicitud);

        return convertirResponse(guardada);
    }

    @Transactional(readOnly = true)
    public List<SolicitudResponse> listarTodas() {

        return solicitudRepository.findAll()
                .stream()
                .map(this::convertirResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitudResponse> listarPorSolicitante(String solicitanteId) {

        return solicitudRepository.findBySolicitanteId(solicitanteId)
                .stream()
                .map(this::convertirResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitudResponse> listarDisponibles() {

        return solicitudRepository
                .findByOperadorIdIsNullAndEstado(EstadoSolicitud.CREADA)
                .stream()
                .map(this::convertirResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitudResponse> listarPorOperador(String operadorId) {

        return solicitudRepository.findByOperadorId(operadorId)
                .stream()
                .map(this::convertirResponse)
                .toList();
    }

    public SolicitudResponse asignar(
            Long id,
            AsignarSolicitudRequest request) {

        Solicitud solicitud = buscarSolicitud(id);

        if (solicitud.getEstado() != EstadoSolicitud.CREADA) {
            throw new ReglaNegocioException(
                    "Solo una solicitud en estado CREADA puede ser asignada"
            );
        }

        if (solicitud.getOperadorId() != null) {
            throw new ReglaNegocioException(
                    "La solicitud ya se encuentra asignada"
            );
        }

        solicitud.setOperadorId(request.getOperadorId());
        solicitud.setOperadorNombre(request.getOperadorNombre());
        solicitud.setFechaAsignacion(LocalDateTime.now());
        solicitud.setEstado(EstadoSolicitud.ASIGNADA);

        Solicitud actualizada = solicitudRepository.save(solicitud);

        return convertirResponse(actualizada);
    }

    public SolicitudResponse cambiarEstado(
            Long id,
            CambiarEstadoRequest request) {

        Solicitud solicitud = buscarSolicitud(id);

        EstadoSolicitud estadoActual = solicitud.getEstado();
        EstadoSolicitud estadoNuevo = request.getEstado();

        if (estadoActual == estadoNuevo) {
            throw new ReglaNegocioException(
                    "La solicitud ya se encuentra en el estado indicado"
            );
        }

        if (estadoNuevo == EstadoSolicitud.ASIGNADA) {
            throw new ReglaNegocioException(
                    "Para asignar una solicitud debe utilizarse la operación de asignación"
            );
        }

        if (!transicionValida(estadoActual, estadoNuevo)) {
            throw new ReglaNegocioException(
                    "Transición de estado no permitida: "
                            + estadoActual
                            + " -> "
                            + estadoNuevo
            );
        }

        solicitud.setEstado(estadoNuevo);

        Solicitud actualizada = solicitudRepository.save(solicitud);

        return convertirResponse(actualizada);
    }

    public AtencionResponse registrarAtencion(
            Long id,
            CrearAtencionRequest request) {

        Solicitud solicitud = buscarSolicitud(id);

        if (solicitud.getEstado() == EstadoSolicitud.CREADA) {
            throw new ReglaNegocioException(
                    "No se puede registrar atención en una solicitud que aún no ha sido asignada"
            );
        }

        if (solicitud.getEstado() == EstadoSolicitud.CERRADA) {
            throw new ReglaNegocioException(
                    "No se puede registrar atención en una solicitud cerrada"
            );
        }

        if (solicitud.getEstado() == EstadoSolicitud.CANCELADA) {
            throw new ReglaNegocioException(
                    "No se puede registrar atención en una solicitud cancelada"
            );
        }

        Atencion atencion = new Atencion();

        atencion.setSolicitud(solicitud);
        atencion.setOperadorId(request.getOperadorId());
        atencion.setOperadorNombre(request.getOperadorNombre());
        atencion.setDetalle(request.getDetalle());

        Atencion guardada = atencionRepository.save(atencion);

        return convertirAtencionResponse(guardada);
    }

    private Solicitud buscarSolicitud(Long id) {

        return solicitudRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Solicitud no encontrada con id: " + id
                        )
                );
    }

    private boolean transicionValida(
            EstadoSolicitud actual,
            EstadoSolicitud nuevo) {

        return switch (actual) {

            case CREADA ->
                    nuevo == EstadoSolicitud.CANCELADA;

            case ASIGNADA ->
                    nuevo == EstadoSolicitud.EN_PROCESO
                            || nuevo == EstadoSolicitud.CANCELADA;

            case EN_PROCESO ->
                    nuevo == EstadoSolicitud.RESUELTA
                            || nuevo == EstadoSolicitud.CANCELADA;

            case RESUELTA ->
                    nuevo == EstadoSolicitud.CERRADA;

            case CERRADA, CANCELADA ->
                    false;
        };
    }

    private SolicitudResponse convertirResponse(Solicitud solicitud) {

        SolicitudResponse response = new SolicitudResponse();

        response.setId(solicitud.getId());
        response.setTitulo(solicitud.getTitulo());
        response.setDescripcion(solicitud.getDescripcion());

        response.setCategoriaId(solicitud.getCategoriaId());
        response.setCategoriaNombre(solicitud.getCategoriaNombre());

        response.setPrioridadId(solicitud.getPrioridadId());
        response.setPrioridadNombre(solicitud.getPrioridadNombre());

        response.setSolicitanteId(solicitud.getSolicitanteId());
        response.setSolicitanteNombre(solicitud.getSolicitanteNombre());
        response.setSolicitanteEmail(solicitud.getSolicitanteEmail());

        response.setEstado(solicitud.getEstado());

        response.setOperadorId(solicitud.getOperadorId());
        response.setOperadorNombre(solicitud.getOperadorNombre());

        response.setFechaCreacion(solicitud.getFechaCreacion());
        response.setFechaActualizacion(solicitud.getFechaActualizacion());
        response.setFechaAsignacion(solicitud.getFechaAsignacion());

        return response;
    }

    private AtencionResponse convertirAtencionResponse(Atencion atencion) {

        AtencionResponse response = new AtencionResponse();

        response.setId(atencion.getId());
        response.setSolicitudId(atencion.getSolicitud().getId());
        response.setOperadorId(atencion.getOperadorId());
        response.setOperadorNombre(atencion.getOperadorNombre());
        response.setDetalle(atencion.getDetalle());
        response.setFechaCreacion(atencion.getFechaCreacion());

        return response;
    }
}