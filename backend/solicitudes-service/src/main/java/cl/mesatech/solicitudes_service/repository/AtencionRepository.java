package cl.mesatech.solicitudes_service.repository;

import cl.mesatech.solicitudes_service.entity.Atencion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AtencionRepository extends JpaRepository<Atencion, Long> {

    List<Atencion> findBySolicitudId(Long solicitudId);
}