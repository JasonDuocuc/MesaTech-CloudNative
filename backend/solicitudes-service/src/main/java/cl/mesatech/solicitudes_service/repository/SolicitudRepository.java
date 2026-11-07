package cl.mesatech.solicitudes_service.repository;

import cl.mesatech.solicitudes_service.entity.Solicitud;
import cl.mesatech.solicitudes_service.enums.EstadoSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    List<Solicitud> findBySolicitanteId(String solicitanteId);

    List<Solicitud> findByOperadorId(String operadorId);

    List<Solicitud> findByOperadorIdIsNullAndEstado(EstadoSolicitud estado);
}